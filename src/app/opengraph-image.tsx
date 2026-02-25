import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "World Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#111827",
          color: "#fff",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.8 }}>worldblog</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 16 }}>Building in public.</div>
      </div>
    ),
    size
  );
}
