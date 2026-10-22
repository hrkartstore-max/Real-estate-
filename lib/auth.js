import crypto from "node:crypto";

const COOKIE = "hepra_admin_session";
function secret() { return process.env.AUTH_SECRET || ""; }
export function createSession(email, role = "admin") {
  if (!secret() || secret().length < 32) throw new Error("AUTH_SECRET must be at least 32 characters.");
  const payload = Buffer.from(JSON.stringify({ email, role, exp: Date.now() + (role === "customer" ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 12) })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return payload + "." + signature;
}
export function verifySession(token) {
  try {
    if (!token || !secret()) return null;
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;
    const expected = crypto.createHmac("sha256", secret()).update(payload).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.email || !data.exp || data.exp < Date.now()) return null;
    return { email: data.email, role: data.role || "admin" };
  } catch { return null; }
}
export function isAdminRequest(request) {
  return verifySession(request.cookies.get(COOKIE)?.value)?.role === "admin";
}
export const customerCookieName = "hepra_customer_session";
export function isCustomerRequest(request) {
  return verifySession(request.cookies.get(customerCookieName)?.value)?.role === "customer";
}
export function getCustomer(request) {
  const session = verifySession(request.cookies.get(customerCookieName)?.value);
  return session?.role === "customer" ? session : null;
}
export const sessionCookieName = COOKIE;
