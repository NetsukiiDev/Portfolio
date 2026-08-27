import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AiGalleryForm } from "@/components/admin/AiGalleryForm";

export default async function NewAiGalleryImagePage() {
  const authoringLocale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader title="Add image" />
      <AiGalleryForm locale={authoringLocale} />
    </div>
  );
}
