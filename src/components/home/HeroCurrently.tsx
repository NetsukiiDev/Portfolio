"use client";

import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Experience, Locale } from "@/types";

function period(entry: Experience, locale: Locale, present: string) {
  const year = (date: string | null) => (date ? new Date(date).getFullYear() : null);
  const from = year(entry.startDate);
  const to = entry.current ? present : year(entry.endDate);
  void locale;
  return to && to !== from ? `${from} — ${to}` : `${from}`;
}

/**
 * What the person is doing now, beside the hero: the most recent role in
 * full, with the ones before it listed underneath.
 *
 * Built from the Experience module rather than its own copy — a card that
 * says "currently" and has to be updated by hand is a card that will be
 * wrong. With no entries there is nothing true to show, so it isn't shown.
 */
export function HeroCurrently({ entries }: { entries: Experience[] }) {
  const { t, locale } = useTranslation();
  if (entries.length === 0) return null;

  const [current, ...rest] = entries;
  const text = current.translations[locale];

  return (
    <aside className="w-full max-w-md rounded-3xl border border-border bg-background-elevated/60 p-8 backdrop-blur-sm">
      <p className="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
        {t.common.currently}
      </p>
      <h2 className="mt-3 text-2xl font-medium tracking-tight text-foreground">{current.company}</h2>
      {text?.description && <p className="mt-3 text-sm text-muted-foreground">{text.description}</p>}

      <ul className="mt-6 space-y-2.5">
        {[current, ...rest].map((entry) => (
          <li key={entry.id} className="flex items-start gap-2 text-sm">
            <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            <span className="text-foreground">
              {entry.translations[locale]?.position ?? entry.company}
              <span className="text-muted-foreground">
                {" · "}
                {period(entry, locale, t.common.present)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
