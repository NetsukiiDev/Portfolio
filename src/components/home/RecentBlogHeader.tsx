"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ROUTES } from "@/lib/constants";

export function RecentBlogHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{t.common.recentPosts}</h2>
      <Link
        href={ROUTES.blog}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {t.common.viewAll}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
