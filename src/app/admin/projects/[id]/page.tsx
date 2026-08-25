import { notFound } from "next/navigation";
import { getProjects } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  return (
    <div>
      <AdminHeader title="Edit project" />
      <ProjectForm project={project} />
    </div>
  );
}
