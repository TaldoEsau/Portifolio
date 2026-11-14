import type { SceneId } from "@/lib/scenes";

export type ChatCommand =
  | { type: "scene"; scene: SceneId }
  | { type: "direct" }
  | { type: "help" }
  | { type: "interferencia" }
  | { type: "raid" }
  | { type: "unknown" };

const COMMANDS: Record<string, ChatCommand> = {
  "!intro": { type: "scene", scene: "intro" },
  "!sobre": { type: "scene", scene: "sobre" },
  "!about": { type: "scene", scene: "sobre" },
  "!projetos": { type: "scene", scene: "projetos" },
  "!projects": { type: "scene", scene: "projetos" },
  "!missoes": { type: "scene", scene: "projetos" },
  "!stack": { type: "scene", scene: "stack" },
  "!arsenal": { type: "scene", scene: "stack" },
  "!lab": { type: "scene", scene: "lab" },
  "!contato": { type: "scene", scene: "contato" },
  "!contact": { type: "scene", scene: "contato" },
  "!direto": { type: "direct" },
  "!direct": { type: "direct" },
  "!ajuda": { type: "help" },
  "!help": { type: "help" },
  "!interferencia": { type: "interferencia" },
  "!interference": { type: "interferencia" },
  "!raid": { type: "raid" },
};

export function resolveCommand(raw: string): ChatCommand {
  const key = raw.trim().toLowerCase().split(/\s+/)[0] ?? "";
  return COMMANDS[key] ?? { type: "unknown" };
}
