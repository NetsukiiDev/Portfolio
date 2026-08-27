"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
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
  titleEn: string;
  excerptEn: string;
  contentEn: string;
  titleIt: string;
  excerptIt: string;
  contentIt: string;
}

function toFormValues(post?: BlogPost): BlogFormValues {
  return {
    slug: post?.slug ?? "",
    status: post?.status ?? "draft",
    coverImage: post?.coverImage ?? "",
    tags: post?.tags.join(", ") ?? "",
    readingTime: post?.readingTime ?? 5,
    titleEn: post?.translations.en.title ?? "",
    excerptEn: post?.translations.en.excerpt ?? "",
    contentEn: post?.translations.en.content ?? "",
    titleIt: post?.translations.it.title ?? "",
    excerptIt: post?.translations.it.excerpt ?? "",
    contentIt: post?.translations.it.content ?? "",
  };
}

export function BlogForm({ post, locale }: { post?: BlogPost; locale: Locale }) {
  const router = useRouter();
  const toast = useToast();
  const isEditing = Boolean(post);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm<BlogFormValues>({
    defaultValues: toFormValues(post),
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
      translations: {
        en: { title: values.titleEn, excerpt: values.excerptEn, content: values.contentEn },
        it: { title: values.titleIt, excerpt: values.excerptIt, content: values.contentIt },
      },
    };

    try {
      const res = await fetch(isEditing ? `/api/blog/${post!.slug}` : "/api/blog", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");

      toast.success(isEditing ? "Post updated" : "Post created");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    await fetch(`/api/blog/${post!.slug}`, { method: "DELETE" });
    toast.success("Post deleted");
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
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
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
          <label className="mb-2 block text-sm font-medium text-foreground">Reading time (minutes)</label>
          <Input type="number" {...register("readingTime", { valueAsNumber: true })} />
        </div>
      </div>

      <ImageUploadField
        value={coverImage}
        onChange={(url) => setValue("coverImage", url)}
        folder="blog"
        label="Immagine di copertina"
      />

      {/* Only the authoring language is shown; the other locales are
          generated on save (Admin → Lingua). The hidden group stays mounted
          so its stored values round-trip untouched. */}
      <Tabs defaultValue={locale}>
        <TabsContent value="en">
          <div className="space-y-4">
            <Input {...register("titleEn", { required: true })} placeholder="Title" />
            <Textarea rows={2} {...register("excerptEn")} placeholder="Excerpt" />
            <Textarea rows={10} {...register("contentEn")} placeholder="Full content (Markdown supported)" />
          </div>
        </TabsContent>
        <TabsContent value="it">
          <div className="space-y-4">
            <Input {...register("titleIt")} placeholder="Titolo" />
            <Textarea rows={2} {...register("excerptIt")} placeholder="Estratto" />
            <Textarea rows={10} {...register("contentIt")} placeholder="Contenuto completo (Markdown supportato)" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between border-t border-border pt-6">
        {isEditing ? <DeleteButton onConfirm={handleDelete} label="post" /> : <span />}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvataggio…" : isEditing ? "Salva modifiche" : "Crea articolo"}
        </Button>
      </div>
    </form>
  );
}
