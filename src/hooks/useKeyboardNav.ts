"use client";

import { useEffect } from "react";
import { SCENE_IDS, adjacentScene } from "@/lib/scenes";
import { useStage } from "@/store/stage";

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable)
  );
}

export function useKeyboardNav() {
  const scene = useStage((state) => state.scene);
  const booted = useStage((state) => state.booted);
  const dossierOpen = useStage((state) => state.dossierOpen);
  const requestScene = useStage((state) => state.requestScene);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || !booted || dossierOpen) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const index = Number(event.key) - 1;
      if (event.key >= "1" && event.key <= "6" && SCENE_IDS[index]) {
        requestScene(SCENE_IDS[index]);
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        requestScene(adjacentScene(scene, 1));
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        requestScene(adjacentScene(scene, -1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [booted, dossierOpen, requestScene, scene]);
}
