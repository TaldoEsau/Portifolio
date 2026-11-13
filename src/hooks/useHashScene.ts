"use client";

import { useEffect, useLayoutEffect } from "react";
import { parseHash } from "@/lib/scenes";
import { useStage } from "@/store/stage";

export function useHashScene() {
  const scene = useStage((state) => state.scene);
  const booted = useStage((state) => state.booted);
  const boot = useStage((state) => state.boot);

  useLayoutEffect(() => {
    const id = parseHash(window.location.hash);
    if (id) boot(id);
    document.documentElement.removeAttribute("data-direct-scene");
    document.documentElement.removeAttribute("data-boot");
  }, [boot]);

  useEffect(() => {
    if (!booted) return;
    const next = `#${scene}`;
    if (window.location.hash === next) return;
    window.history.pushState(null, "", next);
  }, [booted, scene]);

  useEffect(() => {
    const onHash = () => {
      const id = parseHash(window.location.hash);
      if (!id) return;
      useStage.setState({
        scene: id,
        booted: true,
        transitioning: false,
        pendingScene: null,
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
}
