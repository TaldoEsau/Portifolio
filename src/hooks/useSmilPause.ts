"use client";

import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

/** SMIL (<animate>, <animateMotion>) ignores the CSS reduced-motion override. */
export function useSmilPause(ref: RefObject<SVGSVGElement | null>) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (reduced) {
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    } else {
      svg.unpauseAnimations();
    }
  }, [reduced, ref]);
}
