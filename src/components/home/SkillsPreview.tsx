import { getSkillsData } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { RevealOnScroll } from "@/components/animations";
import { SkillsPreviewList } from "./SkillsPreviewList";
import { SkillsPreviewHeader } from "./SkillsPreviewHeader";
import { getSectionText } from "@/lib/site.server";

export async function SkillsPreview() {
  const { skills } = await getSkillsData();
  const top = [...skills].sort((a, b) => b.proficiency - a.proficiency).slice(0, 10);

  return (
    <SectionWrapper className="border-t border-border">
      <Container>
        <RevealOnScroll className="text-center">
          <SkillsPreviewHeader heading={await getSectionText("skills")} />
        </RevealOnScroll>
        <div className="mt-8">
          <SkillsPreviewList skills={top} />
        </div>
      </Container>
    </SectionWrapper>
  );
}
