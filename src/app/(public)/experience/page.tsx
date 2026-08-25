import { getExperience } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Timeline } from "@/components/experience/Timeline";

export default async function ExperiencePage() {
  const experience = await getExperience();

  return (
    <Container>
      <PageHeader page="experience" />
      <Timeline items={experience} />
    </Container>
  );
}
