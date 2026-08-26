"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Select } from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { cn } from "@/lib/cn";
import { PALETTES, PALETTE_KEYS, type PaletteKey, type ThemeMode } from "@/lib/theme";
import { LOCALES } from "@/lib/constants";
import { DEFAULT_STORAGE_SETTINGS, type StorageSettings } from "@/lib/storage/types";
import { getSetupT, type WizardLang } from "@/lib/setup-translations";
import type { Locale } from "@/types";

const LOCALE_LABELS: Record<Locale, string> = { en: "English", it: "Italiano" };
const LOCALE_OPTIONS = LOCALES.map((locale) => ({ value: locale, label: LOCALE_LABELS[locale] }));

export function SiteStep({ lang }: { lang: WizardLang }) {
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
  const [storage, setStorage] = useState<StorageSettings>(DEFAULT_STORAGE_SETTINGS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      setDomain(window.location.host);
      setHttps(window.location.protocol === "https:");
    });
  }, []);

  function setS3<K extends keyof StorageSettings["s3"]>(key: K, value: StorageSettings["s3"][K]) {
    setStorage((prev) => ({ ...prev, s3: { ...prev.s3, [key]: value } }));
  }

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
        body: JSON.stringify({ domain, https, defaultLocale, themePalette, themeMode, storage }),
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
    <Card className="w-full max-w-lg p-6 sm:p-8">
      <h1 className="text-xl font-medium tracking-tight text-foreground">{t.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>

      <Tabs defaultValue="site" className="mt-6">
        <TabsList>
          <TabsTrigger value="site">{t.tabs.site}</TabsTrigger>
          <TabsTrigger value="appearance">{t.tabs.appearance}</TabsTrigger>
          <TabsTrigger value="storage">{t.tabs.storage}</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <div className="space-y-6">
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
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{t.palette}</label>
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
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{t.theme}</label>
              <Toggle
                checked={themeMode === "dark"}
                onChange={(checked) => setThemeMode(checked ? "dark" : "light")}
                label={themeMode === "dark" ? t.dark : t.light}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="storage">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{t.storageProvider}</label>
              <Select
                value={storage.provider}
                onChange={(value) =>
                  setStorage((prev) => ({ ...prev, provider: value as StorageSettings["provider"] }))
                }
                options={[
                  { value: "local", label: t.storageLocal },
                  { value: "s3", label: t.storageS3 },
                ]}
                className="max-w-xs"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">{t.storageHint}</p>
            </div>

            {storage.provider === "s3" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    placeholder={t.s3Endpoint}
                    value={storage.s3.endpoint}
                    onChange={(e) => setS3("endpoint", e.target.value)}
                  />
                  <Input
                    placeholder={t.s3Region}
                    value={storage.s3.region}
                    onChange={(e) => setS3("region", e.target.value)}
                  />
                </div>
                <Input
                  placeholder={t.s3Bucket}
                  value={storage.s3.bucket}
                  onChange={(e) => setS3("bucket", e.target.value)}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    placeholder={t.s3AccessKeyId}
                    value={storage.s3.accessKeyId}
                    onChange={(e) => setS3("accessKeyId", e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder={t.s3SecretAccessKey}
                    value={storage.s3.secretAccessKey}
                    onChange={(e) => setS3("secretAccessKey", e.target.value)}
                  />
                </div>
                <Input
                  placeholder={t.s3PublicUrlBase}
                  value={storage.s3.publicUrlBase}
                  onChange={(e) => setS3("publicUrlBase", e.target.value)}
                />
                <Toggle
                  checked={storage.s3.forcePathStyle}
                  onChange={(checked) => setS3("forcePathStyle", checked)}
                  label={t.s3ForcePathStyle}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      <div className="mt-6">
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-full">
          {isSubmitting ? t.saving : t.finish}
        </Button>
      </div>
    </Card>
  );
}
