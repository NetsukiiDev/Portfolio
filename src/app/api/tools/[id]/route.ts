import { NextRequest, NextResponse } from "next/server";
import { updateTool, deleteTool } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { Tool } from "@/types";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const updated = await updateTool(id, (await request.json()) as Partial<Tool>);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  await deleteTool(id);
  return NextResponse.json({ ok: true });
}
