import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSetupStatus } from "@/lib/setup";
import { prisma } from "@/lib/prisma";
import { LOCALES } from "@/lib/constants";
import { PALETTE_KEYS } from "@/lib/theme";
import {
  DEFAULT_PERSONAL,
  DEFAULT_SOCIAL,
  DEFAULT_SEO,
  DEFAULT_CONTACT_FORM,
  DEFAULT_MAINTENANCE,
  DEFAULT_HOME,
  DEFAULT_PAGES,
} from "@/lib/default-settings";
import { DEFAULT_MODULES } from "@/lib/modules";
import { DEFAULT_STORAGE_SETTINGS } from "@/lib/storage/types";
import type { Prisma } from "@/generated/prisma-sqlite/client";

function toJson<T>(value: T): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

const storageSchema = z.object({
  provider: z.enum(["local", "s3"]),
  s3: z.object({
    endpoint: z.string(),
    region: z.string(),
    bucket: z.string(),
    accessKeyId: z.string(),
    secretAccessKey: z.string(),
    forcePathStyle: z.boolean(),
    publicUrlBase: z.string(),
  }),
});

const schema = z.object({
  domain: z.string().min(1),
  https: z.boolean(),
  defaultLocale: z.enum(LOCALES as [string, ...string[]]),
  themePalette: z.enum(PALETTE_KEYS as [string, ...string[]]),
  themeMode: z.enum(["light", "dark"]),
  storage: storageSchema.optional(),
});

export async function POST(request: NextRequest) {
  const status = await getSetupStatus();
  if (status !== "site") {
    return NextResponse.json({ error: "Site step is not available right now" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
  }

  const { domain, https, defaultLocale, themePalette, themeMode, storage } = parsed.data;
  const siteUrl = `${https ? "https" : "http"}://${domain}`;
  const storageSettings = storage ?? DEFAULT_STORAGE_SETTINGS;

  const existing = await prisma.settings.findUnique({ where: { id: "singleton" } });
  const seo = { ...(existing ? (existing.seo as typeof DEFAULT_SEO) : DEFAULT_SEO), siteUrl };

  await prisma.settings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      personal: toJson(DEFAULT_PERSONAL),
      social: toJson(DEFAULT_SOCIAL),
      seo: toJson(seo),
      contactForm: toJson(DEFAULT_CONTACT_FORM),
      maintenance: toJson(DEFAULT_MAINTENANCE),
      storage: toJson(storageSettings),
      modules: toJson(DEFAULT_MODULES),
      home: toJson(DEFAULT_HOME),
      pages: toJson(DEFAULT_PAGES),
      domain,
      https,
      defaultLocale,
      themePalette,
      themeMode,
      setupCompletedAt: new Date(),
    },
    update: {
      seo: toJson(seo),
      storage: toJson(storageSettings),
      domain,
      https,
      defaultLocale,
      themePalette,
      themeMode,
      setupCompletedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
