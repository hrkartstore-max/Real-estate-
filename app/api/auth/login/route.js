import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createSession, sessionCookieName } from "../../../../lib/auth";

export async function POST(request) {
  const { email = "", password = "" } = await request.json().catch(() => ({}));
  const expectedEmail = process.env.ADMIN_EMAIL || "";
  const expectedPassword = process.env.ADMIN_PASSWORD || "";
  if (!expectedEmail || !expectedPassword || !process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    return NextResponse.json({ error: "Admin authentication is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and a 32+ character AUTH_SECRET." }, { status: 503 });
  }
  const normalize = value => Buffer.from(String(value));
  const emailOk = String(email).trim().toLowerCase() === expectedEmail.trim().toLowerCase();
  const passwordOk = normalize(password).length === normalize(expectedPassword).length && crypto.timingSafeEqual(normalize(password), normalize(expectedPassword));
  if (!emailOk || !passwordOk) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, createSession(expectedEmail), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}
