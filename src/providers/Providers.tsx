"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "./LanguageProvider";
import { CursorProvider } from "./CursorProvider";
import { ToastProvider } from "@/context/ToastContext";
import type { Locale } from "@/types";

export function Providers({
  children,
  defaultLocale,
  allowSwitch,
}: {
  children: ReactNode;
  defaultLocale?: Locale;
  allowSwitch?: boolean;
}) {
  return (
    <LanguageProvider defaultLocale={defaultLocale} allowSwitch={allowSwitch}>
      <ToastProvider>
        <CursorProvider>{children}</CursorProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
