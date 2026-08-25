import type { Locale } from "./index";
import type { PaletteKey, ThemeMode } from "@/lib/theme";
import type { StorageSettings } from "@/lib/storage/types";

export interface Settings {
  site: {
    defaultLocale: Locale;
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
}
