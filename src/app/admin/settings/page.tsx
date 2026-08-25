import { getSettings } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminHeader title="Settings" />
      <SettingsForm settings={settings} />
    </div>
  );
}
