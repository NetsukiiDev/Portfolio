import { notFound } from "next/navigation";
import { getAiGallery } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { GalleryDetailHeader } from "@/components/ai-gallery/GalleryDetailHeader";
import { GalleryModal } from "@/components/ai-gallery/GalleryModal";
import { ImageMetadata } from "@/components/ai-gallery/ImageMetadata";

export default async function AiGalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const images = await getAiGallery();
  const image = images.find((img) => img.id === id);

  if (!image) notFound();

  return (
    <Container className="max-w-4xl">
      <GalleryDetailHeader image={image} />
      <div className="grid grid-cols-1 gap-10 pb-16 md:grid-cols-2">
        <GalleryModal image={image} />
        <ImageMetadata image={image} />
      </div>
    </Container>
  );
}
