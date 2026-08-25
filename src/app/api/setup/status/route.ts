import { NextResponse } from "next/server";
import { getSetupStatus } from "@/lib/setup";

export async function GET() {
  const step = await getSetupStatus();
  return NextResponse.json({ step });
}
