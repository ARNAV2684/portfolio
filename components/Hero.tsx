import { DATA } from "@/data/content";
import { assetPath } from "@/lib/assetPath";
import { Reveal } from "./Reveal";
import { HeroPanel } from "./HeroPanel";

/** Hero (CLAUDE.md §5): status line, display headline, sub, CTA row.
 *  Two-column on desktop — copy on the left, an interactive status panel on the
 *  right — so the wide layout reads as intentional rather than empty. */
export function Hero() {
  const { hero, status, links, name } = DATA;

  return (
    <section className="relative overflow-hidden">
      <span className="aurora" aria-hidden />
      <div className="shell relative z-10 grid items-center gap-10 pb-12 pt-14 md:pb-20 md:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-3.5 py-1.5 font-mono-label text-mut">
              <span className="status-dot" aria-hidden />
              {status}
            </p>
          </Reveal>

          <Reveal delay={60}>
            <p className="mt-7 font-mono-label text-mut">{name}</p>
            <h1 className="mt-2 max-w-[20ch] text-[clamp(2.4rem,6.2vw,4.4rem)] leading-[1.03]">
              {hero.line1} <span className="text-accent">{hero.line2accent}</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-6 max-w-[540px] text-lg leading-relaxed text-mut">
              {hero.sub}
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={assetPath(links.resume)}
                download
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
              >
                Download résumé
              </a>
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                GitHub ↗
              </a>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                LinkedIn ↗
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} className="hidden lg:block">
          <HeroPanel />
        </Reveal>
      </div>
    </section>
  );
}
