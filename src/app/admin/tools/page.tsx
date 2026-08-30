import { getTools, getSettings } from "@/lib/data";
import { TOOL_CATALOGUE } from "@/lib/tools/catalogue";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ToolsManager } from "@/components/admin/ToolsManager";

export default async function AdminToolsPage() {
  const [tools, settings] = await Promise.all([getTools(), getSettings()]);

  return (
    <div>
      <AdminHeader
        title="Strumenti e software"
        description="Spunta quelli che usi: i loghi sono già pronti."
      />
      <ToolsManager tools={tools} catalogue={TOOL_CATALOGUE} settings={settings.tools} />
    </div>
  );
}
