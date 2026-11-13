"use client";

import { Moon, Sun } from "lucide-react";
import { useSide } from "@/components/side/SideProvider";
import { useCopy } from "@/hooks/useCopy";

export function SideSwitch() {
  const copy = useCopy();
  const { side, toggle } = useSide();
  const current = side === "light" ? copy.side.light : copy.side.dark;
  const Icon = side === "light" ? Sun : Moon;

  return (
    <button
      type="button"
      className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 px-2 font-mono text-xs text-accent"
      aria-label={copy.side.switchLabel.replace("{side}", current)}
      title={side === "light" ? copy.side.switchToDark : copy.side.switchToLight}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        void toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {current}
    </button>
  );
}
