import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, updateBlogPostBySlug, deleteBlogPostBySlug } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { BlogPost } from "@/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { slug } = await params;
  const body = (await request.json()) as Partial<BlogPost>;
  const updated = await updateBlogPostBySlug(slug, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { slug } = await params;
  await deleteBlogPostBySlug(slug);

  return NextResponse.json({ success: true });
}
