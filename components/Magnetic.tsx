"use client";

import { useRef, type ReactNode } from "react";

/**
 * Subtle magnetic hover: the child drifts a few px toward the cursor and
 * springs back on leave. Wrapper-based so server components can use it.
 * No-op under prefers-reduced-motion.
 */
export function Magnetic({
  children,
  strength = 0.22,
  max = 5,
}: {
  children: ReactNode;
  strength?: number;
  max?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transition = "transform 0s";
    el.style.transform = `translate(${clamp(dx * strength)}px, ${clamp(dy * strength)}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.25s cubic-bezier(0.2, 0.7, 0.2, 1.4)";
    el.style.transform = "translate(0, 0)";
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block will-change-transform"
    >
      {children}
    </span>
  );
}
