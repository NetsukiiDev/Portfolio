import { NextRequest, NextResponse } from "next/server";
import { updateSkill, deleteSkill } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { Skill } from "@/types";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const body = (await request.json()) as Partial<Skill>;
  const updated = await updateSkill(id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  await deleteSkill(id);

  return NextResponse.json({ success: true });
}
