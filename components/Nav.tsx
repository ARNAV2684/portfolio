"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "#work", label: "work" },
  { href: "#experience", label: "experience" },
  { href: "#certs", label: "certs" },
  { href: "#community", label: "community" },
  { href: "#skills", label: "skills" },
  { href: "#contact", label: "contact" },
];

const blurStyle = {
  backgroundColor: "color-mix(in srgb, var(--bg) 72%, transparent)",
  backdropFilter: "saturate(180%) blur(12px)",
  WebkitBackdropFilter: "saturate(180%) blur(12px)",
} as const;

/** Sticky, blurred translucent nav (CLAUDE.md §5). Collapses to a menu on mobile. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the nav link for the section currently in view.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled ? "border-line" : "border-transparent"
      }`}
      style={blurStyle}
    >
      <nav className="shell flex h-16 items-center justify-between">
        <a
          href="#main"
          aria-label="Back to top"
          className="font-display text-lg font-extrabold tracking-tight text-ink"
        >
          arnav<span className="text-accent">.</span>
          <span
            className={`inline-block overflow-hidden align-baseline transition-all duration-500 ease-out ${
              scrolled ? "ml-1 max-w-[8ch] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            gupta
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          <ul className="flex items-center gap-4 lg:gap-6">
            {LINKS.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`font-mono-label transition-colors ${
                      isActive ? "text-accent" : "text-mut hover:text-ink"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href="#contact"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
          >
            Get in touch
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent"
          >
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-line md:hidden" style={blurStyle}>
          <ul className="shell flex flex-col py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 font-mono-label text-mut transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-ink px-4 py-2.5 text-center text-sm font-semibold text-bg transition-opacity hover:opacity-90"
              >
                Get in touch
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
