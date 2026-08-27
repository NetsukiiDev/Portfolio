import type { Locale } from "@/types";

// Free and keyless by default: MyMemory needs no account, which keeps the
// feature working on a fresh clone. It's a draft-quality translation — the
// point is that the admin writes once and then refines the result under
// Admin → Lingua, not that the machine gets it perfect.
//
// Set DEEPL_API_KEY (DeepL's free tier is 500k characters a month) to use
// DeepL instead; nothing else changes.
const MYMEMORY_MAX_CHARS = 500;

const cache = new Map<string, string>();

async function viaDeepL(text: string, from: Locale, to: Locale, key: string): Promise<string | null> {
  const host = key.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
  const res = await fetch(`https://${host}/v2/translate`, {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ text: [text], source_lang: from.toUpperCase(), target_lang: to.toUpperCase() }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { translations?: { text: string }[] };
  return data.translations?.[0]?.text ?? null;
}

async function viaMyMemory(text: string, from: Locale, to: Locale): Promise<string | null> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;
  const data = (await res.json()) as { responseStatus?: number; responseData?: { translatedText?: string } };
  if (data.responseStatus !== 200) return null;
  const out = data.responseData?.translatedText;
  // MyMemory reports quota problems in the payload rather than the status.
  return out && !/^(MYMEMORY WARNING|QUERY LENGTH LIMIT)/i.test(out) ? out : null;
}

/** Returns null when the text can't be translated, so callers can keep the original. */
export async function translateText(text: string, from: Locale, to: Locale): Promise<string | null> {
  const trimmed = text.trim();
  if (!trimmed || from === to) return null;

  const cacheKey = `${from}|${to}|${trimmed}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const key = process.env.DEEPL_API_KEY;
    const translated = key
      ? await viaDeepL(trimmed, from, to, key)
      : trimmed.length <= MYMEMORY_MAX_CHARS
        ? await viaMyMemory(trimmed, from, to)
        : null;

    if (!translated) return null;
    cache.set(cacheKey, translated);
    return translated;
  } catch (error) {
    // Never let a translation outage block saving content.
    console.warn("[translate] failed:", from, "->", to, error);
    return null;
  }
}

type Fields = Record<string, string>;

/**
 * Fills every non-source locale of a `translations` object from the source
 * one. Every admin-authored model stores its text this way, so one helper
 * covers settings, the home page and all content types.
 *
 * Existing target text is only replaced when `overwrite` is set, so a
 * translation the admin has corrected by hand survives later saves.
 */
export async function fillTranslations<T extends Record<string, Fields>>(
  translations: T,
  source: Locale,
  targets: Locale[],
  { overwrite = false }: { overwrite?: boolean } = {},
): Promise<T> {
  const from = translations[source] as Fields | undefined;
  if (!from) return translations;

  const filled = { ...translations } as Record<string, Fields>;

  for (const target of targets) {
    if (target === source) continue;
    const existing = (filled[target] ?? {}) as Fields;
    const next: Fields = { ...existing };

    for (const [field, value] of Object.entries(from)) {
      if (typeof value !== "string") continue;
      if (!overwrite && existing[field]?.trim()) continue;
      next[field] = (await translateText(value, source, target)) ?? value;
    }

    filled[target] = next;
  }

  return filled as T;
}
