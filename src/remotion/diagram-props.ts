import type { Side } from "@/lib/side";

export type BlueprintId =
  | "hyperspace-boot"
  | "gemini-pipeline"
  | "arduino-clip";

export type DiagramProps = {
  side?: Side;
  navLock?: string;
  lines?: string[];
  caption?: string;
  steps?: string[];
};
