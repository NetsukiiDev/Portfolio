import { getSettings } from "@/lib/data";
import { getAuthoringLocale } from "@/lib/authoring.server";
import { maskSettingsSecrets } from "@/lib/settings-secrets";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const authoringLocale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader title="Impostazioni" />
      <SettingsForm
        settings={maskSettingsSecrets(settings)}
        locale={authoringLocale}
      />
    </div>
  );
}
