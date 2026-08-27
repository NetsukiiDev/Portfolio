import { Plus } from "lucide-react";
import { getExperience } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExperienceTable } from "@/components/admin/ExperienceTable";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminExperiencePage() {
  const experience = await getExperience();
  const sorted = [...experience].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div>
      <AdminHeader
        title="Esperienza"
        action={
          <ButtonLink href="/admin/experience/new" size="sm">
            <Plus className="h-4 w-4" /> New entry
          </ButtonLink>
        }
      />
      <ExperienceTable items={sorted} />
    </div>
  );
}
