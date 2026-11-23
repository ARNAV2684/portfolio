"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

type DocWithViewTransition = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

/**
 * Light/dark toggle with a View Transitions circle reveal: the new theme wipes
 * across the page in an expanding circle from the button. Falls back to an
 * instant switch on browsers without startViewTransition and under
 * prefers-reduced-motion.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);

  // Site default is light (Wayfind platform); assume light pre-mount so the icon doesn't flash.
  const isDark = mounted ? resolvedTheme === "dark" : false;
  const next = isDark ? "light" : "dark";

  const toggle = async () => {
    const doc = document as DocWithViewTransition;
    const btn = ref.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduced || !btn) {
      setTheme(next);
      return;
    }

    try {
      await doc.startViewTransition(() => {
        flushSync(() => setTheme(next));
      }).ready;

      const { top, left, width, height } = btn.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 550,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } catch {
      // Transition was skipped (rapid toggling); the theme is already set.
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={
        mounted ? `Switch to ${next} mode` : "Toggle color theme"
      }
      className="icon-btn"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
