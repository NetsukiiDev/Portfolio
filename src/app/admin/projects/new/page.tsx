import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <AdminHeader title="New project" />
      <ProjectForm />
    </div>
  );
}
