"use client";

import { useEffect, useRef, useState } from "react";
import { DATA } from "@/data/content";
import { assetPath } from "@/lib/assetPath";

/**
 * The shell, on a plate: the last deploy of this site as its opening log, then
 * a real prompt (see COMMANDS below) that lists the work, prints the stack,
 * opens the résumé and links, and scrolls to contact. It holds still; the
 * log only changes when a visitor types.
 */
type Tone = "cmd" | "step" | "ok" | "out" | "err";
interface LogLine {
  text: string;
  tone: Tone;
}

const DEPLOY_LOG: LogLine[] = [
  { text: "git push origin main", tone: "cmd" },
  { text: "ci: tests passed (12/12)", tone: "step" },
  { text: "build: image pushed to ecr", tone: "step" },
  { text: "deploy: ecs service updated", tone: "step" },
  { text: "live: arnav.works", tone: "ok" },
];

const ROWS = [
  { k: "stack", v: "aws, docker, terraform" },
  { k: "status", v: "open to opportunities" },
];

const HELP_LINES = [
  "help              this list",
  "whoami            who I am",
  "ls projects       what I’ve built",
  "cat about.txt     why I build",
  "cat skills.txt    the full stack",
  "open resume       download the résumé",
  "open github       my GitHub, new tab",
  "open linkedin     my LinkedIn, new tab",
  "contact           scroll to contact",
  "clear             clear the screen",
];

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Hard character cap with an ellipsis; some descriptions run long before their first full stop. */
function oneLiner(text: string, max = 64): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Maps a typed command to output lines and an optional side effect. */
function interpret(raw: string): { lines: string[]; action?: () => void } {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "help") return { lines: HELP_LINES };

  if (cmd === "whoami") {
    return { lines: [`${DATA.name}, ${DATA.role}`, DATA.status] };
  }

  if (cmd === "ls" || cmd === "ls projects") {
    return {
      lines: DATA.projects.map((p) => `${slugify(p.title)}/  ${p.kind}: ${oneLiner(p.desc)}`),
    };
  }

  if (cmd === "cat about.txt") {
    return { lines: [DATA.whyIBuild.terminalSummary] };
  }

  if (cmd === "cat skills.txt") {
    return {
      lines: DATA.skills.map((g) => `${g.label}: ${g.items.map((i) => i.name).join(", ")}`),
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
      action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
    };
  }

  if (cmd === "clear") return { lines: [] };

  if (cmd === "") return { lines: [] };

  return { lines: [`command not found: ${raw}`, "type help to see the commands"] };
}

export function HeroPanel() {
  const [time, setTime] = useState("");
  const [log, setLog] = useState<LogLine[]>(DEPLOY_LOG);
  const [interactive, setInteractive] = useState(false);
  const [input, setInput] = useState("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number | null>(null);
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

  // Keep the newest line in view. Sets scrollTop on the box itself; scrollIntoView
  // would also scroll the page, which once hijacked the visitor's position.
  useEffect(() => {
    const box = logBoxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [log]);

  const engage = () => {
    if (!interactive) setInteractive(true);
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
      const next = historyIndexRef.current === null ? h.length - 1 : Math.max(0, historyIndexRef.current - 1);
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

  return (
    <div className="shell plate">
      <p className="shell__top">
        <span>~/arnav, {interactive ? "shell" : "last deploy"}</span>
        <span>{time || "--:--"} IST</span>
      </p>

      <div ref={logBoxRef} className="shell__log" aria-label="Terminal output" aria-live="polite">
        {log.map((line, i) => (
          <div key={i} className={`is-${line.tone}`}>
            {line.text}
          </div>
        ))}
      </div>

      <label className="shell__prompt">
        <span aria-hidden="true">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={engage}
          onKeyDown={onKeyDown}
          placeholder="type help"
          aria-label="Terminal command input: type help for a list of commands"
          spellCheck={false}
          autoComplete="off"
        />
      </label>

      <dl className="shell__rows">
        {ROWS.map((r) => (
          <div key={r.k}>
            <dt>{r.k}</dt>
            <dd>{r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
