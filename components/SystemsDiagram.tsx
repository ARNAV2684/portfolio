import { DATA } from "@/data/content";
import { iconUrl } from "@/lib/skillIcon";

/**
 * Static annotated architecture diagram replacing the old logo-tile grid.
 * Three lanes of what I build (pulled directly from DATA.skills — the same
 * source of truth as the icon cloud, so nothing drifts) converge into one
 * pipeline, because they genuinely do: everything ships through the same
 * infra regardless of which lane it started in. Real brand logos next to
 * each tool name, an accent "flow" animating along the connectors (the same
 * visual language as the hero grid's packets), and a soft drop shadow for
 * depth. Colors are theme tokens, so it repaints correctly in light/dark
 * with zero JS. A wide, horizontally-scrollable wrapper keeps it legible on
 * mobile instead of shrinking text past readability.
 */

const LANE_LABELS = ["Cloud & DevOps", "AI / ML & CV", "Web & Backend"] as const;
const LANE_X = [20, 290, 560];
const LANE_W = 220;
const LANE_Y = 24;
const ROW_H = 20;
const HEADER_H = 40;
const ITEMS_PER_LANE = 4;
const LANE_H = HEADER_H + ITEMS_PER_LANE * ROW_H + 14;

const SHIP_X = 250;
const SHIP_Y = LANE_Y + LANE_H + 70;
const SHIP_W = 300;
const SHIP_H = 96;
const SHIP_CENTER_X = SHIP_X + SHIP_W / 2;

const lanes = LANE_LABELS.map((label) => {
  const group = DATA.skills.find((g) => g.label === label);
  return { title: label, items: (group?.items ?? []).slice(0, ITEMS_PER_LANE) };
});

export function SystemsDiagram() {
  return (
    <div className="overflow-x-auto">
      <svg
        role="img"
        aria-label="Diagram: Cloud & DevOps, AI/ML, and Web & Backend all converge into one shipped and observed pipeline — CI/CD, AWS infrastructure, CloudWatch monitoring"
        viewBox={`0 0 800 ${SHIP_Y + SHIP_H + 20}`}
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
          <linearGradient id="diagram-node-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--card)" />
            <stop offset="100%" stopColor="var(--bg)" />
          </linearGradient>
        </defs>

        {/* connectors — static base line + an animated accent flow on top,
            drawn first so nodes sit above them */}
        {lanes.map((lane, i) => {
          const startX = LANE_X[i] + LANE_W / 2;
          const startY = LANE_Y + LANE_H;
          const midY = startY + (SHIP_Y - startY) / 2;
          const d = `M ${startX} ${startY} C ${startX} ${midY}, ${SHIP_CENTER_X} ${midY}, ${SHIP_CENTER_X} ${SHIP_Y - 4}`;
          return (
            <g key={lane.title}>
              <path d={d} fill="none" stroke="var(--line)" strokeWidth={1.5} markerEnd="url(#diagram-arrow)" />
              <path
                d={d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2}
                strokeLinecap="round"
                className="diagram-flow"
                opacity={0.55}
              />
            </g>
          );
        })}

        {/* lane nodes */}
        {lanes.map((lane, i) => (
          <g key={lane.title} className="diagram-node">
            <rect
              x={LANE_X[i]}
              y={LANE_Y}
              width={LANE_W}
              height={LANE_H}
              rx={12}
              fill="url(#diagram-node-fill)"
              stroke={i === 0 ? "var(--accent)" : "var(--line)"}
              strokeWidth={i === 0 ? 1.5 : 1}
            />
            <text
              x={LANE_X[i] + 16}
              y={LANE_Y + 26}
              fill="var(--ink)"
              fontFamily="var(--font-mono-stack)"
              fontSize="13"
              fontWeight={700}
            >
              {lane.title}
            </text>
            {lane.items.map((item, j) => {
              const src = iconUrl(item);
              const rowY = LANE_Y + HEADER_H + j * ROW_H;
              return (
                <g key={item.name}>
                  {src && (
                    <image
                      href={src}
                      x={LANE_X[i] + 16}
                      y={rowY - 11}
                      width={13}
                      height={13}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  )}
                  <text
                    x={LANE_X[i] + (src ? 35 : 16)}
                    y={rowY}
                    fill="var(--mut)"
                    fontFamily="var(--font-mono-stack)"
                    fontSize="11.5"
                  >
                    {item.name}
                  </text>
                </g>
              );
            })}
          </g>
        ))}

        {/* convergence node */}
        <g className="diagram-node">
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
            y={SHIP_Y + 78}
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
