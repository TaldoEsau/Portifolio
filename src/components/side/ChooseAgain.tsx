"use client";

import { useSide } from "@/components/side/SideProvider";
import { useCopy } from "@/hooks/useCopy";

export function ChooseAgain({ className }: { className?: string }) {
  const copy = useCopy();
  const { reopenGate } = useSide();

  return (
    <button type="button" className={`cursor-pointer underline-offset-4 hover:underline ${className ?? ""}`} onClick={reopenGate}>
      {copy.side.chooseAgain}
    </button>
  );
}
