"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useStage } from "@/store/stage";

type Spark = { x: number; y: number; vx: number; vy: number; life: number };

export function ClickSpark({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const reduced = useStage((state) => state.reducedMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let running = true;
    const colors = { blade: "", hologram: "" };

    const tick = () => {
      if (!running) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparks.current = sparks.current.filter((spark) => spark.life > 0);
      for (const spark of sparks.current) {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.life -= 0.04;
        context.globalAlpha = Math.max(spark.life, 0);
        context.fillStyle = spark.life > 0.5 ? colors.blade : colors.hologram;
        context.fillRect(spark.x, spark.y, 2, 2);
      }
      if (!document.hidden && sparks.current.length > 0) requestAnimationFrame(tick);
    };

    const onClick = (event: MouseEvent) => {
      if (reduced) return;
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("[data-spark]")) return;
      const styles = getComputedStyle(document.documentElement);
      colors.blade = styles.getPropertyValue("--blade").trim();
      colors.hologram = styles.getPropertyValue("--hologram").trim();
      for (let index = 0; index < 12; index += 1) {
        const angle = (Math.PI * 2 * index) / 12;
        sparks.current.push({
          x: event.clientX,
          y: event.clientY,
          vx: Math.cos(angle) * 3.2,
          vy: Math.sin(angle) * 3.2,
          life: 1,
        });
      }
      requestAnimationFrame(tick);
    };

    window.addEventListener("click", onClick);
    return () => {
      running = false;
      window.removeEventListener("click", onClick);
    };
  }, [reduced]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[95]"
        aria-hidden="true"
      />
      {children}
    </>
  );
}
