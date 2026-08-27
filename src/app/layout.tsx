import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/Providers";
import { getSiteChrome } from "@/lib/site.server";
import { PALETTES } from "@/lib/theme";
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

export async function generateMetadata(): Promise<Metadata> {
  const { settings, locale, siteName } = await getSiteChrome();

  // Reads what the admin actually saved under Impostazioni → SEO, in the
  // visitor's language, instead of a hardcoded tagline.
  const seo = settings?.seo.translations[locale];
  const siteUrl = settings?.seo.siteUrl || "http://localhost:3000";
  const title = seo?.siteTitle || siteName;
  const description = seo?.siteDescription || undefined;

  return {
    title: {
      default: title,
      // Sub-pages sign off with the site's own name, not a build-time constant.
      template: `%s — ${siteName}`,
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
  const { settings, language, locale } = await getSiteChrome();
  const themeMode = settings?.site.themeMode ?? "dark";
  const palette = (settings && PALETTES[settings.site.themePalette]) ?? PALETTES.violet;

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
