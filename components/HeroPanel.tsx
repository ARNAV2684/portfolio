"use client";

import { useEffect, useState } from "react";
import { useMouseGlow } from "@/lib/useMouseGlow";

/**
 * Interactive hero side-panel (desktop): a "terminal/status" card that fills the
 * wide layout and reacts to the cursor (spotlight), shows live IST time, an
 * animated training bar, and a blinking caret. Static copy, no secrets.
 */
const ROWS = [
  { k: "stack", v: "aws · docker · terraform" },
  { k: "build", v: "architecture → cloud → prod" },
  { k: "status", v: "shipping flickstat" },
];

export function HeroPanel() {
  const onMove = useMouseGlow();
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      onMouseMove={onMove}
      className="glow group relative overflow-hidden rounded-card border border-line bg-card p-5 shadow-[var(--shadow-card)] transition-colors duration-300 hover:border-accent"
    >
      {/* terminal chrome */}
      <div className="relative z-[1] flex items-center gap-2 border-b border-line pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-green/50" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-green/80" aria-hidden />
        <span className="ml-2 font-mono-label text-mut">~/arnav — live</span>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono-label text-mut">
          <span className="status-dot" aria-hidden />
          {time || "--:--"} IST
        </span>
      </div>

      {/* key/value rows */}
      <dl className="relative z-[1] mt-4 space-y-3 font-mono text-sm">
        {ROWS.map((r) => (
          <div key={r.k} className="flex gap-3">
            <dt className="w-16 shrink-0 text-accent">{r.k}</dt>
            <dd className="text-ink">{r.v}</dd>
          </div>
        ))}
      </dl>

      {/* faux deploy pipeline — animates on load */}
      <div className="relative z-[1] mt-5">
        <div className="flex justify-between font-mono-label text-mut">
          <span>deploy pipeline</span>
          <span>stage 4/5</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div className="hero-bar h-full rounded-full bg-accent" />
        </div>
      </div>

      <div className="relative z-[1] mt-5 flex items-center gap-2 font-mono text-sm text-mut">
        <span className="text-green">$</span>
        <span>building the next thing</span>
        <span className="hero-caret inline-block h-4 w-[2px] bg-ink" aria-hidden />
      </div>
    </div>
  );
}
