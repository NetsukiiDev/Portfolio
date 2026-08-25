import { getSkillsData } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SkillsManager } from "@/components/admin/SkillsManager";

export default async function AdminSkillsPage() {
  const { categories, skills } = await getSkillsData();

  return (
    <div>
      <AdminHeader title="Skills" />
      <SkillsManager categories={categories} skills={skills} />
    </div>
  );
}
