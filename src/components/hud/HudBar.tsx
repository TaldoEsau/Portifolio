"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LiveBadge } from "@/components/hud/LiveBadge";
import { LocaleToggle } from "@/components/hud/LocaleToggle";
import { ProgressChip } from "@/components/hud/ProgressChip";
import { ChooseAgain } from "@/components/side/ChooseAgain";
import { SideSwitch } from "@/components/side/SideSwitch";
import { SoundToggle } from "@/components/hud/SoundToggle";
import { useCopy } from "@/hooks/useCopy";
import { sceneById } from "@/lib/scenes";
import { useStage } from "@/store/stage";

export function HudBar() {
  const copy = useCopy();
  const scene = useStage((state) => state.scene);
  const setChatOpen = useStage((state) => state.setChatOpen);
  const chatOpen = useStage((state) => state.chatOpen);
  const [uptime, setUptime] = useState("00:00:00");
  const meta = sceneById(scene);

  useEffect(() => {
    const started = Date.now();
    const tick = () => {
      if (document.hidden) return;
      const elapsed = Math.floor((Date.now() - started) / 1000);
      const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const seconds = String(elapsed % 60).padStart(2, "0");
      setUptime(`${hours}:${minutes}:${seconds}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="z-20 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b border-line bg-surface px-2 sm:px-3 py-1">
      <div className="flex items-center gap-x-2 sm:gap-x-3 overflow-hidden">
        <LiveBadge />
        <p className="hidden font-mono text-xs text-muted sm:inline">
          {copy.hud.uptime} {uptime}
        </p>
        <p className="hidden font-mono text-xs text-muted md:inline">
          {`${meta.coords} // ${copy.deck.sectors[scene].code}`}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-0.5 sm:gap-x-1">
        <ProgressChip />
        <button
          type="button"
          className="min-h-11 cursor-pointer px-1.5 sm:px-2 font-mono text-xs"
          aria-expanded={chatOpen}
          aria-label={copy.a11y.comms}
          onClick={() => setChatOpen(!chatOpen)}
        >
          {copy.hud.comms}
        </button>
        <ChooseAgain />
        <SideSwitch />
        <SoundToggle />
        <LocaleToggle />
        <Link
          href="/direto"
          className="inline-flex min-h-11 items-center px-1.5 sm:px-2 font-mono text-xs text-hologram"
        >
          <span className="hidden sm:inline">[{copy.hud.direct}]</span>
          <span className="inline sm:hidden">[CV]</span>
        </Link>
      </div>
    </header>
  );
}
