import { getSkillsData } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { SkillGrid } from "@/components/skills/SkillGrid";

export default async function SkillsPage() {
  const { categories, skills } = await getSkillsData();

  return (
    <Container className="pb-16">
      <PageHeader page="skills" />
      <SkillGrid categories={categories} skills={skills} />
    </Container>
  );
}
