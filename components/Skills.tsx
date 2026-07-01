"use client";

import { useState } from "react";
import { DATA, type SkillGroup, type SkillItem } from "@/data/content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Skills grid — each stack renders as a square tile with a logo on top and the
 * name below. Icons come from cdn.simpleicons.org (monochrome SVGs). A tile
 * whose slug is missing or whose icon fails to load falls back to a two-letter
 * monogram — useful for stacks without a Simple Icons entry (SAM, YOLO, etc.).
 */
export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-14 md:py-20">
      <div className="shell">
        <Reveal>
          <SectionHeading caption="// stack" title="Tech stack & tools." />
        </Reveal>

        <Reveal delay={60}>
          <p className="mt-4 max-w-2xl leading-relaxed text-mut">
            Platforms and tooling I work with day to day across cloud, DevOps, and AI/ML.
          </p>
        </Reveal>

        <div className="mt-10 space-y-8">
          {DATA.skills.map((group, i) => (
            <Reveal key={group.label} delay={i * 60}>
              <SkillsRow group={group} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsRow({ group }: { group: SkillGroup }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 font-mono-label">
        <span className={group.accent ? "text-accent" : "text-mut"}>{group.label}</span>
        {group.accent && <span className="text-accent">★ core</span>}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {group.items.map((item) => (
          <SkillTile key={item.name} item={item} accent={group.accent} />
        ))}
      </div>
    </div>
  );
}

function SkillTile({ item, accent }: { item: SkillItem; accent?: boolean }) {
  const [errored, setErrored] = useState(false);
  const showIcon = Boolean(item.slug) && !errored;
  const monogram = item.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase();

  return (
    <div
      className={`group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border bg-card p-3 transition-colors ${
        accent ? "border-[var(--accent-ring)] hover:border-accent" : "border-line hover:border-accent"
      }`}
      title={item.name}
    >
      <div className="grid h-10 w-10 place-items-center">
        {showIcon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://cdn.simpleicons.org/${item.slug}`}
            alt=""
            aria-hidden
            loading="lazy"
            className="skill-icon h-full w-full object-contain"
            onError={() => setErrored(true)}
          />
        ) : (
          <span
            className="font-mono-label text-sm font-bold text-accent"
            aria-hidden
          >
            {monogram}
          </span>
        )}
      </div>
      <div className="w-full truncate text-center font-mono-label text-mut">
        {item.name}
      </div>
    </div>
  );
}
