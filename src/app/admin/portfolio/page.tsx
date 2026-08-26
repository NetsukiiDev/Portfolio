import { getSettings } from "@/lib/data";
import { maskStorageSecrets } from "@/lib/storage/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export default async function AdminPortfolioPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminHeader title="Portfolio" />
      {/* Secrets are masked because this form PUTs the whole settings object
          back; the API restores the stored values when it sees the mask. */}
      <PortfolioForm settings={{ ...settings, storage: maskStorageSecrets(settings.storage) }} />
    </div>
  );
}
