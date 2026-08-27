"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { useToast } from "@/context/ToastContext";
import type { BlogPost, BlogStatus , Locale} from "@/types";

interface BlogFormValues {
  slug: string;
  status: BlogStatus;
  coverImage: string;
  tags: string;
  readingTime: number;
  title: string;
  excerpt: string;
  content: string;
}

function toFormValues(post: BlogPost | undefined, locale: Locale): BlogFormValues {
  const text = post?.translations[locale];
  return {
    slug: post?.slug ?? "",
    status: post?.status ?? "draft",
    coverImage: post?.coverImage ?? "",
    tags: post?.tags.join(", ") ?? "",
    readingTime: post?.readingTime ?? 5,
    title: text?.title ?? "",
    excerpt: text?.excerpt ?? "",
    content: text?.content ?? "",
  };
}

export function BlogForm({ post, locale }: { post?: BlogPost; locale: Locale }) {
  const router = useRouter();
  const toast = useToast();
  const isEditing = Boolean(post);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm<BlogFormValues>({
    defaultValues: toFormValues(post, locale),
  });

  const coverImage = watch("coverImage");

  async function onSubmit(values: BlogFormValues) {
    setIsSubmitting(true);

    const willBePublished = values.status === "published";

    const payload = {
      slug: values.slug,
      status: values.status,
      coverImage: values.coverImage,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      readingTime: Number(values.readingTime),
      publishedAt: willBePublished ? (post?.publishedAt ?? new Date().toISOString()) : null,
      // Only the authoring language is written here; the rest is generated
      // server-side, and any locale already stored rides along untouched.
      translations: {
        ...post?.translations,
        [locale]: { title: values.title, excerpt: values.excerpt, content: values.content },
      },
    };

    try {
      const res = await fetch(isEditing ? `/api/blog/${post!.slug}` : "/api/blog", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");

      toast.success(isEditing ? "Articolo aggiornato" : "Articolo creato");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      toast.error("Qualcosa è andato storto");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    await fetch(`/api/blog/${post!.slug}`, { method: "DELETE" });
    toast.success("Articolo eliminato");
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Slug</label>
          <Input {...register("slug", { required: true })} placeholder="my-post" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Stato</label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "draft", label: "Bozza" },
                  { value: "published", label: "Pubblicato" },
                ]}
              />
            )}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Tag (separati da virgola)</label>
          <Input {...register("tags")} placeholder="react, webgl" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Tempo di lettura (minuti)</label>
          <Input type="number" {...register("readingTime", { valueAsNumber: true })} />
        </div>
      </div>

      <ImageUploadField
        value={coverImage}
        onChange={(url) => setValue("coverImage", url)}
        folder="blog"
        label="Immagine di copertina"
      />

      {/* Only the authoring language is written; the other locales are
          generated on save and reviewed under Admin → Lingua. */}
      <div className="space-y-4">
        <Input {...register("title", { required: true })} placeholder="Titolo" />
        <Textarea rows={2} {...register("excerpt")} placeholder="Estratto" />
        <Textarea rows={10} {...register("content")} placeholder="Contenuto completo (Markdown supportato)" />
      </div>

      <div className="flex items-center justify-between border-t border-border pt-6">
        {isEditing ? <DeleteButton onConfirm={handleDelete} label="l'articolo" /> : <span />}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvataggio…" : isEditing ? "Salva modifiche" : "Crea articolo"}
        </Button>
      </div>
    </form>
  );
}
