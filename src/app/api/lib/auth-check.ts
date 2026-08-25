import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get("admin-session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const valid = await verifyToken(token);
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
