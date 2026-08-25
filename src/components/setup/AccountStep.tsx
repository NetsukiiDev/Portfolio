"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface AccountFormValues {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export function AccountStep({ onComplete, onBack }: { onComplete: () => void; onBack?: () => void }) {
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
        setError(body.error ?? "Qualcosa è andato storto");
        return;
      }
      onComplete();
    } catch {
      setError("Qualcosa è andato storto");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg p-6 sm:p-8">
      <h1 className="text-xl font-medium tracking-tight text-foreground">Account amministratore</h1>
      <p className="mt-1 text-sm text-muted-foreground">Crea l&apos;account che userai per accedere al pannello.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input placeholder="Nome" {...register("firstName", { required: true })} />
            {errors.firstName && <p className="mt-1.5 text-xs text-red-400">Obbligatorio</p>}
          </div>
          <div>
            <Input placeholder="Cognome" {...register("lastName", { required: true })} />
            {errors.lastName && <p className="mt-1.5 text-xs text-red-400">Obbligatorio</p>}
          </div>
        </div>
        <div>
          <Input placeholder="Nome utente" {...register("username", { required: true, minLength: 3 })} />
          {errors.username && <p className="mt-1.5 text-xs text-red-400">Almeno 3 caratteri</p>}
        </div>
        <div>
          <Input type="password" placeholder="Password" {...register("password", { required: true, minLength: 8 })} />
          {errors.password && <p className="mt-1.5 text-xs text-red-400">Almeno 8 caratteri</p>}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Conferma password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === password || "Le password non coincidono",
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message ?? "Obbligatorio"}</p>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {onBack && (
            <Button type="button" variant="secondary" onClick={onBack} className="sm:w-auto">
              Indietro
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Creazione…" : "Continua"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
