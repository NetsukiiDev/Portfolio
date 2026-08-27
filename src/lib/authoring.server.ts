import { getSettings } from "./data";
import { DEFAULT_LOCALE } from "./constants";
import type { Locale } from "@/types";

/**
 * The one language the admin writes in (Admin → Lingua). Admin forms show
 * only its fields; every other locale is generated on save.
 *
 * Kept out of the client bundle: it reads settings, which pulls in Prisma.
 */
export async function getAuthoringLocale(): Promise<Locale> {
  try {
    return (await getSettings()).language.defaultLocale;
  } catch {
    // Settings unreadable (pre-setup).
    return DEFAULT_LOCALE;
  }
}
