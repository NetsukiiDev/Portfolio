import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/api/lib/auth-check";
import { resetSite } from "@/lib/reset";

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  await resetSite();

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("admin-session");
  return response;
}
