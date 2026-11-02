"use client";

import { useEffect, useState } from "react";

const KEY = "arnav-booted";
const DURATION = 500;

/**
 * First-visit loading bar: plain logo + progress bar, ~0.5s. Once per browser
 * session, skippable (click / any key), and CSS-driven as a fallback: if JS never
 * runs the overlay still fades out on its own (.boot in globals.css). Returning visitors
 * never see it — an inline script in layout.tsx sets `data-booted` on <html>
 * before first paint. Hidden under prefers-reduced-motion.
 */
export function BootLoader() {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const hide = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* storage blocked — overlay just shows once per load */
      }
      setGone(true);
    };

    if (document.documentElement.dataset.booted) {
      setGone(true);
      return;
    }

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const p = Math.min(100, ((now - start) / DURATION) * 100);
      setPct(Math.round(p));
      if (p < 100) frame = requestAnimationFrame(tick);
    });
    const done = window.setTimeout(hide, DURATION + 150);

    const skip = () => {
      window.clearTimeout(done);
      hide();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(done);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="boot" role="status" aria-label="Loading arnav.works">
      <div className="boot-inner">
        <div className="boot-logo">
          arnav<span className="text-accent">.</span>
        </div>
        <div className="boot-bar" aria-hidden>
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
