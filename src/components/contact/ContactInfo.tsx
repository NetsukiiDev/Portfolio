"use client";

import { Mail, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Settings } from "@/types";

export function ContactInfo({ settings }: { settings: Settings }) {
  const { locale } = useTranslation();
  const t = settings.personal.translations[locale];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Mail className="h-4 w-4 text-accent" />
        <a href={`mailto:${settings.personal.email}`} className="hover:text-foreground">
          {settings.personal.email}
        </a>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 text-accent" />
        {t.location}
      </div>
    </div>
  );
}
