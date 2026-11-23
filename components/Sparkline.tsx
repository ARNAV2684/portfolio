/** Tiny area chart of the project's monthly visitors, beside its figures. Pure SVG. */
export function Sparkline({ points, label }: { points: number[]; label: string }) {
  const W = 144;
  const H = 44;
  const pad = 3;
  const max = Math.max(...points);
  const step = (W - pad * 2) / (points.length - 1);
  const xy = points.map((v, i) => [pad + i * step, H - pad - (v / max) * (H - pad * 2)]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${xy[xy.length - 1][0].toFixed(1)} ${H} L${xy[0][0].toFixed(1)} ${H} Z`;
  const [lx, ly] = xy[xy.length - 1];

  return (
    <figure className="spark">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={`Chart, ${label}: ${points.join(", ")}`}>
        <path d={area} fill="var(--color-accent-wash)" />
        <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="miter" />
        <rect x={lx - 3} y={ly - 3} width="6" height="6" fill="var(--color-accent)" />
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
