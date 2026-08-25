import { NextResponse } from "next/server";
import { getSetupStatus } from "@/lib/setup";
import { isVercelRuntime } from "@/lib/platform";

export async function GET() {
  const step = await getSetupStatus();
  return NextResponse.json({ step, isVercel: isVercelRuntime() });
}
