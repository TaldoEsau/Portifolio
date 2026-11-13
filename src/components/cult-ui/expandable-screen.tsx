"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { trapTab } from "@/lib/a11y";
import { cn } from "@/lib/utils";

type ExpandableContextValue = {
  expanded: boolean;
  expand: () => void;
  collapse: () => void;
  layoutId: string;
  labelId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const ExpandableContext = createContext<ExpandableContextValue | null>(null);

export function useExpandableScreen() {
  const value = useContext(ExpandableContext);
  if (!value) throw new Error("ExpandableScreen component outside provider");
  return value;
}

type ExpandableScreenProps = {
  children: ReactNode;
  layoutId?: string;
  triggerRadius?: string;
  contentRadius?: string;
  animationDuration?: number;
  onExpandChange?: (expanded: boolean) => void;
  lockScroll?: boolean;
};

export function ExpandableScreen({
  children,
  layoutId,
  onExpandChange,
  lockScroll = true,
}: ExpandableScreenProps) {
  const reactId = useId();
  const [expanded, setExpanded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const labelId = `${reactId}-title`;

  const expand = () => {
    setExpanded(true);
    onExpandChange?.(true);
  };

  const collapse = () => {
    setExpanded(false);
    onExpandChange?.(false);
  };

  const wasExpanded = useRef(false);
  useEffect(() => {
    if (wasExpanded.current && !expanded) triggerRef.current?.focus();
    wasExpanded.current = expanded;
  }, [expanded]);

  useEffect(() => {
    if (!lockScroll || !expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [expanded, lockScroll]);

  return (
    <ExpandableContext.Provider
      value={{
        expanded,
        expand,
        collapse,
        layoutId: layoutId ?? reactId,
        labelId,
        triggerRef,
      }}
    >
      {children}
    </ExpandableContext.Provider>
  );
}

export function ExpandableScreenTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { expanded, expand, layoutId, triggerRef } = useExpandableScreen();
  if (expanded) return null;
  return (
    <motion.button
      ref={triggerRef}
      layoutId={layoutId}
      type="button"
      className={cn(
        "block w-full cursor-pointer border-0 bg-transparent p-0 text-left",
        className,
      )}
      onClick={expand}
      aria-haspopup="dialog"
      aria-expanded={false}
    >
      {children}
    </motion.button>
  );
}

export function ExpandableScreenContent({
  children,
  className,
  closeLabel,
}: {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeButtonClassName?: string;
  closeLabel: string;
}) {
  const { expanded, collapse, layoutId, labelId } = useExpandableScreen();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    panelRef.current?.querySelector<HTMLElement>("h2")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        collapse();
        return;
      }
      if (panelRef.current) trapTab(event, panelRef.current);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [collapse, expanded]);

  if (!expanded || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] bg-bg/80">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        layoutId={layoutId}
        ref={panelRef}
        className={cn(
          "dossier-screen fixed inset-0 z-[81] flex h-dvh w-screen flex-col overflow-hidden bg-surface",
          className,
        )}
      >
        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-4 md:p-8">
          {children}
        </div>
        <div className="border-t border-line bg-surface p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="min-h-11 w-full cursor-pointer bg-accent px-4 font-mono text-sm text-on-accent md:w-auto"
            onClick={collapse}
          >
            {closeLabel}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
