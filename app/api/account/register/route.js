import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDb } from "../../../../lib/mongodb";
import { createSession, customerCookieName } from "../../../../lib/auth";
const hashPassword = (password, salt) => crypto.scryptSync(password, salt, 64).toString("hex");
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10 || password.length > 200) {
    return NextResponse.json({ error: "Enter your name, a valid email and a password of 10–200 characters." }, { status: 400 });
  }
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) return NextResponse.json({ error: "Account sign-in is not configured yet." }, { status: 503 });
  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Account storage is not configured. Set MONGODB_URI in Vercel." }, { status: 503 });
    const users = db.collection("users");
    if (await users.findOne({ email })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const salt = crypto.randomBytes(16).toString("hex");
    const user = { id: crypto.randomUUID(), name, email, salt, passwordHash: hashPassword(password, salt), savedPropertyIds: [], createdAt: new Date() };
    await users.insertOne(user);
    const response = NextResponse.json({ ok: true, name, email });
    response.cookies.set(customerCookieName, createSession(email, "customer"), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch { return NextResponse.json({ error: "Could not create account. Please try again." }, { status: 503 }); }
}
