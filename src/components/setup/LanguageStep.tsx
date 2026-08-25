"use client";

import { Card } from "@/components/ui/Card";
import type { Locale } from "@/types";

const LANGUAGE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "it", label: "Italiano" },
  { value: "en", label: "English" },
];

export function LanguageStep({ onSelect }: { onSelect: (lang: Locale) => void }) {
  return (
    <Card className="w-full max-w-lg p-6 sm:p-8">
      <h1 className="text-xl font-medium tracking-tight text-foreground">Setup language / Lingua del setup</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose the language for the setup wizard. / Scegli la lingua della procedura guidata.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {LANGUAGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border p-4 text-sm text-foreground transition-colors hover:border-accent hover:bg-surface-wash"
          >
            {option.label}
          </button>
        ))}
      </div>
    </Card>
  );
}
