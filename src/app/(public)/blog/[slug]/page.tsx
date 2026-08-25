import { notFound } from "next/navigation";
import { getBlogPosts } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogContent } from "@/components/blog/BlogContent";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug && p.status === "published");

  if (!post) notFound();

  return (
    <Container className="max-w-3xl pb-16">
      <BlogPostHeader post={post} />
      <BlogContent post={post} />
    </Container>
  );
}
