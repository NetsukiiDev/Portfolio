import { Plus } from "lucide-react";
import { getProjects } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <AdminHeader
        title="Projects"
        action={
          <ButtonLink href="/admin/projects/new" size="sm">
            <Plus className="h-4 w-4" /> New project
          </ButtonLink>
        }
      />
      <ProjectsTable projects={projects} />
    </div>
  );
}
