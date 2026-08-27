import { Plus } from "lucide-react";
import { getAiGallery } from "@/lib/data";
import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AiGalleryTable } from "@/components/admin/AiGalleryTable";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminAiGalleryPage() {
  const images = await getAiGallery();
  const locale = await getAuthoringLocale();
  const sorted = [...images].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <AdminHeader
        title="Galleria AI"
        action={
          <ButtonLink href="/admin/ai-gallery/new" size="sm">
            <Plus className="h-4 w-4" /> Aggiungi immagine
          </ButtonLink>
        }
      />
      <AiGalleryTable images={sorted} locale={locale} />
    </div>
  );
}
