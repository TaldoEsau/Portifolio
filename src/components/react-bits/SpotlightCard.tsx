"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("spotlight", className)}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--sx",
          `${event.clientX - bounds.left}px`,
        );
        event.currentTarget.style.setProperty(
          "--sy",
          `${event.clientY - bounds.top}px`,
        );
      }}
    >
      {children}
    </div>
  );
}
