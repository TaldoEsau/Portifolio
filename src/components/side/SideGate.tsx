"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import { useSide } from "@/components/side/SideProvider";
import { useCopy } from "@/hooks/useCopy";
import type { Side, SideOrigin } from "@/lib/side";
import { playClick, playIgnition } from "@/lib/sound";
import { useStage } from "@/store/stage";

type Phase = "idle" | "expand" | "ignite";

const EXPAND_MS = 250;
const IGNITE_MS = 500;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function SideGate() {
  const copy = useCopy();
  const { gateOpen, choose } = useSide();
  const boot = useStage((state) => state.boot);
  const sound = useStage((state) => state.soundEnabled);
  const setSound = useStage((state) => state.setSound);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLButtonElement>(null);
  const darkRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<Side | null>(null);
  const [chosen, setChosen] = useState<Side | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [tip, setTip] = useState<SideOrigin | null>(null);

  useEffect(() => {
    if (!gateOpen) return;
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    (prefersLight ? lightRef : darkRef).current?.focus({ preventScroll: true });
  }, [gateOpen]);

  const pick = async (side: Side, origin: SideOrigin) => {
    if (chosen) return;
    setChosen(side);
    boot();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      setPhase("expand");
      await wait(EXPAND_MS);
      setTip(origin);
      setPhase("ignite");
      if (sound) playIgnition();
      await wait(IGNITE_MS);
    }
    await choose(side, origin);
  };

  const pickFrom = (side: Side, target: HTMLElement, point?: { x: number; y: number }) => {
    const rect = target.getBoundingClientRect();
    void pick(side, point ?? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      lightRef.current?.focus();
      setActive("light");
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      darkRef.current?.focus();
      setActive("dark");
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]"),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const bladeStyle = tip
    ? ({ "--tip-x": `${tip.x}px`, "--tip-y": `${tip.y}px` } as CSSProperties)
    : undefined;

  return (
    <div
      ref={dialogRef}
      className="side-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="side-gate-title"
      aria-describedby="side-gate-hint"
      data-active={active ?? undefined}
      data-chosen={chosen ?? undefined}
      data-phase={phase}
      onKeyDown={onKeyDown}
    >
      <header className="side-gate-bar">
        <h1 id="side-gate-title" className="side-gate-title">
          {copy.side.gateTitle}
        </h1>
        <p id="side-gate-hint" className="side-gate-hint">
          {copy.side.gateHint}
        </p>
      </header>
      <div className="side-gate-panes">
        {(["light", "dark"] as const).map((side, index) => (
          <div key={side} className="contents">
            {index === 1 ? <span className="side-gate-split" aria-hidden="true" /> : null}
            <button
              ref={side === "light" ? lightRef : darkRef}
              type="button"
              className={`side-gate-pane side-gate-${side}`}
              disabled={chosen !== null}
              onMouseEnter={() => setActive(side)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(side)}
              onClick={(event) => {
                const point = event.detail > 0 ? { x: event.clientX, y: event.clientY } : undefined;
                pickFrom(side, event.currentTarget, point);
              }}
            >
              <span className="side-gate-name">
                {side === "light" ? copy.side.lightName : copy.side.darkName}
              </span>
              <span className="side-gate-tagline">
                {side === "light" ? copy.side.lightTagline : copy.side.darkTagline}
              </span>
            </button>
          </div>
        ))}
      </div>
      <footer className="side-gate-bar side-gate-footer">
        <p>{copy.side.footnote}</p>
        <button
          type="button"
          className="side-gate-link"
          disabled={chosen !== null}
          onClick={(event) => pickFrom("dark", event.currentTarget)}
        >
          {copy.side.skip}
        </button>
        <Link href="/direto" className="side-gate-link">
          {copy.side.direct}
        </Link>
        <button
          type="button"
          className="side-gate-link"
          aria-pressed={sound}
          onClick={() => {
            const next = !sound;
            setSound(next);
            if (next) playClick();
          }}
        >
          {sound ? copy.side.soundOn : copy.side.soundOff}
        </button>
      </footer>
      {phase === "ignite" ? (
        <span className="side-gate-blade" style={bladeStyle} aria-hidden="true" />
      ) : null}
    </div>
  );
}
