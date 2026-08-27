import { notFound } from "next/navigation";
import { getProjects } from "@/lib/data";
import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  const authoringLocale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader title="Modifica progetto" />
      <ProjectForm project={project} locale={authoringLocale} />
    </div>
  );
}
