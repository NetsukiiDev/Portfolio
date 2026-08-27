import { notFound } from "next/navigation";
import { getBlogPosts } from "@/lib/data";
import { getAuthoringLocale } from "@/lib/authoring.server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  const authoringLocale = await getAuthoringLocale();

  return (
    <div>
      <AdminHeader title="Modifica articolo" />
      <BlogForm post={post} locale={authoringLocale} />
    </div>
  );
}
