import { getSettings } from "@/lib/data";
import { maskStorageSecrets } from "@/lib/storage/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminHeader title="Settings" />
      <SettingsForm settings={{ ...settings, storage: maskStorageSecrets(settings.storage) }} />
    </div>
  );
}
