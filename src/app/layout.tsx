import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/Providers";
import { SITE_NAME, LOCALES } from "@/lib/constants";
import { getSettings } from "@/lib/data";
import { PALETTES } from "@/lib/theme";
import type { Locale } from "@/types";
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

// The visitor's own choice, mirrored into a cookie by LanguageProvider, so
// the first render already matches what the client will settle on — no
// post-hydration language swap (which re-ran every entrance animation).
async function resolveLocale(fallback: Locale): Promise<Locale> {
  const stored = (await cookies()).get("locale")?.value;
  return (LOCALES as string[]).includes(stored ?? "") ? (stored as Locale) : fallback;
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
    const seo = settings.seo.translations[await resolveLocale(settings.site.defaultLocale)];
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
  let defaultLocale: Locale = "en";
  let themeMode: "light" | "dark" = "dark";
  let palette = PALETTES.violet;

  try {
    const settings = await getSettings();
    defaultLocale = settings.site.defaultLocale;
    themeMode = settings.site.themeMode;
    palette = PALETTES[settings.site.themePalette] ?? PALETTES.violet;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }

  const locale = await resolveLocale(defaultLocale);

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
        <Providers defaultLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
