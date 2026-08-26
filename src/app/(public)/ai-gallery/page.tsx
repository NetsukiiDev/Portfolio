import { getAiGallery } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { GalleryGrid } from "@/components/ai-gallery/GalleryGrid";
import { assertModuleEnabled } from "@/lib/modules.server";

export default async function AiGalleryPage() {
  await assertModuleEnabled("aiGallery");
  const images = await getAiGallery();
  const sorted = [...images].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Container>
      <PageHeader page="aiGallery" />
      <GalleryGrid images={sorted} />
    </Container>
  );
}
