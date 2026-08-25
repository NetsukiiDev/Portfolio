"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { RevealOnScroll } from "@/components/animations";
import type { Settings } from "@/types";

export function AboutContent({ settings }: { settings: Settings }) {
  const { locale } = useTranslation();
  const t = settings.personal.translations[locale];

  return (
    <RevealOnScroll className="mx-auto mt-16 max-w-2xl pb-16">
      <p className="text-lg leading-relaxed text-muted-foreground">{t.longBio}</p>
    </RevealOnScroll>
  );
}
