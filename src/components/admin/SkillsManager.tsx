"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Plus, Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { useToast } from "@/context/ToastContext";
import type { Skill, SkillCategory , Locale} from "@/types";

interface SkillFormValues {
  categoryId: string;
  icon: string;
  proficiency: number;
  yearsOfExperience: number;
  nameEn: string;
  descriptionEn: string;
  nameIt: string;
  descriptionIt: string;
}

function toFormValues(skill?: Skill, defaultCategoryId?: string): SkillFormValues {
  return {
    categoryId: skill?.categoryId ?? defaultCategoryId ?? "",
    icon: skill?.icon ?? "",
    proficiency: skill?.proficiency ?? 70,
    yearsOfExperience: skill?.yearsOfExperience ?? 1,
    nameEn: skill?.translations.en.name ?? "",
    descriptionEn: skill?.translations.en.description ?? "",
    nameIt: skill?.translations.it.name ?? "",
    descriptionIt: skill?.translations.it.description ?? "",
  };
}

export function SkillsManager({
  categories,
  skills: initialSkills,
  locale,
}: {
  categories: SkillCategory[];
  skills: Skill[];
  locale: Locale;
}) {
  const [skills, setSkills] = useState(initialSkills);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const { register, handleSubmit, control, reset } = useForm<SkillFormValues>({
    defaultValues: toFormValues(undefined, sortedCategories[0]?.id),
  });

  function openNew() {
    setEditing(null);
    reset(toFormValues(undefined, sortedCategories[0]?.id));
    setModalOpen(true);
  }

  function openEdit(skill: Skill) {
    setEditing(skill);
    reset(toFormValues(skill));
    setModalOpen(true);
  }

  async function onSubmit(values: SkillFormValues) {
    const payload = {
      categoryId: values.categoryId,
      icon: values.icon,
      proficiency: Number(values.proficiency),
      yearsOfExperience: Number(values.yearsOfExperience),
      order: editing?.order ?? skills.filter((s) => s.categoryId === values.categoryId).length,
      translations: {
        en: { name: values.nameEn, description: values.descriptionEn },
        it: { name: values.nameIt, description: values.descriptionIt },
      },
    };

    try {
      if (editing) {
        const res = await fetch(`/api/skills/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = (await res.json()) as Skill;
        setSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        toast.success("Skill updated");
      } else {
        const res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = (await res.json()) as Skill;
        setSkills((prev) => [...prev, created]);
        toast.success("Skill added");
      }
      setModalOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
    toast.success("Skill deleted");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" /> New skill
        </Button>
      </div>

      <div className="space-y-10">
        {sortedCategories.map((category) => {
          const categorySkills = skills.filter((skill) => skill.categoryId === category.id);
          return (
            <div key={category.id}>
              <h2 className="mb-3 text-sm font-medium text-muted-foreground">{category.translations.en.name}</h2>
              <div className="space-y-3">
                {categorySkills.map((skill) => (
                  <Card key={skill.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{skill.translations.en.name}</p>
                      <Progress value={skill.proficiency} className="mt-2 max-w-xs" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(skill)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <DeleteButton onConfirm={() => handleDelete(skill.id)} label="skill" />
                    </div>
                  </Card>
                ))}
                {categorySkills.length === 0 && <p className="text-xs text-muted-foreground">No skills yet.</p>}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-lg font-medium text-foreground">{editing ? "Edit skill" : "New skill"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Categoria</label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    options={sortedCategories.map((category) => ({
                      value: category.id,
                      label: category.translations.en.name,
                    }))}
                  />
                )}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Slug icona</label>
              <Input {...register("icon")} placeholder="react" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Proficiency (0-100)</label>
              <Input type="number" min={0} max={100} {...register("proficiency", { valueAsNumber: true })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Anni di esperienza</label>
              <Input type="number" min={0} {...register("yearsOfExperience", { valueAsNumber: true })} />
            </div>
          </div>
          {/* Only the authoring language; the other locale is generated on
              save (Admin → Lingua). */}
          {locale === "it" ? (
            <>
              <Input {...register("nameIt", { required: true })} placeholder="Nome" />
              <Input {...register("descriptionIt")} placeholder="Descrizione" />
            </>
          ) : (
            <>
              <Input {...register("nameEn", { required: true })} placeholder="Name" />
              <Input {...register("descriptionEn")} placeholder="Description" />
            </>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Salva</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
