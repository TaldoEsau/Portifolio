import { ImageResponse } from "next/og";
import { pt } from "@/content/pt";

export const alt = pt.meta.ogAlt;
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
          justifyContent: "space-between",
          background: "#07080A",
          color: "#F0EEE9",
          padding: 64,
          border: "16px solid #151A22",
        }}
      >
        <div style={{ display: "flex", color: "#FF9F1C", fontSize: 28 }}>
          ● HOLONET TRANSMISSION // TALDOSATIS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, letterSpacing: -2 }}>ESAÚ SANTANA</div>
          <div style={{ marginTop: 16, fontSize: 32, color: "#94A0B8" }}>
            ENGENHEIRO FULL STACK · IA · STREAMER
          </div>
        </div>
        <div style={{ display: "flex", color: "#38BDF8", fontSize: 24 }}>
          SECTOR: OUTER RIM // FREQ: TALDOSATIS
        </div>
      </div>
    ),
    size,
  );
}
