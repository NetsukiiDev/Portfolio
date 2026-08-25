"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

export function Markdown({ content }: { content: string }) {
  return (
    <div className="max-w-none text-muted-foreground [&_a]:text-accent [&_code]:text-foreground [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-foreground [&_li]:mt-1 [&_p]:mt-4 [&_p]:leading-relaxed [&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-background-elevated [&_pre]:p-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
