import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";

export const dynamic = "force-dynamic";
export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token || !/^[a-f0-9]{48}$/.test(token)) return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  try {
    const db = await getDb();
    if (!db) return new NextResponse("Email preferences are temporarily unavailable.", { status: 503 });
    const result = await db.collection("savedSearches").updateMany({ unsubscribeToken: token }, { $set: { active: false, unsubscribedAt: new Date() } });
    return new NextResponse(result.modifiedCount ? "You have been unsubscribed from HEPRA Realty listing alerts." : "This alert was already inactive or the link is invalid.", { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch {
    return new NextResponse("Could not update your email preferences. Please try again later.", { status: 503 });
  }
}
