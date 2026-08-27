"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function AccountForm() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormValues>();

  const newPassword = watch("newPassword");

  async function onSubmit(values: PasswordFormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        toast.error(body?.error ?? "Something went wrong");
        return;
      }

      toast.success("Password updated");
      reset();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Password attuale</label>
        <Input type="password" {...register("currentPassword", { required: true })} />
        {errors.currentPassword && <p className="mt-1.5 text-xs text-red-400">Required</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Nuova password</label>
        <Input type="password" {...register("newPassword", { required: true, minLength: 8 })} />
        {errors.newPassword && <p className="mt-1.5 text-xs text-red-400">At least 8 characters</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Confirm new password</label>
        <Input
          type="password"
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === newPassword || "Passwords don't match",
          })}
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message ?? "Required"}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
