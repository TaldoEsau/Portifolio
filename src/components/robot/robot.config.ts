import type { Side } from "@/lib/side";

export type RobotState =
  | "idle"
  | "attentive"
  | "speaking"
  | "pointing"
  | "celebrating"
  | "switching"
  | "sleeping"
  | "muted";

type SideConfig = {
  gaze: { lerp: number; maxPx: number; holdMs: number };
  blink: { everyMs: [number, number]; ms: number };
  bubble: { typeMsPerChar: number };
};

export const robotConfig: Record<Side, SideConfig> = {
  light: {
    gaze: { lerp: 0.08, maxPx: 4, holdMs: 0 },
    blink: { everyMs: [4000, 6000], ms: 180 },
    bubble: { typeMsPerChar: 0 },
  },
  dark: {
    gaze: { lerp: 0.35, maxPx: 6, holdMs: 80 },
    blink: { everyMs: [7000, 11000], ms: 80 },
    bubble: { typeMsPerChar: 18 },
  },
};

export const SPEECH_GAP_MS = 8000;
export const IDLE_MS = 20000;
export const SWITCH_MS = 900;
