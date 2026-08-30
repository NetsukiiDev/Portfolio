"use client";

import { RevealOnScroll } from "@/components/animations";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useTranslation } from "@/hooks/useTranslation";
import type { ProjectImage } from "@/types";

/** Everything after the cover, each with its caption where one was written. */
export function ProjectGallery({ images }: { images: ProjectImage[] }) {
  const { t, locale } = useTranslation();

  if (images.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
        {t.common.gallery}
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {images.map((image, index) => {
          const caption = image.translations[locale]?.caption;
          return (
            <RevealOnScroll key={`${image.url}-${index}`} delay={index * 0.05}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-white/[0.02]">
                  <ImageWithFallback
                    src={image.url}
                    alt={caption ?? ""}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
                {caption && <figcaption className="mt-2.5 text-sm text-muted-foreground">{caption}</figcaption>}
              </figure>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
