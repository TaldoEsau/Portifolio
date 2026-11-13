"use client";

import { Fragment, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationType =
  | "fadeIn"
  | "fadeInUp"
  | "popIn"
  | "shiftInUp"
  | "rollIn"
  | "whipIn"
  | "whipInUp"
  | "calmInUp";

const animationVariants: Record<AnimationType, { container: Variants; child: Variants }> = {
  fadeIn: {
    container: {
      hidden: { opacity: 0 },
      visible: (i: number = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: i * 0.3 },
      }),
    },
    child: {
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 12, stiffness: 100 },
      },
      hidden: { opacity: 0, y: 10 },
    },
  },
  fadeInUp: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
      },
    },
    child: {
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      hidden: { opacity: 0, y: 20 },
    },
  },
  popIn: {
    container: {
      hidden: { scale: 0 },
      visible: {
        scale: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.2 },
      },
    },
    child: {
      visible: {
        opacity: 1,
        scale: 1.1,
        transition: { type: "spring", damping: 15, stiffness: 400 },
      },
      hidden: { opacity: 0, scale: 0 },
    },
  },
  calmInUp: {
    container: {
      hidden: {},
      visible: (i: number = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i },
      }),
    },
    child: {
      hidden: {
        y: "200%",
        transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.85 },
      },
      visible: {
        y: 0,
        transition: { ease: [0.125, 0.92, 0.69, 0.975], duration: 0.75 },
      },
    },
  },
  shiftInUp: {
    container: {
      hidden: {},
      visible: (i: number = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i },
      }),
    },
    child: {
      hidden: {
        y: "100%",
        transition: { ease: [0.75, 0, 0.25, 1], duration: 0.6 },
      },
      visible: {
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      },
    },
  },
  whipInUp: {
    container: {
      hidden: {},
      visible: (i: number = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i },
      }),
    },
    child: {
      hidden: {
        y: "200%",
        transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.45 },
      },
      visible: {
        y: 0,
        transition: { ease: [0.5, -0.15, 0.25, 1.05], duration: 0.75 },
      },
    },
  },
  rollIn: {
    container: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.025 } },
    },
    child: {
      hidden: { opacity: 0, y: "0.25em" },
      visible: {
        opacity: 1,
        y: "0em",
        transition: { duration: 0.65, ease: [0.65, 0, 0.75, 1] },
      },
    },
  },
  whipIn: {
    container: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.025 } },
    },
    child: {
      hidden: { opacity: 0, y: "0.35em" },
      visible: {
        opacity: 1,
        y: "0em",
        transition: { duration: 0.45, ease: [0.85, 0.1, 0.9, 1.2] },
      },
    },
  },
};

type Props = {
  text: string;
  type?: AnimationType;
  as?: "h2" | "h3" | "p" | "span";
  id?: string;
  className?: string;
};

/**
 * Letter-by-letter reveal from Cult UI. The accessible name comes from
 * aria-label, so `aria-labelledby` pointing here reads the plain string once
 * instead of the per-letter spans. The reveal
 * replays whenever the element re-enters the viewport (sector panels toggle
 * `hidden`, so this also fires on every sector visit).
 */
export function TextAnimate({ text, type = "whipInUp", as = "h2", id, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const { container, child } = animationVariants[type];
  const Tag = as as "h2";

  return (
    <Tag ref={ref} id={id} aria-label={text} className={cn("text-animate", className)}>
      <motion.span
        aria-hidden="true"
        className="inline"
        variants={container}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {text.split(" ").map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            {wordIndex > 0 ? " " : null}
            <span className="text-animate-word">
              {Array.from(word).map((letter, index) => (
                <motion.span key={index} variants={child} className="inline-block">
                  {letter}
                </motion.span>
              ))}
            </span>
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
