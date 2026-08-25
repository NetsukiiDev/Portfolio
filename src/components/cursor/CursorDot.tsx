"use client";

import { useEffect, useRef } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";

export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition();

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
    }
  }, [x, y]);

  return <div ref={ref} className="cursor-dot" aria-hidden />;
}
