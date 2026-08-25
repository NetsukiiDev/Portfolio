import { NextRequest, NextResponse } from "next/server";
import { getSkillsData, createSkill } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { Skill } from "@/types";

export async function GET() {
  const data = await getSkillsData();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const body = (await request.json()) as Omit<Skill, "id">;
  const skill = await createSkill({ ...body, id: crypto.randomUUID() });

  return NextResponse.json(skill, { status: 201 });
}
