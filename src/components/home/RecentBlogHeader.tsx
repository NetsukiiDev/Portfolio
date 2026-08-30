"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ROUTES } from "@/lib/constants";
import type { Locale } from "@/types";

export function RecentBlogHeader({
  heading,
  viewAll,
}: {
  heading: Record<Locale, string>;
  viewAll: Record<Locale, string>;
}) {
  const { locale } = useTranslation();

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{heading[locale]}</h2>
      <Link
        href={ROUTES.blog}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {viewAll[locale]}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
