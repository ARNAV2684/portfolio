"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Heading text that "fills in" left→right as it scrolls through the viewport.
 * Drives a single CSS variable (--fill, 0–100) read by .scroll-fill in
 * globals.css. Default is fully filled, so SSR, no-JS and reduced-motion all
 * show normal text.
 */
export function ScrollFill({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the heading enters at 92% of the viewport, 100 by the time it reaches 55%.
      const t = (vh * 0.92 - r.top) / (vh * 0.37);
      node.style.setProperty("--fill", String(Math.round(Math.min(1, Math.max(0, t)) * 100)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span ref={ref} className="scroll-fill">
      {children}
    </span>
  );
}
