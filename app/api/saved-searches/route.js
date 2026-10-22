import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDb } from "../../../lib/mongodb";

export const dynamic = "force-dynamic";
const allowedTypes = ["All", "Apartment", "Villa", "House", "Plot"];

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase().slice(0, 254);
  const city = String(body?.city || "All").trim().slice(0, 100);
  const type = String(body?.type || "All").trim();
  const maxPriceLakh = Number(body?.maxPriceLakh || 0);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!city || !allowedTypes.includes(type) || !Number.isFinite(maxPriceLakh) || maxPriceLakh < 0 || maxPriceLakh > 1000000) return NextResponse.json({ error: "Choose a valid city, property type and maximum budget." }, { status: 400 });
  if (body?.consent !== true) return NextResponse.json({ error: "Please consent to receive listing alerts by email." }, { status: 400 });
  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Email alerts are not available until the database is configured." }, { status: 503 });
    const now = new Date();
    const criteria = { email, city, type, maxPriceLakh };
    const existing = await db.collection("savedSearches").findOne(criteria);
    const unsubscribeToken = existing?.unsubscribeToken || crypto.randomBytes(24).toString("hex");
    await db.collection("savedSearches").updateOne(criteria, {
      $set: { ...criteria, active: true, consentAt: existing?.consentAt || now, updatedAt: now, unsubscribeToken },
      $setOnInsert: { createdAt: now }
    }, { upsert: true });
    const deliveryConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
    return NextResponse.json({ saved: true, deliveryConfigured, message: deliveryConfigured ? "Saved. We will email matching new listings." : "Saved, but email delivery is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL to enable notifications." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save this alert right now." }, { status: 503 });
  }
}
