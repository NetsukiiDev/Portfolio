import { getSkillsData } from "@/lib/data";
import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SkillsManager } from "@/components/admin/SkillsManager";

export default async function AdminSkillsPage() {
  const { categories, skills } = await getSkillsData();

  const authoringLocale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader title="Competenze" />
      <SkillsManager categories={categories} skills={skills} locale={authoringLocale} />
    </div>
  );
}
