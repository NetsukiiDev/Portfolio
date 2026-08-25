import { NextRequest, NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { Project } from "@/types";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const body = (await request.json()) as Omit<Project, "id" | "createdAt" | "updatedAt">;
  const now = new Date().toISOString();

  const project = await createProject({
    ...body,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json(project, { status: 201 });
}
