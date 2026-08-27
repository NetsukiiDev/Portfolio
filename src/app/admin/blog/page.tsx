import { Plus } from "lucide-react";
import { getBlogPosts } from "@/lib/data";
import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogTable } from "@/components/admin/BlogTable";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  const locale = await getAuthoringLocale();
  const sorted = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <AdminHeader
        title="Blog"
        action={
          <ButtonLink href="/admin/blog/new" size="sm">
            <Plus className="h-4 w-4" /> Nuovo articolo
          </ButtonLink>
        }
      />
      <BlogTable posts={sorted} locale={locale} />
    </div>
  );
}
