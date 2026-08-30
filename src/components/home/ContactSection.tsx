"use client";

import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/contact/ContactForm";
import type { Settings } from "@/types";

/** The form, in a panel of its own beside the heading. */
export function ContactSection({ settings }: { settings: Settings }) {
  if (!settings.contactForm.enabled) return null;

  return (
    <Card className="p-6 sm:p-8">
      <ContactForm />
    </Card>
  );
}
