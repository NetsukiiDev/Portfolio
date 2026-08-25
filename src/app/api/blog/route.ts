import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, createBlogPost } from "@/lib/data";
import { requireAuth } from "@/app/api/lib/auth-check";
import type { BlogPost } from "@/types";

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const body = (await request.json()) as Omit<BlogPost, "id" | "createdAt" | "updatedAt">;
  const now = new Date().toISOString();

  const post = await createBlogPost({
    ...body,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json(post, { status: 201 });
}
