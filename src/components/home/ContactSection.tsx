"use client";

import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import type { Settings } from "@/types";

/**
 * The details on one line, and the form in a panel under them — a single
 * centred column rather than two.
 */
export function ContactSection({ settings }: { settings: Settings }) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <ContactInfo settings={settings} />

      {settings.contactForm.enabled && (
        <Card className="mt-10 p-6 sm:p-8">
          <ContactForm />
        </Card>
      )}
    </div>
  );
}
