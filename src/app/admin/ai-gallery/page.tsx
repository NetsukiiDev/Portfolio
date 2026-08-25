import { Plus } from "lucide-react";
import { getAiGallery } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AiGalleryTable } from "@/components/admin/AiGalleryTable";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminAiGalleryPage() {
  const images = await getAiGallery();
  const sorted = [...images].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <AdminHeader
        title="AI Gallery"
        action={
          <ButtonLink href="/admin/ai-gallery/new" size="sm">
            <Plus className="h-4 w-4" /> Add image
          </ButtonLink>
        }
      />
      <AiGalleryTable images={sorted} />
    </div>
  );
}
