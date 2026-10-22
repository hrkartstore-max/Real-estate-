import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HEPRA Realty — considered homes across Tamil Nadu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#0b2925", color: "#fffefa", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 24, letterSpacing: "7px" }}>
        <div style={{ width: 58, height: 58, border: "1px solid #bd9860", display: "flex", alignItems: "center", justifyContent: "center", color: "#dfc69a", fontSize: 40 }}>H</div>
        <div style={{ display: "flex", flexDirection: "column" }}>HEPRA<span style={{ fontSize: 12, letterSpacing: "8px", marginTop: 8 }}>REALTY</span></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ fontSize: 18, letterSpacing: "5px", color: "#dfc69a" }}>PROPERTY, WITH PERSPECTIVE.</div>
        <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 600 }}>Find a place<br />to belong.</div>
        <div style={{ fontSize: 25, color: "#d9e0d9" }}>Considered homes across Tamil Nadu</div>
      </div>
      <div style={{ height: 2, width: "100%", background: "#bd9860" }} />
    </div>,
    size
  );
}
