import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { DiagramProps } from "@/remotion/diagram-props";
import { getPalette } from "@/remotion/palette";

export const HYPERSPACE_FRAMES = 90;

export function HyperspaceBoot({ navLock = "NAV LOCK", side = "dark" }: DiagramProps) {
  const { amber, holo, ink, muted, voidColor } = getPalette(side);
  const frame = useCurrentFrame();
  const streak = interpolate(frame, [0, 70], [12, 220], {
    extrapolateRight: "clamp",
  });
  const lock = interpolate(frame, [50, 85], [1.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: voidColor, overflow: "hidden" }}>
      {Array.from({ length: 28 }, (_, index) => {
        const y = 16 + ((index * 47) % 500);
        const x = ((index * 97) % 900) - streak * (0.3 + (index % 5) * 0.15);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 8 + (index % 4) * 10,
              height: 2,
              background: index % 3 === 0 ? amber : holo,
              opacity: 0.75,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 160,
          height: 160,
          transform: `translate(-50%, -50%) scale(${lock})`,
          border: `2px solid ${amber}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 28,
          height: 2,
          background: ink,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 2,
          height: 28,
          background: ink,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 36,
          bottom: 32,
          color: muted,
          fontFamily: "ui-monospace, monospace",
          fontSize: 18,
          letterSpacing: 1,
        }}
      >
        {`${navLock} // ${String(Math.round(frame)).padStart(3, "0")}`}
      </div>
    </AbsoluteFill>
  );
}
