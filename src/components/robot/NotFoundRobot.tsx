"use client";

import { Robot } from "@/components/robot/Robot";
import { useSide } from "@/components/side/SideProvider";
import { pt } from "@/content/pt";
import { useStage } from "@/store/stage";

export function NotFoundRobot() {
  const { side } = useSide();
  const reduced = useStage((state) => state.reducedMotion);

  return (
    <div className="flex items-end gap-3">
      <Robot side={side} live={!reduced} className="h-[72px] w-16 shrink-0" />
      <p className={`robot-bubble robot-bubble-${side} robot-bubble-static text-sm`}>
        {pt.robot[side].notFound}
      </p>
    </div>
  );
}
