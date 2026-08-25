"use client";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useTranslation } from "@/hooks/useTranslation";
import { RevealOnScroll } from "@/components/animations";
import type { Settings } from "@/types";

export function AboutHero({ settings }: { settings: Settings }) {
  const { locale } = useTranslation();
  const t = settings.personal.translations[locale];

  return (
    <div className="grid grid-cols-1 items-center gap-12 pt-32 md:grid-cols-2">
      <RevealOnScroll>
        <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-white/[0.02]">
          <ImageWithFallback src={settings.personal.avatar} alt={t.name} fill className="object-cover" />
        </div>
      </RevealOnScroll>
      <RevealOnScroll delay={0.1}>
        <p className="text-sm font-medium text-accent">{t.title}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">{t.name}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{t.bio}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t.location}</p>
      </RevealOnScroll>
    </div>
  );
}
