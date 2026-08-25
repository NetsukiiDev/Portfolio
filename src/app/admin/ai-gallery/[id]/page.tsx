import { notFound } from "next/navigation";
import { getAiGallery } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AiGalleryForm } from "@/components/admin/AiGalleryForm";

export default async function EditAiGalleryImagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const images = await getAiGallery();
  const image = images.find((img) => img.id === id);

  if (!image) notFound();

  return (
    <div>
      <AdminHeader title="Edit image" />
      <AiGalleryForm image={image} />
    </div>
  );
}
