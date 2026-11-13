"use client";

import { useEffect, useRef } from "react";
import { useSide } from "@/components/side/SideProvider";
import { useStage } from "@/store/stage";

type Star = { x: number; y: number; z: number };

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useStage((state) => state.reducedMotion);
  const { side } = useSide();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const stars: Star[] = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.3 + Math.random() * 0.7,
    }));
    const starColor = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim();
    let frame = 0;
    let stopped = false;

    const draw = () => {
      if (stopped) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = starColor;
      for (const star of stars) {
        const drift = reduced ? 0 : (frame * star.z) % height;
        const y = (star.y * height + drift) % height;
        context.globalAlpha = 0.25 + star.z * 0.45;
        context.fillRect(star.x * width, y, star.z > 0.8 ? 2 : 1, 1);
      }
      context.globalAlpha = 1;
      frame += 0.35;
      if (!reduced && !document.hidden) {
        requestAnimationFrame(draw);
      }
    };

    draw();
    const onVisibility = () => {
      if (!document.hidden && !reduced) requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopped = true;
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, side]);

  return (
    <canvas
      ref={canvasRef}
      className="star-layer h-full w-full"
      aria-hidden="true"
    />
  );
}
