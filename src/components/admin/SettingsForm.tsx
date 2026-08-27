"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ResetButton } from "@/components/admin/ResetButton";
import { ResetSiteButton } from "@/components/admin/ResetSiteButton";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { PALETTES, PALETTE_KEYS, type PaletteKey, type ThemeMode } from "@/lib/theme";
import { LOCALES } from "@/lib/constants";
import type { StorageProviderKey } from "@/lib/storage/types";
import type { Settings, Locale } from "@/types";

const LOCALE_LABELS: Record<Locale, string> = { en: "English", it: "Italiano" };
const LOCALE_OPTIONS = LOCALES.map((locale) => ({ value: locale, label: LOCALE_LABELS[locale] }));

const STORAGE_PROVIDER_OPTIONS: { value: StorageProviderKey; label: string }[] = [
  { value: "local", label: "Locale (disco del server)" },
  { value: "s3", label: "S3 o MinIO" },
];

const RESET_TARGETS: { type: string; label: string; description: string }[] = [
  { type: "projects", label: "Reimposta progetti", description: "Elimina tutti i progetti e le relative immagini caricate." },
  { type: "blog", label: "Reimposta blog", description: "Elimina tutti gli articoli del blog e le relative immagini caricate." },
  { type: "skills", label: "Reimposta competenze", description: "Elimina tutte le categorie e le competenze." },
  { type: "experience", label: "Reimposta esperienza", description: "Elimina tutte le voci di esperienza e i loghi caricati." },
  { type: "ai-gallery", label: "Reimposta galleria AI", description: "Elimina tutte le immagini della galleria AI." },
];

async function resetContentType(type: string) {
  const res = await fetch("/api/admin/reset/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });
  if (!res.ok) throw new Error("Reset failed");
}

interface SettingsFormValues {
  nameEn: string;
  titleEn: string;
  bioEn: string;
  longBioEn: string;
  locationEn: string;
  nameIt: string;
  titleIt: string;
  bioIt: string;
  longBioIt: string;
  locationIt: string;
  avatar: string;
  email: string;
  resumeUrl: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  dribbble: string;
  youtube: string;
  seoTitleEn: string;
  seoDescriptionEn: string;
  seoTitleIt: string;
  seoDescriptionIt: string;
  ogImage: string;
  domain: string;
  https: boolean;
  defaultLocale: Locale;
  themePalette: PaletteKey;
  themeMode: ThemeMode;
  maintenanceEnabled: boolean;
  maintenanceMessageEn: string;
  maintenanceMessageIt: string;
  storageProvider: StorageProviderKey;
  s3Endpoint: string;
  s3Region: string;
  s3Bucket: string;
  s3AccessKeyId: string;
  s3SecretAccessKey: string;
  s3ForcePathStyle: boolean;
  s3PublicUrlBase: string;
}

function toFormValues(settings: Settings): SettingsFormValues {
  return {
    nameEn: settings.personal.translations.en.name,
    titleEn: settings.personal.translations.en.title,
    bioEn: settings.personal.translations.en.bio,
    longBioEn: settings.personal.translations.en.longBio,
    locationEn: settings.personal.translations.en.location,
    nameIt: settings.personal.translations.it.name,
    titleIt: settings.personal.translations.it.title,
    bioIt: settings.personal.translations.it.bio,
    longBioIt: settings.personal.translations.it.longBio,
    locationIt: settings.personal.translations.it.location,
    avatar: settings.personal.avatar,
    email: settings.personal.email,
    resumeUrl: settings.personal.resumeUrl,
    github: settings.social.github ?? "",
    linkedin: settings.social.linkedin ?? "",
    twitter: settings.social.twitter ?? "",
    instagram: settings.social.instagram ?? "",
    dribbble: settings.social.dribbble ?? "",
    youtube: settings.social.youtube ?? "",
    seoTitleEn: settings.seo.translations.en.siteTitle,
    seoDescriptionEn: settings.seo.translations.en.siteDescription,
    seoTitleIt: settings.seo.translations.it.siteTitle,
    seoDescriptionIt: settings.seo.translations.it.siteDescription,
    ogImage: settings.seo.ogImage,
    domain: settings.site.domain,
    https: settings.site.https,
    defaultLocale: settings.site.defaultLocale,
    themePalette: settings.site.themePalette,
    themeMode: settings.site.themeMode,
    maintenanceEnabled: settings.maintenance.enabled,
    maintenanceMessageEn: settings.maintenance.translations.en.message,
    maintenanceMessageIt: settings.maintenance.translations.it.message,
    storageProvider: settings.storage.provider,
    s3Endpoint: settings.storage.s3.endpoint,
    s3Region: settings.storage.s3.region,
    s3Bucket: settings.storage.s3.bucket,
    s3AccessKeyId: settings.storage.s3.accessKeyId,
    s3SecretAccessKey: settings.storage.s3.secretAccessKey,
    s3ForcePathStyle: settings.storage.s3.forcePathStyle,
    s3PublicUrlBase: settings.storage.s3.publicUrlBase,
  };
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm<SettingsFormValues>({
    defaultValues: toFormValues(settings),
  });

  const avatar = watch("avatar");
  const ogImage = watch("ogImage");
  const storageProvider = watch("storageProvider");

  async function onSubmit(values: SettingsFormValues) {
    setIsSubmitting(true);

    // Only this page's slices — the API merges them into what's stored, so
    // Moduli and Portfolio keep whatever they last saved.
    const payload: Partial<Settings> = {
      site: {
        defaultLocale: values.defaultLocale,
        domain: values.domain,
        https: values.https,
        themePalette: values.themePalette,
        themeMode: values.themeMode,
      },
      personal: {
        translations: {
          en: {
            name: values.nameEn,
            title: values.titleEn,
            bio: values.bioEn,
            longBio: values.longBioEn,
            location: values.locationEn,
          },
          it: {
            name: values.nameIt,
            title: values.titleIt,
            bio: values.bioIt,
            longBio: values.longBioIt,
            location: values.locationIt,
          },
        },
        avatar: values.avatar,
        email: values.email,
        resumeUrl: values.resumeUrl,
      },
      social: {
        github: values.github || null,
        linkedin: values.linkedin || null,
        twitter: values.twitter || null,
        instagram: values.instagram || null,
        dribbble: values.dribbble || null,
        youtube: values.youtube || null,
      },
      seo: {
        translations: {
          en: { siteTitle: values.seoTitleEn, siteDescription: values.seoDescriptionEn },
          it: { siteTitle: values.seoTitleIt, siteDescription: values.seoDescriptionIt },
        },
        ogImage: values.ogImage,
        siteUrl: settings.seo.siteUrl,
      },
      maintenance: {
        enabled: values.maintenanceEnabled,
        translations: {
          en: { message: values.maintenanceMessageEn },
          it: { message: values.maintenanceMessageIt },
        },
      },
      storage: {
        provider: values.storageProvider,
        s3: {
          endpoint: values.s3Endpoint,
          region: values.s3Region,
          bucket: values.s3Bucket,
          accessKeyId: values.s3AccessKeyId,
          secretAccessKey: values.s3SecretAccessKey,
          forcePathStyle: values.s3ForcePathStyle,
          publicUrlBase: values.s3PublicUrlBase,
        },
      },
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Settings saved");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="site">Generale</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="reset">Reset</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="space-y-6">
            <ImageUploadField
              value={avatar}
              onChange={(url) => setValue("avatar", url)}
              folder="settings"
              label="Avatar"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input {...register("email")} placeholder="Email" />
              <Input {...register("resumeUrl")} placeholder="Resume URL" />
            </div>
            <Tabs defaultValue="en">
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="it">Italiano</TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <div className="space-y-4">
                  <Input {...register("nameEn")} placeholder="Name" />
                  <Input {...register("titleEn")} placeholder="Title" />
                  <Input {...register("locationEn")} placeholder="Location" />
                  <Textarea rows={2} {...register("bioEn")} placeholder="Short bio" />
                  <Textarea rows={4} {...register("longBioEn")} placeholder="Long bio" />
                </div>
              </TabsContent>
              <TabsContent value="it">
                <div className="space-y-4">
                  <Input {...register("nameIt")} placeholder="Nome" />
                  <Input {...register("titleIt")} placeholder="Titolo" />
                  <Input {...register("locationIt")} placeholder="Posizione" />
                  <Textarea rows={2} {...register("bioIt")} placeholder="Bio breve" />
                  <Textarea rows={4} {...register("longBioIt")} placeholder="Bio estesa" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input {...register("github")} placeholder="GitHub URL" />
            <Input {...register("linkedin")} placeholder="LinkedIn URL" />
            <Input {...register("twitter")} placeholder="Twitter/X URL" />
            <Input {...register("instagram")} placeholder="Instagram URL" />
            <Input {...register("dribbble")} placeholder="Dribbble URL" />
            <Input {...register("youtube")} placeholder="YouTube URL" />
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="space-y-6">
            <ImageUploadField
              value={ogImage}
              onChange={(url) => setValue("ogImage", url)}
              folder="settings"
              label="OG image"
            />
            <Tabs defaultValue="en">
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="it">Italiano</TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <div className="space-y-4">
                  <Input {...register("seoTitleEn")} placeholder="Site title" />
                  <Textarea rows={2} {...register("seoDescriptionEn")} placeholder="Site description" />
                </div>
              </TabsContent>
              <TabsContent value="it">
                <div className="space-y-4">
                  <Input {...register("seoTitleIt")} placeholder="Titolo del sito" />
                  <Textarea rows={2} {...register("seoDescriptionIt")} placeholder="Descrizione del sito" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="site">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Domain</label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input {...register("domain")} placeholder="example.com" />
                <Controller
                  control={control}
                  name="https"
                  render={({ field }) => (
                    <Toggle checked={field.value} onChange={field.onChange} label="Use HTTPS" />
                  )}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Primary language</label>
              <Controller
                control={control}
                name="defaultLocale"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value as Locale)}
                    options={LOCALE_OPTIONS}
                    className="max-w-xs"
                  />
                )}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Theme</label>
              <div className="flex flex-wrap items-center gap-4">
                <Controller
                  control={control}
                  name="themePalette"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      {PALETTE_KEYS.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => field.onChange(key)}
                          aria-label={PALETTES[key].label}
                          className={cn(
                            "h-8 w-8 rounded-full border-2 transition-transform",
                            field.value === key ? "scale-110 border-foreground" : "border-transparent",
                          )}
                          style={{ background: PALETTES[key].accent }}
                        />
                      ))}
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="themeMode"
                  render={({ field }) => (
                    <Toggle
                      checked={field.value === "dark"}
                      onChange={(checked) => field.onChange(checked ? "dark" : "light")}
                      label={field.value === "dark" ? "Dark mode" : "Light mode"}
                    />
                  )}
                />
              </div>
            </div>

            <Controller
              control={control}
              name="maintenanceEnabled"
              render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} label="Maintenance mode" />}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input {...register("maintenanceMessageEn")} placeholder="Maintenance message (English)" />
              <Input {...register("maintenanceMessageIt")} placeholder="Maintenance message (Italiano)" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="storage">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Provider</label>
              <Controller
                control={control}
                name="storageProvider"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value as StorageProviderKey)}
                    options={STORAGE_PROVIDER_OPTIONS}
                    className="max-w-xs"
                  />
                )}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Dove vengono salvate le immagini caricate (avatar, copertine, galleria AI).
              </p>
            </div>

            {storageProvider === "s3" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input {...register("s3Endpoint")} placeholder="Endpoint (vuoto = AWS S3, oppure URL MinIO)" />
                  <Input {...register("s3Region")} placeholder="Region" />
                </div>
                <Input {...register("s3Bucket")} placeholder="Bucket" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input {...register("s3AccessKeyId")} placeholder="Access key ID" />
                  <Input {...register("s3SecretAccessKey")} type="password" placeholder="Secret access key" />
                </div>
                <Input {...register("s3PublicUrlBase")} placeholder="URL pubblico personalizzato (opzionale)" />
                <Controller
                  control={control}
                  name="s3ForcePathStyle"
                  render={({ field }) => (
                    <Toggle
                      checked={field.value}
                      onChange={field.onChange}
                      label="Path-style URLs (richiesto per MinIO)"
                    />
                  )}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reset">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-foreground">Reimposta contenuti</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Elimina in modo permanente un tipo di contenuto e le immagini caricate collegate.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {RESET_TARGETS.map((target) => (
                  <ResetButton
                    key={target.type}
                    label={target.label}
                    description={target.description}
                    onConfirm={async () => {
                      try {
                        await resetContentType(target.type);
                        toast.success(`${target.label} completato`);
                      } catch {
                        toast.error("Qualcosa è andato storto");
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.04] p-6">
              <h3 className="text-sm font-medium text-red-400">Zona pericolosa</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Elimina l&apos;intero database — tutti i contenuti, l&apos;account amministratore e le
                impostazioni — e riporta il sito alla configurazione iniziale.
              </p>
              <div className="mt-4">
                <ResetSiteButton />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end border-t border-border pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
