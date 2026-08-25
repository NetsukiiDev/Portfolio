import { NextRequest, NextResponse } from "next/server";
import { getAiGallery, updateAiImage, deleteAiImage } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { AiImage } from "@/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const images = await getAiGallery();
  const image = images.find((img) => img.id === id);
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(image);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const body = (await request.json()) as Partial<AiImage>;
  const updated = await updateAiImage(id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id } = await params;
  await deleteAiImage(id);

  return NextResponse.json({ success: true });
}
