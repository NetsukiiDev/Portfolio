"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

const PLACEHOLDER_SRC = "/placeholder.jpg";

type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export function ImageWithFallback({ src, alt, ...props }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = !src || failed ? PLACEHOLDER_SRC : src;

  return <Image src={resolvedSrc} alt={alt} onError={() => setFailed(true)} {...props} />;
}
