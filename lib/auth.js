import crypto from "node:crypto";

const COOKIE = "hepra_admin_session";
function secret() { return process.env.AUTH_SECRET || ""; }
export function createSession(email) {
  if (!secret() || secret().length < 32) throw new Error("AUTH_SECRET must be at least 32 characters.");
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString("base64url");
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
    return { email: data.email };
  } catch { return null; }
}
export function isAdminRequest(request) {
  return Boolean(verifySession(request.cookies.get(COOKIE)?.value));
}
export const sessionCookieName = COOKIE;
