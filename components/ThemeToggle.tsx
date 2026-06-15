"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/** The `◐` light/dark toggle in the nav (CLAUDE.md §2/§5). */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle color theme"
      }
      className="grid h-10 w-10 place-items-center rounded-full border border-line text-base text-ink transition-colors hover:border-accent hover:text-accent"
    >
      <span aria-hidden>◐</span>
    </button>
  );
}
