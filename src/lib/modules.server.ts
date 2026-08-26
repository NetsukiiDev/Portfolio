import { notFound } from "next/navigation";
import { getSettings } from "./data";
import type { ModuleKey } from "./modules";

// Kept out of modules.ts because that file is imported by client components
// (the navbar filters its links with it) — pulling getSettings in there drags
// Prisma, and therefore node built-ins, into the browser bundle.

/**
 * Guard for a module's public route. Call from the page: a disabled module
 * should be indistinguishable from a page that doesn't exist, rather than
 * merely unlinked from the navbar.
 */
export async function assertModuleEnabled(key: ModuleKey): Promise<void> {
  let enabled = true;
  try {
    enabled = (await getSettings()).modules[key].enabled;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — stay open.
  }
  if (!enabled) notFound();
}
