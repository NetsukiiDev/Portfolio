import { NextRequest, NextResponse } from "next/server";
import { getTools, createTool } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { Tool } from "@/types";

export async function GET() {
  return NextResponse.json(await getTools());
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const body = (await request.json()) as Omit<Tool, "id">;
  const tool = await createTool({ ...body, id: crypto.randomUUID() });

  return NextResponse.json(tool, { status: 201 });
}
