"use client";

import { useId, useRef, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useSmilPause } from "@/hooks/useSmilPause";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 24 };

const cardStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardFadeUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: spring },
};

const TONES = {
  hologram: { glow: "color-mix(in srgb, var(--hologram) 15%, transparent)", text: "text-hologram" },
  telemetry: { glow: "color-mix(in srgb, var(--accent-2) 15%, transparent)", text: "text-telemetry" },
  accent: { glow: "color-mix(in srgb, var(--accent) 15%, transparent)", text: "text-accent" },
} as const;

export type CircuitCard = {
  name: string;
  description: string;
  icon: ReactNode;
  tone: keyof typeof TONES;
};

/** Cult UI circuit board: traces feed a chip, the chip feeds three cards. */
export function CircuitBoard({
  label,
  cards,
  className,
}: {
  label: string;
  cards: [CircuitCard, CircuitCard, CircuitCard];
  className?: string;
}) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  useSmilPause(svgRef);

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative w-full max-w-[891px]">
        <svg
          aria-hidden="true"
          ref={svgRef}
          className="h-auto w-full overflow-visible"
          fill="none"
          height="264"
          viewBox="0 0 891 264"
          width="891"
        >
          <defs>
            {/* Orange Pulse Gradients */}
            <linearGradient
              id={`${id}-orange-pulse-1`}
              x1="0%"
              x2="100%"
              y1="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="color-mix(in srgb, var(--accent) 0%, transparent)" />
              <stop offset="50%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 0%, transparent)" />
              <animateTransform
                attributeName="gradientTransform"
                dur="2s"
                from="-1 0"
                repeatCount="indefinite"
                to="1 0"
                type="translate"
              />
            </linearGradient>

            <linearGradient
              id={`${id}-orange-pulse-2`}
              x1="0%"
              x2="100%"
              y1="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="color-mix(in srgb, var(--accent) 0%, transparent)" />
              <stop offset="50%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 0%, transparent)" />
              <animateTransform
                attributeName="gradientTransform"
                dur="2.5s"
                from="-1 0"
                repeatCount="indefinite"
                to="1 0"
                type="translate"
              />
            </linearGradient>

            {/* Blue Pulse Gradients */}
            <linearGradient
              id={`${id}-blue-pulse-1`}
              x1="0%"
              x2="100%"
              y1="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="color-mix(in srgb, var(--hologram) 0%, transparent)" />
              <stop offset="50%" stopColor="var(--hologram)" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--hologram) 0%, transparent)" />
              <animateTransform
                attributeName="gradientTransform"
                dur="2s"
                from="-1 0"
                repeatCount="indefinite"
                to="1 0"
                type="translate"
              />
            </linearGradient>

            <linearGradient
              id={`${id}-blue-pulse-2`}
              x1="0%"
              x2="100%"
              y1="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="color-mix(in srgb, var(--hologram) 0%, transparent)" />
              <stop offset="50%" stopColor="var(--hologram)" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--hologram) 0%, transparent)" />
              <animateTransform
                attributeName="gradientTransform"
                dur="1.8s"
                from="-1 0"
                repeatCount="indefinite"
                to="1 0"
                type="translate"
              />
            </linearGradient>

            {/* Pink Pulse Gradient */}
            <linearGradient
              id={`${id}-pink-pulse`}
              x1="0%"
              x2="0%"
              y1="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="color-mix(in srgb, var(--accent-2) 0%, transparent)" />
              <stop offset="50%" stopColor="var(--accent-2)" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--accent-2) 0%, transparent)" />
              <animateTransform
                attributeName="gradientTransform"
                dur="2s"
                from="0 -1"
                repeatCount="indefinite"
                to="0 1"
                type="translate"
              />
            </linearGradient>

            {/* Connector pulse gradients (vertical direction) */}
            <linearGradient
              id={`${id}-blue-conn`}
              x1="0%"
              x2="0%"
              y1="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="color-mix(in srgb, var(--hologram) 0%, transparent)" />
              <stop offset="50%" stopColor="color-mix(in srgb, var(--hologram) 80%, transparent)" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--hologram) 0%, transparent)" />
              <animateTransform
                attributeName="gradientTransform"
                dur="2s"
                from="0 -1"
                repeatCount="indefinite"
                to="0 1"
                type="translate"
              />
            </linearGradient>
            <linearGradient
              id={`${id}-orange-conn`}
              x1="0%"
              x2="0%"
              y1="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="color-mix(in srgb, var(--accent) 0%, transparent)" />
              <stop offset="50%" stopColor="color-mix(in srgb, var(--accent) 80%, transparent)" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 0%, transparent)" />
              <animateTransform
                attributeName="gradientTransform"
                dur="2s"
                from="0 -1"
                repeatCount="indefinite"
                to="0 1"
                type="translate"
              />
            </linearGradient>
            <linearGradient
              id={`${id}-mixed-conn`}
              x1="0%"
              x2="0%"
              y1="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="color-mix(in srgb, var(--accent-2) 0%, transparent)" />
              <stop offset="50%" stopColor="color-mix(in srgb, var(--accent-2) 60%, transparent)" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--accent-2) 0%, transparent)" />
              <animateTransform
                attributeName="gradientTransform"
                dur="2.2s"
                from="0 -1"
                repeatCount="indefinite"
                to="0 1"
                type="translate"
              />
            </linearGradient>

            {/* Chip ambient halo */}
            <radialGradient id={`${id}-halo`}>
              <stop offset="0%" stopColor="color-mix(in srgb, var(--accent) 5%, transparent)" />
              <stop offset="40%" stopColor="color-mix(in srgb, var(--hologram) 2.5%, transparent)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Static background lines */}
          <g
            className="stroke-line"
            strokeLinecap="round"
          >
            <path d="M388 96L388 68C388 65.7909 386.209 64 384 64L310 64" />
            <path d="M349 150L73 150C70.7909 150 69 151.791 69 154L69 174" />
            <path d="M574 96L574 4C574 1.79086 575.791 0 578 0L751 0" />
            <path d="M506 96L506 62C506 59.7909 507.791 58 510 58L579 58" />
            <path d="M388 96L388 44C388 41.7909 389.791 40 392 40L509 40C511.209 40 513 38.2091 513 36L513 0" />
            <path d="M547 110L822 110C824.209 110 826 108.209 826 106L826 0" />
            <path d="M349 110L67 110C64.7909 110 63 108.209 63 106L63 0" />
            <path d="M547 150L697 150C699.209 150 701 148.209 701 146L701 0" />
            <path d="M349 150L199 150C196.791 150 195 148.209 195 146L195 0" />
          </g>

          {/* Endpoint dots on visible static path terminals */}
          <g className="fill-line-bright">
            <circle cx="310" cy="64" r="2.5" />
            <circle cx="69" cy="174" r="2.5" />
            <circle cx="579" cy="58" r="2.5" />
          </g>

          {/* Orange animated line - right side */}
          <g>
            <path
              className="stroke-line"
              d="M547 130L822 130C824.209 130 826 131.791 826 134L826 264"
              strokeLinecap="round"
            />
            <path
              d="M547 130L822 130C824.209 130 826 131.791 826 134L826 264"
              opacity="0.3"
              stroke={`url(#${id}-orange-pulse-1)`}
              strokeWidth="6"
            />
            <path
              d="M547 130L822 130C824.209 130 826 131.791 826 134L826 264"
              stroke={`url(#${id}-orange-pulse-1)`}
              strokeWidth="2"
            />
            <circle fill="#ff9f1c" r="2.5">
              <animateMotion
                dur="3s"
                path="M547 130L822 130C824.209 130 826 131.791 826 134L826 264"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                dur="3s"
                keyTimes="0;0.1;0.9;1"
                repeatCount="indefinite"
                values="0;0.9;0.9;0"
              />
            </circle>
          </g>

          {/* Blue animated line - left side */}
          <g>
            <path
              className="stroke-line"
              d="M349 130L5.00002 130C2.79088 130 1.00001 131.791 1.00001 134L1.00001 264"
              strokeLinecap="round"
            />
            <path
              d="M349 130L5.00002 130C2.79088 130 1.00001 131.791 1.00001 134L1.00001 264"
              opacity="0.3"
              stroke={`url(#${id}-blue-pulse-1)`}
              strokeLinecap="round"
              strokeWidth="6"
            />
            <path
              d="M349 130L5.00002 130C2.79088 130 1.00001 131.791 1.00001 134L1.00001 264"
              stroke={`url(#${id}-blue-pulse-1)`}
              strokeLinecap="round"
              strokeWidth="2"
            />
            <circle fill="#38bdf8" r="2.5">
              <animateMotion
                dur="3.5s"
                path="M349 130L5.00002 130C2.79088 130 1.00001 131.791 1.00001 134L1.00001 264"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                dur="3.5s"
                keyTimes="0;0.1;0.9;1"
                repeatCount="indefinite"
                values="0;0.9;0.9;0"
              />
            </circle>
          </g>

          {/* Orange animated line - center right */}
          <g>
            <path
              className="stroke-line"
              d="M547 150L633 150C635.209 150 637 151.791 637 154L637 236C637 238.209 635.209 240 633 240L488 240C485.791 240 484 241.791 484 244L484 264"
              strokeLinecap="round"
            />
            <path
              d="M547 150L633 150C635.209 150 637 151.791 637 154L637 236C637 238.209 635.209 240 633 240L488 240C485.791 240 484 241.791 484 244L484 264"
              opacity="0.3"
              stroke={`url(#${id}-orange-pulse-2)`}
              strokeWidth="6"
            />
            <path
              d="M547 150L633 150C635.209 150 637 151.791 637 154L637 236C637 238.209 635.209 240 633 240L488 240C485.791 240 484 241.791 484 244L484 264"
              stroke={`url(#${id}-orange-pulse-2)`}
              strokeWidth="2"
            />
          </g>

          {/* Blue animated line - center left */}
          <g>
            <path
              className="stroke-line"
              d="M349 150L261 150C258.791 150 257 151.791 257 154L257 236C257 238.209 258.791 240 261 240L406 240C408.209 240 410 241.791 410 244L410 264"
              strokeLinecap="round"
            />
            <path
              d="M349 150L261 150C258.791 150 257 151.791 257 154L257 236C257 238.209 258.791 240 261 240L406 240C408.209 240 410 241.791 410 244L410 264"
              opacity="0.3"
              stroke={`url(#${id}-blue-pulse-2)`}
              strokeLinecap="round"
              strokeWidth="6"
            />
            <path
              d="M349 150L261 150C258.791 150 257 151.791 257 154L257 236C257 238.209 258.791 240 261 240L406 240C408.209 240 410 241.791 410 244L410 264"
              stroke={`url(#${id}-blue-pulse-2)`}
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>

          {/* Pink animated line - top */}
          <g>
            <path
              className="stroke-line"
              d="M506 96L506 0"
              strokeLinecap="round"
            />
            <path
              d="M506 96L506 0"
              opacity="0.3"
              stroke={`url(#${id}-pink-pulse)`}
              strokeLinecap="round"
              strokeWidth="6"
            />
            <path
              d="M506 96L506 0"
              stroke={`url(#${id}-pink-pulse)`}
              strokeLinecap="round"
              strokeWidth="2"
            />
            <circle fill="#2ec4b6" r="2">
              <animateMotion
                dur="2.5s"
                path="M506 96L506 0"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                dur="2.5s"
                keyTimes="0;0.1;0.9;1"
                repeatCount="indefinite"
                values="0;0.9;0.9;0"
              />
            </circle>
          </g>

          {/* Chip ambient halo */}
          <ellipse
            cx="448"
            cy="136"
            fill={`url(#${id}-halo)`}
            rx="180"
            ry="90"
          />

          {/* Junction nodes at chip connection points */}
          <g>
            <circle className="fill-accent/60" cx="547" cy="130" r="2.5">
              <animate
                attributeName="opacity"
                dur="2s"
                repeatCount="indefinite"
                values="0.4;1;0.4"
              />
            </circle>
            <circle className="fill-hologram/60" cx="349" cy="130" r="2.5">
              <animate
                attributeName="opacity"
                dur="2.2s"
                repeatCount="indefinite"
                values="0.4;1;0.4"
              />
            </circle>
            <circle className="fill-accent/40" cx="547" cy="150" r="2">
              <animate
                attributeName="opacity"
                dur="2.5s"
                repeatCount="indefinite"
                values="0.3;0.8;0.3"
              />
            </circle>
            <circle className="fill-hologram/40" cx="349" cy="150" r="2">
              <animate
                attributeName="opacity"
                dur="2.3s"
                repeatCount="indefinite"
                values="0.3;0.8;0.3"
              />
            </circle>
            <circle className="fill-telemetry/60" cx="506" cy="96" r="2.5">
              <animate
                attributeName="opacity"
                dur="2s"
                repeatCount="indefinite"
                values="0.4;1;0.4"
              />
            </circle>
          </g>

          {/* Connector paths: traces -> card columns */}
          {/* Blue left -> Card 1 (React) */}
          <g>
            <path
              className="stroke-line"
              d="M1 264 C1 290 60 320 148 320"
              strokeLinecap="round"
            />
            <path
              d="M1 264 C1 290 60 320 148 320"
              opacity="0.2"
              stroke={`url(#${id}-blue-conn)`}
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path
              d="M1 264 C1 290 60 320 148 320"
              stroke={`url(#${id}-blue-conn)`}
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            <circle
              className="fill-line-bright"
              cx="148"
              cy="320"
              r="2.5"
            />
          </g>

          {/* Blue center-left -> Card 2 (Turbopack) */}
          <g>
            <path
              className="stroke-line"
              d="M410 264 C410 290 430 320 445 320"
              strokeLinecap="round"
            />
            <path
              d="M410 264 C410 290 430 320 445 320"
              opacity="0.2"
              stroke={`url(#${id}-mixed-conn)`}
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path
              d="M410 264 C410 290 430 320 445 320"
              stroke={`url(#${id}-mixed-conn)`}
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </g>

          {/* Orange center-right -> Card 2 (Turbopack) */}
          <g>
            <path
              className="stroke-line"
              d="M484 264 C484 290 462 320 445 320"
              strokeLinecap="round"
            />
            <path
              d="M484 264 C484 290 462 320 445 320"
              opacity="0.2"
              stroke={`url(#${id}-mixed-conn)`}
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path
              d="M484 264 C484 290 462 320 445 320"
              stroke={`url(#${id}-mixed-conn)`}
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            <circle
              className="fill-line-bright"
              cx="445"
              cy="320"
              r="2.5"
            />
          </g>

          {/* Orange right -> Card 3 (SWC) */}
          <g>
            <path
              className="stroke-line"
              d="M826 264 C826 290 800 320 748 320"
              strokeLinecap="round"
            />
            <path
              d="M826 264 C826 290 800 320 748 320"
              opacity="0.2"
              stroke={`url(#${id}-orange-conn)`}
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path
              d="M826 264 C826 290 800 320 748 320"
              stroke={`url(#${id}-orange-conn)`}
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            <circle
              className="fill-line-bright"
              cx="748"
              cy="320"
              r="2.5"
            />
          </g>
        </svg>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute flex select-none items-center justify-center"
          style={{ left: "50.3%", top: "51.3%", transform: "translate(-50%, -50%)" }}
        >
          <div className="flex flex-col items-center">
            <Pins count={6} horizontal />
            <div className="flex items-center">
              <Pins count={2} />
              <div className="chamfer-sm relative border border-line-bright bg-surface-2 px-4 py-3 sm:px-6 sm:py-4">
                <span className="relative whitespace-nowrap font-display text-sm leading-none tracking-wide text-accent sm:text-xl md:text-2xl">
                  {label}
                </span>
              </div>
              <Pins count={2} />
            </div>
            <Pins count={6} horizontal />
          </div>
        </div>
      </div>

      <motion.ul
        className="relative z-10 -mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={cardStagger}
      >
        {cards.map((card, index) => (
          <CircuitCardItem key={card.name} card={card} glowDelay={index * 0.8} />
        ))}
      </motion.ul>
    </div>
  );
}

function Pins({ count, horizontal = false }: { count: number; horizontal?: boolean }) {
  return (
    <div className={cn("flex gap-[5px]", horizontal ? "flex-row" : "flex-col")}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "block rounded-[1px] bg-line",
            horizontal ? "h-[6px] w-[7px]" : "h-[7px] w-[6px]",
          )}
        />
      ))}
    </div>
  );
}

function CircuitCardItem({ card, glowDelay }: { card: CircuitCard; glowDelay: number }) {
  const tone = TONES[card.tone];

  return (
    <motion.li
      className="relative flex flex-col overflow-hidden border border-line bg-surface p-5"
      variants={cardFadeUp}
    >
      <div
        aria-hidden="true"
        className="circuit-glow pointer-events-none absolute inset-0"
        style={{
          boxShadow: `0 0 24px 4px ${tone.glow}, inset 0 0 16px 1px ${tone.glow}`,
          animationDelay: `${glowDelay}s`,
        }}
      />
      <div
        aria-hidden="true"
        className="circuit-glow pointer-events-none absolute inset-x-4 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${tone.glow}, transparent)`,
          animationDelay: `${glowDelay}s`,
        }}
      />
      <div aria-hidden="true" className={cn("mb-4 flex h-10 w-10 items-center", tone.text)}>
        {card.icon}
      </div>
      <h3 className="font-mono text-sm text-text">{card.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{card.description}</p>
    </motion.li>
  );
}
