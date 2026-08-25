import { AdminHeader } from "@/components/admin/AdminHeader";
import { AiGalleryForm } from "@/components/admin/AiGalleryForm";

export default function NewAiGalleryImagePage() {
  return (
    <div>
      <AdminHeader title="Add image" />
      <AiGalleryForm />
    </div>
  );
}
