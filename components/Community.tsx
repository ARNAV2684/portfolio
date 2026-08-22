import { DATA } from "@/data/content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Community & hackathons — unboxed prose with a left accent rule (like a
 * pull-quote), and the highlight cards collapsed into an inline tag cluster
 * instead of stacked dark boxes. Deliberately a third distinct shape on this
 * page: Projects are media+info cards, Certs are a ledger, this is plain text
 * on the page background.
 */
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

      <Reveal delay={60}>
        <div className="mt-8 max-w-[64ch] border-l-2 border-accent pl-6">
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

      <Reveal delay={120}>
        <ul className="mt-6 flex flex-wrap gap-3">
          {cards.map((c) => (
            <li
              key={c.t}
              className="rounded-full border border-line px-4 py-2 font-mono-label"
            >
              <span className="text-ink">{c.t}</span>
              <span className="text-mut"> · {c.s}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
