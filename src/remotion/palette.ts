import { tokens } from "@/styles/tokens";
import type { Side } from "@/lib/side";

export const FPS = 30;
export const WIDTH = 960;
export const HEIGHT = 540;

export type RemotionPalette = {
  ink: string;
  muted: string;
  amber: string;
  holo: string;
  line: string;
  panel: string;
  voidColor: string;
  ok: string;
};

export function getPalette(side: Side = "dark"): RemotionPalette {
  const t = tokens[side] ?? tokens.dark;
  return {
    ink: t.text,
    muted: t.muted,
    amber: t.accent,
    holo: t.hologram,
    line: side === "light" ? t.line : t.lineBright,
    panel: side === "light" ? t.surface : t.surface2,
    voidColor: t.bg,
    ok: t.telemetry,
  };
}

// Fallback defaults for backwards compatibility
export const ink = tokens.dark.text;
export const muted = tokens.dark.muted;
export const amber = tokens.dark.accent;
export const holo = tokens.dark.hologram;
export const line = tokens.dark.lineBright;
export const panel = tokens.dark.surface2;
export const voidColor = tokens.dark.bg;
export const ok = tokens.dark.telemetry;
