"use client";

import { useEffect, useRef, type RefObject } from "react";
import { robotConfig } from "@/components/robot/robot.config";
import type { Side } from "@/lib/side";

type Point = { x: number; y: number };

/**
 * Moves the eye group toward a target (cursor, last touch or a forced point)
 * through refs only, so the guide never re-renders per frame.
 */
export function useGaze(
  eyeRef: RefObject<SVGGElement | null>,
  anchorRef: RefObject<HTMLElement | null>,
  side: Side,
  enabled: boolean,
  forced: Point | null,
) {
  const forcedRef = useRef(forced);

  useEffect(() => {
    forcedRef.current = forced;
  }, [forced]);

  useEffect(() => {
    const eye = eyeRef.current;
    const anchor = anchorRef.current;
    if (!enabled || !eye || !anchor) {
      if (eye) eye.style.transform = "";
      return;
    }
    const { lerp, maxPx, holdMs } = robotConfig[side].gaze;
    let pointer: Point | null = null;
    let lastTarget: Element | null = null;
    let holdUntil = 0;
    let current = { x: 0, y: 0 };
    let center = { x: 0, y: 0 };
    let measuredAt = 0;
    let frame = 0;

    const onPointer = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (holdMs === 0) return;
      const target = event.target instanceof Element ? event.target.closest("a, button, article") : null;
      if (target && target !== lastTarget) holdUntil = performance.now() + holdMs;
      lastTarget = target;
    };

    const tick = (now: number) => {
      frame = 0;
      if (document.hidden) return;
      if (now - measuredAt > 250) {
        const box = anchor.getBoundingClientRect();
        center = { x: box.left + box.width / 2, y: box.top + box.height * 0.32 };
        measuredAt = now;
      }
      const target = forcedRef.current ?? pointer;
      if (target && now >= holdUntil) {
        const dx = target.x - center.x;
        const dy = target.y - center.y;
        const distance = Math.hypot(dx, dy) || 1;
        const reach = Math.min(maxPx, distance / 40);
        const goal = { x: (dx / distance) * reach, y: (dy / distance) * reach * 0.6 };
        current = {
          x: current.x + (goal.x - current.x) * lerp,
          y: current.y + (goal.y - current.y) * lerp,
        };
        eye.style.transform = `translate(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (!document.hidden && !frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(tick);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [anchorRef, enabled, eyeRef, side]);
}
