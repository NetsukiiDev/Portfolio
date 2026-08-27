import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const authoringLocale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader title="Nuovo progetto" />
      <ProjectForm locale={authoringLocale} />
    </div>
  );
}
