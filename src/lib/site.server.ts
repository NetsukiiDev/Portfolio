import { getSettings } from "./data";
import { resolveLocale } from "./locale.server";
import { DEFAULT_MODULES, type ModulesSettings } from "./modules";
import { DEFAULT_LANGUAGE, DEFAULT_PAGES } from "./default-settings";
import { SITE_NAME, LOCALES } from "./constants";
import type { Locale, Settings } from "@/types";
import type { LanguageSettings, PageKey } from "@/types/settings";

export interface SiteChrome {
  /** Null before /setup has run, which every caller has to survive. */
  settings: Settings | null;
  modules: ModulesSettings;
  language: LanguageSettings;
  locale: Locale;
  /** What the navbar and footer sign the site with. */
  siteName: string;
}

/**
 * Everything the public navbar and footer need, resolved once. Shared by the
 * public layout and the 404 page so the two can't drift apart.
 */
export async function getSiteChrome(): Promise<SiteChrome> {
  let settings: Settings | null = null;
  try {
    settings = await getSettings();
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }

  const modules = settings?.modules ?? DEFAULT_MODULES;
  const language = settings?.language ?? DEFAULT_LANGUAGE;
  const locale = await resolveLocale(language);
  const siteName = settings?.personal.translations[locale]?.name?.trim() || SITE_NAME;

  return { settings, modules, language, locale, siteName };
}

/**
 * The intro line under a public page's title, in every language, so the
 * client can follow a language switch without another request.
 */
export async function getPageDescriptions(page: PageKey): Promise<Record<Locale, string>> {
  let pages = DEFAULT_PAGES;
  try {
    pages = (await getSettings()).pages;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, pages.translations[locale]?.[page] ?? ""]),
  ) as Record<Locale, string>;
}
