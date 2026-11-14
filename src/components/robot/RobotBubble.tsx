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
  align?: "left" | "right";
  robotX?: number;
  viewportWidth?: number;
  robotSize?: number;
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
  robotX,
  viewportWidth,
  robotSize,
  children,
}: BubbleProps) {
  const perChar = robotConfig[side].bubble.typeMsPerChar;

  // Responsive boundary calculation:
  // Ensures the bubble is ALWAYS strictly clamped inside the screen boundaries
  // and never causes horizontal scrolling on any mobile or desktop screen.
  const vw = viewportWidth ?? (typeof window !== "undefined" ? window.innerWidth : 400);
  const size = robotSize ?? (vw < 768 ? 52 : 64);
  const isMobile = vw < 640;
  const bubbleMaxWidth = Math.min(340, Math.max(260, vw - 24));

  let relativeLeft: number | undefined = undefined;
  let tailLeft: number | undefined = undefined;

  if (robotX !== undefined) {
    let idealScreenLeft: number;
    if (isMobile) {
      // On mobile, center the bubble above the robot, then clamp within viewport
      idealScreenLeft = robotX + size / 2 - bubbleMaxWidth / 2;
    } else {
      // On desktop, follow alignment preference
      idealScreenLeft = align === "right" ? robotX + size - bubbleMaxWidth : robotX;
    }
    // Strict clamp between 12px from left and 12px from right
    const clampedLeft = Math.max(12, Math.min(vw - bubbleMaxWidth - 12, idealScreenLeft));
    relativeLeft = Math.round(clampedLeft - robotX);

    // Position the tail to point directly to robot center
    const arrowCenter = robotX + size / 2 - clampedLeft;
    tailLeft = Math.round(Math.max(18, Math.min(bubbleMaxWidth - 20, arrowCenter)));
  }

  return (
    <div
      className={cn(
        "robot-bubble pointer-events-auto absolute bottom-full mb-3 max-w-[calc(100vw-24px)]",
        `robot-bubble-${side}`,
        robotX === undefined && (align === "right" ? "right-0" : "left-0"),
      )}
      style={{
        width: bubbleMaxWidth,
        ...(relativeLeft !== undefined ? { left: `${relativeLeft}px`, right: "auto" } : {}),
      }}
      aria-live="off"
    >
      <p className="font-mono text-[0.625rem] tracking-[0.14em] text-accent">{name}</p>
      <p className="mt-1 min-h-[2lh] text-xs sm:text-sm leading-relaxed text-text">
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
      <span
        className={cn(
          "robot-bubble-tail",
          robotX === undefined && (align === "right" ? "right-6" : "left-6"),
        )}
        style={tailLeft !== undefined ? { left: `${tailLeft}px`, right: "auto" } : undefined}
        aria-hidden="true"
      />
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
