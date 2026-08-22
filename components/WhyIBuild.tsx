import { DATA } from "@/data/content";
import { assetPath } from "@/lib/assetPath";
import { Reveal } from "./Reveal";

/**
 * A personal narrative note, deliberately shaped unlike every other section on
 * the page: no card border, no rounded box — just a photo, a big opening
 * quote mark, and prose. Sits right before Contact so the page closes on a
 * human note rather than another proof-point.
 */
export function WhyIBuild() {
  const { caption, heading, paragraphs } = DATA.whyIBuild;

  return (
    <section id="why" className="shell scroll-mt-24 py-14 md:py-20">
      <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-10">
        <Reveal className="flex items-start gap-4 md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/arnav.jpg")}
            alt={DATA.name}
            className="h-16 w-16 shrink-0 rounded-full object-cover md:h-20 md:w-20"
          />
        </Reveal>

        <div>
          <Reveal>
            <div className="font-mono-label text-mut">{caption}</div>
            <h2 className="mt-2 text-3xl md:text-[2.4rem]">{heading}</h2>
          </Reveal>

          <div className="relative mt-6 max-w-[64ch]">
            <span
              aria-hidden
              className="pointer-events-none absolute -left-2 -top-6 font-display text-6xl text-accent/25 md:-left-4 md:-top-8 md:text-7xl"
            >
              “
            </span>
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p className="relative mt-4 leading-relaxed text-mut first:mt-0">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
