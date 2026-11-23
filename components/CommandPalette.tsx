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
  /** Keep the palette open briefly after running (e.g. to show "Copied"). */
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
 * ⌘K command palette: jump to sections, open links, copy the email, toggle
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
        hint: "new tab",
        run: () => {
          window.open(DATA.links.github, "_blank", "noopener");
        },
      },
      {
        group: "Links",
        label: "LinkedIn",
        hint: "new tab",
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
        label: copied ? "Copied" : "Copy email address",
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
        hint: "theme",
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
    <div className="palette-scrim" onClick={close} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="palette"
      >
        <div className="palette__search">
          <span aria-hidden="true">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a section, open a link…"
            aria-label="Search commands"
          />
          <kbd>esc</kbd>
        </div>

        <ul role="listbox" aria-label="Commands" className="palette__list">
          {filtered.length === 0 && (
            <li className="palette__empty">No matches. Try “work” or “github”.</li>
          )}
          {filtered.map((cmd, i) => {
            const showGroup = cmd.group !== lastGroup;
            lastGroup = cmd.group;
            return (
              <li key={`${cmd.group}-${cmd.label}`} role="presentation">
                {showGroup && (
                  <div className="palette__group">{cmd.group}</div>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === index}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => runCommand(cmd)}
                  className="palette__item"
                >
                  <span>{cmd.label}</span>
                  {cmd.hint && <small>{cmd.hint}</small>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="palette__foot">
          <span>Arrow keys to move</span>
          <span>Enter to run</span>
          <span>⌘&nbsp;K to close</span>
        </div>
      </div>
    </div>
  );
}
