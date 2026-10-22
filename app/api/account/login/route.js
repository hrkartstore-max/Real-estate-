import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDb } from "../../../../lib/mongodb";
import { createSession, customerCookieName } from "../../../../lib/auth";
const hashPassword = (password, salt) => crypto.scryptSync(password, salt, 64);
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  try {
    const db = await getDb();
    if (!db || !process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) return NextResponse.json({ error: "Account sign-in is not configured yet." }, { status: 503 });
    const user = await db.collection("users").findOne({ email });
    const supplied = user ? hashPassword(password, user.salt) : crypto.randomBytes(64);
    const expected = user ? Buffer.from(user.passwordHash, "hex") : crypto.randomBytes(64);
    const passwordOk = supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
    if (!user || !passwordOk) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    const response = NextResponse.json({ ok: true, name: user.name, email: user.email });
    response.cookies.set(customerCookieName, createSession(user.email, "customer"), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch { return NextResponse.json({ error: "Could not sign in. Please try again." }, { status: 503 }); }
}
