import { notFound } from "next/navigation";
import { getProjects } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { ProjectDetailHeader } from "@/components/projects/ProjectDetailHeader";
import { ProjectContent } from "@/components/projects/ProjectContent";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <Container className="max-w-3xl pb-16">
      <ProjectDetailHeader project={project} />
      <ProjectContent project={project} />
    </Container>
  );
}
