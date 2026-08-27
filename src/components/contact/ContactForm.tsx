"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/context/ToastContext";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const { t } = useTranslation();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success(t.common.messageSent);
      reset();
    } catch {
      toast.error(t.common.messageFailed);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Input placeholder={t.common.name} {...register("name")} />
        {errors.name && <p className="mt-1.5 text-xs text-red-400">{t.common.required}</p>}
      </div>
      <div>
        <Input type="email" placeholder={t.common.email} {...register("email")} />
        {errors.email && <p className="mt-1.5 text-xs text-red-400">{t.common.invalidEmail}</p>}
      </div>
      <div>
        <Textarea rows={5} placeholder={t.common.message} {...register("message")} />
        {errors.message && <p className="mt-1.5 text-xs text-red-400">{t.common.messageTooShort}</p>}
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? t.common.sending : t.common.send}
      </Button>
    </form>
  );
}
