import { NextResponse } from "next/server";
import { getCustomer } from "../../../../lib/auth";
import { getDb } from "../../../../lib/mongodb";
export async function GET(request) {
  const session = getCustomer(request);
  if (!session) return NextResponse.json({ authenticated: false });
  try {
    const db = await getDb();
    const user = db ? await db.collection("users").findOne({ email: session.email }, { projection: { name: 1, email: 1, savedPropertyIds: 1 } }) : null;
    return NextResponse.json({ authenticated: Boolean(user), name: user?.name || "", email: user?.email || session.email, savedPropertyIds: user?.savedPropertyIds || [] });
  } catch { return NextResponse.json({ authenticated: false }); }
}
