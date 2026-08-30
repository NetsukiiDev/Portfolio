import type { Locale } from "./index";
import type { PaletteKey, ThemeMode } from "@/lib/theme";
import type { StorageSettings } from "@/lib/storage/types";
import type { ModulesSettings } from "@/lib/modules";
import type { TunnelSettings } from "@/lib/tunnel/types";

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

/**
 * The headings on the home page that sit between the editable blocks — the
 * ones that were left as fixed strings in translations.ts when the rest of
 * the home copy moved into settings.
 */
export const SECTION_KEYS = [
  "featuredProjects",
  "viewAll",
  "skills",
  "recentPosts",
  "ctaHeading",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export interface SectionsSettings {
  translations: Record<Locale, Record<SectionKey, string>>;
}

/**
 * The public pages that carry an editable intro under their title. About
 * isn't one: its opening is the profile itself.
 */
export const PAGE_KEYS = ["projects", "skills", "experience", "blog", "aiGallery", "contact"] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

/**
 * The line under each page's title. It used to be hardcoded placeholder copy
 * in translations.ts — which meant notes written for the admin ("Invite
 * people to get in touch") were showing up on the live site.
 */
export interface PagesSettings {
  translations: Record<Locale, Record<PageKey, string>>;
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
  tunnel: TunnelSettings;
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
  pages: PagesSettings;
  sections: SectionsSettings;
}
