import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Container } from "./Container";
import { getSettings } from "@/lib/data";
import { translations } from "@/lib/translations";
import type { Locale } from "@/types";

export async function Footer({ siteName, locale }: { siteName: string; locale: Locale }) {
  const settings = await getSettings();
  const t = translations[locale].common;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <Container className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-muted-foreground">
          © {year} {siteName}. {t.rights}
        </p>
        <div className="flex items-center gap-3">
          {settings.social.github && (
            <Link
              href={settings.social.github}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </Link>
          )}
          {settings.social.linkedin && (
            <Link
              href={settings.social.linkedin}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              LinkedIn
            </Link>
          )}
          <a
            href="#top"
            className="rounded-full border border-border p-2.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={t.backToTop}
          >
            <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
