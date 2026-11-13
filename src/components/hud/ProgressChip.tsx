"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useCopy } from "@/hooks/useCopy";
import { PROGRESS_TOTAL, PROTOCOLS, progressCount } from "@/lib/progress";
import { SCENES } from "@/lib/scenes";
import { cn } from "@/lib/utils";
import { useStage } from "@/store/stage";

export function ProgressChip() {
  const copy = useCopy();
  const explored = useStage((state) => state.explored);
  const achievements = useStage((state) => state.achievements);
  const resetProgress = useStage((state) => state.resetProgress);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const count = progressCount(explored, achievements);
  const sectors = Math.min(explored.length, SCENES.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${copy.progress.open}: ${count} / ${PROGRESS_TOTAL}`}
        className="flex min-h-11 cursor-pointer items-center gap-2 px-2 font-mono text-xs"
        onClick={() => setOpen(!open)}
      >
        <span key={count} className="progress-bump text-accent">
          {String(count).padStart(2, "0")}/{PROGRESS_TOTAL}
        </span>
        <span className="hidden text-muted sm:inline">{copy.progress.label}</span>
        <span className="flex gap-[2px]" aria-hidden="true">
          {Array.from({ length: PROGRESS_TOTAL }, (_, index) => (
            <span
              key={index}
              className={cn(
                "progress-seg block h-3 w-1",
                index < count ? "bg-accent" : "bg-line-bright",
              )}
              style={{ animationDelay: `${index * 40}ms` }}
            />
          ))}
        </span>
      </button>
      {open ? (
        <div
          id={panelId}
          className="progress-panel absolute top-full right-0 z-50 mt-1 w-[min(22rem,90vw)] border border-line bg-surface p-4 shadow-[var(--glow-amber)]"
        >
          <p className="font-display text-lg">{copy.progress.title}</p>
          <p className="mt-1 font-mono text-xs text-muted">
            {copy.progress.sectors}: {sectors}/{SCENES.length}
          </p>
          <p className="mt-3 font-mono text-xs text-hologram">
            {copy.progress.protocols}
          </p>
          <ul className="stagger mt-2 grid gap-2">
            {PROTOCOLS.map((id) => {
              const item = copy.progress.items[id];
              const done = achievements.includes(id);
              return (
                <li
                  key={id}
                  className={cn(
                    "grid grid-cols-[auto_1fr] items-start gap-x-3 border-l-2 pl-3",
                    done ? "border-accent" : "border-line",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1 block h-2 w-2",
                      done ? "bg-accent" : "border border-line-bright",
                    )}
                    aria-hidden="true"
                  />
                  <span>
                    <span className={cn("block text-sm", done ? "text-text" : "text-muted")}>
                      {done ? item.name : `${copy.progress.locked} // ${item.name}`}
                    </span>
                    {done ? null : (
                      <span className="block font-mono text-xs text-muted">{item.hint}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 border-t border-line pt-3">
            <button
              type="button"
              className="min-h-11 cursor-pointer font-mono text-xs text-accent underline"
              onClick={resetProgress}
            >
              {copy.progress.reset}
            </button>
            <span className="font-mono text-xs text-muted">{copy.progress.resetNote}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
