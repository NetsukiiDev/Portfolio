"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SortableList } from "@/components/admin/SortableList";
import { useToast } from "@/context/ToastContext";
import type { Locale, Project } from "@/types";

export function ProjectsTable({ projects, locale }: { projects: Project[]; locale: Locale }) {
  // Held in list order from the start: dragging rewrites the array, and the
  // array is what gets saved.
  const [items, setItems] = useState(() => [...projects].sort((a, b) => a.order - b.order));
  const router = useRouter();
  const toast = useToast();

  async function saveOrder(next: Project[]) {
    try {
      await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "projects", ids: next.map((project) => project.id) }),
      });
      router.refresh();
    } catch {
      toast.error("Ordine non salvato");
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((project) => project.id !== id));
    toast.success("Progetto eliminato");
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nessun progetto.</p>;
  }

  return (
    <SortableList
      items={items}
      onReorder={setItems}
      onCommit={() => saveOrder(items)}
      getKey={(project) => project.id}
    >
      {(project) => (
        <Card className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{project.translations[locale]?.title}</p>
            <p className="text-xs text-muted-foreground">/{project.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            {project.featured && <Badge>In evidenza</Badge>}
            <Link
              href={`/admin/projects/${project.id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <DeleteButton onConfirm={() => handleDelete(project.id)} label="il progetto" />
          </div>
        </Card>
      )}
    </SortableList>
  );
}
