import { getBlogPosts } from "@/lib/data";
import { Container } from "@/components/layout/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { RevealOnScroll } from "@/components/animations";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { RecentBlogHeader } from "./RecentBlogHeader";
import { getSectionText } from "@/lib/site.server";

export async function RecentBlog() {
  const posts = await getBlogPosts();
  const recent = posts
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime())
    .slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <SectionWrapper className="border-t border-border">
      <Container>
        <RevealOnScroll>
          <RecentBlogHeader
            heading={await getSectionText("recentPosts")}
            viewAll={await getSectionText("viewAll")}
          />
        </RevealOnScroll>
        <div className="mt-12">
          <BlogGrid posts={recent} />
        </div>
      </Container>
    </SectionWrapper>
  );
}
