import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/Providers";
import { SITE_NAME } from "@/lib/constants";
import { getSettings } from "@/lib/data";
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

export async function generateMetadata(): Promise<Metadata> {
  let siteUrl = "http://localhost:3000";
  try {
    const settings = await getSettings();
    siteUrl = settings.seo.siteUrl || siteUrl;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }

  return {
    title: {
      default: `${SITE_NAME} — Portfolio`,
      template: `%s — ${SITE_NAME}`,
    },
    description: "Full-Stack Developer Portfolio",
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: `${SITE_NAME} — Portfolio`,
      description: "Full-Stack Developer Portfolio",
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
  let defaultLocale: "en" | "it" = "en";
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

  return (
    <html
      lang={defaultLocale}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${themeMode} h-full antialiased`}
    >
      <head>
        <style>{`:root{--accent:${palette.accent};--accent-soft:${palette.accentSoft}}`}</style>
      </head>
      <body id="top" className="flex min-h-full flex-col">
        <Providers defaultLocale={defaultLocale}>{children}</Providers>
      </body>
    </html>
  );
}
