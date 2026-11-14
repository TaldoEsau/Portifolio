"use client";

import type { ReactNode } from "react";
import { DecryptedText } from "@/components/react-bits/DecryptedText";
import { useCopy } from "@/hooks/useCopy";
import type { SceneId } from "@/lib/scenes";
import { useStage } from "@/store/stage";

export function SceneFrame({
  id,
  children,
}: {
  id: SceneId;
  children: ReactNode;
}) {
  const copy = useCopy();
  const scene = useStage((state) => state.scene);
  const title = copy.deck.sectors[id].name;
  const active = scene === id;

  return (
    <section
      data-panel={id}
      hidden={!active}
      className="scene-panel mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8"
      aria-labelledby={`setor-${id}`}
    >
      <p className="font-mono text-xs text-muted">
        {copy.deck.sectors[id].code}
      </p>
      <h1
        id={`setor-${id}`}
        tabIndex={-1}
        className="display-title mt-2 text-text outline-none"
      >
        <DecryptedText text={title} active={active} />
      </h1>
      <div className="stagger mt-6 grid gap-6">{children}</div>
    </section>
  );
}
