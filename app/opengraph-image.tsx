import { ImageResponse } from "next/og";
import { DATA } from "@/data/content";

// Edge runtime: avoids a @vercel/og Node-path font-resolution bug during build.
export const runtime = "edge";

// Custom social card — name + role + accent on the paper bg (CLAUDE.md §8, high priority).
export const alt = "Arnav Gupta — Cloud & DevOps Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F6F5F1",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#17161A" }}>
          <span>arnav</span>
          <span style={{ color: "#3B43F5" }}>.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 800,
              color: "#17161A",
              letterSpacing: -2,
              lineHeight: 1.04,
            }}
          >
            Arnav Gupta
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 700,
              color: "#3B43F5",
              marginTop: 14,
            }}
          >
            {DATA.role}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#76727E",
              marginTop: 26,
              maxWidth: 920,
              lineHeight: 1.4,
            }}
          >
            {DATA.hero.sub}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            color: "#76727E",
          }}
        >
          <div
            style={{ width: 12, height: 12, borderRadius: 99, background: "#16B364" }}
          />
          <div style={{ display: "flex" }}>{DATA.status}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
