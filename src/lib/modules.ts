import type { translations } from "./translations";

type NavKey = keyof (typeof translations)["en"]["nav"];

export const MODULE_KEYS = [
  "projects",
  "skills",
  "tools",
  "experience",
  "blog",
  "aiGallery",
  "contact",
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];

export interface ModuleConfig {
  /** Public page and navbar entry. Admin management stays reachable either way. */
  enabled: boolean;
  /** This module's section on the home page, where it has one. */
  showOnHome: boolean;
}

export type ModulesSettings = Record<ModuleKey, ModuleConfig>;

export interface ModuleDefinition {
  key: ModuleKey;
  /**
   * Public route the module owns — 404s while disabled. Null for a module
   * that only ever appears as a section of the home page, and so has no page
   * of its own to hide and no navbar entry.
   */
  href: string | null;
  /** Navbar label, reused from the existing translations. */
  navKey: NavKey | null;
  adminHref: string | null;
  /** Whether toggling showOnHome does anything for this module. */
  hasHomeSection: boolean;
}

// Home and About aren't listed: one is the page these modules compose, the
// other is the profile, which a portfolio can't meaningfully turn off.
//
// `href: null` is now the common case. The site is a single page, so most
// modules are a band on it rather than a route — only the blog and the
// gallery keep an archive of their own.
export const MODULES: ModuleDefinition[] = [
  { key: "projects", href: null, navKey: "projects", adminHref: "/admin/projects", hasHomeSection: true },
  { key: "skills", href: null, navKey: "skills", adminHref: "/admin/skills", hasHomeSection: true },
  // Home-only: a page listing nothing but logos would be a thin thing to
  // give a URL to, so this module lives entirely in the home page strip.
  { key: "tools", href: null, navKey: null, adminHref: "/admin/tools", hasHomeSection: true },
  {
    key: "experience",
    href: null,
    navKey: "experience",
    adminHref: "/admin/experience",
    hasHomeSection: true,
  },
  { key: "blog", href: "/blog", navKey: "blog", adminHref: "/admin/blog", hasHomeSection: true },
  {
    key: "aiGallery",
    href: "/ai-gallery",
    navKey: "aiGallery",
    adminHref: "/admin/ai-gallery",
    hasHomeSection: true,
  },
  { key: "contact", href: null, navKey: "contact", adminHref: null, hasHomeSection: true },
];

export const DEFAULT_MODULES: ModulesSettings = Object.fromEntries(
  MODULE_KEYS.map((key) => [key, { enabled: true, showOnHome: true }]),
) as ModulesSettings;

/**
 * Nav keys with no module behind them (home, about) are always visible; the
 * rest follow their module's toggle.
 */
export function isNavKeyVisible(navKey: string, modules: ModulesSettings): boolean {
  const definition = MODULES.find((mod) => mod.navKey === navKey);
  return !definition || modules[definition.key].enabled;
}

/** Fills in any module missing from stored settings, so adding one later is safe. */
export function mergeModules(stored: unknown): ModulesSettings {
  const value = (stored ?? {}) as Partial<Record<ModuleKey, Partial<ModuleConfig>>>;
  return Object.fromEntries(
    MODULE_KEYS.map((key) => [key, { ...DEFAULT_MODULES[key], ...value[key] }]),
  ) as ModulesSettings;
}
