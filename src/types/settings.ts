import type { Locale } from "./index";
import type { PaletteKey, ThemeMode } from "@/lib/theme";
import type { StorageSettings } from "@/lib/storage/types";
import type { ModulesSettings } from "@/lib/modules";

/** The figures pulled from the GitHub profile configured under Settings → Social. */
export const GITHUB_STAT_KEYS = ["repos", "followers", "stars", "years"] as const;

export type GithubStatKey = (typeof GITHUB_STAT_KEYS)[number];

export interface HomeStat {
  key: GithubStatKey;
  /** Only the wording is editable — the number comes from GitHub. */
  translations: Record<Locale, { label: string }>;
}

/** Everything the home page renders that isn't pulled from a content module. */
export interface HomeSettings {
  translations: Record<
    Locale,
    { kicker: string; title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string }
  >;
  statsEnabled: boolean;
  stats: HomeStat[];
}

/** Owned by Admin → Lingua. */
export interface LanguageSettings {
  /** The one language the admin writes in; every other locale is derived from it. */
  defaultLocale: Locale;
  /** Serve visitors their own language when their browser asks for one we have. */
  autoDetect: boolean;
  /** Show the language switcher in the navbar. */
  allowSwitch: boolean;
}

export interface Settings {
  language: LanguageSettings;
  site: {
    domain: string;
    https: boolean;
    themePalette: PaletteKey;
    themeMode: ThemeMode;
  };
  storage: StorageSettings;
  personal: {
    translations: Record<
      Locale,
      { name: string; title: string; bio: string; longBio: string; location: string }
    >;
    avatar: string;
    email: string;
    resumeUrl: string;
  };
  social: {
    github: string | null;
    linkedin: string | null;
    twitter: string | null;
    instagram: string | null;
    dribbble: string | null;
    youtube: string | null;
  };
  seo: {
    translations: Record<Locale, { siteTitle: string; siteDescription: string }>;
    ogImage: string;
    siteUrl: string;
  };
  contactForm: { enabled: boolean };
  maintenance: { enabled: boolean; translations: Record<Locale, { message: string }> };
  modules: ModulesSettings;
  home: HomeSettings;
}
