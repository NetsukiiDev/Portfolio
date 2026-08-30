import { NextRequest, NextResponse } from "next/server";
import { getTools, replaceTools } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { Tool } from "@/types";

export async function GET() {
  return NextResponse.json(await getTools());
}

/**
 * Replaces the whole selection in one go. Picking tools is a set operation —
 * the admin ticks several and saves once — so a per-item CRUD surface would
 * only invite the list and the database to drift apart.
 */
export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const body = (await request.json()) as { tools?: Partial<Tool>[] };
  if (!Array.isArray(body.tools)) {
    return NextResponse.json({ error: "Serve un elenco di strumenti" }, { status: 400 });
  }

  const tools: Tool[] = body.tools.map((tool, index) => ({
    id: tool.id ?? crypto.randomUUID(),
    slug: tool.slug ?? null,
    name: tool.name ?? null,
    image: tool.image ?? null,
    url: tool.url ?? null,
    order: index,
  }));

  return NextResponse.json(await replaceTools(tools));
}
