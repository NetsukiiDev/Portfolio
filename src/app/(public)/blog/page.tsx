import { getBlogPosts } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getPageDescriptions } from "@/lib/site.server";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { assertModuleEnabled } from "@/lib/modules.server";

export default async function BlogPage() {
  await assertModuleEnabled("blog");
  const posts = await getBlogPosts();
  const published = posts
    .filter((post) => post.status === "published")
    .sort(
      (a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime(),
    );

  return (
    <Container className="pb-16">
      <PageHeader page="blog" descriptions={await getPageDescriptions("blog")} />
      <BlogGrid posts={published} />
    </Container>
  );
}
