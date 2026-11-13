"use client";

import { playClick } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { useStage } from "@/store/stage";
import type { SceneId } from "@/lib/scenes";

export function DeckButton({
  scene,
  label,
  name,
  shortcut,
}: {
  scene: SceneId;
  label: string;
  name: string;
  shortcut: string;
}) {
  const current = useStage((state) => state.scene);
  const requestScene = useStage((state) => state.requestScene);
  const sound = useStage((state) => state.soundEnabled);
  const active = current === scene;

  return (
    <button
      type="button"
      data-spark=""
      aria-current={active ? "page" : undefined}
      aria-keyshortcuts={shortcut}
      aria-label={name}
      className={cn(
        "min-h-11 cursor-pointer border px-1 font-mono text-[11px] leading-tight",
        active
          ? "border-accent bg-surface-2 text-accent"
          : "border-line bg-surface text-muted",
      )}
      onClick={() => {
        if (sound) playClick();
        requestScene(scene);
      }}
    >
      {label}
    </button>
  );
}
