import { NextRequest, NextResponse } from "next/server";
import { getExperience, updateExperience, deleteExperience } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { Experience } from "@/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await getExperience();
  const entry = experience.find((e) => e.id === id);
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const body = (await request.json()) as Partial<Experience>;
  const updated = await updateExperience(id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  await deleteExperience(id);

  return NextResponse.json({ success: true });
}
