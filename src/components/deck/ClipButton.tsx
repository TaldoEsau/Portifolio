"use client";

import { playClick } from "@/lib/sound";
import { useCopy } from "@/hooks/useCopy";
import { useHolocron } from "@/hooks/useHolocron";
import { useStage } from "@/store/stage";

export function ClipButton() {
  const copy = useCopy();
  const burn = useHolocron();
  const sound = useStage((state) => state.soundEnabled);

  return (
    <button
      id="holocron"
      type="button"
      data-spark=""
      className="min-h-11 cursor-pointer bg-accent px-3 font-mono text-xs text-on-accent"
      aria-label={copy.a11y.holocron}
      onClick={() => {
        if (sound) playClick();
        void burn();
      }}
    >
      {copy.deck.holocron}
    </button>
  );
}
