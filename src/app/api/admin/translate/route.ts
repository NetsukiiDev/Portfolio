import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import { fillTranslations } from "@/lib/translate";
import { LOCALES } from "@/lib/constants";
import type { Settings } from "@/types";

/**
 * Regenerates the non-default locales of every settings-level text from the
 * language the admin writes in.
 *
 * `overwrite: false` only fills what's empty, so translations already
 * corrected by hand survive. `overwrite: true` is the explicit "redo them
 * all" action.
 */
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { overwrite = false } = (await request.json().catch(() => ({}))) as { overwrite?: boolean };

  const current = await getSettings();
  const source = current.language.defaultLocale;
  const targets = LOCALES.filter((locale) => locale !== source);
  const options = { overwrite };

  const before = JSON.stringify([
    current.personal.translations,
    current.seo.translations,
    current.home.translations,
    current.sections.translations,
    current.pages.translations,
    current.maintenance.translations,
  ]);

  const next: Settings = {
    ...current,
    personal: {
      ...current.personal,
      translations: await fillTranslations(current.personal.translations, source, targets, options),
    },
    seo: {
      ...current.seo,
      translations: await fillTranslations(current.seo.translations, source, targets, options),
    },
    home: {
      ...current.home,
      translations: await fillTranslations(current.home.translations, source, targets, options),
      stats: await Promise.all(
        current.home.stats.map(async (stat) => ({
          ...stat,
          translations: await fillTranslations(stat.translations, source, targets, options),
        })),
      ),
    },
    sections: {
      ...current.sections,
      translations: await fillTranslations(current.sections.translations, source, targets, options),
    },
    pages: {
      ...current.pages,
      translations: await fillTranslations(current.pages.translations, source, targets, options),
    },
    maintenance: {
      ...current.maintenance,
      translations: await fillTranslations(current.maintenance.translations, source, targets, options),
    },
  };

  const after = JSON.stringify([
    next.personal.translations,
    next.seo.translations,
    next.home.translations,
    next.sections.translations,
    next.pages.translations,
    next.maintenance.translations,
  ]);

  if (before !== after) await saveSettings(next);

  // Counts the fields that actually changed, so the UI can say whether
  // anything happened rather than always claiming success.
  let translated = 0;
  for (const locale of targets) {
    const pairs: [Record<string, string>, Record<string, string>][] = [
      [current.personal.translations[locale], next.personal.translations[locale]],
      [current.seo.translations[locale], next.seo.translations[locale]],
      [current.home.translations[locale], next.home.translations[locale]],
      [current.sections.translations[locale], next.sections.translations[locale]],
      [current.pages.translations[locale], next.pages.translations[locale]],
      [current.maintenance.translations[locale], next.maintenance.translations[locale]],
    ];
    for (const [was, now] of pairs) {
      for (const field of Object.keys(now ?? {})) {
        if ((was ?? {})[field] !== now[field]) translated++;
      }
    }
  }

  return NextResponse.json({ translated });
}
