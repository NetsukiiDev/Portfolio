import { NextRequest, NextResponse } from "next/server";
import { deleteContactMessage } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  await deleteContactMessage(id);
  return NextResponse.json({ ok: true });
}
