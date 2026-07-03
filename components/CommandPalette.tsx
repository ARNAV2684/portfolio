"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { DATA } from "@/data/content";
import { assetPath } from "@/lib/assetPath";

interface Command {
  group: string;
  label: string;
  hint?: string;
  run: () => void | Promise<void>;
  /** Keep the palette open briefly after running (e.g. to show "copied ✓"). */
  keepOpen?: boolean;
}

const SECTIONS = [
  { id: "work", label: "Selected work" },
  { id: "experience", label: "Experience" },
  { id: "certs", label: "Certifications" },
  { id: "community", label: "Community" },
  { id: "skills", label: "Tech stack" },
  { id: "contact", label: "Contact" },
];

/**
 * ⌘K command palette — jump to sections, open links, copy the email, toggle
 * the theme. Opens via Cmd/Ctrl+K or a `cmdk:open` window event (the nav pill
 * dispatches it). Plain listbox semantics, arrow-key navigation, Esc closes.
 */
export function CommandPalette() {
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
    setCopied(false);
  }, []);

  const commands = useMemo<Command[]>(
    () => [
      ...SECTIONS.map((s) => ({
        group: "Navigate",
        label: s.label,
        hint: `#${s.id}`,
        run: () => {
          document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
        },
      })),
      {
        group: "Links",
        label: "GitHub profile",
        hint: "↗",
        run: () => {
          window.open(DATA.links.github, "_blank", "noopener");
        },
      },
      {
        group: "Links",
        label: "LinkedIn",
        hint: "↗",
        run: () => {
          window.open(DATA.links.linkedin, "_blank", "noopener");
        },
      },
      {
        group: "Links",
        label: "Download résumé",
        hint: "pdf",
        run: () => {
          window.open(assetPath(DATA.links.resume), "_blank", "noopener");
        },
      },
      {
        group: "Links",
        label: "Email me",
        hint: DATA.links.email,
        run: () => {
          window.location.href = `mailto:${DATA.links.email}`;
        },
      },
      {
        group: "Actions",
        label: copied ? "Copied ✓" : "Copy email address",
        hint: "clipboard",
        keepOpen: true,
        run: async () => {
          await navigator.clipboard.writeText(DATA.links.email).catch(() => {});
          setCopied(true);
          setTimeout(close, 900);
        },
      },
      {
        group: "Actions",
        label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`,
        hint: "◐",
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
    ],
    [resolvedTheme, setTheme, copied, close]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        (c.hint ?? "").toLowerCase().includes(q)
    );
  }, [commands, query]);

  const runCommand = useCallback(
    (cmd: Command) => {
      if (!cmd.keepOpen) close();
      void cmd.run();
    },
    [close]
  );

  // Global shortcuts: ⌘K / Ctrl+K toggles; nav pill dispatches `cmdk:open`.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("cmdk:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cmdk:open", onOpen);
    };
  }, []);

  // Focus the input and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[index]) {
      e.preventDefault();
      runCommand(filtered[index]);
    }
  };

  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="mx-auto mt-[16vh] w-[min(560px,calc(100vw-2rem))] overflow-hidden rounded-card border border-line bg-card shadow-[var(--shadow-hover)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span className="font-mono-label text-accent">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a section, open a link…"
            aria-label="Search commands"
            className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-mut"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono-label text-mut">
            esc
          </kbd>
        </div>

        <ul role="listbox" aria-label="Commands" className="max-h-[46vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center font-mono-label text-mut">
              no matches — try “work” or “github”
            </li>
          )}
          {filtered.map((cmd, i) => {
            const showGroup = cmd.group !== lastGroup;
            lastGroup = cmd.group;
            return (
              <li key={`${cmd.group}-${cmd.label}`} role="presentation">
                {showGroup && (
                  <div className="px-3 pb-1 pt-3 font-mono-label text-mut">
                    // {cmd.group.toLowerCase()}
                  </div>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === index}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => runCommand(cmd)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    i === index
                      ? "bg-[var(--accent-soft)] text-accent"
                      : "text-ink hover:bg-[var(--accent-soft)]"
                  }`}
                >
                  <span>{cmd.label}</span>
                  {cmd.hint && (
                    <span className="shrink-0 font-mono-label text-mut">{cmd.hint}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2 font-mono-label text-mut">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span className="ml-auto">⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}
