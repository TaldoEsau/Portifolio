"use client";

import { useEffect, useState, type ReactNode } from "react";
import { robotConfig } from "@/components/robot/robot.config";
import type { Side } from "@/lib/side";
import { cn } from "@/lib/utils";

type BubbleProps = {
  side: Side;
  name: string;
  text: string;
  textKey: string;
  instant: boolean;
  closeLabel: string;
  onClose: () => void;
  align: "left" | "right";
  children?: ReactNode;
};

export function RobotBubble({
  side,
  name,
  text,
  textKey,
  instant,
  closeLabel,
  onClose,
  align,
  children,
}: BubbleProps) {
  const perChar = robotConfig[side].bubble.typeMsPerChar;

  return (
    <div
      className={cn(
        "robot-bubble pointer-events-auto absolute bottom-full mb-3 w-[min(21.5rem,82vw)]",
        `robot-bubble-${side}`,
        align === "right" ? "right-0" : "left-0",
      )}
      aria-live="off"
    >
      <p className="font-mono text-[0.625rem] tracking-[0.14em] text-accent">{name}</p>
      <p className="mt-1 min-h-[2lh] text-sm leading-relaxed text-text">
        <span className="sr-only">{text}</span>
        <Typewriter key={textKey} text={text} perChar={instant ? 0 : perChar} />
      </p>
      {children}
      <button
        type="button"
        className="absolute top-0 right-0 grid h-11 w-11 cursor-pointer place-items-center font-mono text-xs text-muted hover:text-text"
        aria-label={closeLabel}
        onClick={onClose}
      >
        ×
      </button>
      <span className={cn("robot-bubble-tail", align === "right" ? "right-6" : "left-6")} aria-hidden="true" />
    </div>
  );
}

function Typewriter({ text, perChar }: { text: string; perChar: number }) {
  const [count, setCount] = useState(perChar === 0 ? text.length : 0);

  useEffect(() => {
    if (perChar === 0) return;
    const id = window.setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          window.clearInterval(id);
          return current;
        }
        return current + 1;
      });
    }, perChar);
    return () => window.clearInterval(id);
  }, [perChar, text]);

  const shown = perChar === 0 ? text.length : count;

  return (
    <span aria-hidden="true">
      {text.slice(0, shown)}
      {shown < text.length ? <span className="droid-caret">▌</span> : null}
    </span>
  );
}
