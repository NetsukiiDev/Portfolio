"use client";

import { useEffect } from "react";

/** Long enough for the smooth scroll to land before another notch is read. */
const LOCK_MS = 700;

/**
 * One turn of the wheel moves to the next band of the page.
 *
 * With one caveat that keeps the page readable: a section taller than the
 * window scrolls normally until you reach its far edge, and only then does
 * the next notch jump on. Snapping unconditionally would make everything
 * below the fold of a tall section unreachable.
 *
 * Only the wheel is intercepted. Touch, keyboard, scrollbar and in-page
 * anchors keep their own behaviour, so nothing here takes away a way of
 * moving around the page — it only makes one of them coarser.
 */
export function SectionSnap() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let locked = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    function onWheel(event: WheelEvent) {
      // Pinch-zoom on a trackpad arrives as a wheel event.
      if (event.ctrlKey || event.deltaY === 0) return;

      const sections = [...document.querySelectorAll<HTMLElement>("main > section")];
      if (sections.length < 2) return;

      const down = event.deltaY > 0;
      const y = window.scrollY;
      const viewport = window.innerHeight;

      // The section whose top the page has last passed.
      let index = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= y + 2) index = i;
      }

      const current = sections[index];
      const reachedEdge = down
        ? y + viewport >= current.offsetTop + current.offsetHeight - 2
        : y <= current.offsetTop + 2;

      // Still inside a section that doesn't fit: let the page scroll as usual.
      if (!reachedEdge) return;

      const target = sections[index + (down ? 1 : -1)];
      if (!target) return;

      event.preventDefault();
      if (locked) return;
      locked = true;

      window.scrollTo({
        top: target.offsetTop,
        behavior: reduced.matches ? "auto" : "smooth",
      });

      timer = setTimeout(() => {
        locked = false;
      }, LOCK_MS);
    }

    // Not passive: the whole point is being able to take the event over.
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
