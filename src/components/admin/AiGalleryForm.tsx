"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { useToast } from "@/context/ToastContext";
import type { AiImage , Locale} from "@/types";

interface AiGalleryFormValues {
  image: string;
  tags: string;
  model: string;
  sampler: string;
  steps: number;
  cfgScale: number;
  seed: number;
  negativePrompt: string;
  loras: string;
  titleEn: string;
  descriptionEn: string;
  promptEn: string;
  titleIt: string;
  descriptionIt: string;
  promptIt: string;
}

function toFormValues(image?: AiImage): AiGalleryFormValues {
  return {
    image: image?.image ?? "",
    tags: image?.tags.join(", ") ?? "",
    model: image?.model ?? "",
    sampler: image?.sampler ?? "",
    steps: image?.steps ?? 30,
    cfgScale: image?.cfgScale ?? 7,
    seed: image?.seed ?? 0,
    negativePrompt: image?.negativePrompt ?? "",
    loras: image?.loras.map((lora) => `${lora.name}:${lora.weight}`).join(", ") ?? "",
    titleEn: image?.translations.en.title ?? "",
    descriptionEn: image?.translations.en.description ?? "",
    promptEn: image?.translations.en.prompt ?? "",
    titleIt: image?.translations.it.title ?? "",
    descriptionIt: image?.translations.it.description ?? "",
    promptIt: image?.translations.it.prompt ?? "",
  };
}

export function AiGalleryForm({ image, locale }: { image?: AiImage; locale: Locale }) {
  const router = useRouter();
  const toast = useToast();
  const isEditing = Boolean(image);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<AiGalleryFormValues>({
    defaultValues: toFormValues(image),
  });

  const imageUrl = watch("image");

  async function onSubmit(values: AiGalleryFormValues) {
    setIsSubmitting(true);

    const payload = {
      image: values.image,
      thumbnail: values.image,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      model: values.model,
      sampler: values.sampler,
      steps: Number(values.steps),
      cfgScale: Number(values.cfgScale),
      seed: Number(values.seed),
      negativePrompt: values.negativePrompt,
      loras: values.loras
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
          const [name, weight] = entry.split(":");
          return { name: name?.trim() ?? "", weight: Number(weight) || 1 };
        }),
      translations: {
        en: { title: values.titleEn, description: values.descriptionEn, prompt: values.promptEn },
        it: { title: values.titleIt, description: values.descriptionIt, prompt: values.promptIt },
      },
    };

    try {
      const res = await fetch(isEditing ? `/api/ai-gallery/${image!.id}` : "/api/ai-gallery", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");

      toast.success(isEditing ? "Image updated" : "Image added");
      router.push("/admin/ai-gallery");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    await fetch(`/api/ai-gallery/${image!.id}`, { method: "DELETE" });
    toast.success("Image deleted");
    router.push("/admin/ai-gallery");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <ImageUploadField
        value={imageUrl}
        onChange={(url) => setValue("image", url)}
        folder="ai-gallery"
        label="Immagine"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Tag (separati da virgola)</label>
          <Input {...register("tags")} placeholder="landscape, scifi" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Modello</label>
          <Input {...register("model", { required: true })} placeholder="sdxl-1.0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Sampler</label>
          <Input {...register("sampler")} placeholder="DPM++ 2M Karras" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Step</label>
          <Input type="number" {...register("steps", { valueAsNumber: true })} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">CFG Scale</label>
          <Input type="number" step="0.1" {...register("cfgScale", { valueAsNumber: true })} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Seed</label>
          <Input type="number" {...register("seed", { valueAsNumber: true })} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">LoRAs (name:weight, comma separated)</label>
        <Input {...register("loras")} placeholder="detail-tweaker:0.6" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Negative prompt</label>
        <Textarea rows={2} {...register("negativePrompt")} />
      </div>

      {/* Only the authoring language is shown; the other locales are
          generated on save (Admin → Lingua). The hidden group stays mounted
          so its stored values round-trip untouched. */}
      <Tabs defaultValue={locale}>
        <TabsContent value="en">
          <div className="space-y-4">
            <Input {...register("titleEn", { required: true })} placeholder="Title" />
            <Textarea rows={2} {...register("descriptionEn")} placeholder="Description" />
            <Textarea rows={3} {...register("promptEn")} placeholder="Prompt" />
          </div>
        </TabsContent>
        <TabsContent value="it">
          <div className="space-y-4">
            <Input {...register("titleIt")} placeholder="Titolo" />
            <Textarea rows={2} {...register("descriptionIt")} placeholder="Descrizione" />
            <Textarea rows={3} {...register("promptIt")} placeholder="Prompt" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between border-t border-border pt-6">
        {isEditing ? <DeleteButton onConfirm={handleDelete} label="l'immagine" /> : <span />}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvataggio…" : isEditing ? "Salva modifiche" : "Add image"}
        </Button>
      </div>
    </form>
  );
}
