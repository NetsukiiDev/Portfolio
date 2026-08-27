"use client";

import { RevealOnScroll } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/cn";
import type { Locale } from "@/types";
import type { PageKey } from "@/types/settings";

/**
 * The title comes from the navigation labels; the line under it is written by
 * the admin (Portfolio → Pagine) and arrives already translated, so the whole
 * record is passed in and picked per locale here — the visitor can switch
 * language without another round trip.
 */
export function PageHeader({
  page,
  descriptions,
  className,
}: {
  page: PageKey;
  descriptions: Record<Locale, string>;
  className?: string;
}) {
  const { t, locale } = useTranslation();

  return (
    <RevealOnScroll className={cn("mx-auto max-w-2xl pt-32 pb-16 text-center", className)}>
      <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">{t.nav[page]}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{descriptions[locale]}</p>
    </RevealOnScroll>
  );
}
