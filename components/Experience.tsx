import { DATA, type Metric } from "@/data/content";
import { Count } from "./Count";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Experience timeline with count-up metrics (CLAUDE.md §5/§6). */
export function Experience() {
  const items = DATA.experience;

  return (
    <section id="experience" className="shell scroll-mt-24 py-14 md:py-20">
      <Reveal>
        <SectionHeading
          caption="// numbers animate as you scroll"
          title="Experience"
        />
      </Reveal>

      <div className="mt-8">
        {items.map((e, i) => {
          const last = i === items.length - 1;
          return (
            <Reveal key={`${e.org}-${e.when}`} delay={i * 50}>
              <div className="flex gap-4 sm:gap-5">
                {/* rail + dot */}
                <div className="flex w-3.5 flex-col items-center">
                  <span
                    className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                      e.now
                        ? "border-green bg-green shadow-[0_0_0_4px_var(--accent-soft)]"
                        : "border-line bg-card"
                    }`}
                    aria-hidden
                  />
                  {!last && <span className="w-px flex-1 bg-line" aria-hidden />}
                </div>

                {/* entry */}
                <div className={`min-w-0 ${last ? "pb-0" : "pb-10"}`}>
                  <div className="font-mono-label text-mut">
                    {e.when}
                    {e.now && <span className="text-green"> · now</span>}
                  </div>
                  <h3 className="mt-1 text-xl">{e.role}</h3>
                  <div className="mt-0.5 font-mono-label text-accent">
                    {e.org} · {e.loc}
                  </div>
                  <p className="mt-3 max-w-[60ch] leading-relaxed text-mut">
                    {e.desc}
                  </p>

                  {e.metrics.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {e.metrics.map((m, mi) => (
                        <MetricItem key={mi} m={m} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function MetricItem({ m }: { m: Metric }) {
  const decimals = m.decimals ?? 0;
  const isDecimal = decimals > 0;
  const delta = m.to - m.from;

  return (
    <div className="min-w-[140px] rounded-xl border border-line bg-card px-4 py-3">
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
