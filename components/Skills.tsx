import { DATA, type SkillItem } from "@/data/content";
import { IconCloud } from "./IconCloud";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SystemsDiagram } from "./SystemsDiagram";

/**
 * Skills — a rotating 3D icon cloud (all stacks with a Simple Icons entry,
 * original brand colors) next to the section header, and a systems diagram
 * below showing how the three things I build actually converge into one
 * pipeline, instead of an exhaustive logo-tile grid. The full tool list still
 * exists — it's just not the headline here anymore; the icon cloud carries
 * the "look at everything I use" job, the diagram carries "here's how it fits
 * together," and the terminal's `cat skills.txt` carries the raw enumeration.
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
              <SectionHeading caption="// stack" title="How it fits together." />
            </Reveal>

            <Reveal delay={60}>
              <p className="mt-4 max-w-2xl leading-relaxed text-mut">
                Cloud/DevOps, AI/ML, and the web layer aren't separate skill
                lists — they all ship through the same pipeline. Give the
                cloud a spin.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} className="justify-self-center">
            <IconCloud images={cloudImages} size={340} />
          </Reveal>
        </div>

        <Reveal delay={100} className="mt-10">
          <SystemsDiagram />
        </Reveal>
      </div>
    </section>
  );
}

/** Resolve a skill's icon URL: explicit override → Simple Icons slug → none. */
function iconUrl(item: SkillItem): string | undefined {
  if (item.icon) return item.icon;
  if (item.slug) return `https://cdn.simpleicons.org/${item.slug}`;
  return undefined;
}
