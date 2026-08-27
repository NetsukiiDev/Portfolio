import { getSettings } from "@/lib/data";
import { maskStorageSecrets } from "@/lib/storage/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ModulesForm } from "@/components/admin/ModulesForm";

export default async function AdminModulesPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminHeader title="Moduli" />
      <ModulesForm settings={{ ...settings, storage: maskStorageSecrets(settings.storage) }} />
    </div>
  );
}
