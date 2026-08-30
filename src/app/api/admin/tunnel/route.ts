import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import { getFullStatus, restartTunnel, startTunnel, stopTunnel } from "@/lib/tunnel/manager";

/**
 * Drives the cloudflared process. The tunnel's *settings* are saved through
 * /api/settings like every other slice; this only starts and stops what's
 * already configured, so the two can't disagree about what's stored.
 */
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { tunnel } = await getSettings();
  return NextResponse.json(await getFullStatus(tunnel));
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { action } = (await request.json().catch(() => ({}))) as { action?: string };
  const { tunnel } = await getSettings();

  switch (action) {
    case "start":
      return NextResponse.json(await startTunnel(tunnel));
    case "restart":
      return NextResponse.json(await restartTunnel(tunnel));
    case "stop":
      await stopTunnel();
      return NextResponse.json(await getFullStatus(tunnel));
    default:
      return NextResponse.json({ error: "Azione non riconosciuta" }, { status: 400 });
  }
}
