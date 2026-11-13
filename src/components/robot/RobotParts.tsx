"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { Side } from "@/lib/side";

type Corners = [number, number, number, number];
type Box = { x: number; y: number; w: number; h: number; r: Corners; chin?: number };

const K = 0.5523;

/**
 * Every part is drawn by this one builder so both sides share the same command
 * sequence (M L C L L C L C L C Z). Light bends the corners; Dark collapses the
 * control points onto the chord, which turns the same curve into a chamfer.
 */
function shape({ x, y, w, h, r, chin = 0 }: Box, round: boolean) {
  const [tl, tr, br, bl] = r;
  const k = round ? K : 0;
  const cx = x + w / 2;
  const n = (value: number) => Number(value.toFixed(2));
  const corner = (ax: number, ay: number, bx: number, by: number, px: number, py: number) => {
    const c1x = round ? ax + (px - ax) * k : ax;
    const c1y = round ? ay + (py - ay) * k : ay;
    const c2x = round ? bx + (px - bx) * k : bx;
    const c2y = round ? by + (py - by) * k : by;
    return `C${n(c1x)} ${n(c1y)} ${n(c2x)} ${n(c2y)} ${n(bx)} ${n(by)}`;
  };
  return [
    `M${n(x + tl)} ${n(y)}`,
    `L${n(x + w - tr)} ${n(y)}`,
    corner(x + w - tr, y, x + w, y + tr, x + w, y),
    `L${n(x + w)} ${n(y + h - br)}`,
    corner(x + w, y + h - br, x + w - br, y + h, x + w, y + h),
    `L${n(cx)} ${n(y + h + chin)}`,
    `L${n(x + bl)} ${n(y + h)}`,
    corner(x + bl, y + h, x, y + h - bl, x, y + h),
    `L${n(x)} ${n(y + tl)}`,
    corner(x, y + tl, x + tl, y, x, y),
    "Z",
  ].join(" ");
}

type PartSpec = { light: Box; dark: Box };

const PARTS = {
  head: {
    light: { x: 9, y: 10, w: 46, h: 28, r: [14, 14, 11, 11] },
    dark: { x: 9, y: 12, w: 46, h: 25, r: [7, 7, 10, 10], chin: 4 },
  },
  visor: {
    light: { x: 21, y: 17, w: 22, h: 14, r: [7, 7, 7, 7] },
    dark: { x: 18, y: 21, w: 28, h: 7, r: [3, 3, 3, 3] },
  },
  iris: {
    light: { x: 28.5, y: 20.5, w: 7, h: 7, r: [3.5, 3.5, 3.5, 3.5] },
    dark: { x: 27, y: 22.5, w: 10, h: 4, r: [1.5, 1.5, 1.5, 1.5] },
  },
  body: {
    light: { x: 19, y: 41, w: 26, h: 16, r: [8, 8, 9, 9] },
    dark: { x: 19, y: 41, w: 26, h: 15, r: [3, 3, 7, 7], chin: 3 },
  },
  plateLeft: {
    light: { x: 11, y: 42, w: 10, h: 11, r: [5, 4, 4, 5] },
    dark: { x: 9, y: 41, w: 12, h: 12, r: [4, 1, 1, 6] },
  },
  plateRight: {
    light: { x: 43, y: 42, w: 10, h: 11, r: [4, 5, 5, 4] },
    dark: { x: 43, y: 42, w: 10, h: 10, r: [1, 3, 5, 1] },
  },
  thruster: {
    light: { x: 26, y: 58, w: 12, h: 5, r: [2, 2, 3, 3] },
    dark: { x: 26, y: 57, w: 12, h: 5, r: [1, 1, 3, 3], chin: 2 },
  },
  antennaTip: {
    light: { x: 44, y: 1, w: 6, h: 6, r: [3, 3, 3, 3] },
    dark: { x: 45, y: 0, w: 4, h: 7, r: [2, 2, 1, 1], chin: 1 },
  },
} satisfies Record<string, PartSpec>;

export type PartName = keyof typeof PARTS;

export function partPath(name: PartName, side: Side) {
  return shape(PARTS[name][side], side === "light");
}

const ORDER: PartName[] = ["head", "plateLeft", "plateRight", "body", "thruster", "antennaTip", "visor", "iris"];

type ArtProps = {
  side: Side;
  animate: boolean;
  className?: string;
};

/** Original floating guide. All colours come from --robot-* side tokens. */
export const RobotArt = forwardRef<SVGGElement, ArtProps>(function RobotArt(
  { side, animate, className },
  eyeRef,
) {
  const transition = (name: PartName) =>
    animate
      ? { duration: 0.3, ease: [0.65, 0, 0.35, 1] as const, delay: ORDER.indexOf(name) * 0.04 }
      : { duration: 0 };
  const path = (name: PartName, props: Record<string, unknown>) => (
    <motion.path
      initial={false}
      animate={{ d: partPath(name, side) }}
      transition={transition(name)}
      {...props}
    />
  );

  return (
    <svg
      viewBox="0 0 64 72"
      className={className}
      aria-hidden="true"
      focusable="false"
      data-side={side}
    >
      <g className="robot-flame">
        <ellipse cx="32" cy="66" rx="4" ry="5" fill="var(--robot-eye)" opacity="0.55" />
        <ellipse cx="32" cy="65" rx="2" ry="3" fill="var(--robot-body)" opacity="0.9" />
      </g>
      {path("thruster", { fill: "var(--robot-shade)", stroke: "var(--robot-outline)", strokeWidth: 1.2 })}
      <g className="robot-plates">
        {path("plateLeft", { fill: "var(--robot-shade)", stroke: "var(--robot-outline)", strokeWidth: 1.2 })}
        {path("plateRight", { fill: "var(--robot-shade)", stroke: "var(--robot-outline)", strokeWidth: 1.2 })}
      </g>
      {path("body", { fill: "var(--robot-body)", stroke: "var(--robot-outline)", strokeWidth: 1.4 })}
      <g className="robot-detail-light">
        <circle cx="27" cy="48" r="1.6" fill="var(--robot-line)" />
        <circle cx="32" cy="48" r="1.6" fill="var(--robot-eye)" />
        <circle cx="37" cy="48" r="1.6" fill="var(--robot-line)" />
      </g>
      <g className="robot-detail-dark" stroke="var(--robot-eye)" strokeWidth="0.9" fill="none">
        <path d="M23 46 L29 46 L31 48" />
        <path d="M41 46 L35 46" />
        <path d="M24 51 L40 51" stroke="var(--robot-line)" />
      </g>
      <g className="robot-head">
        <path
          className="robot-antenna"
          d="M40 11 L44 6 L47 4"
          stroke="var(--robot-outline)"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
        {path("antennaTip", { className: "robot-antenna-tip", fill: "var(--robot-eye)" })}
        {path("head", { fill: "var(--robot-body)", stroke: "var(--robot-outline)", strokeWidth: 1.4 })}
        {path("visor", { fill: "var(--robot-outline)" })}
        <g ref={eyeRef} className="robot-eye">
          {path("iris", { className: "robot-iris", fill: "var(--robot-eye)" })}
          <circle className="robot-glint" cx="30.5" cy="22.5" r="1" fill="var(--robot-body)" />
        </g>
        <rect className="robot-scan" x="18" y="21" width="28" height="1" fill="var(--robot-body)" />
        <rect className="robot-lid" x="17" y="16" width="30" height="16" fill="var(--robot-body)" />
      </g>
    </svg>
  );
});
