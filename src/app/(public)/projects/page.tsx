import { getProjects } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <Container>
      <PageHeader page="projects" />
      <ProjectsPageClient projects={sorted} />
    </Container>
  );
}
