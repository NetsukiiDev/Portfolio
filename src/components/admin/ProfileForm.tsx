"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  username: string;
}

export function ProfileForm({ account }: { account: ProfileFormValues }) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({ defaultValues: account });

  async function onSubmit(values: ProfileFormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        toast.error(body?.error ?? "Something went wrong");
        return;
      }

      toast.success("Profile updated");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">First name</label>
          <Input {...register("firstName", { required: true })} />
          {errors.firstName && <p className="mt-1.5 text-xs text-red-400">Required</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Last name</label>
          <Input {...register("lastName", { required: true })} />
          {errors.lastName && <p className="mt-1.5 text-xs text-red-400">Required</p>}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Username</label>
        <Input {...register("username", { required: true, minLength: 3 })} />
        {errors.username && <p className="mt-1.5 text-xs text-red-400">At least 3 characters</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
