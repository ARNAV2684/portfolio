"use client";

import { useState } from "react";
import { DATA, type Metric } from "@/data/content";
import { Count } from "./Count";

/** Experience: the roles as a choice set on the left, the chosen one on a plate
 *  with its figures in amber; the figures count up again on each choice. */
export function Experience() {
  const items = DATA.experience;
  const [active, setActive] = useState(0);
  const e = items[active];

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="head">
          <h2>Experience</h2>
        </div>

        <div className="grid12 exp">
          <div className="exp__list" role="tablist" aria-label="Roles" aria-orientation="vertical">
            {items.map((it, i) => {
              const on = i === active;
              return (
                <button
                  key={`${it.org}-${it.when}`}
                  type="button"
                  role="tab"
                  id={`exp-tab-${i}`}
                  aria-selected={on}
                  aria-controls="exp-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(ev) => {
                    const fwd = ev.key === "ArrowDown" || ev.key === "ArrowRight";
                    const back = ev.key === "ArrowUp" || ev.key === "ArrowLeft";
                    if (!fwd && !back) return;
                    ev.preventDefault();
                    const next = (i + (fwd ? 1 : -1) + items.length) % items.length;
                    setActive(next);
                    document.getElementById(`exp-tab-${next}`)?.focus();
                  }}
                  className="exp__role"
                >
                  <small>
                    {it.when}
                    {it.now && ", current"}
                  </small>
                  <span className="exp__org">{it.org}</span>
                  <small>{it.role}</small>
                </button>
              );
            })}
          </div>

          <div
            id="exp-panel"
            role="tabpanel"
            aria-labelledby={`exp-tab-${active}`}
            key={`${e.org}-${e.when}`}
            className="exp__detail plate"
          >
            <small>
              {e.when}
              {e.now && ", current"}
            </small>
            <h3>{e.role}</h3>
            <p className="exp__where">
              {e.org}, {e.loc}
            </p>
            <p className="exp__desc">{e.desc}</p>

            {e.metrics.length > 0 && (
              <div className="metrics">
                {e.metrics.map((m, mi) => (
                  <MetricItem key={mi} m={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricItem({ m }: { m: Metric }) {
  const decimals = m.decimals ?? 0;
  const isDecimal = decimals > 0;
  const delta = m.to - m.from;

  return (
    <div className="metric">
      <div className="metric__fig">
        <b>
          <Count from={m.from} to={m.to} decimals={decimals} prefix={m.prefix ?? ""} suffix={m.suffix ?? ""} />
        </b>
        {isDecimal && delta > 0 && <span className="metric__delta">+{delta.toFixed(decimals)}</span>}
      </div>
      <p className="metric__label">{m.label}</p>
      {isDecimal && (
        <div className="metric__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(1, Math.max(0, m.to))})` }} />
        </div>
      )}
    </div>
  );
}
