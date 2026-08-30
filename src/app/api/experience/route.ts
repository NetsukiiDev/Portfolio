import { NextRequest, NextResponse } from "next/server";
import { getExperience, createExperience } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { Experience } from "@/types";

export async function GET() {
  const experience = await getExperience();
  return NextResponse.json(experience);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const body = (await request.json()) as Omit<Experience, "id">;
  const entry = await createExperience({
    ...body,
    // Ordering is done by dragging the list, so a new one joins at the end.
    order: (await getExperience()).length,
    id: crypto.randomUUID(),
  });

  return NextResponse.json(entry, { status: 201 });
}
