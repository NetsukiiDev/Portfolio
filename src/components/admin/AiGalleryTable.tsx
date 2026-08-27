"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useToast } from "@/context/ToastContext";
import type { AiImage } from "@/types";

export function AiGalleryTable({ images: initialImages }: { images: AiImage[] }) {
  const [images, setImages] = useState(initialImages);
  const router = useRouter();
  const toast = useToast();

  async function handleDelete(id: string) {
    await fetch(`/api/ai-gallery/${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((image) => image.id !== id));
    toast.success("Image deleted");
    router.refresh();
  }

  if (images.length === 0) {
    return <p className="text-sm text-muted-foreground">No images yet.</p>;
  }

  return (
    <div className="space-y-3">
      {images.map((image) => (
        <Card key={image.id} className="flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/[0.03]">
              <ImageWithFallback src={image.thumbnail} alt="" fill className="object-cover" />
            </div>
            <p className="truncate text-sm font-medium text-foreground">{image.translations.en.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/ai-gallery/${image.id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <DeleteButton onConfirm={() => handleDelete(image.id)} label="l'immagine" />
          </div>
        </Card>
      ))}
    </div>
  );
}
