"use client";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useTranslation } from "@/hooks/useTranslation";
import type { Settings } from "@/types";

/** The long bio, beside the portrait. */
export function AboutSection({ personal }: { personal: Settings["personal"] }) {
  const { locale } = useTranslation();
  const text = personal.translations[locale];

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-[240px_minmax(0,1fr)] md:gap-16">
      {personal.avatar && (
        <div className="relative aspect-square w-full max-w-[240px] overflow-hidden rounded-3xl border border-border bg-white/[0.02]">
          <ImageWithFallback src={personal.avatar} alt={text.name} fill className="object-cover" sizes="240px" />
        </div>
      )}
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-accent">{text.title}</p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{text.longBio}</p>
        {text.location && <p className="mt-6 text-sm text-muted-foreground">{text.location}</p>}
      </div>
    </div>
  );
}
