"use client";

import { useState, type ReactNode } from "react";
import { CursorContext } from "@/context/CursorContext";
import { CustomCursor } from "@/components/cursor/CustomCursor";

export function CursorProvider({ children }: { children: ReactNode }) {
  const [isHovering, setHovering] = useState(false);

  return (
    <CursorContext.Provider value={{ isHovering, setHovering }}>
      {children}
      <CustomCursor />
    </CursorContext.Provider>
  );
}
