/**
 * Static annotated architecture diagram replacing the old logo-tile grid.
 * Three lanes of what I build (Cloud & DevOps / AI & ML / Web & Backend)
 * converge into one pipeline — because they genuinely do; everything ships
 * through the same infra regardless of which lane it started in. Colors are
 * theme tokens (CSS vars), so it repaints correctly in light/dark with zero
 * JS. A wide, horizontally-scrollable wrapper keeps it legible on mobile
 * instead of shrinking text past readability.
 */

const LANES = [
  {
    title: "Cloud & DevOps",
    items: ["AWS", "Docker", "Terraform", "Kubernetes"],
    x: 20,
  },
  {
    title: "AI / ML & CV",
    items: ["PyTorch", "YOLO", "SAM", "GroundingDINO"],
    x: 290,
  },
  {
    title: "Web & Backend",
    items: ["Next.js", "React", "Supabase", "FastAPI"],
    x: 560,
  },
];

const LANE_W = 220;
const LANE_Y = 24;
const LANE_H = 118;
const SHIP_X = 250;
const SHIP_Y = 300;
const SHIP_W = 300;
const SHIP_H = 92;
const SHIP_CENTER_X = SHIP_X + SHIP_W / 2;

export function SystemsDiagram() {
  return (
    <div className="overflow-x-auto">
      <svg
        role="img"
        aria-label="Diagram: Cloud & DevOps, AI/ML, and Web & Backend all converge into one shipped and observed pipeline — CI/CD, AWS infrastructure, CloudWatch monitoring"
        viewBox="0 0 800 420"
        className="h-auto w-full min-w-[640px]"
      >
        <defs>
          <marker
            id="diagram-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--mut)" />
          </marker>
        </defs>

        {/* connectors — drawn first so nodes sit on top */}
        {LANES.map((lane) => {
          const startX = lane.x + LANE_W / 2;
          const startY = LANE_Y + LANE_H;
          const midY = startY + (SHIP_Y - startY) / 2;
          return (
            <path
              key={lane.title}
              d={`M ${startX} ${startY} C ${startX} ${midY}, ${SHIP_CENTER_X} ${midY}, ${SHIP_CENTER_X} ${SHIP_Y - 4}`}
              fill="none"
              stroke="var(--line)"
              strokeWidth={1.5}
              markerEnd="url(#diagram-arrow)"
            />
          );
        })}

        {/* lane nodes */}
        {LANES.map((lane, i) => (
          <g key={lane.title}>
            <rect
              x={lane.x}
              y={LANE_Y}
              width={LANE_W}
              height={LANE_H}
              rx={12}
              fill="var(--card)"
              stroke={i === 0 ? "var(--accent)" : "var(--line)"}
              strokeWidth={i === 0 ? 1.5 : 1}
            />
            <text
              x={lane.x + 16}
              y={LANE_Y + 30}
              fill="var(--ink)"
              fontFamily="var(--font-mono-stack)"
              fontSize="13"
              fontWeight={700}
            >
              {lane.title}
            </text>
            {lane.items.map((item, j) => (
              <text
                key={item}
                x={lane.x + 16}
                y={LANE_Y + 54 + j * 18}
                fill="var(--mut)"
                fontFamily="var(--font-mono-stack)"
                fontSize="11.5"
              >
                {item}
              </text>
            ))}
          </g>
        ))}

        {/* convergence node */}
        <g>
          <rect
            x={SHIP_X}
            y={SHIP_Y}
            width={SHIP_W}
            height={SHIP_H}
            rx={12}
            fill="var(--accent-soft)"
            stroke="var(--accent)"
            strokeWidth={1.5}
          />
          <text
            x={SHIP_CENTER_X}
            y={SHIP_Y + 32}
            textAnchor="middle"
            fill="var(--ink)"
            fontFamily="var(--font-mono-stack)"
            fontSize="13"
            fontWeight={700}
          >
            shipped &amp; observed
          </text>
          <text
            x={SHIP_CENTER_X}
            y={SHIP_Y + 56}
            textAnchor="middle"
            fill="var(--mut)"
            fontFamily="var(--font-mono-stack)"
            fontSize="11.5"
          >
            CI/CD → AWS infra → CloudWatch
          </text>
          <text
            x={SHIP_CENTER_X}
            y={SHIP_Y + 76}
            textAnchor="middle"
            fill="var(--accent)"
            fontFamily="var(--font-mono-stack)"
            fontSize="10.5"
          >
            ★ everything converges here
          </text>
        </g>
      </svg>
    </div>
  );
}
