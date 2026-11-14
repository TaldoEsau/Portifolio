"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { useCopy } from "@/hooks/useCopy";
import type { BlueprintId, DiagramProps } from "@/remotion/diagram-props";
import { useStage } from "@/store/stage";

function BlueprintLoading() {
  const copy = useCopy();
  return (
    <div className="grid aspect-video place-items-center border border-line bg-bg px-4 text-center font-mono text-sm text-muted">
      {copy.projects.loading}
    </div>
  );
}

const Player = dynamic(
  () =>
    import("@/components/ui/RemotionBlueprintPlayer").then(
      (mod) => mod.RemotionBlueprintPlayer,
    ),
  { ssr: false, loading: () => <BlueprintLoading /> },
);

class Boundary extends Component<
  { fallback: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="border border-line px-3 py-4 font-mono text-sm text-muted">
          {this.props.fallback}
        </p>
      );
    }
    return this.props.children;
  }
}

export function BlueprintSlot({
  id,
  autoPlay = false,
}: {
  id: BlueprintId;
  autoPlay?: boolean;
}) {
  const copy = useCopy();
  const reduced = useStage((state) => state.reducedMotion);
  return (
    <Boundary key={id} fallback={copy.projects.failed}>
      <Player
        id={id}
        autoPlay={autoPlay}
        reducedMotion={reduced}
        labels={{
          play: copy.a11y.play,
          pause: copy.a11y.pause,
          prev: copy.a11y.prev,
          next: copy.a11y.next,
          frame: copy.a11y.frame,
        }}
        input={{
          navLock: copy.lab.navLock,
          lines: [...copy.lab.geminiSteps],
          caption: copy.lab.arduinoCaption,
          steps: [...copy.lab.arduinoSteps],
        } satisfies DiagramProps}
      />
    </Boundary>
  );
}
