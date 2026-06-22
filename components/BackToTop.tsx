"use client";

import { useEffect, useState } from "react";

/**
 * Floating "back to top" pill — appears after the user scrolls past the hero,
 * positioned bottom-right. Subtle, accent-colored on hover.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink shadow-[var(--shadow-card)] transition-all duration-300 hover:border-accent hover:text-accent ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span aria-hidden className="text-lg leading-none">↑</span>
    </button>
  );
}
