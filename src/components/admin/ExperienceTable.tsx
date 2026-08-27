"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { useToast } from "@/context/ToastContext";
import type { Experience, Locale } from "@/types";

export function ExperienceTable({ items: initialItems, locale }: { items: Experience[]; locale: Locale }) {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();
  const toast = useToast();

  async function handleDelete(id: string) {
    await fetch(`/api/experience/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Voce eliminata");
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nessuna voce.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{item.translations[locale]?.position}</p>
            <p className="text-xs text-muted-foreground">{item.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{item.type === "work" ? "Lavoro" : "Formazione"}</Badge>
            <Link
              href={`/admin/experience/${item.id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <DeleteButton onConfirm={() => handleDelete(item.id)} label="la voce" />
          </div>
        </Card>
      ))}
    </div>
  );
}
