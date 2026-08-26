import { getSettings } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { assertModuleEnabled } from "@/lib/modules.server";

export default async function ContactPage() {
  await assertModuleEnabled("contact");
  const settings = await getSettings();

  return (
    <Container className="max-w-3xl">
      <PageHeader page="contact" />
      <div className="grid grid-cols-1 gap-10 pb-16 md:grid-cols-[1fr_1.5fr]">
        <ContactInfo settings={settings} />
        <ContactForm />
      </div>
    </Container>
  );
}
