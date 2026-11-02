"use client";

import { useEffect, useState } from "react";

/**
 * Thin accent bar fixed to the top edge that fills as the user scrolls through
 * the page. Sits ABOVE the sticky nav so it reads as a separate UI layer.
 * Hidden entirely when prefers-reduced-motion is set — feels like jitter then.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
      frame = 0;
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
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
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
    >
      {/* Full-width gradient revealed by clip-path, so the indigo→green colours
          stay anchored to the page instead of stretching as the bar grows. */}
      <div
        className="h-full transition-[clip-path] duration-75 ease-out"
        style={{
          background: "linear-gradient(90deg, var(--accent), var(--green))",
          clipPath: `inset(0 ${100 - progress}% 0 0)`,
        }}
      />
    </div>
  );
}
