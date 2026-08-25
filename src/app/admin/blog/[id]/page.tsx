import { notFound } from "next/navigation";
import { getBlogPosts } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <div>
      <AdminHeader title="Edit post" />
      <BlogForm post={post} />
    </div>
  );
}
