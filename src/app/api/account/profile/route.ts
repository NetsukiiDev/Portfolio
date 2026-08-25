import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateAdminProfile } from "@/lib/auth";
import { requireAuth } from "@/app/api/lib/auth-check";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_.-]+$/, "Only letters, numbers, and _ . - are allowed"),
});

export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
  }

  await updateAdminProfile(parsed.data);
  return NextResponse.json({ success: true });
}
