"use client";

import { Mail, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Settings } from "@/types";

/** Email and whereabouts, on one line above the form. */
export function ContactInfo({ settings }: { settings: Settings }) {
  const { locale } = useTranslation();
  const t = settings.personal.translations[locale];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <Mail className="h-4 w-4 text-accent" />
        <a href={`mailto:${settings.personal.email}`} className="hover:text-foreground">
          {settings.personal.email}
        </a>
      </div>
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 text-accent" />
        {t.location}
      </div>
    </div>
  );
}
