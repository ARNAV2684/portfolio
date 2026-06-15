"use client";

import { useCallback, type MouseEvent } from "react";

/**
 * Returns an onMouseMove handler that writes the pointer's position into the
 * target's `--mx` / `--my` CSS variables, driving the `.glow` spotlight in
 * globals.css. Pure CSS does the painting — JS only feeds coordinates.
 */
export function useMouseGlow() {
  return useCallback((e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);
}
