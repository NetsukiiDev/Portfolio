import { getSettings } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LanguageForm } from "@/components/admin/LanguageForm";

export default async function AdminLanguagePage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminHeader title="Lingua" />
      <LanguageForm settings={settings} />
    </div>
  );
}
