import { getSettings } from "@/lib/data";
import { getAuthoringLocale } from "@/lib/authoring.server";
import { maskSettingsSecrets } from "@/lib/settings-secrets";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export default async function AdminPortfolioPage() {
  const settings = await getSettings();
  const authoringLocale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader title="Portfolio" />
      <PortfolioForm
        settings={maskSettingsSecrets(settings)}
        locale={authoringLocale}
      />
    </div>
  );
}
