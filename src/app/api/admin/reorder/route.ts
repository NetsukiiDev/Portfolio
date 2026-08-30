import { NextRequest, NextResponse } from "next/server";
import { reorder, REORDERABLE, type Reorderable } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";

/**
 * Saves a new order for one of the drag-sortable lists. Takes the ids in the
 * order they now appear and writes the position of each, so the list on
 * screen is the definition of the order rather than something to be kept in
 * sync with it.
 */
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { type, ids } = (await request.json().catch(() => ({}))) as { type?: string; ids?: unknown };

  if (!REORDERABLE.includes(type as Reorderable)) {
    return NextResponse.json({ error: "Tipo non riordinabile" }, { status: 400 });
  }
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Serve un elenco di id" }, { status: 400 });
  }

  await reorder(type as Reorderable, ids as string[]);
  return NextResponse.json({ ok: true });
}
