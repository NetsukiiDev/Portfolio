import { getSettings, getSectionCounts } from "./data";
import { resolveLocale } from "./locale.server";
import { DEFAULT_MODULES, type ModulesSettings } from "./modules";
import { DEFAULT_LANGUAGE, DEFAULT_PAGES, DEFAULT_SECTIONS } from "./default-settings";
import { SITE_NAME, LOCALES } from "./constants";
import type { Locale, Settings } from "@/types";
import type { LanguageSettings, PageKey, SectionKey } from "@/types/settings";

export interface SiteChrome {
  /** Null before /setup has run, which every caller has to survive. */
  settings: Settings | null;
  modules: ModulesSettings;
  language: LanguageSettings;
  locale: Locale;
  /** What the navbar and footer sign the site with. */
  siteName: string;
  /** The profile picture, doubling as the site's mark in the navbar. */
  avatar: string;
  /** Modules whose band is actually on the page, so the navbar can link to it. */
  presentSections: string[];
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

  // A module with nothing in it renders no band, so it gets no menu entry.
  const counts = await getSectionCounts();
  const presentSections = Object.entries(counts)
    .filter(([key, count]) => count > 0 && modules[key as keyof ModulesSettings]?.enabled)
    .map(([key]) => key);
  // Neither of these is a collection, so neither has a count. About is the
  // profile and is there as soon as the site is set up; contact is a form and
  // some details, there whenever its module is.
  if (settings) presentSections.push("about");
  if (modules.contact.enabled) presentSections.push("contact");

  return {
    settings,
    modules,
    language,
    locale,
    siteName,
    avatar: settings?.personal.avatar ?? "",
    presentSections,
  };
}

/**
 * One admin-written string in every language. The whole record is handed to
 * the client so a language switch doesn't need another round trip — the
 * components that render these are client components by necessity.
 */
function everyLocale(
  translations: Record<string, Record<string, string>>,
  key: string,
): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, translations[locale]?.[key] ?? ""]),
  ) as Record<Locale, string>;
}

/** The intro line under a public page's title. */
export async function getPageDescriptions(page: PageKey): Promise<Record<Locale, string>> {
  let pages = DEFAULT_PAGES;
  try {
    pages = (await getSettings()).pages;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }
  return everyLocale(pages.translations, page);
}

/** A heading between the home page's sections. */
export async function getSectionText(key: SectionKey): Promise<Record<Locale, string>> {
  let sections = DEFAULT_SECTIONS;
  try {
    sections = (await getSettings()).sections;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }
  return everyLocale(sections.translations, key);
}
