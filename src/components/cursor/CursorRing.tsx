"use client";

import { useEffect, useRef } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useCursor } from "@/context/CursorContext";

export function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition();
  const { isHovering } = useCursor();
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let frame: number;
    const animate = () => {
      pos.current.x += (x - pos.current.x) * 0.15;
      pos.current.y += (y - pos.current.y) * 0.15;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x - 18}px, ${pos.current.y - 18}px, 0)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [x, y]);

  return <div ref={ref} className="cursor-ring" data-hovering={isHovering} aria-hidden />;
}
