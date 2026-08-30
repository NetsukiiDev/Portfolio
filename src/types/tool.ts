/**
 * A tool, piece of software or programming language shown on the home page.
 *
 * Deliberately untranslated: these are product names — Docker, TypeScript,
 * Figma — and they read the same in every language, so putting them through
 * the translation pipeline would only invite a machine to mangle them.
 */
export interface Tool {
  id: string;
  name: string;
  /** Logo, uploaded through the usual storage provider. */
  image: string;
  /** Optional link to the tool's own site. */
  url: string | null;
  order: number;
  /** Unticked entries stay in the admin but drop off the site. */
  visible: boolean;
}
