import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDb } from "../../../lib/mongodb";
import { isAdminRequest } from "../../../lib/auth";

export const dynamic = "force-dynamic";
export async function GET(request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ enquiries: [], configured: false });
    const enquiries = await db.collection("enquiries").find({}).sort({ createdAt: -1 }).limit(500).toArray();
    return NextResponse.json({ enquiries: enquiries.map(({ _id, ...item }) => item), configured: true });
  } catch {
    return NextResponse.json({ error: "Could not load enquiries." }, { status: 503 });
  }
}
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").trim().slice(0, 100);
  const phone = String(body?.phone || "").replace(/\D/g, "").slice(0, 10);
  const subject = String(body?.subject || "").trim().slice(0, 200);
  const note = String(body?.note || "").trim().slice(0, 2000);
  if (name.length < 2 || !/^\d{10}$/.test(phone) || !subject) return NextResponse.json({ error: "Valid name, 10-digit phone and property are required." }, { status: 400 });
  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ saved: false, message: "Database not configured; continue via WhatsApp." });
    const enquiry = { id: crypto.randomUUID(), name, phone, subject, note, status: "New", createdAt: new Date() };
    await db.collection("enquiries").insertOne(enquiry);
    return NextResponse.json({ saved: true, id: enquiry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ saved: false, message: "Enquiry storage is unavailable; continue via WhatsApp." });
  }
}
export async function PUT(request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body?.id || !["New", "Contacted", "Closed"].includes(body.status)) return NextResponse.json({ error: "Valid enquiry ID and status are required." }, { status: 400 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  const now = new Date();
  const changes = { status: body.status, updatedAt: now };
  if (body.status === "Contacted") changes.contactedAt = now;
  if (body.status === "Closed") changes.closedAt = now;
  const result = await db.collection("enquiries").updateOne({ id: body.id }, { $set: changes });
  return NextResponse.json({ updated: result.modifiedCount > 0 });
}
