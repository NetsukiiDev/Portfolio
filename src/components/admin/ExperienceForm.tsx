"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { useToast } from "@/context/ToastContext";
import type { Experience, ExperienceType } from "@/types";

interface ExperienceFormValues {
  type: ExperienceType;
  company: string;
  logo: string;
  website: string;
  startDate: string;
  endDate: string;
  current: boolean;
  order: number;
  positionEn: string;
  descriptionEn: string;
  highlightsEn: string;
  positionIt: string;
  descriptionIt: string;
  highlightsIt: string;
}

function toFormValues(experience?: Experience): ExperienceFormValues {
  return {
    type: experience?.type ?? "work",
    company: experience?.company ?? "",
    logo: experience?.logo ?? "",
    website: experience?.website ?? "",
    startDate: experience?.startDate?.slice(0, 10) ?? "",
    endDate: experience?.endDate?.slice(0, 10) ?? "",
    current: experience?.current ?? false,
    order: experience?.order ?? 0,
    positionEn: experience?.translations.en.position ?? "",
    descriptionEn: experience?.translations.en.description ?? "",
    highlightsEn: experience?.translations.en.highlights.join("\n") ?? "",
    positionIt: experience?.translations.it.position ?? "",
    descriptionIt: experience?.translations.it.description ?? "",
    highlightsIt: experience?.translations.it.highlights.join("\n") ?? "",
  };
}

export function ExperienceForm({ experience }: { experience?: Experience }) {
  const router = useRouter();
  const toast = useToast();
  const isEditing = Boolean(experience);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm<ExperienceFormValues>({
    defaultValues: toFormValues(experience),
  });

  const logo = watch("logo");
  const current = watch("current");

  async function onSubmit(values: ExperienceFormValues) {
    setIsSubmitting(true);

    const payload = {
      type: values.type,
      company: values.company,
      logo: values.logo,
      ...(values.website ? { website: values.website } : {}),
      startDate: values.startDate,
      endDate: values.current ? null : values.endDate || null,
      current: values.current,
      order: Number(values.order),
      translations: {
        en: {
          position: values.positionEn,
          description: values.descriptionEn,
          highlights: values.highlightsEn
            .split("\n")
            .map((h) => h.trim())
            .filter(Boolean),
        },
        it: {
          position: values.positionIt,
          description: values.descriptionIt,
          highlights: values.highlightsIt
            .split("\n")
            .map((h) => h.trim())
            .filter(Boolean),
        },
      },
    };

    try {
      const res = await fetch(isEditing ? `/api/experience/${experience!.id}` : "/api/experience", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");

      toast.success(isEditing ? "Entry updated" : "Entry created");
      router.push("/admin/experience");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    await fetch(`/api/experience/${experience!.id}`, { method: "DELETE" });
    toast.success("Entry deleted");
    router.push("/admin/experience");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Type</label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "work", label: "Work" },
                  { value: "education", label: "Education" },
                ]}
              />
            )}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Company / Institution</label>
          <Input {...register("company", { required: true })} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Website</label>
          <Input {...register("website")} placeholder="https://…" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Order</label>
          <Input type="number" {...register("order", { valueAsNumber: true })} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Start date</label>
          <Controller
            control={control}
            name="startDate"
            rules={{ required: true }}
            render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">End date</label>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} disabled={current} />}
          />
        </div>
        <div className="flex items-end">
          <Controller
            control={control}
            name="current"
            render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} label="Current" />}
          />
        </div>
      </div>

      <ImageUploadField value={logo} onChange={(url) => setValue("logo", url)} folder="experience" label="Logo" />

      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="it">Italiano</TabsTrigger>
        </TabsList>
        <TabsContent value="en">
          <div className="space-y-4">
            <Input {...register("positionEn", { required: true })} placeholder="Position" />
            <Textarea rows={2} {...register("descriptionEn")} placeholder="Description" />
            <Textarea rows={4} {...register("highlightsEn")} placeholder="One highlight per line" />
          </div>
        </TabsContent>
        <TabsContent value="it">
          <div className="space-y-4">
            <Input {...register("positionIt")} placeholder="Posizione" />
            <Textarea rows={2} {...register("descriptionIt")} placeholder="Descrizione" />
            <Textarea rows={4} {...register("highlightsIt")} placeholder="Un punto saliente per riga" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between border-t border-border pt-6">
        {isEditing ? <DeleteButton onConfirm={handleDelete} label="entry" /> : <span />}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create entry"}
        </Button>
      </div>
    </form>
  );
}
