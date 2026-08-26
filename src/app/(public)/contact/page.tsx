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
      {/* With the form switched off (Moduli → Contatti) the page keeps the
          contact details and just drops the form, so it stops spanning two
          columns. */}
      <div
        className={
          settings.contactForm.enabled
            ? "grid grid-cols-1 gap-10 pb-16 md:grid-cols-[1fr_1.5fr]"
            : "pb-16"
        }
      >
        <ContactInfo settings={settings} />
        {settings.contactForm.enabled && <ContactForm />}
      </div>
    </Container>
  );
}
