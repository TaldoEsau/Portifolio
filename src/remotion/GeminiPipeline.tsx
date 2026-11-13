import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { DiagramProps } from "@/remotion/diagram-props";
import { amber, holo, ink, line, muted, ok, panel, voidColor } from "@/remotion/palette";

export const GEMINI_FRAMES = 180;

const NODES = [
  { label: "CRON", x: 70 },
  { label: "NESTJS", x: 250 },
  { label: "REDIS", x: 430 },
  { label: "GEMINI", x: 610 },
  { label: "ALERTA", x: 790 },
];

export function GeminiPipeline({ lines = [] }: DiagramProps) {
  const frame = useCurrentFrame();
  const packet = interpolate(frame, [0, 150], [70, 790], {
    extrapolateRight: "clamp",
  });
  const validated = frame > 130;

  return (
    <AbsoluteFill style={{ background: voidColor }}>
      <div
        style={{
          position: "absolute",
          left: 36,
          top: 28,
          color: amber,
          fontFamily: "ui-monospace, monospace",
          fontSize: 16,
          letterSpacing: 1,
        }}
      >
        GEMINI // PIPELINE
      </div>
      <svg
        width="960"
        height="540"
        viewBox="0 0 960 540"
        style={{ position: "absolute", inset: 0 }}
      >
        <line x1="110" y1="250" x2="850" y2="250" stroke={line} strokeWidth="2" />
        <circle cx={packet} cy="250" r="8" fill={holo} />
      </svg>
      {NODES.map((node, index) => {
        const active = packet >= node.x - 20;
        return (
          <div
            key={node.label}
            style={{
              position: "absolute",
              left: node.x - 58,
              top: 188,
              width: 116,
              height: 124,
              background: panel,
              border: `1px solid ${active ? amber : line}`,
              color: ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "ui-monospace, monospace",
              fontSize: 16,
            }}
          >
            {node.label}
            <span style={{ position: "absolute", bottom: 10, color: muted, fontSize: 12 }}>
              0{index + 1}
            </span>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 36,
          bottom: 36,
          right: 36,
          color: validated ? ok : muted,
          fontFamily: "ui-monospace, monospace",
          fontSize: 18,
        }}
      >
        {frame < 40
          ? lines[0]
          : frame < 80
            ? lines[1]
            : frame < 120
              ? lines[2]
              : validated
                ? lines[4]
                : lines[3]}
      </div>
    </AbsoluteFill>
  );
}
