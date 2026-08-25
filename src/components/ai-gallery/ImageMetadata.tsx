"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "@/components/ui/Badge";
import type { AiImage } from "@/types";

export function ImageMetadata({ image }: { image: AiImage }) {
  const { locale } = useTranslation();
  const t = image.translations[locale];

  const rows: [string, string][] = [
    ["Model", image.model],
    ["Sampler", image.sampler],
    ["Steps", String(image.steps)],
    ["CFG Scale", String(image.cfgScale)],
    ["Seed", String(image.seed)],
  ];

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground">Prompt</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t.prompt}</p>

      {image.negativePrompt && (
        <>
          <h3 className="mt-6 text-sm font-medium text-foreground">Negative prompt</h3>
          <p className="mt-2 text-sm text-muted-foreground">{image.negativePrompt}</p>
        </>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      {image.loras.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {image.loras.map((lora) => (
            <Badge key={lora.name}>
              {lora.name} · {lora.weight}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
