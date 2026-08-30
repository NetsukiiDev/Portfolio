"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Locale } from "@/types";

/** "See them all" — only for the two sections that still have a page. */
export function SectionLink({ href, label }: { href: string; label: Record<Locale, string> }) {
  const { locale } = useTranslation();

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {label[locale]}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  );
}
