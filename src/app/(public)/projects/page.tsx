import { getProjects } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getPageDescriptions } from "@/lib/site.server";
import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";
import { assertModuleEnabled } from "@/lib/modules.server";

export default async function ProjectsPage() {
  await assertModuleEnabled("projects");
  const projects = await getProjects();
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <Container>
      <PageHeader page="projects" descriptions={await getPageDescriptions("projects")} />
      <ProjectsPageClient projects={sorted} />
    </Container>
  );
}
