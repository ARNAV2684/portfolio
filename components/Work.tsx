import { DATA } from "@/data/content";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Selected work (CLAUDE.md §5/§7). */
export function Work() {
  return (
    <section id="work" className="shell scroll-mt-24 py-14 md:py-20">
      <Reveal>
        <SectionHeading
          caption="live · open-source · demo clips"
          title="Selected work"
        />
      </Reveal>

      <div className="mt-8 flex flex-col gap-5">
        {DATA.projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 60}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
