import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin-session")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }
  const authenticated = await verifyToken(token);
  return NextResponse.json({ authenticated });
}
