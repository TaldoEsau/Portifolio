"use client";

import { useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import type { BlueprintId, DiagramProps } from "@/remotion/diagram-props";
import { BLUEPRINTS } from "@/remotion/registry";
import { fill } from "@/lib/utils";

type PlayerLabels = {
  play: string;
  pause: string;
  prev: string;
  next: string;
  frame: string;
};

export function RemotionBlueprintPlayer({
  id,
  labels,
  input,
  autoPlay = false,
  reducedMotion = false,
}: {
  id: BlueprintId;
  labels: PlayerLabels;
  input: DiagramProps;
  autoPlay?: boolean;
  reducedMotion?: boolean;
}) {
  const blueprint = BLUEPRINTS[id];
  const ref = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(reducedMotion ? blueprint.duration - 1 : 0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    const onFrame = () => setFrame(player.getCurrentFrame());
    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("play", () => setPlaying(true));
    player.addEventListener("pause", () => setPlaying(false));
    return () => {
      player.removeEventListener("frameupdate", onFrame);
    };
  }, [id]);

  return (
    <div className="grid gap-3">
      <div
        className="w-full overflow-hidden border border-line bg-bg"
        style={{ aspectRatio: `${blueprint.width} / ${blueprint.height}` }}
      >
        <Player
          ref={ref}
          component={blueprint.component}
          inputProps={input}
          durationInFrames={blueprint.duration}
          compositionWidth={blueprint.width}
          compositionHeight={blueprint.height}
          fps={blueprint.fps}
          autoPlay={autoPlay && !reducedMotion}
          initialFrame={reducedMotion ? blueprint.duration - 1 : 0}
          clickToPlay
          controls={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="min-h-11 cursor-pointer border border-line-bright bg-surface-2 px-3 font-mono text-sm"
          onClick={() => ref.current?.play()}
        >
          {labels.play}
        </button>
        <button
          type="button"
          className="min-h-11 cursor-pointer border border-line-bright bg-surface-2 px-3 font-mono text-sm"
          onClick={() => ref.current?.pause()}
        >
          {labels.pause}
        </button>
        <button
          type="button"
          className="min-h-11 cursor-pointer border border-line-bright bg-surface-2 px-3 font-mono text-sm"
          onClick={() => ref.current?.seekTo(Math.max(0, frame - 1))}
        >
          {labels.prev}
        </button>
        <button
          type="button"
          className="min-h-11 cursor-pointer border border-line-bright bg-surface-2 px-3 font-mono text-sm"
          onClick={() =>
            ref.current?.seekTo(Math.min(blueprint.duration - 1, frame + 1))
          }
        >
          {labels.next}
        </button>
        <p className="self-center font-mono text-sm text-muted" aria-live="polite">
          {playing ? "" : ""}
          {fill(labels.frame, {
            current: String(frame + 1).padStart(3, "0"),
            total: String(blueprint.duration).padStart(3, "0"),
          })}
        </p>
      </div>
    </div>
  );
}
