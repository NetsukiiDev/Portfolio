import { Plus } from "lucide-react";
import { getExperience } from "@/lib/data";
import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExperienceTable } from "@/components/admin/ExperienceTable";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminExperiencePage() {
  const experience = await getExperience();
  const locale = await getAuthoringLocale();
  const sorted = [...experience].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div>
      <AdminHeader
        title="Esperienza"
        action={
          <ButtonLink href="/admin/experience/new" size="sm">
            <Plus className="h-4 w-4" /> Nuova voce
          </ButtonLink>
        }
      />
      <ExperienceTable items={sorted} locale={locale} />
    </div>
  );
}
