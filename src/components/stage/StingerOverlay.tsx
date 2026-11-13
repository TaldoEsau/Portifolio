"use client";

import { useEffect, useState } from "react";
import { StarWarsWipe } from "@/components/stage/StarWarsWipe";
import { useStage } from "@/store/stage";

export function StingerOverlay() {
  const transitioning = useStage((state) => state.transitioning);
  const transitionId = useStage((state) => state.transitionId);
  const reduced = useStage((state) => state.reducedMotion);
  const commitScene = useStage((state) => state.commitScene);
  const finishTransition = useStage((state) => state.finishTransition);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STINGER !== "true") return;
    const timer = window.setTimeout(() => {
      fetch("/video/stinger.webm")
        .then((response) => {
          if (response.ok) setVideoReady(true);
        })
        .catch(() => undefined);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!transitioning) return;
    const mid = window.setTimeout(commitScene, reduced ? 0 : 450);
    const end = window.setTimeout(finishTransition, reduced ? 150 : 900);
    return () => {
      window.clearTimeout(mid);
      window.clearTimeout(end);
    };
  }, [commitScene, finishTransition, reduced, transitionId, transitioning]);

  if (!transitioning || reduced) return null;

  return (
    <>
      <StarWarsWipe />
      {videoReady ? (
        <video
          className="pointer-events-none fixed inset-0 z-[61] h-full w-full object-cover"
          src="/video/stinger.webm"
          autoPlay
          muted
          playsInline
        />
      ) : null}
    </>
  );
}
