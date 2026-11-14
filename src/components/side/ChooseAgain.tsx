"use client";

import { Sparkles } from "lucide-react";
import { useSide } from "@/components/side/SideProvider";
import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";

export function ChooseAgain({
  className,
  showIcon = true,
}: {
  className?: string;
  showIcon?: boolean;
}) {
  const copy = useCopy();
  const { reopenGate } = useSide();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-1 px-1.5 sm:px-2 font-mono text-xs text-accent transition-colors hover:text-ink hover:underline underline-offset-4",
        className,
      )}
      onClick={reopenGate}
      title={copy.side.chooseAgain}
      aria-label={copy.side.chooseAgain}
    >
      {showIcon ? <Sparkles aria-hidden="true" className="size-3.5 shrink-0" /> : null}
      <span className="hidden sm:inline">{copy.side.chooseAgain}</span>
      <span className="inline sm:hidden">Lado</span>
    </button>
  );
}
