import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotFoundContent } from "@/components/errors/NotFoundContent";
import { getSiteChrome } from "@/lib/site.server";

export const metadata: Metadata = {
  title: "404",
};

export default async function NotFound() {
  const { modules, language, locale, siteName, avatar } = await getSiteChrome();

  return (
    <>
      <Navbar modules={modules} allowSwitch={language.allowSwitch} siteName={siteName} avatar={avatar} />
      <main className="flex-1 pt-20">
        <NotFoundContent />
      </main>
      <Footer siteName={siteName} locale={locale} />
    </>
  );
}
