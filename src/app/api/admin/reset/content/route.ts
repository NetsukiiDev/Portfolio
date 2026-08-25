import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/app/api/lib/auth-check";
import { resetContent, RESET_CONTENT_TYPES } from "@/lib/reset";

const schema = z.object({
  type: z.enum(RESET_CONTENT_TYPES as [string, ...string[]]),
});

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  await resetContent(parsed.data.type as (typeof RESET_CONTENT_TYPES)[number]);
  return NextResponse.json({ ok: true });
}
