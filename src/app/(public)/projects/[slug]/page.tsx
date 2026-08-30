import { notFound } from "next/navigation";
import { getProjects } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { ProjectDetailHeader } from "@/components/projects/ProjectDetailHeader";
import { ProjectContent } from "@/components/projects/ProjectContent";
import { ProjectAside } from "@/components/projects/ProjectAside";
import { ProjectGallery } from "@/components/projects/ProjectGallery";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <Container className="pb-24">
      <ProjectDetailHeader project={project} />

      {/* Writing on the left, facts on the right — rather than one centred
          column with the links buried above the text. */}
      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
        <div className="min-w-0">
          <ProjectContent project={project} />
          <ProjectGallery images={project.images.slice(1)} />
        </div>
        <ProjectAside project={project} />
      </div>
    </Container>
  );
}
