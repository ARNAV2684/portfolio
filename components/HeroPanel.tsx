"use client";

import { useEffect, useState } from "react";
import { useMouseGlow } from "@/lib/useMouseGlow";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Interactive hero side-panel: a terminal card that "runs" a deploy on loop —
 * each line types out, the pipeline bar advances per stage, and after a hold
 * the sequence restarts. Static full log under prefers-reduced-motion.
 */
const LOG: { text: string; tone: "cmd" | "step" | "ok" }[] = [
  { text: "git push origin main", tone: "cmd" },
  { text: "▸ ci — tests passed (12/12)", tone: "step" },
  { text: "▸ build — image pushed to ecr", tone: "step" },
  { text: "▸ deploy — ecs service updated", tone: "step" },
  { text: "✓ live — arnav.works", tone: "ok" },
];
const STAGES = LOG.length - 1; // the command itself isn't a stage

const ROWS = [
  { k: "stack", v: "aws · docker · terraform" },
  { k: "status", v: "shipping flickstat" },
];

const TONE_CLASS: Record<(typeof LOG)[number]["tone"], string> = {
  cmd: "text-ink",
  step: "text-mut",
  ok: "text-green",
};

export function HeroPanel() {
  const onMove = useMouseGlow();
  const reduced = usePrefersReducedMotion();
  const [time, setTime] = useState("");
  // done: fully typed lines; typing: partial text of the current line.
  const [done, setDone] = useState<string[]>([]);
  const [typing, setTyping] = useState("");

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

  // Deploy-loop state machine. Timeout-driven so unmount cleanup is trivial.
  useEffect(() => {
    if (reduced) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const sleep = (ms: number) =>
      new Promise<void>((res) => {
        timer = setTimeout(res, ms);
      });

    (async () => {
      while (alive) {
        setDone([]);
        setTyping("");
        await sleep(700);
        for (let li = 0; li < LOG.length && alive; li++) {
          const line = LOG[li].text;
          for (let c = 1; c <= line.length && alive; c++) {
            setTyping(line.slice(0, c));
            await sleep(line[c - 1] === " " ? 12 : 24);
          }
          if (!alive) break;
          setDone((prev) => [...prev, line]);
          setTyping("");
          await sleep(li === 0 ? 500 : 380);
        }
        await sleep(4500); // hold the finished deploy before looping
      }
    })();

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [reduced]);

  const doneLines = reduced ? LOG.map((l) => l.text) : done;
  const stage = Math.max(0, doneLines.length - 1);

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
        <span className="ml-2 font-mono-label text-mut">~/arnav — deploy</span>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono-label text-mut">
          <span className="status-dot" aria-hidden />
          {time || "--:--"} IST
        </span>
      </div>

      {/* typed deploy log — height reserved so the card never jumps */}
      <div
        className="relative z-[1] mt-4 min-h-[7.75rem] font-mono text-sm leading-6"
        aria-label="Deploy pipeline demo"
      >
        {doneLines.map((text, i) => (
          <div key={i} className={TONE_CLASS[LOG[i].tone]}>
            {LOG[i].tone === "cmd" ? (
              <>
                <span className="text-green">$ </span>
                {text}
              </>
            ) : (
              text
            )}
          </div>
        ))}
        {!reduced && doneLines.length < LOG.length && (
          <div className={TONE_CLASS[LOG[doneLines.length].tone]}>
            {LOG[doneLines.length].tone === "cmd" && (
              <span className="text-green">$ </span>
            )}
            {typing}
            <span
              className="hero-caret ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] bg-ink"
              aria-hidden
            />
          </div>
        )}
      </div>

      {/* key/value rows */}
      <dl className="relative z-[1] mt-4 space-y-2 border-t border-line pt-4 font-mono text-sm">
        {ROWS.map((r) => (
          <div key={r.k} className="flex gap-3">
            <dt className="w-16 shrink-0 text-accent">{r.k}</dt>
            <dd className="text-ink">{r.v}</dd>
          </div>
        ))}
      </dl>

      {/* pipeline bar synced to the typed stage */}
      <div className="relative z-[1] mt-5">
        <div className="flex justify-between font-mono-label text-mut">
          <span>deploy pipeline</span>
          <span>
            stage {stage}/{STAGES}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="deploy-bar h-full rounded-full bg-accent"
            style={{ width: `${(stage / STAGES) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
