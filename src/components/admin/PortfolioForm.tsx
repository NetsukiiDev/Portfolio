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
import { PAGE_KEYS, SECTION_KEYS } from "@/types/settings";
import type { GithubStatKey, HomeSettings, PageKey, SectionKey, Settings, Locale } from "@/types";

/** The heading each of these sits above on the home page. */
const SECTION_LABELS: Record<SectionKey, string> = {
  featuredProjects: "Titolo della sezione progetti",
  viewAll: "Link «vedi tutti»",
  skills: "Titolo della sezione competenze",
  recentPosts: "Titolo della sezione blog",
  ctaHeading: "Titolo del riquadro finale",
};

/** The public page each editable intro belongs to. */
const PAGE_LABELS: Record<PageKey, string> = {
  projects: "Progetti",
  skills: "Competenze",
  experience: "Esperienza",
  blog: "Blog",
  aiGallery: "Galleria AI",
  contact: "Contatti",
};

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

      <Tabs defaultValue="profilo">
        <TabsList>
          <TabsTrigger value="profilo">Profilo</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Statistiche</TabsTrigger>
          <TabsTrigger value="sezioni">Sezioni</TabsTrigger>
          <TabsTrigger value="pagine">Pagine</TabsTrigger>
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
              I titoli che separano le sezioni della home. Compaiono solo quando la sezione a cui appartengono
              è attiva.
            </p>
            {SECTION_KEYS.map((key) => (
              <Card key={key} className="space-y-3 p-5">
                <h3 className="text-sm font-medium text-foreground">{SECTION_LABELS[key]}</h3>
                <Input
                  placeholder="Testo"
                  value={sections.translations[locale]?.[key] ?? ""}
                  onChange={(e) => updateSection(key, e.target.value)}
                />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pagine">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              La riga che compare sotto il titolo di ogni pagina pubblica. La pagina{" "}
              <span className="text-foreground">Chi sono</span> non è qui: la sua apertura è il profilo.
            </p>
            {PAGE_KEYS.map((page) => (
              <Card key={page} className="space-y-3 p-5">
                <h3 className="text-sm font-medium text-foreground">{PAGE_LABELS[page]}</h3>
                <Textarea
                  rows={2}
                  placeholder="Descrizione della pagina"
                  value={pages.translations[locale]?.[page] ?? ""}
                  onChange={(e) => updatePage(page, e.target.value)}
                />
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
