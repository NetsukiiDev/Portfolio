"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once, when the element first comes into view.
 *
 * Used only to *start* an entrance animation, never to make content
 * appear — the elements are visible on their own, and this decides when the
 * animation plays. If the observer never fires, nothing is lost but the
 * animation.
 */
export function useInView<T extends HTMLElement>(rootMargin = "-60px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
