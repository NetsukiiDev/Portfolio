import { AdminHeader } from "@/components/admin/AdminHeader";
import { AccountForm } from "@/components/admin/AccountForm";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { getAdminAccount } from "@/lib/auth";

export default async function AdminAccountPage() {
  const account = await getAdminAccount();

  return (
    <div className="space-y-10">
      <div>
        <AdminHeader title="Account" description="Le credenziali con cui accedi al pannello." />
        <ProfileForm
          account={{ firstName: account.firstName, lastName: account.lastName, username: account.username }}
        />
      </div>
      <div>
        <h2 className="mb-4 text-lg font-medium text-foreground">Password</h2>
        <AccountForm />
      </div>
    </div>
  );
}
