import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TacticalButton({
  children,
  className,
  spark = false,
  tone = "accent",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  spark?: boolean;
  tone?: "accent" | "ghost";
}) {
  return (
    <button
      type="button"
      data-spark={spark ? "" : undefined}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center px-4 font-mono text-sm tracking-wide",
        tone === "accent"
          ? "bg-accent text-on-accent"
          : "border border-line-bright bg-surface-2 text-text",
        className,
      )}
      {...props}
    >
      <span className={tone === "accent" ? "chamfer-sm bg-accent px-1" : undefined}>
        {children as ReactNode}
      </span>
    </button>
  );
}
