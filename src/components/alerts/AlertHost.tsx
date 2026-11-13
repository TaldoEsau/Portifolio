"use client";

import { useEffect } from "react";
import { AlertToast } from "@/components/alerts/AlertToast";
import { useStage } from "@/store/stage";

export function AlertHost() {
  const current = useStage((state) => state.toasts[0]);
  const shiftToast = useStage((state) => state.shiftToast);
  const reduced = useStage((state) => state.reducedMotion);

  useEffect(() => {
    if (!current) return;
    const timer = window.setTimeout(shiftToast, reduced ? 1500 : 3600);
    return () => window.clearTimeout(timer);
  }, [current, reduced, shiftToast]);

  if (!current) return null;

  return (
    <div className="pointer-events-none fixed top-20 right-3 z-[90]">
      <AlertToast title={current.title} body={current.body} />
    </div>
  );
}
