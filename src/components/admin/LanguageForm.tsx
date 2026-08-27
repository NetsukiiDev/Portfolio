"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/context/ToastContext";
import { LOCALES } from "@/lib/constants";
import type { LanguageSettings, Settings } from "@/types/settings";
import type { Locale } from "@/types";

const LOCALE_LABELS: Record<Locale, string> = { en: "Inglese", it: "Italiano" };
const LOCALE_OPTIONS = LOCALES.map((locale) => ({ value: locale, label: LOCALE_LABELS[locale] }));

type Group = "personal" | "seo" | "home" | "maintenance";

/** The settings-level texts the site renders, flattened so they can be listed. */
const ENTRIES: { group: Group; field: string; label: string }[] = [
  { group: "personal", field: "title", label: "Ruolo" },
  { group: "personal", field: "bio", label: "Bio breve" },
  { group: "personal", field: "longBio", label: "Bio estesa" },
  { group: "personal", field: "location", label: "Località" },
  { group: "seo", field: "siteTitle", label: "Titolo SEO" },
  { group: "seo", field: "siteDescription", label: "Descrizione SEO" },
  { group: "home", field: "kicker", label: "Home · kicker" },
  { group: "home", field: "title", label: "Home · titolo" },
  { group: "home", field: "subtitle", label: "Home · sottotitolo" },
  { group: "home", field: "ctaPrimary", label: "Home · pulsante principale" },
  { group: "home", field: "ctaSecondary", label: "Home · pulsante secondario" },
  { group: "maintenance", field: "message", label: "Messaggio di manutenzione" },
];

type Bag = Record<string, Record<string, string>>;

function readGroup(settings: Settings, group: Group): Bag {
  if (group === "personal") return settings.personal.translations as unknown as Bag;
  if (group === "seo") return settings.seo.translations as unknown as Bag;
  if (group === "home") return settings.home.translations as unknown as Bag;
  return settings.maintenance.translations as unknown as Bag;
}

export function LanguageForm({ settings }: { settings: Settings }) {
  const toast = useToast();
  const [language, setLanguage] = useState<LanguageSettings>(settings.language);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const source = language.defaultLocale;
  const targets = LOCALES.filter((locale) => locale !== source);

  function keyOf(group: string, field: string, locale: Locale) {
    return group + "." + field + "." + locale;
  }

  function valueOf(group: Group, field: string, locale: Locale) {
    const key = keyOf(group, field, locale);
    if (key in drafts) return drafts[key];
    return readGroup(settings, group)[locale]?.[field] ?? "";
  }

  async function saveAll() {
    setIsSaving(true);
    try {
      // Rebuilt from what's on screen, so a translation corrected by hand is
      // what gets stored.
      const groups: Record<Group, Bag> = {
        personal: {},
        seo: {},
        home: {},
        maintenance: {},
      };
      for (const group of ["personal", "seo", "home", "maintenance"] as Group[]) {
        for (const locale of LOCALES) {
          groups[group][locale] = { ...readGroup(settings, group)[locale] };
        }
      }
      for (const entry of ENTRIES) {
        for (const locale of LOCALES) {
          const key = keyOf(entry.group, entry.field, locale);
          if (key in drafts) groups[entry.group][locale][entry.field] = drafts[key];
        }
      }

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          personal: { ...settings.personal, translations: groups.personal },
          seo: { ...settings.seo, translations: groups.seo },
          home: { ...settings.home, translations: groups.home },
          maintenance: { ...settings.maintenance, translations: groups.maintenance },
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Impostazioni lingua salvate");
    } catch {
      toast.error("Salvataggio non riuscito");
    } finally {
      setIsSaving(false);
    }
  }

  async function retranslate(overwrite: boolean) {
    setIsTranslating(true);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overwrite }),
      });
      if (!res.ok) throw new Error("Request failed");
      const body = (await res.json()) as { translated: number };
      if (body.translated > 0) {
        toast.success(body.translated + " testi tradotti");
        window.location.reload();
      } else {
        toast.success("Nessun testo da tradurre");
      }
    } catch {
      toast.error("Traduzione non riuscita");
    } finally {
      setIsTranslating(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Lingua predefinita</label>
          <Select
            value={language.defaultLocale}
            onChange={(value) => setLanguage({ ...language, defaultLocale: value as Locale })}
            options={LOCALE_OPTIONS}
            className="max-w-xs"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            È la lingua in cui scrivi i contenuti. Le altre vengono generate da questa.
          </p>
        </div>

        <div>
          <Toggle
            checked={language.autoDetect}
            onChange={(checked) => setLanguage({ ...language, autoDetect: checked })}
            label="Rileva la lingua del visitatore"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Usa la lingua richiesta dal browser, se il sito la offre; altrimenti mostra quella predefinita.
          </p>
        </div>

        <div>
          <Toggle
            checked={language.allowSwitch}
            onChange={(checked) => setLanguage({ ...language, allowSwitch: checked })}
            label="Il visitatore può cambiare lingua"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Mostra il selettore di lingua nella barra di navigazione del sito.
          </p>
        </div>
      </Card>

      <div>
        <h2 className="text-sm font-medium text-foreground">Traduzioni</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate automaticamente dalla lingua predefinita. Sono una bozza: correggile pure qui, non
          vengono sovrascritte al prossimo salvataggio.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={() => retranslate(false)} disabled={isTranslating}>
            {isTranslating ? "Traduzione…" : "Traduci i testi mancanti"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => retranslate(true)} disabled={isTranslating}>
            Ritraduci tutto
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {ENTRIES.map((entry) => (
          <Card key={entry.group + "." + entry.field} className="space-y-3 p-5">
            <div>
              <h3 className="text-sm font-medium text-foreground">{entry.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{valueOf(entry.group, entry.field, source)}</p>
            </div>
            {targets.map((target) => (
              <div key={target}>
                <label className="mb-1.5 block text-xs text-muted-foreground">{LOCALE_LABELS[target]}</label>
                <Input
                  value={valueOf(entry.group, entry.field, target)}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, [keyOf(entry.group, entry.field, target)]: e.target.value }))
                  }
                />
              </div>
            ))}
          </Card>
        ))}
      </div>

      <Button type="button" onClick={saveAll} disabled={isSaving}>
        {isSaving ? "Salvataggio…" : "Salva"}
      </Button>
    </div>
  );
}
