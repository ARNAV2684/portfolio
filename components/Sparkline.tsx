/** Tiny inline area chart for the project metric row. Pure SVG, no dependencies. */
export function Sparkline({
  points,
  label,
}: {
  points: number[];
  label: string;
}) {
  const W = 132;
  const H = 40;
  const pad = 3;
  const max = Math.max(...points);
  const step = (W - pad * 2) / (points.length - 1);
  const xy = points.map((v, i) => [
    pad + i * step,
    H - pad - (v / max) * (H - pad * 2),
  ]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${xy[xy.length - 1][0].toFixed(1)} ${H} L${xy[0][0].toFixed(1)} ${H} Z`;
  const [lx, ly] = xy[xy.length - 1];

  return (
    <figure className="m-0 flex flex-col gap-1">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        role="img"
        aria-label={`${label}: ${points.join(", ")}`}
      >
        <path d={area} fill="var(--accent-soft)" />
        <path
          d={line}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={lx} cy={ly} r="3" fill="var(--green)" />
      </svg>
      <figcaption className="font-mono-label text-mut">{label}</figcaption>
    </figure>
  );
}
