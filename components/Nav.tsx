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

/** Floating pill nav: wordmark, the sections, ⌘K, the contact action and the
 *  theme toggle. Under 68rem the links fold into a menu below the pill. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      // Back on the hero, no section is current.
      if (window.scrollY < window.innerHeight * 0.5) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: mark the nav link for the section currently in view.
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
    <header className="nav-wrap">
      <div className="container">
        <nav className="nav" aria-label="Primary" data-scrolled={scrolled ? "true" : "false"}>
          <a href="#main" aria-label="Back to top" className="nav__mark">
            arnav gupta
          </a>

          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active === l.href.slice(1) ? "true" : undefined}
                  className="nav__link"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__tools">
            <button
              type="button"
              aria-label="Open command palette"
              onClick={() => window.dispatchEvent(new CustomEvent("cmdk:open"))}
              className="nav__cmd"
            >
              ⌘&nbsp;K
            </button>
            <a href="#contact" className="btn btn--sm nav__cta">
              Get in touch
            </a>
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="nav-drawer"
              onClick={() => setOpen((o) => !o)}
              className="icon-btn nav__menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div className="nav__drawer" id="nav-drawer">
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn--sm">
              Get in touch
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
