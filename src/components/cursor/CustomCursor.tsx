"use client";

import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CursorDot } from "./CursorDot";
import { CursorRing } from "./CursorRing";

export function CustomCursor() {
  const isFinePointer = useMediaQuery("(pointer: fine)");

  useEffect(() => {
    if (isFinePointer) {
      document.documentElement.classList.add("has-custom-cursor");
    }
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <>
      <CursorDot />
      <CursorRing />
    </>
  );
}
