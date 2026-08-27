"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { useToast } from "@/context/ToastContext";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import type { Project, ProjectCategory , Locale} from "@/types";

interface ProjectFormValues {
  slug: string;
  category: ProjectCategory;
  featured: boolean;
  order: number;
  image: string;
  demo: string;
  github: string;
  techStack: string;
  titleEn: string;
  descriptionEn: string;
  contentEn: string;
  titleIt: string;
  descriptionIt: string;
  contentIt: string;
}

function toFormValues(project?: Project): ProjectFormValues {
  return {
    slug: project?.slug ?? "",
    category: project?.category ?? "web",
    featured: project?.featured ?? false,
    order: project?.order ?? 0,
    image: project?.images[0] ?? "",
    demo: project?.links.demo ?? "",
    github: project?.links.github ?? "",
    techStack: project?.techStack.join(", ") ?? "",
    titleEn: project?.translations.en.title ?? "",
    descriptionEn: project?.translations.en.description ?? "",
    contentEn: project?.translations.en.content ?? "",
    titleIt: project?.translations.it.title ?? "",
    descriptionIt: project?.translations.it.description ?? "",
    contentIt: project?.translations.it.content ?? "",
  };
}

export function ProjectForm({ project, locale }: { project?: Project; locale: Locale }) {
  const router = useRouter();
  const toast = useToast();
  const isEditing = Boolean(project);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm<ProjectFormValues>({
    defaultValues: toFormValues(project),
  });

  const image = watch("image");

  async function onSubmit(values: ProjectFormValues) {
    setIsSubmitting(true);

    const payload = {
      slug: values.slug,
      category: values.category,
      featured: values.featured,
      order: Number(values.order),
      images: values.image ? [values.image] : [],
      links: {
        ...(values.demo ? { demo: values.demo } : {}),
        ...(values.github ? { github: values.github } : {}),
      },
      techStack: values.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      translations: {
        en: { title: values.titleEn, description: values.descriptionEn, content: values.contentEn },
        it: { title: values.titleIt, description: values.descriptionIt, content: values.contentIt },
      },
    };

    try {
      const res = await fetch(isEditing ? `/api/projects/${project!.id}` : "/api/projects", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");

      toast.success(isEditing ? "Project updated" : "Project created");
      router.push("/admin/projects");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    await fetch(`/api/projects/${project!.id}`, { method: "DELETE" });
    toast.success("Project deleted");
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
                options={PROJECT_CATEGORIES.map((category) => ({ value: category.id, label: category.label.en }))}
              />
            )}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Ordine</label>
          <Input type="number" {...register("order", { valueAsNumber: true })} />
        </div>
        <div className="flex items-end">
          <Controller
            control={control}
            name="featured"
            render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} label="In evidenza" />}
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

      <ImageUploadField
        value={image}
        onChange={(url) => setValue("image", url)}
        folder="projects"
        label="Immagine di copertina"
      />

      {/* Only the authoring language is shown; the other locales are
          generated on save (Admin → Lingua). The hidden group stays mounted
          so its stored values round-trip untouched. */}
      <Tabs defaultValue={locale}>
        <TabsContent value="en">
          <div className="space-y-4">
            <Input {...register("titleEn", { required: true })} placeholder="Title" />
            <Textarea rows={2} {...register("descriptionEn")} placeholder="Short description" />
            <Textarea rows={8} {...register("contentEn")} placeholder="Full content (Markdown supported)" />
          </div>
        </TabsContent>
        <TabsContent value="it">
          <div className="space-y-4">
            <Input {...register("titleIt")} placeholder="Titolo" />
            <Textarea rows={2} {...register("descriptionIt")} placeholder="Descrizione breve" />
            <Textarea rows={8} {...register("contentIt")} placeholder="Contenuto completo (Markdown supportato)" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between border-t border-border pt-6">
        {isEditing ? <DeleteButton onConfirm={handleDelete} label="project" /> : <span />}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvataggio…" : isEditing ? "Salva modifiche" : "Crea progetto"}
        </Button>
      </div>
    </form>
  );
}
