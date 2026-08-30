"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { ProjectGalleryField } from "@/components/admin/ProjectGalleryField";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { useToast } from "@/context/ToastContext";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import type { Project, ProjectCategory, ProjectImage, Locale } from "@/types";

interface ProjectFormValues {
  slug: string;
  category: ProjectCategory;
  featured: boolean;
  images: ProjectImage[];
  demo: string;
  github: string;
  techStack: string;
  title: string;
  description: string;
  content: string;
}

function toFormValues(project: Project | undefined, locale: Locale): ProjectFormValues {
  const text = project?.translations[locale];
  return {
    slug: project?.slug ?? "",
    category: project?.category ?? "web",
    featured: project?.featured ?? false,
    images: project?.images ?? [],
    demo: project?.links.demo ?? "",
    github: project?.links.github ?? "",
    techStack: project?.techStack.join(", ") ?? "",
    title: text?.title ?? "",
    description: text?.description ?? "",
    content: text?.content ?? "",
  };
}

export function ProjectForm({ project, locale }: { project?: Project; locale: Locale }) {
  const router = useRouter();
  const toast = useToast();
  const isEditing = Boolean(project);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm<ProjectFormValues>({
    defaultValues: toFormValues(project, locale),
  });

  const images = watch("images");

  async function onSubmit(values: ProjectFormValues) {
    setIsSubmitting(true);

    const payload = {
      slug: values.slug,
      category: values.category,
      featured: values.featured,
      images: values.images,
      links: {
        ...(values.demo ? { demo: values.demo } : {}),
        ...(values.github ? { github: values.github } : {}),
      },
      techStack: values.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      // Only the authoring language is written here; the rest is generated
      // server-side, and any locale already stored rides along untouched.
      translations: {
        ...project?.translations,
        [locale]: { title: values.title, description: values.description, content: values.content },
      },
    };

    try {
      const res = await fetch(isEditing ? `/api/projects/${project!.id}` : "/api/projects", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");

      toast.success(isEditing ? "Progetto aggiornato" : "Progetto creato");
      router.push("/admin/projects");
      router.refresh();
    } catch {
      toast.error("Qualcosa è andato storto");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    await fetch(`/api/projects/${project!.id}`, { method: "DELETE" });
    toast.success("Progetto eliminato");
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Slug</label>
          <Input {...register("slug", { required: true })} placeholder="my-project" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Categoria</label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={PROJECT_CATEGORIES.map((category) => ({
                  value: category.id,
                  label: category.label[locale],
                }))}
              />
            )}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Demo URL</label>
          <Input {...register("demo")} placeholder="https://…" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">GitHub URL</label>
          <Input {...register("github")} placeholder="https://github.com/…" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Stack tecnologico (separato da virgola)</label>
        <Input {...register("techStack")} placeholder="Next.js, React, Tailwind" />
      </div>

      <div className="rounded-2xl border border-border p-4">
        <Controller
          control={control}
          name="featured"
          render={({ field }) => (
            <Toggle checked={field.value} onChange={field.onChange} label="Metti in evidenza" />
          )}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          I progetti in evidenza sono quelli che compaiono in home, fino a tre, nell&apos;ordine dell&apos;elenco.
        </p>
      </div>

      <ProjectGalleryField
        images={images}
        onChange={(next) => setValue("images", next)}
        locale={locale}
      />

      {/* Only the authoring language is written; the other locales are
          generated on save and reviewed under Admin → Lingua. */}
      <div className="space-y-4">
        <Input {...register("title", { required: true })} placeholder="Titolo" />
        <Textarea rows={2} {...register("description")} placeholder="Descrizione breve" />
        <Textarea rows={8} {...register("content")} placeholder="Contenuto completo (Markdown supportato)" />
      </div>

      <div className="flex items-center justify-between border-t border-border pt-6">
        {isEditing ? <DeleteButton onConfirm={handleDelete} label="il progetto" /> : <span />}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvataggio…" : isEditing ? "Salva modifiche" : "Crea progetto"}
        </Button>
      </div>
    </form>
  );
}
