import { NextRequest, NextResponse } from "next/server";
import { getSetupStatus } from "@/lib/setup";
import { testDatabaseConnection } from "@/lib/db-provision";
import { dbSetupSchema } from "@/lib/setup-schema";
import { isVercelRuntime } from "@/lib/platform";

export async function POST(request: NextRequest) {
  const status = await getSetupStatus();
  if (status !== "database") {
    return NextResponse.json({ error: "Database step already completed" }, { status: 403 });
  }

  const parsed = dbSetupSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid submission" }, { status: 400 });
  }

  if (isVercelRuntime() && parsed.data.type === "sqlite") {
    return NextResponse.json({ ok: false, error: "SQLite non è supportato su Vercel." }, { status: 400 });
  }

  const result = await testDatabaseConnection(parsed.data);
  return NextResponse.json(result);
}
