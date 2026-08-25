import { NextRequest, NextResponse } from "next/server";
import { getSetupStatus } from "@/lib/setup";
import { testDatabaseConnection } from "@/lib/db-provision";
import { dbSetupSchema, getDbSetupErrorField } from "@/lib/setup-schema";

export async function POST(request: NextRequest) {
  const status = await getSetupStatus();
  if (status !== "database") {
    return NextResponse.json({ error: "Database step already completed" }, { status: 403 });
  }

  const parsed = dbSetupSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errorCode: "missing_field", field: getDbSetupErrorField(parsed.error) },
      { status: 400 },
    );
  }

  const result = await testDatabaseConnection(parsed.data);
  return NextResponse.json(result);
}
