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

  const body = (await request.json()) as Settings;
  const current = await getSettings();

  if (body.storage.s3.secretAccessKey === SECRET_MASK) {
    body.storage.s3.secretAccessKey = current.storage.s3.secretAccessKey;
  }

  await saveSettings(body);

  return NextResponse.json({ ...body, storage: maskStorageSecrets(body.storage) });
}
