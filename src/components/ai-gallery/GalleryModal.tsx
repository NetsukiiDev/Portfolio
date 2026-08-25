"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useTranslation } from "@/hooks/useTranslation";
import type { AiImage } from "@/types";

export function GalleryModal({ image }: { image: AiImage }) {
  const [open, setOpen] = useState(false);
  const { locale } = useTranslation();
  const t = image.translations[locale];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block aspect-square w-full overflow-hidden rounded-3xl border border-border bg-white/[0.02]"
      >
        <ImageWithFallback src={image.image} alt={t.title} fill className="object-cover" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} className="max-w-4xl p-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
          <ImageWithFallback src={image.image} alt={t.title} fill className="object-contain" />
        </div>
      </Modal>
    </>
  );
}
