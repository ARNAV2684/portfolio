"use client";

import { useState } from "react";
import { DATA, type SkillGroup, type SkillItem } from "@/data/content";
import { IconCloud } from "./IconCloud";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Skills — a rotating 3D icon cloud (all stacks with a Simple Icons entry,
 * original brand colors) next to the section header, with the grouped tile grid
 * below. Tiles show each logo in brand color on a white chip so dark marks
 * (Next.js, Vercel) stay visible in dark mode; slug-less stacks (SAM, YOLO…)
 * fall back to an accent monogram.
 */
export function Skills() {
  const cloudImages = DATA.skills
    .flatMap((g) => g.items)
    .map((item) => iconUrl(item))
    .filter((url): url is string => Boolean(url));

  return (
    <section id="skills" className="scroll-mt-24 py-14 md:py-20">
      <div className="shell">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <Reveal>
              <SectionHeading caption="// stack" title="Tech stack & tools." />
            </Reveal>

            <Reveal delay={60}>
              <p className="mt-4 max-w-2xl leading-relaxed text-mut">
                Platforms and tooling I work with day to day across cloud, DevOps,
                and AI/ML. Give the cloud a spin.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} className="justify-self-center">
            <IconCloud images={cloudImages} size={340} />
          </Reveal>
        </div>

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

/** Resolve a skill's icon URL: explicit override → Simple Icons slug → none. */
function iconUrl(item: SkillItem): string | undefined {
  if (item.icon) return item.icon;
  if (item.slug) return `https://cdn.simpleicons.org/${item.slug}`;
  return undefined;
}

/** Short mark for logo-less stacks: SAM, YOLO, LLM (first word if ≤4 chars),
 *  else the first two capitals — CloudWatch → CW, ResNet → RN. */
function monogramFor(name: string): string {
  const first = (name.split(/\s+/)[0] ?? "").replace(/[^A-Za-z0-9]/g, "");
  if (first.length <= 4) return first.toUpperCase();
  const caps = first.match(/[A-Z]/g) ?? [];
  if (caps.length >= 2) return caps.slice(0, 2).join("");
  return first.slice(0, 2).toUpperCase();
}

function SkillTile({ item, accent }: { item: SkillItem; accent?: boolean }) {
  const [errored, setErrored] = useState(false);
  const src = iconUrl(item);
  const showIcon = Boolean(src) && !errored;
  const monogram = monogramFor(item.name);

  return (
    <div
      className={`group flex aspect-square flex-col items-center justify-center gap-2.5 rounded-xl border bg-card p-3 transition-colors ${
        accent ? "border-[var(--accent-ring)] hover:border-accent" : "border-line hover:border-accent"
      }`}
      title={item.name}
    >
      {/* white chip keeps brand-colored logos legible on the dark theme */}
      <div className="grid h-12 w-12 place-items-center rounded-lg border border-line bg-white p-2 shadow-sm">
        {showIcon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            aria-hidden
            loading="lazy"
            className="skill-icon h-full w-full object-contain"
            onError={() => setErrored(true)}
          />
        ) : (
          <span className="font-mono-label text-sm font-bold text-accent" aria-hidden>
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
