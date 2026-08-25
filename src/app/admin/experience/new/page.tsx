import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div>
      <AdminHeader title="New entry" />
      <ExperienceForm />
    </div>
  );
}
