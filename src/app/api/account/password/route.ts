import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getAdminAccount, updateAdminPassword } from "@/lib/auth";
import { requireAuth } from "@/app/api/lib/auth-check";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { passwordHash: currentHash } = await getAdminAccount();
  const match = await bcrypt.compare(parsed.data.currentPassword, currentHash);
  if (!match) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await updateAdminPassword(newHash);

  return NextResponse.json({ success: true });
}
