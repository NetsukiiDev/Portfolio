import { getSettings } from "@/lib/data";
import { getAuthoringLocale } from "@/lib/authoring.server";
import { maskStorageSecrets } from "@/lib/storage/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export default async function AdminPortfolioPage() {
  const settings = await getSettings();
  const authoringLocale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader title="Portfolio" />
      <PortfolioForm
        settings={{ ...settings, storage: maskStorageSecrets(settings.storage) }}
        locale={authoringLocale}
      />
    </div>
  );
}
