"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Select } from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useToast } from "@/context/ToastContext";
import { LOCALES } from "@/lib/constants";
import type { LanguageSettings, Settings } from "@/types/settings";
import type { Locale } from "@/types";

const LOCALE_LABELS: Record<Locale, string> = { en: "Inglese", it: "Italiano" };
const LOCALE_OPTIONS = LOCALES.map((locale) => ({ value: locale, label: LOCALE_LABELS[locale] }));

type Group = "personal" | "seo" | "home" | "pages" | "maintenance";

interface Entry {
  group: Group;
  field: string;
  label: string;
  /** Long copy gets a textarea rather than a single line. */
  multiline?: boolean;
}

/** The settings-level texts the site renders, grouped the way the admin edits them. */
const SECTIONS: { id: string; label: string; entries: Entry[] }[] = [
  {
    id: "profilo",
    label: "Profilo",
    entries: [
      { group: "personal", field: "title", label: "Ruolo" },
      { group: "personal", field: "bio", label: "Bio breve", multiline: true },
      { group: "personal", field: "longBio", label: "Bio estesa", multiline: true },
      { group: "personal", field: "location", label: "Località" },
    ],
  },
  {
    id: "home",
    label: "Home",
    entries: [
      { group: "home", field: "kicker", label: "Kicker" },
      { group: "home", field: "title", label: "Titolo", multiline: true },
      { group: "home", field: "subtitle", label: "Sottotitolo", multiline: true },
      { group: "home", field: "ctaPrimary", label: "Pulsante principale" },
      { group: "home", field: "ctaSecondary", label: "Pulsante secondario" },
    ],
  },
  {
    id: "pagine",
    label: "Pagine",
    entries: [
      { group: "pages", field: "projects", label: "Progetti", multiline: true },
      { group: "pages", field: "skills", label: "Competenze", multiline: true },
      { group: "pages", field: "experience", label: "Esperienza", multiline: true },
      { group: "pages", field: "blog", label: "Blog", multiline: true },
      { group: "pages", field: "aiGallery", label: "Galleria AI", multiline: true },
      { group: "pages", field: "contact", label: "Contatti", multiline: true },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    entries: [
      { group: "seo", field: "siteTitle", label: "Titolo del sito" },
      { group: "seo", field: "siteDescription", label: "Descrizione", multiline: true },
    ],
  },
  {
    id: "manutenzione",
    label: "Manutenzione",
    entries: [{ group: "maintenance", field: "message", label: "Messaggio", multiline: true }],
  },
];

type Bag = Record<string, Record<string, string>>;

function readGroup(settings: Settings, group: Group): Bag {
  if (group === "personal") return settings.personal.translations as unknown as Bag;
  if (group === "seo") return settings.seo.translations as unknown as Bag;
  if (group === "home") return settings.home.translations as unknown as Bag;
  if (group === "pages") return settings.pages.translations as unknown as Bag;
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
  const dirty = Object.keys(drafts).length > 0 || language !== settings.language;

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
      const groups: Record<Group, Bag> = { personal: {}, seo: {}, home: {}, pages: {}, maintenance: {} };
      for (const group of ["personal", "seo", "home", "pages", "maintenance"] as Group[]) {
        for (const locale of LOCALES) {
          groups[group][locale] = { ...readGroup(settings, group)[locale] };
        }
      }
      for (const section of SECTIONS) {
        for (const entry of section.entries) {
          for (const locale of LOCALES) {
            const key = keyOf(entry.group, entry.field, locale);
            if (key in drafts) groups[entry.group][locale][entry.field] = drafts[key];
          }
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
          pages: { ...settings.pages, translations: groups.pages },
          maintenance: { ...settings.maintenance, translations: groups.maintenance },
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Salvato");
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
        toast.success("Erano già tutti tradotti");
      }
    } catch {
      toast.error("Traduzione non riuscita");
    } finally {
      setIsTranslating(false);
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="impostazioni">
        <TabsList>
          <TabsTrigger value="impostazioni">Impostazioni</TabsTrigger>
          {SECTIONS.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="impostazioni">
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
                Usa la lingua richiesta dal browser, se il sito la offre; altrimenti mostra quella
                predefinita.
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
        </TabsContent>

        {SECTIONS.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  A sinistra il testo che hai scritto, a destra la traduzione: correggila pure, non viene
                  sovrascritta.
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => retranslate(false)}
                    disabled={isTranslating}
                  >
                    {isTranslating ? "Traduzione…" : "Traduci i mancanti"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => retranslate(true)}
                    disabled={isTranslating}
                  >
                    Ritraduci tutto
                  </Button>
                </div>
              </div>

              {section.entries.map((entry) => (
                <Card key={entry.group + "." + entry.field} className="p-5">
                  <h3 className="text-sm font-medium text-foreground">{entry.label}</h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs text-muted-foreground">
                        {LOCALE_LABELS[source]} · originale
                      </label>
                      <p className="rounded-2xl border border-border bg-surface-wash px-4 py-3 text-sm text-muted-foreground">
                        {valueOf(entry.group, entry.field, source) || "—"}
                      </p>
                    </div>
                    {targets.map((target) => {
                      const key = keyOf(entry.group, entry.field, target);
                      const value = valueOf(entry.group, entry.field, target);
                      return (
                        <div key={target}>
                          <label className="mb-1.5 block text-xs text-muted-foreground">
                            {LOCALE_LABELS[target]}
                          </label>
                          {entry.multiline ? (
                            <Textarea
                              rows={3}
                              value={value}
                              onChange={(e) => setDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
                            />
                          ) : (
                            <Input
                              value={value}
                              onChange={(e) => setDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Button type="button" onClick={saveAll} disabled={isSaving || !dirty}>
        {isSaving ? "Salvataggio…" : "Salva"}
      </Button>
    </div>
  );
}
