"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { PALETTES, PALETTE_KEYS, type PaletteKey, type ThemeMode } from "@/lib/theme";
import { LOCALES } from "@/lib/constants";
import { getSetupT, type WizardLang } from "@/lib/setup-translations";
import type { Locale } from "@/types";

const LOCALE_LABELS: Record<Locale, string> = { en: "English", it: "Italiano" };
const LOCALE_OPTIONS = LOCALES.map((locale) => ({ value: locale, label: LOCALE_LABELS[locale] }));

export function SiteStep({ onBack, lang }: { onBack?: () => void; lang: WizardLang }) {
  const t = getSetupT(lang).site;
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [https, setHttps] = useState(true);
  // The site's own content locale only supports the languages it has
  // translations for (LOCALES), unlike the wider set of wizard UI languages
  // — default to the chosen wizard language only when it's one of those.
  const [defaultLocale, setDefaultLocale] = useState<Locale>(
    (LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : "en",
  );
  const [themePalette, setThemePalette] = useState<PaletteKey>("violet");
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      setDomain(window.location.host);
      setHttps(window.location.protocol === "https:");
    });
  }, []);

  async function handleSubmit() {
    if (!domain) {
      setError(t.domainRequired);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/setup/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, https, defaultLocale, themePalette, themeMode }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? t.genericError);
        return;
      }
      router.push("/admin/login");
      router.refresh();
    } catch {
      setError(t.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="relative w-full max-w-lg p-6 sm:p-8">
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          aria-label={t.back}
          className="absolute right-4 top-4 h-9 w-9 p-0 sm:right-6 sm:top-6"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      <h1 className="text-xl font-medium tracking-tight text-foreground">{t.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>

      <div className="mt-6 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">{t.domain}</label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
            <Toggle checked={https} onChange={setHttps} label={t.useHttps} />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{t.domainHint}</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">{t.mainLanguage}</label>
          <Select
            value={defaultLocale}
            onChange={(value) => setDefaultLocale(value as Locale)}
            options={LOCALE_OPTIONS}
            className="max-w-xs"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">{t.theme}</label>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              {PALETTE_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setThemePalette(key)}
                  aria-label={PALETTES[key].label}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-transform",
                    themePalette === key ? "scale-110 border-foreground" : "border-transparent",
                  )}
                  style={{ background: PALETTES[key].accent }}
                />
              ))}
            </div>
            <Toggle
              checked={themeMode === "dark"}
              onChange={(checked) => setThemeMode(checked ? "dark" : "light")}
              label={themeMode === "dark" ? t.dark : t.light}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-full">
          {isSubmitting ? t.saving : t.finish}
        </Button>
      </div>
    </Card>
  );
}
