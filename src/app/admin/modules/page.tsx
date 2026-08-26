import { getSettings } from "@/lib/data";
import { maskStorageSecrets } from "@/lib/storage/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ModulesForm } from "@/components/admin/ModulesForm";

export default async function AdminModulesPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminHeader title="Moduli" />
      {/* Secrets are masked because this form PUTs the whole settings object
          back; the API restores the stored values when it sees the mask. */}
      <ModulesForm settings={{ ...settings, storage: maskStorageSecrets(settings.storage) }} />
    </div>
  );
}
