import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContactMessage, getSettings } from "@/lib/data";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  // Hiding the form in the UI isn't the same as closing the endpoint: with
  // the module or the form switched off, submissions stop being accepted.
  const settings = await getSettings().catch(() => null);
  if (settings && !(settings.modules.contact.enabled && settings.contactForm.enabled)) {
    return NextResponse.json({ error: "Il modulo di contatto non è attivo." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Controlla i campi e riprova." },
      { status: 400 },
    );
  }

  await createContactMessage({
    id: crypto.randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
