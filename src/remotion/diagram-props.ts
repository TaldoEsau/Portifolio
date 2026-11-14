export type BlueprintId =
  | "hyperspace-boot"
  | "gemini-pipeline"
  | "arduino-clip";

export type DiagramProps = {
  navLock?: string;
  lines?: string[];
  caption?: string;
  steps?: string[];
};
