"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

/*
 * Cult UI gateway illustrations (endpoint, overhead, routing), ported to the
 * HoloNet tokens. Brand logos are replaced by short tool labels so every node
 * names a real item from the Stack sector. Each link is drawn twice: a dim
 * base trace and a dashed overlay that flows toward the hub (`.gateway-link`).
 */

const LINK_COLORS = [
  "var(--color-hologram)",
  "var(--color-telemetry)",
  "var(--color-live)",
  "var(--color-accent)",
];

type GatewayProps = Omit<ComponentProps<"svg">, "children"> & {
  hub: string;
  nodes: string[];
  label: string;
};

function Svg({
  className,
  label,
  children,
  ...props
}: ComponentProps<"svg"> & { label: string }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 264 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full max-w-[320px]", className)}
      {...props}
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

function Link({ d, color, delay = 0 }: { d: string; color: string; delay?: number }) {
  return (
    <>
      <path d={d} stroke={color} strokeOpacity="0.35" />
      <path
        d={d}
        stroke={color}
        strokeWidth="1.5"
        className="gateway-link"
        style={{ animationDelay: `${delay}s` }}
      />
    </>
  );
}

function NodeLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill="var(--color-text)"
      fontFamily="var(--font-mono), monospace"
      fontSize={text.length > 4 ? 6.5 : 7.5}
    >
      {text}
    </text>
  );
}

function Bubble({ x, y, text, round = true }: { x: number; y: number; text: string; round?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="32"
        height="32"
        rx={round ? 16 : 6}
        fill="var(--color-surface)"
        stroke="var(--color-line-bright)"
      />
      <NodeLabel x={x + 16} y={y + 16} text={text} />
    </g>
  );
}

function Hub({ cx, cy, text, r = 20 }: { cx: number; cy: number; text: string; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-surface-2)" stroke="var(--color-accent)" strokeOpacity="0.7" />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-accent)"
        fontFamily="var(--font-display), sans-serif"
        fontSize={text.length > 4 ? 7.5 : 9}
        fontWeight="600"
      >
        {text}
      </text>
    </g>
  );
}

/** One input, a hub, four outputs on bubbles. */
export function GatewayEndpoint({ hub, nodes, label, ...props }: GatewayProps) {
  const id = useId().replaceAll(":", "");
  const [a = "", b = "", c = "", d = ""] = nodes;

  return (
    <Svg label={label} {...props}>
      <defs>
        {[
          [1, 172, 92],
          [2, 208, 56],
          [3, 244, 20],
        ].map(([ring, x1, x2]) => (
          <linearGradient
            key={ring}
            id={`${id}-ring${ring}`}
            x1={x1}
            y1="60"
            x2={x2}
            y2="60"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.5" stopColor="var(--color-line-bright)" />
            <stop offset="1" stopColor="var(--color-line-bright)" stopOpacity="0" />
          </linearGradient>
        ))}
        <linearGradient id={`${id}-in`} x1="0" y1="60" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-accent)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
      <circle opacity="0.8" cx="132" cy="60" r="39.5" stroke={`url(#${id}-ring1)`} />
      <circle opacity="0.8" cx="132" cy="60" r="75.5" stroke={`url(#${id}-ring2)`} />
      <circle opacity="0.8" cx="132" cy="60" r="111.5" stroke={`url(#${id}-ring3)`} />
      <path d="M112 60L0 60" stroke={`url(#${id}-in)`} />
      <path d="M0 60L112 60" stroke="var(--color-accent)" strokeWidth="1.5" className="gateway-link" />
      <Link d="M191 30.5L181.809 47.2107C178.997 52.3235 173.625 55.5 167.79 55.5H151.219" color={LINK_COLORS[0]} />
      <Link d="M240 40L227.754 53.326C224.724 56.6234 220.451 58.5 215.973 58.5H151.5" color={LINK_COLORS[1]} delay={0.3} />
      <Link d="M240 80L227.754 66.674C224.724 63.3766 220.451 61.5 215.973 61.5H151.5" color={LINK_COLORS[3]} delay={0.6} />
      <Link d="M191 89.5L181.809 72.7893C178.997 67.6765 173.625 64.5 167.79 64.5H151.219" color={LINK_COLORS[2]} delay={0.9} />
      <Hub cx={132} cy={60} text={hub} />
      <Bubble x={180} y={4} text={a} />
      <Bubble x={226} y={20} text={b} />
      <Bubble x={226} y={68} text={c} />
      <Bubble x={180} y={84} text={d} />
    </Svg>
  );
}

/** Three sources at the top converge into one hub below. */
export function GatewayOverhead({ hub, nodes, label, ...props }: GatewayProps) {
  const [a = "", b = "", c = ""] = nodes;

  return (
    <Svg label={label} {...props}>
      <g opacity="0.4" stroke="var(--color-line)">
        {[-10, 74, 158, 242].map((x) => (
          <rect key={x} x={x} y="16" width="32" height="32" rx="6" />
        ))}
        {[22, 64, 106, 148, 190, 232].map((x) => (
          <rect key={x} x={x - 32} y="-24" width="32" height="32" rx="6" transform={`rotate(90 ${x} -24)`} />
        ))}
      </g>
      <path d="M132 100V120" stroke="var(--color-line-bright)" />
      <Link d="M48 49C48 55.1998 53.026 60.2258 59.2258 60.2258H120C126.627 60.2258 132 65.5984 132 72.2258V73" color={LINK_COLORS[0]} />
      <Link d="M132 48.5L132 75" color={LINK_COLORS[3]} delay={0.4} />
      <Link d="M216 49C216 55.1998 210.974 60.2258 204.774 60.2258H144C137.373 60.2258 132 65.5984 132 72.2258V73" color={LINK_COLORS[2]} delay={0.8} />
      <Bubble x={32} y={16} text={a} round={false} />
      <Bubble x={116} y={16} text={b} round={false} />
      <Bubble x={200} y={16} text={c} round={false} />
      <Hub cx={132} cy={88} text={hub} r={18} />
    </Svg>
  );
}

/** A hub inside a ring, three nodes riding the ring. */
export function GatewayRouting({ hub, nodes, label, ...props }: GatewayProps) {
  const [a = "", b = "", c = ""] = nodes;

  return (
    <Svg label={label} {...props}>
      <circle cx="132" cy="65" r="47" stroke="var(--color-line)" />
      <Link d="M132 18C157.957 18 179 39.0426 179 65C179 73.5607 176.711 81.5869 172.712 88.5" color={LINK_COLORS[0]} />
      <Link d="M91.5811 89C99.7763 102.772 114.81 112 132 112C148.77 112 163.489 103.217 171.807 90" color={LINK_COLORS[2]} delay={0.4} />
      <Link d="M132 18C106.043 18 85 39.0426 85 65C85 71.3762 86.2697 77.4559 88.5701 83" color={LINK_COLORS[3]} delay={0.8} />
      <Hub cx={132} cy={65} text={hub} />
      <Bubble x={116} y={4} text={a} />
      <Bubble x={155} y={74} text={b} />
      <Bubble x={76} y={73} text={c} />
    </Svg>
  );
}
