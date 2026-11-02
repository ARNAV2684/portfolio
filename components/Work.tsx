"use client";

import { useState } from "react";
import { DATA, type Project } from "@/data/content";
import { ProjectCard } from "./ProjectCard";

// Status as a departure board reads it: sentence case, the live one marked.
const STATUS: Record<Project["type"], string> = {
  LIVE: "Live",
  PRIVATE: "Private",
  "OPEN SOURCE": "Open source",
};

/** Selected work as a departures board: every project a row with its kind, its
 *  figure and its status. Choosing a row opens that project as a case below. */
export function Work() {
  const projects = DATA.projects;
  const [active, setActive] = useState(0);

  return (
    <section id="work" className="section">
      <div className="container">
        <div className="head head--rule">
          <h2>Selected work</h2>
        </div>

        <div className="board__head" aria-hidden="true">
          <small>No.</small>
          <small>Project</small>
          <small>Kind</small>
          <small>Figure</small>
          <small>Status</small>
        </div>
        <ol className="board" role="tablist" aria-label="Projects">
          {projects.map((p, i) => {
            const on = i === active;
            return (
              <li key={p.title} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`work-tab-${i}`}
                  aria-selected={on}
                  aria-controls="work-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    const fwd = e.key === "ArrowDown" || e.key === "ArrowRight";
                    const back = e.key === "ArrowUp" || e.key === "ArrowLeft";
                    if (!fwd && !back) return;
                    e.preventDefault();
                    const next = (i + (fwd ? 1 : -1) + projects.length) % projects.length;
                    setActive(next);
                    document.getElementById(`work-tab-${next}`)?.focus();
                  }}
                  className="board__row"
                >
                  <span className="board__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="board__title">{p.title}</span>
                  <span className="board__kind">{p.kind}</span>
                  <span className="board__fig">
                    {p.metric && (
                      <>
                        <b>{p.metric.value}</b>
                        <span>{p.metric.label}</span>
                      </>
                    )}
                  </span>
                  <span className={`status${p.type === "LIVE" ? " status--live" : ""}`}>
                    {p.type === "LIVE" && <span className="live-sq" aria-hidden="true" />}
                    {STATUS[p.type]}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div id="work-panel" role="tabpanel" aria-labelledby={`work-tab-${active}`}>
          {/* key remounts the case so its drawer and media reset per project */}
          <ProjectCard key={projects[active].title} project={projects[active]} />
        </div>
      </div>
    </section>
  );
}
