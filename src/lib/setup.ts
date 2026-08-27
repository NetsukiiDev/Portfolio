import { prisma } from "./prisma";

export type SetupStep = "database" | "account" | "site" | "complete";

const SETTINGS_ID = "singleton";
const ADMIN_ACCOUNT_ID = "singleton";

/**
 * Whether the public site is closed for maintenance. Read from the proxy, so
 * a closed site never renders a page at all — dropping the markup in a layout
 * still ships the page's content in the streamed payload.
 */
export async function isMaintenanceOn(): Promise<boolean> {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: SETTINGS_ID },
      select: { maintenance: true },
    });
    return Boolean((settings?.maintenance as { enabled?: boolean } | null)?.enabled);
  } catch {
    return false;
  }
}

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
