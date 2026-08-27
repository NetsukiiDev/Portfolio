"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { UploadFolder } from "@/lib/constants";

export function ImageUploadField({
  value,
  onChange,
  folder,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");

        const data = (await res.json()) as { url: string };
        onChange(data.url);
      } catch {
        setError("Upload failed. Try a smaller image.");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    maxFiles: 1,
  });

  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>}
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-6 text-center transition-colors",
          isDragActive && "border-accent bg-accent-soft",
        )}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-xl">
            <ImageWithFallback src={value} alt="Preview" fill className="object-cover" />
          </div>
        ) : uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
        <p className="text-xs text-muted-foreground">
          {uploading ? "Uploading…" : value ? "Clicca o trascina per sostituire" : "Clicca o trascina un'immagine"}
        </p>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" /> Remove
        </button>
      )}
    </div>
  );
}
