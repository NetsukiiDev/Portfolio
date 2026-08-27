import { getContactMessages } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MessagesTable } from "@/components/admin/MessagesTable";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div>
      <AdminHeader title="Messaggi" description="Quello che arriva dal modulo di contatto del sito." />
      <MessagesTable messages={messages} />
    </div>
  );
}
