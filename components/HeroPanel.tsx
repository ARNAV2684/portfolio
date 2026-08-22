"use client";

import { useEffect, useRef, useState } from "react";
import { DATA } from "@/data/content";
import { assetPath } from "@/lib/assetPath";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Interactive hero side-panel: a terminal that "runs" a deploy on loop as an
 * idle/attract-mode animation — each line types out, the pipeline bar
 * advances per stage, and after a hold the sequence restarts — until a
 * visitor clicks or types into the prompt, at which point it becomes a real
 * shell (see COMMANDS below). Static full log under prefers-reduced-motion,
 * though the shell itself is always interactive regardless of motion prefs
 * (typing isn't an animation).
 */
type Tone = "cmd" | "step" | "ok" | "out" | "err";
interface LogLine {
  text: string;
  tone: Tone;
}

const DEPLOY_LOG: LogLine[] = [
  { text: "git push origin main", tone: "cmd" },
  { text: "▸ ci — tests passed (12/12)", tone: "step" },
  { text: "▸ build — image pushed to ecr", tone: "step" },
  { text: "▸ deploy — ecs service updated", tone: "step" },
  { text: "✓ live — arnav.works", tone: "ok" },
];
const STAGES = DEPLOY_LOG.length - 1; // the command itself isn't a stage

const ROWS = [
  { k: "stack", v: "aws · docker · terraform" },
  { k: "status", v: "open to opportunities" },
];

const TONE_CLASS: Record<Tone, string> = {
  cmd: "text-ink",
  step: "text-mut",
  ok: "text-green",
  out: "text-ink",
  err: "text-danger",
};

const HELP_LINES = [
  "help              — this list",
  "whoami            — who I am",
  "ls projects       — what I've built",
  "cat about.txt     — why I build",
  "cat skills.txt    — the full stack",
  "open resume       — download the résumé",
  "open github       — my GitHub, new tab",
  "open linkedin     — my LinkedIn, new tab",
  "contact           — scroll to contact",
  "clear             — clear the screen",
];

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Hard character cap with an ellipsis — sentence-based truncation (splitting
 *  on the first period) isn't reliable here since some project descriptions
 *  run well past 60 characters before their first full stop. */
function oneLiner(text: string, max = 64): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Maps a typed command to output lines and an optional side effect. */
function interpret(raw: string): { lines: string[]; action?: () => void } {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "help") return { lines: HELP_LINES };

  if (cmd === "whoami") {
    return { lines: [`${DATA.name} — ${DATA.role}`, DATA.status] };
  }

  if (cmd === "ls" || cmd === "ls projects") {
    return {
      lines: DATA.projects.map(
        (p) => `${slugify(p.title)}/  ${p.kind} — ${oneLiner(p.desc)}`
      ),
    };
  }

  if (cmd === "cat about.txt") {
    return { lines: [DATA.whyIBuild.terminalSummary] };
  }

  if (cmd === "cat skills.txt") {
    return {
      lines: DATA.skills.map(
        (g) => `${g.label}: ${g.items.map((i) => i.name).join(", ")}`
      ),
    };
  }

  if (cmd === "open resume") {
    return {
      lines: ["opening résumé…"],
      action: () => window.open(assetPath(DATA.links.resume), "_blank"),
    };
  }

  if (cmd === "open github") {
    return {
      lines: ["opening github…"],
      action: () => window.open(DATA.links.github, "_blank", "noopener"),
    };
  }

  if (cmd === "open linkedin") {
    return {
      lines: ["opening linkedin…"],
      action: () => window.open(DATA.links.linkedin, "_blank", "noopener"),
    };
  }

  if (cmd === "contact") {
    return {
      lines: ["scrolling to contact…"],
      action: () =>
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
    };
  }

  if (cmd === "clear") return { lines: [] };

  if (cmd === "") return { lines: [] };

  return { lines: [`command not found: ${raw}`, "type 'help' to see available commands"] };
}

export function HeroPanel() {
  const reduced = usePrefersReducedMotion();
  const [time, setTime] = useState("");
  const [log, setLog] = useState<LogLine[]>([]);
  const [typing, setTyping] = useState("");
  const [interactive, setInteractive] = useState(false);
  const [input, setInput] = useState("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number | null>(null);
  const interactiveRef = useRef(false);
  const logBoxRef = useRef<HTMLDivElement>(null);

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

  // Deploy-loop attract mode. Bails out (via a ref, since it lives inside an
  // async loop that closures over stale state otherwise) the moment a visitor
  // engages the real prompt.
  useEffect(() => {
    if (reduced) {
      setLog(DEPLOY_LOG);
      return;
    }
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const sleep = (ms: number) =>
      new Promise<void>((res) => {
        timer = setTimeout(res, ms);
      });

    (async () => {
      while (alive && !interactiveRef.current) {
        setLog([]);
        setTyping("");
        await sleep(700);
        for (let li = 0; li < DEPLOY_LOG.length && alive && !interactiveRef.current; li++) {
          const line = DEPLOY_LOG[li].text;
          for (let c = 1; c <= line.length && alive && !interactiveRef.current; c++) {
            setTyping(line.slice(0, c));
            await sleep(line[c - 1] === " " ? 12 : 24);
          }
          if (!alive || interactiveRef.current) break;
          setLog((prev) => [...prev, DEPLOY_LOG[li]]);
          setTyping("");
          await sleep(li === 0 ? 500 : 380);
        }
        if (alive && !interactiveRef.current) await sleep(4500); // hold before looping
      }
    })();

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [reduced]);

  // Auto-scroll the log box to its newest line. Sets scrollTop directly on
  // the box itself rather than using scrollIntoView — that call also scrolls
  // *ancestor* scrollable regions (including the whole page) into view of the
  // target, which hijacked the visitor's scroll position because the
  // attract-mode loop above updates `log` continuously in the background,
  // forever, whether or not anyone has ever touched the terminal.
  useEffect(() => {
    const box = logBoxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [log]);

  const engage = () => {
    if (interactive) return;
    interactiveRef.current = true;
    setInteractive(true);
  };

  const runCommand = () => {
    const raw = input;
    if (!raw.trim()) return;
    historyRef.current.push(raw);
    historyIndexRef.current = null;
    setInput("");

    const { lines, action } = interpret(raw);
    if (raw.trim().toLowerCase() === "clear") {
      setLog([]);
    } else {
      setLog((prev) => [
        ...prev,
        { text: raw, tone: "cmd" },
        ...lines.map((text) => ({ text, tone: "out" as const })),
      ]);
    }
    action?.();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = historyRef.current;
      if (h.length === 0) return;
      const next =
        historyIndexRef.current === null ? h.length - 1 : Math.max(0, historyIndexRef.current - 1);
      historyIndexRef.current = next;
      setInput(h[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = historyRef.current;
      if (historyIndexRef.current === null) return;
      const next = historyIndexRef.current + 1;
      if (next >= h.length) {
        historyIndexRef.current = null;
        setInput("");
      } else {
        historyIndexRef.current = next;
        setInput(h[next] ?? "");
      }
    }
  };

  const stage = reduced || interactive ? STAGES : Math.max(0, log.length - 1);

  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-card p-5 shadow-[var(--shadow-card)] transition-colors duration-300 hover:border-accent">
      {/* terminal chrome */}
      <div className="relative z-[1] flex items-center gap-2 border-b border-line pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-green/50" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-green/80" aria-hidden />
        <span className="ml-2 font-mono-label text-mut">
          ~/arnav — {interactive ? "shell" : "deploy"}
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono-label text-mut">
          <span className="status-dot" aria-hidden />
          {time || "--:--"} IST
        </span>
      </div>

      {/* log — scrollable once it grows past the reserved height */}
      <div
        ref={logBoxRef}
        className="relative z-[1] mt-4 max-h-[11rem] min-h-[7.75rem] overflow-y-auto font-mono text-sm leading-6"
        aria-label="Terminal output"
      >
        {log.map((line, i) => (
          <div key={i} className={TONE_CLASS[line.tone]}>
            {line.tone === "cmd" ? (
              <>
                <span className="text-green">$ </span>
                {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
        {!interactive && !reduced && log.length < DEPLOY_LOG.length && (
          <div className={TONE_CLASS[DEPLOY_LOG[log.length].tone]}>
            {DEPLOY_LOG[log.length].tone === "cmd" && <span className="text-green">$ </span>}
            {typing}
            <span
              className="hero-caret ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] bg-ink"
              aria-hidden
            />
          </div>
        )}
      </div>

      {/* real prompt — engaging it stops the attract-mode loop */}
      <div className="relative z-[1] mt-2 flex items-center gap-2 font-mono text-sm">
        <span className="text-green">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={engage}
          onKeyDown={onKeyDown}
          placeholder="type 'help'…"
          aria-label="Terminal command input — type help for a list of commands"
          className="w-full min-w-0 bg-transparent text-ink outline-none placeholder:text-mut"
          spellCheck={false}
          autoComplete="off"
        />
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

      {/* pipeline bar synced to the typed stage; frozen once interactive */}
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
