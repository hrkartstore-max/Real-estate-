import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { properties as sampleProperties } from "../../../lib/properties";
import { getDb } from "../../../lib/mongodb";
import { isAdminRequest } from "../../../lib/auth";

export const dynamic = "force-dynamic";
const collection = async () => {
  const db = await getDb();
  return db ? db.collection("properties") : null;
};
const REQUIRED_VERIFICATION_DOCS = ["ownershipProof", "approvalDocuments", "encumbranceCertificate", "propertyTaxReceipt"];
function validProperty(p) {
  return p && typeof p.title === "string" && p.title.trim() && typeof p.city === "string" && p.city.trim() &&
    ["Apartment", "Villa", "House", "Plot"].includes(p.type) && Number.isFinite(Number(p.price)) && Number(p.price) > 0 &&
    Number.isFinite(Number(p.area)) && Number(p.area) > 0 &&
    (p.latitude == null || p.latitude === "" || (Number.isFinite(Number(p.latitude)) && Number(p.latitude >= -90) && Number(p.latitude) <= 90)) &&
    (p.longitude == null || p.longitude === "" || (Number.isFinite(Number(p.longitude)) && Number(p.longitude) >= -180 && Number(p.longitude) <= 180));
}
export async function GET() {
  try {
    const col = await collection();
    if (!col) return NextResponse.json({ properties: sampleProperties, source: "sample" });
    const docs = await col.find({}).sort({ updatedAt: -1, title: 1 }).toArray();
    const result = docs.map(({ _id, ...p }) => ({ ...p, id: p.id || String(_id) }));
    return NextResponse.json({ properties: result.length ? result : sampleProperties, source: result.length ? "database" : "sample" });
  } catch {
    return NextResponse.json({ properties: sampleProperties, source: "sample", warning: "Database unavailable; sample listings shown." });
  }
}
export async function POST(request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!validProperty(body)) return NextResponse.json({ error: "Provide a title, city, valid type, positive price and area." }, { status: 400 });
  const col = await collection();
  if (!col) return NextResponse.json({ error: "Database is not configured. Add MONGODB_URI before managing live listings." }, { status: 503 });
  const verificationDocuments = Array.isArray(body.verificationDocuments) ? body.verificationDocuments.filter(x => REQUIRED_VERIFICATION_DOCS.includes(x)) : [];
  if (body.verified === true && !REQUIRED_VERIFICATION_DOCS.every(x => verificationDocuments.includes(x))) return NextResponse.json({ error: "Complete all four document checks before marking this listing verified." }, { status: 400 });
  const doc = { ...body, verificationDocuments, verified: body.verified === true, address: String(body.address || "").trim().slice(0, 250), latitude: body.latitude === "" || body.latitude == null ? null : Number(body.latitude), longitude: body.longitude === "" || body.longitude == null ? null : Number(body.longitude), id: body.id || crypto.randomUUID(), price: Number(body.price), area: Number(body.area), beds: Number(body.beds || 0), baths: Number(body.baths || 0), updatedAt: new Date() };
  await col.updateOne({ id: doc.id }, { $set: doc }, { upsert: true });
  return NextResponse.json({ property: doc }, { status: 201 });
}
export async function PUT(request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!validProperty(body) || typeof body.id !== "string" || !body.id) return NextResponse.json({ error: "A valid property ID and listing fields are required." }, { status: 400 });
  const col = await collection();
  if (!col) return NextResponse.json({ error: "Database is not configured. Add MONGODB_URI before managing live listings." }, { status: 503 });
  const verificationDocuments = Array.isArray(body.verificationDocuments) ? body.verificationDocuments.filter(x => REQUIRED_VERIFICATION_DOCS.includes(x)) : [];
  if (body.verified === true && !REQUIRED_VERIFICATION_DOCS.every(x => verificationDocuments.includes(x))) return NextResponse.json({ error: "Complete all four document checks before marking this listing verified." }, { status: 400 });
  const doc = { ...body, verificationDocuments, verified: body.verified === true, address: String(body.address || "").trim().slice(0, 250), latitude: body.latitude === "" || body.latitude == null ? null : Number(body.latitude), longitude: body.longitude === "" || body.longitude == null ? null : Number(body.longitude), price: Number(body.price), area: Number(body.area), beds: Number(body.beds || 0), baths: Number(body.baths || 0), updatedAt: new Date() };
  await col.updateOne({ id: doc.id }, { $set: doc }, { upsert: true });
  return NextResponse.json({ property: doc });
}
export async function DELETE(request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Property ID required." }, { status: 400 });
  const col = await collection();
  if (!col) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  const result = await col.deleteOne({ id });
  return NextResponse.json({ deleted: result.deletedCount > 0 });
}
