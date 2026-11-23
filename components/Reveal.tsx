import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Kept for callers; Wayfind keeps still, so nothing is staggered. */
  delay?: number;
  className?: string;
}

/** Plain wrapper: the page holds still (Wayfind: no reveal on scroll), so content
 *  is always visible, with or without script. */
export function Reveal({ children, className = "" }: RevealProps) {
  return <div className={className || undefined}>{children}</div>;
}
