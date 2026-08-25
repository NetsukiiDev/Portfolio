"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useTranslation } from "@/hooks/useTranslation";
import type { AiImage } from "@/types";

export function GalleryCard({ image }: { image: AiImage }) {
  const { locale } = useTranslation();
  const t = image.translations[locale];

  return (
    <Link href={`/ai-gallery/${image.id}`} className="group block">
      <Card className="overflow-hidden transition-colors group-hover:border-border-strong">
        <div className="relative aspect-square overflow-hidden bg-white/[0.02]">
          <ImageWithFallback
            src={image.thumbnail || image.image}
            alt={t.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-foreground">{t.title}</h3>
        </div>
      </Card>
    </Link>
  );
}
