import { NextResponse } from "next/server";
import { isAdminRequest, verifySession } from "../../../../lib/auth";
export async function GET(request) {
  const session = verifySession(request.cookies.get("hepra_admin_session")?.value);
  return NextResponse.json({ authenticated: isAdminRequest(request), email: session?.email || null });
}
