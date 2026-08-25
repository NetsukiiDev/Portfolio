import { prisma } from "./prisma";

export type SetupStep = "database" | "account" | "site" | "complete";

const SETTINGS_ID = "singleton";
const ADMIN_ACCOUNT_ID = "singleton";

export async function getSetupStatus(): Promise<SetupStep> {
  try {
    const account = await prisma.adminAccount.findUnique({
      where: { id: ADMIN_ACCOUNT_ID },
      select: { id: true },
    });
    if (!account) return "account";

    const settings = await prisma.settings.findUnique({
      where: { id: SETTINGS_ID },
      select: { setupCompletedAt: true },
    });
    if (!settings?.setupCompletedAt) return "site";

    return "complete";
  } catch {
    return "database";
  }
}
