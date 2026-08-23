import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "eyes.on.batumi — street portraits in Batumi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#16202A",
          color: "#F7F2EA",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 8, color: "#D97B4F" }}>BATUMI · GEORGIA</div>
        <div style={{ marginTop: 18, fontSize: 64, fontWeight: 600 }}>eyes.on.batumi</div>
        <div style={{ marginTop: 16, fontSize: 32, color: "#F7F2EA", opacity: 0.88 }}>
          ქუჩის პორტრეტები ბათუმში
        </div>
      </div>
    ),
    size,
  );
}
