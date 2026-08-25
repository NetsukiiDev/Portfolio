"use client";

import { useCallback, useSyncExternalStore, type ReactNode } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import type { Locale } from "@/types";

const STORAGE_KEY = "locale";
const listeners = new Set<() => void>();

function makeSnapshotGetters(fallback: Locale) {
  return {
    getSnapshot(): Locale {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && (LOCALES as string[]).includes(stored)) {
        return stored as Locale;
      }
      return fallback;
    },
    getServerSnapshot(): Locale {
      return fallback;
    },
  };
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function LanguageProvider({
  children,
  defaultLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const { getSnapshot, getServerSnapshot } = makeSnapshotGetters(defaultLocale);
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach((listener) => listener());
  }, []);

  return <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>;
}
