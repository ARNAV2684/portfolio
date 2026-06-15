import { DATA } from "@/data/content";
import { Count } from "./Count";
import { Reveal } from "./Reveal";

/** Stats band (CLAUDE.md §5): 4 hairline-separated count-up tiles. Wraps to 2×2 on mobile. */
export function StatsBand() {
  return (
    <section className="shell py-8">
      <Reveal>
        <div className="grid grid-cols-2 overflow-hidden rounded-card border border-line bg-card md:grid-cols-4">
          {DATA.stats.map((s, i) => {
            const cls = [
              "p-6 sm:p-7",
              i % 2 === 0 ? "border-r" : "",
              i < 2 ? "border-b" : "",
              "md:border-b-0",
              i < 3 ? "md:border-r" : "md:border-r-0",
            ].join(" ");
            return (
              <div key={i} className={cls}>
                <div className="font-display text-4xl font-extrabold tabular-nums text-accent md:text-5xl">
                  {"literal" in s ? (
                    s.literal
                  ) : (
                    <Count to={s.value} suffix={s.suffix} />
                  )}
                </div>
                <div className="mt-2 font-mono-label text-mut">{s.label}</div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
