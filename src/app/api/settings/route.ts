import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import { SECRET_MASK, maskStorageSecrets } from "@/lib/storage/types";
import type { Settings } from "@/types";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const settings = await getSettings();
  return NextResponse.json({ ...settings, storage: maskStorageSecrets(settings.storage) });
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  // Accepts a partial: several admin pages own different top-level slices
  // (Settings, Portfolio, Moduli). Merging against what's stored means each
  // one can send only what it edits, instead of echoing back a whole
  // settings object built from a snapshot that may already be stale — which
  // silently reverted the other pages' changes.
  const patch = (await request.json()) as Partial<Settings>;
  const current = await getSettings();
  const next: Settings = { ...current, ...patch };

  if (next.storage.s3.secretAccessKey === SECRET_MASK) {
    next.storage.s3.secretAccessKey = current.storage.s3.secretAccessKey;
  }

  await saveSettings(next);

  return NextResponse.json({ ...next, storage: maskStorageSecrets(next.storage) });
}
