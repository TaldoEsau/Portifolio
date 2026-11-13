"use client";

import React, { createContext, useContext, useEffect, useId, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";

const springConfig = { stiffness: 200, damping: 20, bounce: 0.2 };

type EaseType = "easeInOut" | "easeIn" | "easeOut" | "linear" | [number, number, number, number];

type ExpandableContextType = {
  isExpanded: boolean;
  toggleExpand: () => void;
  transitionDuration: number;
  easeType: EaseType;
  contentId: string;
};

const ExpandableContext = createContext<ExpandableContextType>({
  isExpanded: false,
  toggleExpand: () => {},
  transitionDuration: 0.3,
  easeType: "easeInOut",
  contentId: "",
});

export const useExpandable = () => useContext(ExpandableContext);

type ExpandableProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode | ((props: { isExpanded: boolean }) => ReactNode);
  expanded?: boolean;
  onToggle?: () => void;
  transitionDuration?: number;
  easeType?: EaseType;
  onExpandStart?: () => void;
  onCollapseStart?: () => void;
};

export const Expandable = React.forwardRef<HTMLDivElement, ExpandableProps>(
  (
    {
      children,
      expanded,
      onToggle,
      transitionDuration = 0.3,
      easeType = "easeInOut",
      onExpandStart,
      onCollapseStart,
      ...props
    },
    ref,
  ) => {
    const [isExpandedInternal, setIsExpandedInternal] = useState(false);
    const isExpanded = expanded !== undefined ? expanded : isExpandedInternal;
    const toggleExpand = onToggle || (() => setIsExpandedInternal((prev) => !prev));
    const contentId = useId();

    useEffect(() => {
      if (isExpanded) onExpandStart?.();
      else onCollapseStart?.();
    }, [isExpanded, onExpandStart, onCollapseStart]);

    return (
      <ExpandableContext.Provider
        value={{ isExpanded, toggleExpand, transitionDuration, easeType, contentId }}
      >
        <motion.div
          ref={ref}
          initial={false}
          transition={{ duration: transitionDuration, ease: easeType }}
          {...props}
        >
          {typeof children === "function" ? children({ isExpanded }) : children}
        </motion.div>
      </ExpandableContext.Provider>
    );
  },
);
Expandable.displayName = "Expandable";

type AnimationPreset = {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  exit: Record<string, number | string>;
};

const ANIMATION_PRESETS = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  "blur-sm": {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
  },
  "blur-md": {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
  },
} satisfies Record<string, AnimationPreset>;

type ExpandableContentProps = Omit<HTMLMotionProps<"div">, "ref" | "children"> & {
  children: ReactNode;
  preset?: keyof typeof ANIMATION_PRESETS;
  stagger?: boolean;
  staggerChildren?: number;
};

/** Wrap the part of the card that stays hidden until the trigger opens it. */
export const ExpandableContent = React.forwardRef<HTMLDivElement, ExpandableContentProps>(
  ({ children, preset, stagger = false, staggerChildren = 0.1, ...props }, ref) => {
    const { isExpanded, transitionDuration, easeType, contentId } = useExpandable();
    const reduced = useReducedMotion();
    const [measureRef, { height: measuredHeight }] = useMeasure();
    const animatedHeight = useMotionValue(0);
    const smoothHeight = useSpring(animatedHeight, springConfig);

    useEffect(() => {
      animatedHeight.set(isExpanded ? measuredHeight : 0);
    }, [isExpanded, measuredHeight, animatedHeight]);

    const animation = preset ? ANIMATION_PRESETS[preset] : { initial: {}, animate: {}, exit: {} };

    return (
      <motion.div
        ref={ref}
        id={contentId}
        style={{
          height: reduced ? (isExpanded ? "auto" : 0) : smoothHeight,
          overflow: "hidden",
        }}
        transition={{ duration: transitionDuration, ease: easeType }}
        {...props}
      >
        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              ref={measureRef}
              initial={animation.initial}
              animate={animation.animate}
              exit={animation.exit}
              transition={{ duration: transitionDuration, ease: easeType }}
            >
              {stagger ? (
                <motion.div
                  variants={{ hidden: {}, visible: { transition: { staggerChildren } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {React.Children.map(children, (child, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      {child}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                children
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    );
  },
);
ExpandableContent.displayName = "ExpandableContent";

/** A real button so keyboard and screen readers get the expanded state. */
export const ExpandableTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, onClick, ...props }, ref) => {
  const { isExpanded, toggleExpand, contentId } = useExpandable();

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={isExpanded}
      aria-controls={contentId}
      onClick={(event) => {
        onClick?.(event);
        toggleExpand();
      }}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  );
});
ExpandableTrigger.displayName = "ExpandableTrigger";
