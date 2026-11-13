"use client";

import { playClick } from "@/lib/sound";
import { useCopy } from "@/hooks/useCopy";
import { useStage } from "@/store/stage";

export function SoundToggle() {
  const copy = useCopy();
  const enabled = useStage((state) => state.soundEnabled);
  const setSound = useStage((state) => state.setSound);

  return (
    <button
      type="button"
      className="min-h-11 cursor-pointer px-2 font-mono text-xs"
      aria-pressed={enabled}
      aria-label={copy.a11y.audio}
      onClick={() => {
        const next = !enabled;
        setSound(next);
        if (next) playClick();
      }}
    >
      {enabled ? copy.hud.audioOn : copy.hud.audioOff}
    </button>
  );
}
