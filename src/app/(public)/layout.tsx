import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSettings } from "@/lib/data";
import { DEFAULT_MODULES, type ModulesSettings } from "@/lib/modules";
import { DEFAULT_LANGUAGE } from "@/lib/default-settings";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  let modules: ModulesSettings = DEFAULT_MODULES;
  let allowSwitch = DEFAULT_LANGUAGE.allowSwitch;
  try {
    const settings = await getSettings();
    modules = settings.modules;
    allowSwitch = settings.language.allowSwitch;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }

  return (
    <>
      <Navbar modules={modules} allowSwitch={allowSwitch} />
      {/* No page-transition wrapper here on purpose. AnimatePresence with
          mode="wait" mounts the incoming page immediately, then mounts it a
          second time when the outgoing page's exit finishes and the keyed
          element swaps — replaying every entrance animation inside it. The
          per-component animations already cover the transition. */}
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </>
  );
}
