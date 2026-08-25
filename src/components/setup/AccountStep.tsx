"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getSetupT, type WizardLang } from "@/lib/setup-translations";

interface AccountFormValues {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export function AccountStep({
  onComplete,
  onBack,
  lang,
}: {
  onComplete: () => void;
  onBack?: () => void;
  lang: WizardLang;
}) {
  const t = getSetupT(lang).account;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountFormValues>();

  const password = watch("password");

  async function onSubmit(values: AccountFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/setup/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          password: values.password,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? t.genericError);
        return;
      }
      onComplete();
    } catch {
      setError(t.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="relative w-full max-w-lg p-6 sm:p-8">
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          aria-label={t.back}
          className="absolute right-4 top-4 h-9 w-9 p-0 sm:right-6 sm:top-6"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      <h1 className="text-xl font-medium tracking-tight text-foreground">{t.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input placeholder={t.firstName} {...register("firstName", { required: true })} />
            {errors.firstName && <p className="mt-1.5 text-xs text-red-400">{t.required}</p>}
          </div>
          <div>
            <Input placeholder={t.lastName} {...register("lastName", { required: true })} />
            {errors.lastName && <p className="mt-1.5 text-xs text-red-400">{t.required}</p>}
          </div>
        </div>
        <div>
          <Input placeholder={t.username} {...register("username", { required: true, minLength: 3 })} />
          {errors.username && <p className="mt-1.5 text-xs text-red-400">{t.minUsername}</p>}
        </div>
        <div>
          <Input type="password" placeholder={t.password} {...register("password", { required: true, minLength: 8 })} />
          {errors.password && <p className="mt-1.5 text-xs text-red-400">{t.minPassword}</p>}
        </div>
        <div>
          <Input
            type="password"
            placeholder={t.confirmPassword}
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === password || t.passwordMismatch,
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message ?? t.required}</p>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t.creating : t.continueLabel}
        </Button>
      </form>
    </Card>
  );
}
