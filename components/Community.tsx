import { DATA } from "@/data/content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Community & hackathons (CLAUDE.md §5): write-up card + stacked dark summary cards. */
export function Community() {
  const { p1, p2, cards } = DATA.community;
  // Accent the word "hosting" in the first paragraph (CLAUDE.md §5).
  const [p1Before, p1After] = p1.split("hosting");

  return (
    <section id="community" className="shell scroll-mt-24 py-14 md:py-20">
      <Reveal>
        <SectionHeading
          caption="meetups · hackathons · startup school"
          title="Community & hackathons"
        />
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="h-full rounded-card border border-line bg-card p-7">
            <p className="leading-relaxed text-mut">
              {p1After !== undefined ? (
                <>
                  {p1Before}
                  <span className="font-semibold text-accent">hosting</span>
                  {p1After}
                </>
              ) : (
                p1
              )}
            </p>
            <p className="mt-4 leading-relaxed text-mut">{p2}</p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <Reveal key={c.t} delay={i * 60}>
              <div className="rounded-card bg-ink p-5 text-bg">
                <div className="font-display text-lg font-extrabold">{c.t}</div>
                <div className="mt-1 font-mono-label opacity-70">{c.s}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
