"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export function useTranslation() {
  const { locale, setLocale } = useLanguage();
  return { t: translations[locale], locale, setLocale };
}
