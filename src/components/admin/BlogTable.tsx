"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { useToast } from "@/context/ToastContext";
import type { BlogPost } from "@/types";

export function BlogTable({ posts }: { posts: BlogPost[] }) {
  const [items, setItems] = useState(posts);
  const router = useRouter();
  const toast = useToast();

  async function handleDelete(slug: string) {
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    setItems((prev) => prev.filter((post) => post.slug !== slug));
    toast.success("Post deleted");
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No posts yet.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((post) => (
        <Card key={post.id} className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{post.translations.en.title}</p>
            <p className="text-xs text-muted-foreground">/{post.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{post.status}</Badge>
            <Link
              href={`/admin/blog/${post.slug}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <DeleteButton onConfirm={() => handleDelete(post.slug)} label="l'articolo" />
          </div>
        </Card>
      ))}
    </div>
  );
}
