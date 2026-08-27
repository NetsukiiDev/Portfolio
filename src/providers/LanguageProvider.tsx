"use client";

import { useCallback, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import type { Locale } from "@/types";

const STORAGE_KEY = "locale";
const listeners = new Set<() => void>();

// localStorage is invisible to the server, so without this the first render
// always used the site's default language and then swapped to the visitor's
// once localStorage was read on the client — a full re-render that replayed
// every entrance animation and left <html lang> stale. Mirroring the choice
// into a cookie lets the root layout render the right language up front.
function writeLocaleCookie(locale: Locale) {
  document.cookie = `${STORAGE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`;
}

function makeSnapshotGetters(fallback: Locale, allowSwitch: boolean) {
  return {
    getSnapshot(): Locale {
      // With switching disabled the server ignores any stored preference, so
      // the client must too — otherwise it swaps language after hydration.
      if (!allowSwitch) return fallback;
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
  allowSwitch = true,
}: {
  children: ReactNode;
  defaultLocale?: Locale;
  allowSwitch?: boolean;
}) {
  const { getSnapshot, getServerSnapshot } = makeSnapshotGetters(defaultLocale, allowSwitch);
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keeps the cookie in step with the active locale, including the first
  // visit after this was introduced (localStorage already set, cookie not
  // yet) — so the next server render already knows the right language.
  useEffect(() => {
    writeLocaleCookie(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    writeLocaleCookie(next);
    listeners.forEach((listener) => listener());
  }, []);

  return <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>;
}
