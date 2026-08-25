"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "./LanguageProvider";
import { CursorProvider } from "./CursorProvider";
import { ToastProvider } from "@/context/ToastContext";
import type { Locale } from "@/types";

export function Providers({ children, defaultLocale }: { children: ReactNode; defaultLocale?: Locale }) {
  return (
    <LanguageProvider defaultLocale={defaultLocale}>
      <ToastProvider>
        <CursorProvider>{children}</CursorProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
