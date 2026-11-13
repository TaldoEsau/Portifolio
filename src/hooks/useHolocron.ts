"use client";

import { copyText } from "@/lib/clipboard";
import { playDroid } from "@/lib/sound";
import { fill } from "@/lib/utils";
import { useStage } from "@/store/stage";
import { useCopy } from "@/hooks/useCopy";

export function useHolocron() {
  const copy = useCopy();
  const scene = useStage((state) => state.scene);
  const soundEnabled = useStage((state) => state.soundEnabled);
  const pushToast = useStage((state) => state.pushToast);
  const pushSignal = useStage((state) => state.pushSignal);
  const grant = useStage((state) => state.grant);
  const flashScan = useStage((state) => state.flashScan);

  return async () => {
    const url = `${window.location.origin}${window.location.pathname}#${scene}`;
    const ok = await copyText(url);
    if (ok) {
      pushToast(copy.alerts.holocronTitle, copy.alerts.holocronBody);
    } else {
      pushToast(
        copy.alerts.copyFailTitle,
        fill(copy.alerts.copyFailBody, { scene }),
      );
    }
    if (grant("holocron")) {
      /* achievement sticks; the toast already confirmed the action */
    }
    pushSignal("holocron", scene);
    flashScan();
    if (soundEnabled) playDroid();
  };
}
