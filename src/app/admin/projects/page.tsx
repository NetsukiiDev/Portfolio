import { Plus } from "lucide-react";
import { getProjects } from "@/lib/data";
import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  const locale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader
        title="Progetti"
        action={
          <ButtonLink href="/admin/projects/new" size="sm">
            <Plus className="h-4 w-4" /> Nuovo progetto
          </ButtonLink>
        }
      />
      <ProjectsTable projects={projects} locale={locale} />
    </div>
  );
}
