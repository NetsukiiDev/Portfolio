"use client";

import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import type { Settings } from "@/types";

/** Details on the left, the form on the right — or just the details. */
export function ContactSection({ settings }: { settings: Settings }) {
  const withForm = settings.contactForm.enabled;

  return (
    <div className={withForm ? "grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.5fr]" : ""}>
      <ContactInfo settings={settings} />
      {withForm && <ContactForm />}
    </div>
  );
}
