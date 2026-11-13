import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { DiagramProps } from "@/remotion/diagram-props";
import { amber, holo, ink, line, muted, ok, panel, voidColor } from "@/remotion/palette";

export const ARDUINO_FRAMES = 180;

const STEPS = [
  "ARDUINO",
  "SERIAL",
  "PYTHON",
  "HELIX",
  "YT-DLP",
  "FFMPEG 9:16",
];

export function ArduinoClipPipeline({ caption = "" }: DiagramProps) {
  const frame = useCurrentFrame();
  const step = Math.min(
    STEPS.length - 1,
    Math.floor(interpolate(frame, [0, 160], [0, STEPS.length], {
      extrapolateRight: "clamp",
    })),
  );
  const press = frame < 24 ? 8 : 0;

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
        }}
      >
        STREAM LAB // CLIP BUTTON
      </div>
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 88,
          width: 72,
          height: 72,
          border: `2px solid ${amber}`,
          background: panel,
          transform: `translateY(${press}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 48,
          top: 150,
          display: "flex",
          gap: 12,
        }}
      >
        {STEPS.map((label, index) => (
          <div
            key={label}
            style={{
              flex: 1,
              minHeight: 92,
              border: `1px solid ${index <= step ? holo : line}`,
              background: panel,
              color: index === step ? ink : muted,
              fontFamily: "ui-monospace, monospace",
              fontSize: 13,
              display: "flex",
              alignItems: "flex-end",
              padding: 10,
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 280,
          width: 180,
          height: 180,
          border: `1px solid ${ok}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: ink,
          fontFamily: "ui-monospace, monospace",
        }}
      >
        9:16
      </div>
      <div
        style={{
          position: "absolute",
          left: 280,
          top: 320,
          color: muted,
          fontFamily: "ui-monospace, monospace",
          fontSize: 18,
          maxWidth: 620,
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
}
