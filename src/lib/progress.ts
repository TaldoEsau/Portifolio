import { SCENES } from "@/lib/scenes";

export const PROTOCOLS = [
  "droide",
  "dossier",
  "holocron",
  "explorer",
  "interferencia",
  "raid",
  "bastidores",
] as const;

export type ProtocolId = (typeof PROTOCOLS)[number];

export const PROGRESS_TOTAL = SCENES.length + PROTOCOLS.length;

export function progressCount(explored: readonly string[], achievements: readonly string[]) {
  const protocols = PROTOCOLS.filter((id) => achievements.includes(id)).length;
  return Math.min(explored.length, SCENES.length) + protocols;
}
