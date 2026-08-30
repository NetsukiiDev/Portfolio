/**
 * A tool, piece of software or programming language shown on the home page.
 *
 * Normally just a pick from the built-in catalogue — `slug` points at a
 * Simple Icons entry and the name and logo come from there. `name`/`image`
 * are the escape hatch for the brands the icon set can't ship (Java, AWS,
 * VS Code and friends were all removed at their owners' request).
 *
 * Deliberately untranslated either way: these are product names, and they
 * read the same in every language.
 */
export interface Tool {
  id: string;
  /** Catalogue slug, or null for a custom entry. */
  slug: string | null;
  /** Custom entries only. */
  name: string | null;
  /** Custom entries only — an uploaded logo. */
  image: string | null;
  /** Optional link to the tool's own site. */
  url: string | null;
  order: number;
}
