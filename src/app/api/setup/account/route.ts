import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getSetupStatus } from "@/lib/setup";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_.-]+$/, "Only letters, numbers, and _ . - are allowed"),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const status = await getSetupStatus();
  // Allowed while setup is still in progress — the "Back" button lets the account
  // step be revisited (and resubmitted) even after the site step has been reached.
  if (status !== "account" && status !== "site") {
    return NextResponse.json({ error: "Account step is not available right now" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
  }

  const { firstName, lastName, username, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminAccount.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", firstName, lastName, username, passwordHash },
    update: { firstName, lastName, username, passwordHash },
  });

  return NextResponse.json({ ok: true });
}
