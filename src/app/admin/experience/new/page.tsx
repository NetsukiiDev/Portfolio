import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default async function NewExperiencePage() {
  const authoringLocale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader title="Nuova voce" />
      <ExperienceForm locale={authoringLocale} />
    </div>
  );
}
