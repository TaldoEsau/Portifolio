"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CountUp({
  value,
  active,
  instant,
  duration = 1600,
  className,
}: {
  value: number;
  active: boolean;
  instant: boolean;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!active || instant) return;
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 4))));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, duration, instant, value]);

  const current = instant ? value : shown;

  return (
    <span className={cn(current === value ? "count-done" : "count-run", className)}>
      <span aria-hidden="true">{current}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
