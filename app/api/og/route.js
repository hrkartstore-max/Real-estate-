import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const url = new URL(request.url);
  const title = (url.searchParams.get("title") || "Find a place to belong").slice(0, 100);
  const city = (url.searchParams.get("city") || "Tamil Nadu").slice(0, 60);
  const type = (url.searchParams.get("type") || "Property").slice(0, 30);
  const price = (url.searchParams.get("price") || "Ask for details").slice(0, 30);
  const area = (url.searchParams.get("area") || "").slice(0, 30);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px", background: "#0b2925", color: "#fffefa", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: 23, letterSpacing: "7px" }}>
        <div style={{ width: 54, height: 54, border: "1px solid #bd9860", display: "flex", alignItems: "center", justifyContent: "center", color: "#dfc69a", fontSize: 38 }}>H</div>
        <div style={{ display: "flex", flexDirection: "column" }}>HEPRA<span style={{ fontSize: 11, letterSpacing: "8px", marginTop: 7 }}>REALTY</span></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: 17, letterSpacing: "5px", color: "#dfc69a" }}>{city.toUpperCase()} · {type.toUpperCase()}</div>
        <div style={{ fontSize: title.length > 42 ? 48 : 62, lineHeight: 1.12, fontWeight: 600, maxWidth: "1050px" }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "22px", fontSize: 28, color: "#dfc69a" }}>{price}{area ? <span style={{ color: "#d9e0d9", fontSize: 20 }}>· {area} sq ft</span> : null}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, color: "#d9e0d9" }}><span>Property, with perspective.</span><span>HEPRA.IN</span></div>
      <div style={{ position: "absolute", right: 0, top: 0, width: 320, height: 320, borderRadius: 999, border: "1px solid #bd986033" }} />
      <div style={{ position: "absolute", right: 52, top: 52, width: 210, height: 210, borderRadius: 999, border: "1px solid #bd986044" }} />
    </div>,
    { width: 1200, height: 630 }
  );
}
