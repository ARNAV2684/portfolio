import { ImageResponse } from "next/og";

// Edge runtime: avoids a @vercel/og Node-path font-resolution bug during build.
export const runtime = "edge";

// Favicon = the `arnav.` mark: white "a" + green accent dot on indigo (CLAUDE.md §8).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3B43F5",
          color: "#FFFFFF",
          fontSize: 22,
          fontWeight: 800,
          borderRadius: 7,
        }}
      >
        <span>a</span>
        <span style={{ color: "#16B364" }}>.</span>
      </div>
    ),
    { ...size }
  );
}
