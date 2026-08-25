import { getSettings } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutContent } from "@/components/about/AboutContent";

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <Container>
      <AboutHero settings={settings} />
      <AboutContent settings={settings} />
    </Container>
  );
}
