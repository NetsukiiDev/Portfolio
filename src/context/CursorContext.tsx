"use client";

import { createContext, useContext } from "react";

export interface CursorContextValue {
  isHovering: boolean;
  setHovering: (hovering: boolean) => void;
}

export const CursorContext = createContext<CursorContextValue | null>(null);

export function useCursor(): CursorContextValue {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used within a CursorProvider");
  return ctx;
}
