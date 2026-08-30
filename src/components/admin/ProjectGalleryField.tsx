"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SortableList } from "@/components/admin/SortableList";
import { useToast } from "@/context/ToastContext";
import { LOCALES } from "@/lib/constants";
import type { Locale, ProjectImage } from "@/types";

function emptyCaptions(): ProjectImage["translations"] {
  return Object.fromEntries(LOCALES.map((locale) => [locale, { caption: "" }])) as ProjectImage["translations"];
}

/**
 * The project's images, in order, with a caption each.
 *
 * The first one is the cover — which is why they're draggable rather than
 * having a separate "cover" field: choosing the cover and ordering the
 * gallery are the same decision, and splitting them into two controls only
 * invites them to disagree.
 */
export function ProjectGalleryField({
  images,
  onChange,
  locale,
}: {
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  locale: Locale;
}) {
  const toast = useToast();
  // Cleared after each upload so the field is ready for the next one.
  const [pending, setPending] = useState("");

  function add(url: string) {
    if (!url) return;
    setPending("");
    // The URL is the row's identity — for the drag order, and for React. The
    // same picture twice would give two rows the same one, and is a mistake
    // anyway.
    if (images.some((image) => image.url === url)) {
      toast.error("Quell’immagine è già nella galleria");
      return;
    }
    onChange([...images, { url, translations: emptyCaptions() }]);
  }

  function setCaption(url: string, caption: string) {
    onChange(
      images.map((image) =>
        image.url === url
          ? {
              ...image,
              translations: { ...image.translations, [locale]: { caption } },
            }
          : image,
      ),
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Immagini</label>
        <p className="mb-3 text-xs text-muted-foreground">
          La prima è la copertina. Trascina per cambiare ordine; la didascalia è facoltativa e viene tradotta
          come il resto.
        </p>
      </div>

      {images.length > 0 && (
        <SortableList items={images} onReorder={onChange} onCommit={() => {}} getKey={(image) => image.url}>
          {(image, handle) => (
            <Card className="flex items-center gap-3 p-3">
              {handle}
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-white/[0.02]">
                <ImageWithFallback src={image.url} alt="" fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Input
                  placeholder="Didascalia (facoltativa)"
                  value={image.translations[locale]?.caption ?? ""}
                  onChange={(e) => setCaption(image.url, e.target.value)}
                />
              </div>
              {images[0]?.url === image.url && <Badge>Copertina</Badge>}
              <button
                type="button"
                onClick={() => onChange(images.filter((other) => other.url !== image.url))}
                aria-label="Rimuovi immagine"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </Card>
          )}
        </SortableList>
      )}

      <ImageUploadField
        value={pending}
        onChange={add}
        folder="projects"
        label={images.length === 0 ? "Aggiungi la copertina" : "Aggiungi un'altra immagine"}
      />
    </div>
  );
}
