import { redirect } from "next/navigation";
import { MaintenanceScreen } from "@/components/layout/MaintenanceScreen";
import { getSiteChrome } from "@/lib/site.server";

export const metadata = {
  title: "Manutenzione",
};

/**
 * Served in place of every public page while maintenance is on. The proxy
 * rewrites to it, so the real page never renders and its content never
 * reaches the response.
 */
export default async function MaintenancePage() {
  const { settings, locale, siteName } = await getSiteChrome();

  // Reachable directly, so it shouldn't linger once the site is open again.
  if (!settings?.maintenance.enabled) redirect("/");

  return (
    <MaintenanceScreen
      siteName={siteName}
      message={settings.maintenance.translations[locale]?.message ?? ""}
    />
  );
}
