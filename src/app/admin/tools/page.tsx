import { getTools, getSettings } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ToolsManager } from "@/components/admin/ToolsManager";

export default async function AdminToolsPage() {
  const [tools, settings] = await Promise.all([getTools(), getSettings()]);

  return (
    <div>
      <AdminHeader
        title="Strumenti e software"
        description="Loghi di strumenti, software e linguaggi, per la fascia in home."
      />
      <ToolsManager tools={tools} settings={settings.tools} />
    </div>
  );
}
