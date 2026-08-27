import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/Providers";
import { SITE_NAME, LOCALES } from "@/lib/constants";
import { getSettings } from "@/lib/data";
import { DEFAULT_LANGUAGE } from "@/lib/default-settings";
import { PALETTES } from "@/lib/theme";
import type { Locale } from "@/types";
import type { LanguageSettings } from "@/types/settings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Every page reads admin-editable content straight from the database, which
// may not even be set up yet at build time (pre-/setup). Both rule out static
// generation: content must be fetched per-request, not baked in once at build.
export const dynamic = "force-dynamic";

/**
 * Picks the language to render in, in order of authority:
 *   1. what the visitor chose (cookie), if switching is even allowed;
 *   2. what their browser asks for, if auto-detect is on;
 *   3. the language the admin writes in.
 *
 * LanguageProvider mirrors the visitor's choice into that cookie so the first
 * render already matches what the client settles on — otherwise the page
 * swaps language after hydration and replays every entrance animation.
 */
async function resolveLocale(language: LanguageSettings): Promise<Locale> {
  if (language.allowSwitch) {
    const chosen = (await cookies()).get("locale")?.value;
    if ((LOCALES as string[]).includes(chosen ?? "")) return chosen as Locale;
  }

  if (language.autoDetect) {
    // Accept-Language is what the browser actually asks for, which beats
    // guessing from an IP: someone in Italy may well want English.
    const header = (await headers()).get("accept-language") ?? "";
    for (const part of header.split(",")) {
      const tag = part.split(";")[0]?.trim().toLowerCase().split("-")[0];
      if (tag && (LOCALES as string[]).includes(tag)) return tag as Locale;
    }
  }

  return language.defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  let siteUrl = "http://localhost:3000";
  let title = SITE_NAME;
  let description: string | undefined;

  try {
    const settings = await getSettings();
    siteUrl = settings.seo.siteUrl || siteUrl;
    // Reads what the admin actually saved under Settings → SEO, in the
    // visitor's language, instead of a hardcoded tagline.
    const seo = settings.seo.translations[await resolveLocale(settings.language)];
    title = seo.siteTitle || SITE_NAME;
    description = seo.siteDescription || undefined;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }

  return {
    title: {
      default: title,
      template: `%s — ${SITE_NAME}`,
    },
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      type: "website",
      url: siteUrl,
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#121218",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let language = DEFAULT_LANGUAGE;
  let themeMode: "light" | "dark" = "dark";
  let palette = PALETTES.violet;

  try {
    const settings = await getSettings();
    language = settings.language;
    themeMode = settings.site.themeMode;
    palette = PALETTES[settings.site.themePalette] ?? PALETTES.violet;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }

  const locale = await resolveLocale(language);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${themeMode} h-full antialiased`}
    >
      <head>
        <style>{`:root{--accent:${palette.accent};--accent-soft:${palette.accentSoft}}`}</style>
      </head>
      <body id="top" className="flex min-h-full flex-col">
        <Providers defaultLocale={locale} allowSwitch={language.allowSwitch}>{children}</Providers>
      </body>
    </html>
  );
}
