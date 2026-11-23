"use client";

import { useEffect, useState } from "react";

/**
 * A 3px cobalt bar across the top edge that fills as the visitor reads down the
 * page, above the floating nav. Revealed with clip-path so nothing reflows.
 * Hidden under prefers-reduced-motion.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }

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

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="progress">
      <div className="progress__bar" style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }} />
    </div>
  );
}
