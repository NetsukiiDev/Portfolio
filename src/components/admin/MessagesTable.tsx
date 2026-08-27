"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { useToast } from "@/context/ToastContext";
import type { ContactMessage } from "@/lib/data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessagesTable({ messages }: { messages: ContactMessage[] }) {
  const [items, setItems] = useState(messages);
  const router = useRouter();
  const toast = useToast();

  async function handleDelete(id: string) {
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((message) => message.id !== id));
    toast.success("Messaggio eliminato");
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nessun messaggio ricevuto.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((message) => (
        <Card key={message.id} className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{message.name}</p>
              <a
                href={`mailto:${message.email}`}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
                {message.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</span>
              <DeleteButton onConfirm={() => handleDelete(message.id)} label="il messaggio" />
            </div>
          </div>
          <p className="mt-4 whitespace-pre-wrap border-t border-border pt-4 text-sm text-muted-foreground">
            {message.message}
          </p>
        </Card>
      ))}
    </div>
  );
}
