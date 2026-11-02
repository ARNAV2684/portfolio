import { DATA } from "@/data/content";

/** Full-bleed monospace ticker under the hero. Reuses the .marquee loop from the
 *  skills section; the second set is aria-hidden so screen readers read it once. */
export function StatusTicker() {
  const items = DATA.ticker;
  const set = (hidden: boolean) =>
    items.map((t) => (
      <span
        key={`${hidden}-${t}`}
        aria-hidden={hidden || undefined}
        className="flex items-center gap-8 whitespace-nowrap font-mono-label text-ink"
      >
        <span>{t}</span>
        <span className="text-accent" aria-hidden>
          ●
        </span>
      </span>
    ));

  return (
    <div className="border-y border-line bg-card py-3" aria-label="Status">
      <div className="marquee" style={{ ["--marquee-duration" as string]: "42s" }}>
        <div className="marquee-track" style={{ gap: "2rem", paddingRight: "2rem" }}>
          {set(false)}
          {set(true)}
        </div>
      </div>
    </div>
  );
}
