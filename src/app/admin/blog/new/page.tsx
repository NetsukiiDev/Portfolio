import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <AdminHeader title="New post" />
      <BlogForm />
    </div>
  );
}
