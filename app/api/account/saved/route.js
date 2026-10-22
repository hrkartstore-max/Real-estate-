import { NextResponse } from "next/server";
import { getCustomer } from "../../../../lib/auth";
import { getDb } from "../../../../lib/mongodb";
export async function GET(request) {
  const session = getCustomer(request);
  if (!session) return NextResponse.json({ authenticated: false, savedPropertyIds: [] });
  const db = await getDb();
  if (!db) return NextResponse.json({ authenticated: false, savedPropertyIds: [], error: "Database unavailable." }, { status: 503 });
  const user = await db.collection("users").findOne({ email: session.email }, { projection: { savedPropertyIds: 1 } });
  return NextResponse.json({ authenticated: Boolean(user), savedPropertyIds: user?.savedPropertyIds || [] });
}
export async function PUT(request) {
  const session = getCustomer(request);
  if (!session) return NextResponse.json({ error: "Sign in to sync your saved homes." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const ids = Array.isArray(body.savedPropertyIds) ? [...new Set(body.savedPropertyIds.filter(id => typeof id === "string").slice(0, 500))] : [];
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  await db.collection("users").updateOne({ email: session.email }, { $set: { savedPropertyIds: ids, updatedAt: new Date() } });
  return NextResponse.json({ savedPropertyIds: ids });
}
