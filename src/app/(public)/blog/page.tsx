import { getBlogPosts } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BlogGrid } from "@/components/blog/BlogGrid";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const published = posts
    .filter((post) => post.status === "published")
    .sort(
      (a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime(),
    );

  return (
    <Container className="pb-16">
      <PageHeader page="blog" />
      <BlogGrid posts={published} />
    </Container>
  );
}
