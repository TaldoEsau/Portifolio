"use client";

import { useEffect, useRef } from "react";
import { RobotArt } from "@/components/robot/RobotParts";
import { robotConfig, type RobotState } from "@/components/robot/robot.config";
import { useGaze } from "@/components/robot/useGaze";
import type { SwitchPhase } from "@/components/robot/useRobotBrain";
import type { Side } from "@/lib/side";
import { cn } from "@/lib/utils";

type RobotProps = {
  side: Side;
  state?: RobotState;
  phase?: SwitchPhase;
  attentive?: boolean;
  moving?: boolean;
  facing?: number;
  gazeTarget?: { x: number; y: number } | null;
  live?: boolean;
  className?: string;
};

/** The single ES-01 guide. Shape morphs by side; colours follow the --robot-* tokens. */
export function Robot({
  side,
  state = "idle",
  phase = null,
  attentive = false,
  moving = false,
  facing = 1,
  gazeTarget = null,
  live = true,
  className,
}: RobotProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const eyeRef = useRef<SVGGElement>(null);

  useGaze(eyeRef, rootRef, side, live && state !== "sleeping" && phase === null, gazeTarget);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !live) return;
    const { everyMs, ms } = robotConfig[side].blink;
    let timer = 0;
    const schedule = () => {
      const wait = everyMs[0] + Math.random() * (everyMs[1] - everyMs[0]);
      timer = window.setTimeout(() => {
        if (!document.hidden) {
          root.classList.add("is-blinking");
          window.setTimeout(() => root.classList.remove("is-blinking"), ms);
        }
        schedule();
      }, wait);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [live, side]);

  return (
    <span
      ref={rootRef}
      className={cn(
        "robot block",
        `robot-${state}`,
        phase ? `robot-phase-${phase}` : null,
        attentive && "is-attentive",
        moving && "is-moving",
        className,
      )}
      data-art={side}
      style={{ ["--facing" as string]: facing }}
    >
      <span className="robot-float block h-full w-full">
        <RobotArt ref={eyeRef} side={side} animate={live} className="robot-art block h-full w-full" />
      </span>
      {live && moving ? (
        <span className="robot-thruster-sparks" aria-hidden="true">
          <span className="spark spark-1" />
          <span className="spark spark-2" />
          <span className="spark spark-3" />
        </span>
      ) : null}
      {live && state === "speaking" ? (
        <span className="robot-holo-rings" aria-hidden="true">
          <span className="holo-ring holo-ring-1" />
          <span className="holo-ring holo-ring-2" />
        </span>
      ) : null}
      {live && state === "celebrating" ? (
        <span className="robot-burst" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} style={{ ["--i" as string]: index }} />
          ))}
        </span>
      ) : null}
    </span>
  );
}
