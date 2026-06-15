import { ImageResponse } from "next/og";

// Edge runtime: avoids a @vercel/og Node-path font-resolution bug during build.
export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 112,
          fontWeight: 800,
        }}
      >
        <span>a</span>
        <span style={{ color: "#16B364" }}>.</span>
      </div>
    ),
    { ...size }
  );
}
