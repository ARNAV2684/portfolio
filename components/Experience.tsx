"use client";

import { useState } from "react";
import { DATA, type Metric } from "@/data/content";
import { Count } from "./Count";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Experience (CLAUDE.md §5/§6): master-detail. A timeline of roles on the left
 *  selects one detail card on the right; its count-up metrics replay on select.
 *  On mobile the timeline becomes a horizontal strip above the card. */
export function Experience() {
  const items = DATA.experience;
  const [active, setActive] = useState(0);
  const e = items[active];

  return (
    <section id="experience" className="shell scroll-mt-24 py-14 md:py-20">
      <Reveal>
        <SectionHeading
          caption="// numbers animate as you scroll"
          title="Experience"
        />
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-8 grid gap-6 md:grid-cols-[250px_1fr] md:gap-8">
          {/* master: role timeline */}
          <div
            role="tablist"
            aria-label="Roles"
            aria-orientation="vertical"
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0 md:pb-0"
          >
            {items.map((it, i) => {
              const on = i === active;
              const last = i === items.length - 1;
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
                  className="group flex shrink-0 gap-3 text-left md:gap-4"
                >
                  <span className="hidden w-3.5 flex-col items-center md:flex">
                    <span
                      className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors ${
                        on
                          ? "border-accent bg-accent shadow-[0_0_0_4px_var(--accent-soft)]"
                          : it.now
                          ? "border-green bg-card"
                          : "border-line bg-card group-hover:border-mut"
                      }`}
                      aria-hidden
                    />
                    {!last && <span className="w-px flex-1 bg-line" aria-hidden />}
                  </span>
                  <span
                    className={`block rounded-xl border px-3.5 py-2.5 transition-colors md:rounded-none md:border-0 md:px-0 md:py-0 ${
                      last ? "md:pb-0" : "md:pb-7"
                    } ${
                      on
                        ? "border-accent bg-[var(--accent-soft)] md:bg-transparent"
                        : "border-line"
                    }`}
                  >
                    <span className="block font-mono-label text-mut">
                      {it.when}
                      {it.now && <span className="text-green"> · now</span>}
                    </span>
                    <span
                      className={`mt-1 block font-display text-[0.95rem] font-extrabold leading-snug transition-colors ${
                        on ? "text-ink" : "text-mut group-hover:text-ink"
                      }`}
                    >
                      {it.org}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* detail: selected role */}
          <div
            id="exp-panel"
            role="tabpanel"
            aria-labelledby={`exp-tab-${active}`}
            key={`${e.org}-${e.when}`}
            className="case-study-enter relative min-w-0 rounded-card border border-line bg-card p-6 shadow-[6px_6px_0_0_var(--accent-soft)] md:p-8"
          >
            <div className="font-mono-label text-mut">
              {e.when}
              {e.now && <span className="text-green"> · now</span>}
            </div>
            <h3 className="mt-2 text-2xl">{e.role}</h3>
            <div className="mt-1 font-mono-label text-accent">
              {e.org} · {e.loc}
            </div>
            <p className="mt-4 max-w-[60ch] leading-relaxed text-mut">{e.desc}</p>

            {e.metrics.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {e.metrics.map((m, mi) => (
                  <MetricItem key={mi} m={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function MetricItem({ m }: { m: Metric }) {
  const decimals = m.decimals ?? 0;
  const isDecimal = decimals > 0;
  const delta = m.to - m.from;

  return (
    <div className="min-w-[140px] rounded-xl border border-line bg-bg px-4 py-3">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-extrabold tabular-nums text-accent">
          <Count
            from={m.from}
            to={m.to}
            decimals={decimals}
            prefix={m.prefix ?? ""}
            suffix={m.suffix ?? ""}
          />
        </span>
        {isDecimal && delta > 0 && (
          <span className="font-mono-label text-green">
            +{delta.toFixed(decimals)}
          </span>
        )}
      </div>
      <div className="mt-1 font-mono-label text-mut">{m.label}</div>
      {isDecimal && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${Math.min(100, Math.max(0, m.to * 100))}%` }}
          />
        </div>
      )}
    </div>
  );
}
