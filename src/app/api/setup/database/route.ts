import { NextRequest, NextResponse } from "next/server";
import { getSetupStatus } from "@/lib/setup";
import {
  testDatabaseConnection,
  isTargetDatabaseEmpty,
  provisionDatabase,
  generateEnvInstructions,
} from "@/lib/db-provision";
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
  const input = parsed.data;

  if (isVercelRuntime() && input.type === "sqlite") {
    return NextResponse.json({ ok: false, error: "SQLite non è supportato su Vercel." }, { status: 400 });
  }

  const connectionResult = await testDatabaseConnection(input);
  if (!connectionResult.ok) {
    return NextResponse.json(connectionResult, { status: 400 });
  }

  // On Vercel the filesystem is read-only and there's no CLI to shell out to at
  // request time, and DATABASE_URL can only be made to persist by setting it as
  // a platform environment variable — something only the user can do from the
  // Vercel dashboard. Hand back the values to paste there instead of trying
  // (and failing) to provision anything ourselves.
  if (isVercelRuntime()) {
    return NextResponse.json({ ok: true, manualEnv: generateEnvInstructions(input) });
  }

  const empty = await isTargetDatabaseEmpty(input);
  if (!empty) {
    return NextResponse.json({ ok: false, error: "The target database already has tables — pick an empty database." }, { status: 409 });
  }

  try {
    await provisionDatabase(input);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to provision the database" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, restartRequired: input.type === "mysql" });
}
