import { cookies, headers } from "next/headers";
import { LOCALES } from "./constants";
import { verifyToken } from "./auth";
import type { Locale } from "@/types";
import type { LanguageSettings } from "@/types/settings";

/**
 * Picks the language to render in, in order of authority:
 *   1. what the visitor chose (cookie), if switching is even allowed;
 *   2. what their browser asks for, if auto-detect is on;
 *   3. the language the admin writes in.
 *
 * LanguageProvider mirrors the visitor's choice into that cookie so the first
 * render already matches what the client settles on — otherwise the page
 * swaps language after hydration and replays every entrance animation.
 */
export async function resolveLocale(language: LanguageSettings): Promise<Locale> {
  if (language.allowSwitch) {
    const chosen = (await cookies()).get("locale")?.value;
    if ((LOCALES as string[]).includes(chosen ?? "")) return chosen as Locale;
  }

  if (language.autoDetect) {
    // Accept-Language is what the browser actually asks for, which beats
    // guessing from an IP: someone in Italy may well want English.
    const header = (await headers()).get("accept-language") ?? "";
    for (const part of header.split(",")) {
      const tag = part.split(";")[0]?.trim().toLowerCase().split("-")[0];
      if (tag && (LOCALES as string[]).includes(tag)) return tag as Locale;
    }
  }

  return language.defaultLocale;
}

/** Whether this request carries a valid admin session, from a server component. */
export async function hasAdminSession(): Promise<boolean> {
  const token = (await cookies()).get("admin-session")?.value;
  return token ? verifyToken(token) : false;
}
