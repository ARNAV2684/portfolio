"use client";

import { useState } from "react";
import { DATA } from "@/data/content";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Selected work (CLAUDE.md §5/§7): one featured project at a time, switched via
 *  a segmented tab rail. Keeps the section short and gives each project room. */
export function Work() {
  const projects = DATA.projects;
  const [active, setActive] = useState(0);

  return (
    <section id="work" className="shell scroll-mt-24 py-14 md:py-20">
      <Reveal>
        <SectionHeading
          caption="live · open-source · demo clips"
          title="Selected work"
        />
      </Reveal>

      <Reveal delay={60}>
        <div
          role="tablist"
          aria-label="Projects"
          className="mt-8 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${projects.length}, minmax(0, 1fr))` }}
        >
          {projects.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.title}
                type="button"
                role="tab"
                id={`work-tab-${i}`}
                aria-selected={on}
                aria-controls="work-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const next =
                    (i + (e.key === "ArrowRight" ? 1 : -1) + projects.length) %
                    projects.length;
                  setActive(next);
                  document.getElementById(`work-tab-${next}`)?.focus();
                }}
                className="group text-left"
              >
                <span
                  className={`block h-1 rounded-full transition-colors ${
                    on ? "bg-accent" : "bg-line group-hover:bg-mut"
                  }`}
                />
                <span
                  className={`mt-2 block truncate font-mono-label transition-colors ${
                    on ? "text-ink" : "text-mut group-hover:text-ink"
                  }`}
                >
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>{" "}
                  {p.title}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div
        id="work-panel"
        role="tabpanel"
        aria-labelledby={`work-tab-${active}`}
        className="mt-5"
      >
        {/* key remounts the card so the case-study drawer and media reset per project */}
        <div key={projects[active].title} className="case-study-enter">
          <ProjectCard project={projects[active]} />
        </div>
      </div>
    </section>
  );
}
