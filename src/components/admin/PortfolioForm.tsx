"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useToast } from "@/context/ToastContext";
import type { GithubStatKey, HomeSettings, PageKey, SectionKey, Settings, Locale } from "@/types";

/**
 * The page, in the order it is read. Each band has a heading, and most have a
 * line under it — they used to live in two separate tabs, "Sezioni" and
 * "Pagine", which is a split that stopped meaning anything when the pages
 * became sections.
 */
const BANDS: { label: string; heading: SectionKey; description?: PageKey; hint?: string }[] = [
  { label: "Progetti", heading: "featuredProjects", description: "projects" },
  { label: "Stack", heading: "tools" },
  { label: "Competenze", heading: "skills", description: "skills" },
  { label: "Esperienza", heading: "experience", description: "experience" },
  { label: "Chi sono", heading: "about" },
  {
    label: "Blog",
    heading: "recentPosts",
    description: "blog",
    hint: "Ha anche una pagina d’archivio, dove compare la stessa riga.",
  },
  {
    label: "Galleria AI",
    heading: "gallery",
    description: "aiGallery",
    hint: "Ha anche una pagina d’archivio, dove compare la stessa riga.",
  },
  { label: "Riquadro finale", heading: "ctaHeading" },
  { label: "Contatti", heading: "contact", description: "contact" },
];

/** Which GitHub figure each row shows — the wording below it is editable. */
const STAT_LABELS: Record<GithubStatKey, string> = {
  repos: "Repository pubblici",
  followers: "Follower",
  stars: "Stelle ricevute",
  years: "Anni su GitHub",
};

export function PortfolioForm({ settings, locale }: { settings: Settings; locale: Locale }) {
  const toast = useToast();
  const [home, setHome] = useState<HomeSettings>(settings.home);
  const [personal, setPersonal] = useState<Settings["personal"]>(settings.personal);
  const [pages, setPages] = useState<Settings["pages"]>(settings.pages);
  const [sections, setSections] = useState<Settings["sections"]>(settings.sections);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateText(locale: Locale, field: keyof HomeSettings["translations"][Locale], value: string) {
    setHome((prev) => ({
      ...prev,
      translations: { ...prev.translations, [locale]: { ...prev.translations[locale], [field]: value } },
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

  function updatePersonal(field: "name" | "title" | "location" | "bio" | "longBio", value: string) {
    setPersonal((prev) => ({
      ...prev,
      translations: { ...prev.translations, [locale]: { ...prev.translations[locale], [field]: value } },
    }));
  }

  function updatePage(page: PageKey, value: string) {
    setPages((prev) => ({
      translations: { ...prev.translations, [locale]: { ...prev.translations[locale], [page]: value } },
    }));
  }

  function updateSection(key: SectionKey, value: string) {
    setSections((prev) => ({
      translations: { ...prev.translations, [locale]: { ...prev.translations[locale], [key]: value } },
    }));
  }

  async function onSave() {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Only this page's slice — the API merges it into what's stored.
        body: JSON.stringify({ home, personal, pages, sections }),
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
          <TabsTrigger value="sezioni">Sezioni</TabsTrigger>
          <TabsTrigger value="stats">Statistiche</TabsTrigger>
          <TabsTrigger value="profilo">Profilo</TabsTrigger>
        </TabsList>

        <TabsContent value="profilo">
          <Card className="space-y-4 p-5">
            <ImageUploadField
              value={personal.avatar}
              onChange={(url) => setPersonal((prev) => ({ ...prev, avatar: url }))}
              folder="settings"
              label="Avatar"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                placeholder="Email"
                value={personal.email}
                onChange={(e) => setPersonal((prev) => ({ ...prev, email: e.target.value }))}
              />
              <Input
                placeholder="Link al CV"
                value={personal.resumeUrl}
                onChange={(e) => setPersonal((prev) => ({ ...prev, resumeUrl: e.target.value }))}
              />
            </div>
            <Input
              placeholder="Nome"
              value={personal.translations[locale].name}
              onChange={(e) => updatePersonal("name", e.target.value)}
            />
            <Input
              placeholder="Ruolo"
              value={personal.translations[locale].title}
              onChange={(e) => updatePersonal("title", e.target.value)}
            />
            <Input
              placeholder="Località"
              value={personal.translations[locale].location}
              onChange={(e) => updatePersonal("location", e.target.value)}
            />
            <Textarea
              rows={2}
              placeholder="Bio breve"
              value={personal.translations[locale].bio}
              onChange={(e) => updatePersonal("bio", e.target.value)}
            />
            <Textarea
              rows={4}
              placeholder="Bio estesa"
              value={personal.translations[locale].longBio}
              onChange={(e) => updatePersonal("longBio", e.target.value)}
            />
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <div className="space-y-6">
            {/* Written in the authoring language only; the other locales are
                generated on save and reviewed under Lingua. */}
            <Card className="space-y-4 p-5">
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
                  placeholder="Frase principale"
                  value={home.translations[locale].subtitle}
                  onChange={(e) => updateText(locale, "subtitle", e.target.value)}
                />
                <Textarea
                  rows={3}
                  placeholder="Paragrafo di presentazione"
                  value={home.translations[locale].intro}
                  onChange={(e) => updateText(locale, "intro", e.target.value)}
                />
                <div>
                  <Input
                    placeholder="Pillola di disponibilità"
                    value={home.translations[locale].availability}
                    onChange={(e) => updateText(locale, "availability", e.target.value)}
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Compare in cima alla hero, sopra il titolo. Lasciala vuota per non mostrarla.
                  </p>
                </div>
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
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="space-y-4">
            <Toggle
              checked={home.statsEnabled}
              onChange={(checked) => setHome((prev) => ({ ...prev, statsEnabled: checked }))}
              label="Mostra la sezione statistiche"
            />

            <p className="text-sm text-muted-foreground">
              I numeri arrivano dal profilo GitHub impostato in{" "}
              <span className="text-foreground">Impostazioni → Social</span> e si aggiornano da soli: qui
              modifichi solo le etichette. Senza un profilo GitHub la sezione non compare.
            </p>

            {home.stats.map((stat, index) => (
              <Card key={stat.key} className="space-y-4 p-5">
                <h3 className="text-sm font-medium text-foreground">{STAT_LABELS[stat.key]}</h3>
                <Input
                  placeholder="Etichetta"
                  value={stat.translations[locale].label}
                  onChange={(e) => updateStatLabel(index, locale, e.target.value)}
                />
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="sezioni">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Il sito è una pagina sola: ogni riquadro qui sotto è una fascia di quella pagina, nell&apos;ordine
              in cui si incontrano. Compaiono solo quando il modulo corrispondente è attivo e ha contenuti.
            </p>

            {BANDS.map((band) => (
              <Card key={band.heading} className="space-y-3 p-5">
                <h3 className="text-sm font-medium text-foreground">{band.label}</h3>
                <Input
                  placeholder="Titolo"
                  value={sections.translations[locale]?.[band.heading] ?? ""}
                  onChange={(e) => updateSection(band.heading, e.target.value)}
                />
                {band.description && (
                  <Textarea
                    rows={2}
                    placeholder="Riga sotto il titolo"
                    value={pages.translations[locale]?.[band.description] ?? ""}
                    onChange={(e) => updatePage(band.description!, e.target.value)}
                  />
                )}
                {band.hint && <p className="text-xs text-muted-foreground">{band.hint}</p>}
              </Card>
            ))}

            <Card className="space-y-3 p-5">
              <h3 className="text-sm font-medium text-foreground">Link «vedi tutti»</h3>
              <Input
                placeholder="Testo"
                value={sections.translations[locale]?.viewAll ?? ""}
                onChange={(e) => updateSection("viewAll", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Porta all&apos;archivio dalle fasce del blog e della galleria.
              </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Button type="button" onClick={onSave} disabled={isSubmitting}>
        {isSubmitting ? "Salvataggio…" : "Salva portfolio"}
      </Button>
    </div>
  );
}
