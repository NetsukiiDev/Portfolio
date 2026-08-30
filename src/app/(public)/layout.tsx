import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSiteChrome } from "@/lib/site.server";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { modules, language, locale, siteName, avatar, presentSections } = await getSiteChrome();

  return (
    <>
      <Navbar modules={modules} allowSwitch={language.allowSwitch} siteName={siteName} avatar={avatar} presentSections={presentSections} />
      {/* No page-transition wrapper here on purpose. AnimatePresence with
          mode="wait" mounts the incoming page immediately, then mounts it a
          second time when the outgoing page's exit finishes and the keyed
          element swaps — replaying every entrance animation inside it. The
          per-component animations already cover the transition. */}
      <main className="flex-1 pt-20">{children}</main>
      <Footer siteName={siteName} locale={locale} />
    </>
  );
}
