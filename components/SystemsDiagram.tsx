import { DATA } from "@/data/content";

/**
 * The system, drawn: three lanes of what I build (pulled from DATA.skills, the
 * same source as the rows beneath) converge into one shipped-and-observed
 * pipeline, because they do. Square nodes, 2px ink rules, every colour a token,
 * so it repaints in both colourways with no script. The wrapper scrolls on a
 * phone rather than shrinking the type past reading.
 */

const LANE_LABELS = ["Cloud & DevOps", "AI / ML & CV", "Web & Backend"] as const;
const LANE_X = [16, 288, 560];
const LANE_W = 224;
const LANE_Y = 16;
const ROW_H = 24;
const HEADER_H = 48;
const ITEMS_PER_LANE = 4;
const LANE_H = HEADER_H + ITEMS_PER_LANE * ROW_H + 12;

const SHIP_X = 236;
const SHIP_Y = LANE_Y + LANE_H + 72;
const SHIP_W = 328;
const SHIP_H = 104;
const SHIP_CENTER_X = SHIP_X + SHIP_W / 2;

const lanes = LANE_LABELS.map((label) => {
  const group = DATA.skills.find((g) => g.label === label);
  return { title: label, items: (group?.items ?? []).slice(0, ITEMS_PER_LANE) };
});

export function SystemsDiagram() {
  return (
    <div className="diagram">
      <svg
        role="img"
        aria-label="Diagram: Cloud & DevOps, AI/ML, and Web & Backend all converge into one shipped and observed pipeline: CI/CD, AWS infrastructure, CloudWatch monitoring"
        viewBox={`0 0 800 ${SHIP_Y + SHIP_H + 16}`}
      >
        {/* connectors: square corridors from each lane down into the pipeline */}
        {lanes.map((lane, i) => {
          const startX = LANE_X[i] + LANE_W / 2;
          const startY = LANE_Y + LANE_H;
          const midY = startY + (SHIP_Y - startY) / 2;
          const endX = SHIP_X + 56 + i * ((SHIP_W - 112) / 2);
          return (
            <path
              key={lane.title}
              d={`M ${startX} ${startY} V ${midY} H ${endX} V ${SHIP_Y}`}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={2}
            />
          );
        })}

        {lanes.map((lane, i) => (
          <g key={lane.title}>
            <rect
              x={LANE_X[i]}
              y={LANE_Y}
              width={LANE_W}
              height={LANE_H}
              fill="var(--color-paper)"
              stroke="var(--color-ink)"
              strokeWidth={2}
            />
            <rect x={LANE_X[i] + 16} y={LANE_Y + 20} width={10} height={10} fill={i === 0 ? "var(--color-accent)" : "var(--color-ink)"} />
            <text x={LANE_X[i] + 34} y={LANE_Y + 30} fill="var(--color-ink)" fontFamily="var(--font-display)" fontSize="14" fontWeight={800}>
              {lane.title}
            </text>
            {lane.items.map((item, j) => (
              <text
                key={item.name}
                x={LANE_X[i] + 16}
                y={LANE_Y + HEADER_H + 14 + j * ROW_H}
                fill="var(--color-ink-2)"
                fontFamily="var(--font-display)"
                fontSize="13"
              >
                {item.name}
              </text>
            ))}
          </g>
        ))}

        <g>
          <rect x={SHIP_X} y={SHIP_Y} width={SHIP_W} height={SHIP_H} fill="var(--color-plate)" stroke="var(--color-plate-rule)" strokeWidth={2} />
          <text x={SHIP_CENTER_X} y={SHIP_Y + 40} textAnchor="middle" fill="var(--color-plate-ink)" fontFamily="var(--font-display)" fontSize="16" fontWeight={800}>
            shipped &amp; observed
          </text>
          <text x={SHIP_CENTER_X} y={SHIP_Y + 70} textAnchor="middle" fill="var(--color-accent-2)" fontFamily="var(--font-display)" fontSize="13" fontWeight={500}>
            CI/CD, AWS infra, CloudWatch
          </text>
        </g>
      </svg>
    </div>
  );
}
