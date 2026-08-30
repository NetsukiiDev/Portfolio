import { getProjects } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { RevealOnScroll } from "@/components/animations";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { FeaturedProjectsHeader } from "./FeaturedProjectsHeader";
import { getSectionText } from "@/lib/site.server";

export async function FeaturedProjects() {
  const projects = await getProjects();
  const featured = projects
    .filter((project) => project.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  return (
    <SectionWrapper>
      <Container>
        <RevealOnScroll>
          <FeaturedProjectsHeader
            heading={await getSectionText("featuredProjects")}
            viewAll={await getSectionText("viewAll")}
          />
        </RevealOnScroll>
        <div className="mt-12">
          <ProjectGrid projects={featured} />
        </div>
      </Container>
    </SectionWrapper>
  );
}
