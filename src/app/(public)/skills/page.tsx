import { getSkillsData } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { SkillGrid } from "@/components/skills/SkillGrid";
import { assertModuleEnabled } from "@/lib/modules.server";

export default async function SkillsPage() {
  await assertModuleEnabled("skills");
  const { categories, skills } = await getSkillsData();

  return (
    <Container className="pb-16">
      <PageHeader page="skills" />
      <SkillGrid categories={categories} skills={skills} />
    </Container>
  );
}
