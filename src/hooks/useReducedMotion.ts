"use client";

import { useEffect } from "react";
import { useStage } from "@/store/stage";

export function useReducedMotion() {
  const setReducedMotion = useStage((state) => state.setReducedMotion);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [setReducedMotion]);
}
