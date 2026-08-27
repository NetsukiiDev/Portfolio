import { getExperience } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getPageDescriptions } from "@/lib/site.server";
import { Timeline } from "@/components/experience/Timeline";
import { assertModuleEnabled } from "@/lib/modules.server";

export default async function ExperiencePage() {
  await assertModuleEnabled("experience");
  const experience = await getExperience();

  return (
    <Container>
      <PageHeader page="experience" descriptions={await getPageDescriptions("experience")} />
      <Timeline items={experience} />
    </Container>
  );
}
