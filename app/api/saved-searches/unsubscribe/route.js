import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";

export const dynamic = "force-dynamic";

function validToken(token) {
  return typeof token === "string" && /^[a-f0-9]{48}$/.test(token);
}

export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!validToken(token)) return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  return new NextResponse(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Manage HEPRA Realty alerts</title><body style="font-family:Arial,sans-serif;max-width:620px;margin:12vh auto;padding:24px;color:#17372e"><h1>Manage email alerts</h1><p>Confirm below if you want to stop HEPRA Realty saved-search emails.</p><form method="POST" action="/api/saved-searches/unsubscribe"><input type="hidden" name="token" value="${token}"><button style="padding:12px 18px;background:#123d35;color:white;border:0;cursor:pointer" type="submit">Unsubscribe from alerts</button></form></body></html>`, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function POST(request) {
  const form = await request.formData().catch(() => null);
  const token = String(form?.get("token") || "");
  if (!validToken(token)) return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  try {
    const db = await getDb();
    if (!db) return new NextResponse("Email preferences are temporarily unavailable.", { status: 503 });
    const result = await db.collection("savedSearches").updateMany({ unsubscribeToken: token }, { $set: { active: false, unsubscribedAt: new Date() } });
    return new NextResponse(result.modifiedCount ? "You have been unsubscribed from HEPRA Realty listing alerts." : "This alert was already inactive or the link is invalid.", { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  } catch {
    return new NextResponse("Could not update your email preferences. Please try again later.", { status: 503 });
  }
}
