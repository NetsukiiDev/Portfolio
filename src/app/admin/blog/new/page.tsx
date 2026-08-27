import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function NewBlogPostPage() {
  const authoringLocale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader title="Nuovo articolo" />
      <BlogForm locale={authoringLocale} />
    </div>
  );
}
