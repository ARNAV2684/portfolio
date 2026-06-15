"use client";

import { useEffect, useState } from "react";

// Always computed in Asia/Kolkata, regardless of the visitor's timezone (CLAUDE.md §5).
function istNow(): string {
  const t = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
  return `${t} IST`;
}

/** Live IST clock in the footer; updates each minute. */
export function ISTClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(istNow());
    const id = setInterval(() => setTime(istNow()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Render a stable placeholder until mounted to avoid SSR/client mismatch.
  return <span suppressHydrationWarning>{time ?? "— IST"}</span>;
}
