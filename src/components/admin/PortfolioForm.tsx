"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useToast } from "@/context/ToastContext";
import { LOCALES } from "@/lib/constants";
import type { HomeSettings, Settings } from "@/types/settings";
import type { Locale } from "@/types";

const LOCALE_LABELS: Record<Locale, string> = { en: "English", it: "Italiano" };

export function PortfolioForm({ settings }: { settings: Settings }) {
  const toast = useToast();
  const [home, setHome] = useState<HomeSettings>(settings.home);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateText(locale: Locale, field: keyof HomeSettings["translations"][Locale], value: string) {
    setHome((prev) => ({
      ...prev,
      translations: { ...prev.translations, [locale]: { ...prev.translations[locale], [field]: value } },
    }));
  }

  function updateStatValue(index: number, value: number) {
    setHome((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) => (i === index ? { ...stat, value } : stat)),
    }));
  }

  function updateStatLabel(index: number, locale: Locale, label: string) {
    setHome((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index
          ? { ...stat, translations: { ...stat.translations, [locale]: { label } } }
          : stat,
      ),
    }));
  }

  async function onSave() {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, home } satisfies Settings),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Portfolio salvato");
    } catch {
      toast.error("Salvataggio non riuscito");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Testi e sezioni della pagina principale. Le sezioni dei contenuti (progetti, competenze, blog…) si
        attivano da <span className="text-foreground">Moduli</span>.
      </p>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Statistiche</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <div className="space-y-6">
            {LOCALES.map((locale) => (
              <Card key={locale} className="space-y-4 p-5">
                <h3 className="text-sm font-medium text-foreground">{LOCALE_LABELS[locale]}</h3>
                <Input
                  placeholder="Kicker (etichetta sopra il titolo)"
                  value={home.translations[locale].kicker}
                  onChange={(e) => updateText(locale, "kicker", e.target.value)}
                />
                <div>
                  <Textarea
                    rows={2}
                    placeholder="Titolo"
                    value={home.translations[locale].title}
                    onChange={(e) => updateText(locale, "title", e.target.value)}
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Vai a capo per spezzare il titolo su più righe — ogni riga viene animata separatamente.
                  </p>
                </div>
                <Textarea
                  rows={2}
                  placeholder="Sottotitolo"
                  value={home.translations[locale].subtitle}
                  onChange={(e) => updateText(locale, "subtitle", e.target.value)}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    placeholder="Pulsante principale"
                    value={home.translations[locale].ctaPrimary}
                    onChange={(e) => updateText(locale, "ctaPrimary", e.target.value)}
                  />
                  <Input
                    placeholder="Pulsante secondario"
                    value={home.translations[locale].ctaSecondary}
                    onChange={(e) => updateText(locale, "ctaSecondary", e.target.value)}
                  />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="space-y-4">
            <Toggle
              checked={home.statsEnabled}
              onChange={(checked) => setHome((prev) => ({ ...prev, statsEnabled: checked }))}
              label="Mostra la sezione statistiche"
            />

            {home.stats.map((stat, index) => (
              <Card key={index} className="space-y-4 p-5">
                <Input
                  type="number"
                  placeholder="Valore"
                  value={String(stat.value)}
                  onChange={(e) => updateStatValue(index, Number(e.target.value) || 0)}
                  className="max-w-40"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {LOCALES.map((locale) => (
                    <Input
                      key={locale}
                      placeholder={`Etichetta (${LOCALE_LABELS[locale]})`}
                      value={stat.translations[locale].label}
                      onChange={(e) => updateStatLabel(index, locale, e.target.value)}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Button type="button" onClick={onSave} disabled={isSubmitting}>
        {isSubmitting ? "Salvataggio…" : "Salva portfolio"}
      </Button>
    </div>
  );
}
