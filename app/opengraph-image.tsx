import { ImageResponse } from "next/og";
import { hero, profile } from "@/data/portfolioData";

export const alt = `${profile.name} — ${profile.role}`;
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
          background: "#F5EFE6",
          padding: 64,
          border: "16px solid #111111",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              background: "#D9381E",
              color: "#fff",
              border: "6px solid #111",
              boxShadow: "8px 8px 0 #111",
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            {profile.monogram}
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#111" }}>{profile.name}</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, color: "#111", lineHeight: 1.05, letterSpacing: -2 }}>
          {hero.headline.replace(/\*/g, "")}
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ background: "#E86F2C", border: "4px solid #111", padding: "8px 20px", fontSize: 28 }}>
            {profile.role}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
