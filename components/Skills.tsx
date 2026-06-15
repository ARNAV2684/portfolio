"use client";

import { type CSSProperties } from "react";
import { DATA, type SkillGroup } from "@/data/content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Skills & toolkit — a clean "label | non-stop ticker" row per group, contained
 * within the page width so labels and chips line up. Cloud & DevOps leads as the
 * accent "core" row; direction alternates row-to-row; the ticker pauses on hover.
 * Falls back to a static wrapped list under prefers-reduced-motion.
 */
export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-14 md:py-20">
      <div className="shell">
        <Reveal>
          <SectionHeading
            caption="cloud-first · systems · ml foundation"
            title="Skills & toolkit"
          />
        </Reveal>

        <div className="mt-8 flex flex-col gap-3">
          {DATA.skills.map((group, i) => (
            <Reveal key={group.label} delay={i * 50}>
              <SkillRow group={group} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Repeat items until the row is dense enough to loop seamlessly with no gaps. */
function fill(items: string[], min = 14): string[] {
  if (items.length === 0) return items;
  const out = [...items];
  let i = 0;
  while (out.length < min) {
    out.push(items[i % items.length]);
    i += 1;
  }
  return out;
}

function SkillRow({ group, index }: { group: SkillGroup; index: number }) {
  const reduced = usePrefersReducedMotion();
  const reverse = index % 2 === 1;
  const duration = `${28 + index * 3}s`;
  const loop = fill(group.items);

  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border p-3 sm:flex-row sm:items-center sm:gap-4 ${
        group.accent
          ? "border-[var(--accent-ring)] bg-[var(--accent-soft)]"
          : "border-line bg-card"
      }`}
    >
      {/* label */}
      <div className="flex shrink-0 items-center gap-2 px-1 sm:w-44">
        <span
          className={`font-mono-label ${group.accent ? "text-accent" : "text-ink"}`}
        >
          {group.label}
        </span>
        {group.accent && <span className="font-mono-label text-accent">★</span>}
      </div>

      {/* ticker (or static list under reduced motion) */}
      {reduced ? (
        <ul className="flex flex-wrap gap-2">
          {group.items.map((item) => (
            <Chip key={item} label={item} accent={group.accent} />
          ))}
        </ul>
      ) : (
        <div className="marquee min-w-0 flex-1">
          <ul
            className={`marquee-track ${reverse ? "reverse" : ""}`}
            style={{ "--marquee-duration": duration } as CSSProperties}
          >
            {loop.map((item, i) => (
              <Chip key={`a-${i}`} label={item} accent={group.accent} />
            ))}
            {loop.map((item, i) => (
              <Chip key={`b-${i}`} label={item} accent={group.accent} ariaHidden />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Chip({
  label,
  accent,
  ariaHidden,
}: {
  label: string;
  accent?: boolean;
  ariaHidden?: boolean;
}) {
  return (
    <li
      aria-hidden={ariaHidden}
      className={`shrink-0 cursor-default whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono-label transition-transform duration-200 hover:-translate-y-0.5 ${
        accent
          ? "border-[var(--accent-ring)] bg-card text-accent"
          : "border-line bg-bg text-ink hover:border-accent"
      }`}
    >
      {label}
    </li>
  );
}
