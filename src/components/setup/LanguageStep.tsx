"use client";

import { Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { WIZARD_LANGUAGES, type WizardLang } from "@/lib/setup-translations";

export function LanguageStep({ onSelect }: { onSelect: (lang: WizardLang) => void }) {
  return (
    <Card className="w-full max-w-lg p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-wash">
          <Globe className="h-6 w-6 text-accent" />
        </div>
        <h1 className="mt-4 text-xl font-medium tracking-tight text-foreground">Select Your Language</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose the language for the setup wizard.</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {WIZARD_LANGUAGES.map((option) => (
          <button
            key={option.code}
            type="button"
            onClick={() => onSelect(option.code)}
            className="rounded-2xl border border-border p-4 text-sm text-foreground transition-colors hover:border-accent hover:bg-surface-wash"
          >
            {option.nativeName}
          </button>
        ))}
      </div>
    </Card>
  );
}
