import { notFound } from "next/navigation";
import { getExperience } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await getExperience();
  const entry = experience.find((e) => e.id === id);

  if (!entry) notFound();

  return (
    <div>
      <AdminHeader title="Edit entry" />
      <ExperienceForm experience={entry} />
    </div>
  );
}
