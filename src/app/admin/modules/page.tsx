import { getSettings } from "@/lib/data";
import { maskSettingsSecrets } from "@/lib/settings-secrets";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ModulesForm } from "@/components/admin/ModulesForm";

export default async function AdminModulesPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminHeader title="Moduli" />
      <ModulesForm settings={maskSettingsSecrets(settings)} />
    </div>
  );
}
