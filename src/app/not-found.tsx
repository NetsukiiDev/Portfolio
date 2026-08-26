import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotFoundContent } from "@/components/errors/NotFoundContent";
import { getSettings } from "@/lib/data";
import { DEFAULT_MODULES, type ModulesSettings } from "@/lib/modules";

export const metadata: Metadata = {
  title: "404",
};

export default async function NotFound() {
  let modules: ModulesSettings = DEFAULT_MODULES;
  try {
    modules = (await getSettings()).modules;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }

  return (
    <>
      <Navbar modules={modules} />
      <main className="flex-1 pt-20">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
