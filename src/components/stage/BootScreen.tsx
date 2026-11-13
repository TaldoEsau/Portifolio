"use client";

import Link from "next/link";
import { Starfield } from "@/components/react-bits/Starfield";
import { AurebeshSeal } from "@/components/ui/AurebeshSeal";
import { useCopy } from "@/hooks/useCopy";
import { playHum } from "@/lib/sound";
import { useStage } from "@/store/stage";

export function BootScreen() {
  const copy = useCopy();
  const boot = useStage((state) => state.boot);
  const sound = useStage((state) => state.soundEnabled);

  return (
    <div className="boot-layer fixed inset-0 z-[70] flex items-center justify-center bg-bg px-4">
      <Starfield />
      <div className="relative z-10 w-full max-w-xl border border-line bg-surface p-6 md:p-8">
        <AurebeshSeal />
        <p className="mt-4 font-mono text-xs text-muted">{copy.boot.kicker}</p>
        <h1 className="display-title mt-3">{copy.boot.title}</h1>
        <p className="mt-3 max-w-[40ch] font-mono text-sm text-muted">
          {copy.boot.subtitle}
        </p>
        <p className="mt-6 font-mono text-xs text-telemetry">{copy.boot.bar}</p>
        <ul className="mt-2 grid gap-1 font-mono text-xs text-muted">
          {copy.boot.logs.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <button
          id="boot-enter"
          type="button"
          data-spark=""
          autoFocus
          className="mt-6 min-h-11 w-full cursor-pointer bg-accent px-4 font-mono text-sm text-on-accent"
          onClick={() => {
            if (sound) playHum();
            boot();
          }}
        >
          {copy.boot.enter}
        </button>
        <Link
          href="/direto"
          className="mt-3 inline-flex min-h-11 items-center font-mono text-sm text-hologram"
        >
          {copy.boot.direct}
        </Link>
        <p className="mt-4 text-sm text-muted">{copy.boot.hint}</p>
      </div>
    </div>
  );
}
