import { NextRequest, NextResponse } from "next/server";
import { getAiGallery, createAiImage } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { AiImage } from "@/types";

export async function GET() {
  const images = await getAiGallery();
  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const body = (await request.json()) as Omit<AiImage, "id" | "createdAt">;
  const image = await createAiImage({ ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString() });

  return NextResponse.json(image, { status: 201 });
}
