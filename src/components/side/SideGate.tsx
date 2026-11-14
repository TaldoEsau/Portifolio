"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import { Robot } from "@/components/robot/Robot";
import { useSide } from "@/components/side/SideProvider";
import { useCopy } from "@/hooks/useCopy";
import { readSide, type Side, type SideOrigin } from "@/lib/side";
import { playClick, playIgnition, playRobot } from "@/lib/sound";
import { cn } from "@/lib/utils";
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
  const booted = useStage((state) => state.booted);
  const sound = useStage((state) => state.soundEnabled);
  const setSound = useStage((state) => state.setSound);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLButtonElement>(null);
  const darkRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<Side | null>(null);
  const [chosen, setChosen] = useState<Side | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [tip, setTip] = useState<SideOrigin | null>(null);

  const [tauntIndex, setTauntIndex] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState<"light" | "dark" | null>("light");
  const [victoryQuotes, setVictoryQuotes] = useState<{ light: string; dark: string } | null>(null);

  useEffect(() => {
    const list = copy.side.gateTaunts;
    if (list && list.length > 0) {
      setTauntIndex(Math.floor(Math.random() * list.length));
    }
  }, [copy.side.gateTaunts]);

  useEffect(() => {
    if (!gateOpen) return;
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    (prefersLight ? lightRef : darkRef).current?.focus({ preventScroll: true });
  }, [gateOpen]);

  // Alterna as falas entre o robô da Luz e o robô da Sombra enquanto a pessoa escolhe
  useEffect(() => {
    if (!gateOpen || chosen !== null) return;
    const taunts = copy.side.gateTaunts;
    if (!taunts || taunts.length === 0) return;

    if (sound && activeSpeaker) {
      playRobot(activeSpeaker);
    }

    const timer = window.setTimeout(() => {
      setActiveSpeaker((prev) => {
        if (prev === "light") {
          return "dark";
        }
        setTauntIndex((idx) => (idx + 1) % taunts.length);
        return "light";
      });
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [activeSpeaker, chosen, copy.side.gateTaunts, gateOpen, sound]);

  const pick = async (side: Side, origin: SideOrigin) => {
    if (chosen) return;
    setChosen(side);
    boot();

    // Seleciona frases aleatórias de zombação do vencedor e indignação do perdedor
    const victoryPool = copy.side.victoryTaunts[side];
    const winnerList = victoryPool.winner;
    const loserList = victoryPool.loser;
    const winnerText = winnerList[Math.floor(Math.random() * winnerList.length)] ?? "";
    const loserText = loserList[Math.floor(Math.random() * loserList.length)] ?? "";

    if (side === "light") {
      setVictoryQuotes({ light: winnerText, dark: loserText });
    } else {
      setVictoryQuotes({ light: loserText, dark: winnerText });
    }
    setActiveSpeaker(side);

    if (sound) {
      playRobot(side);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Tempo para ver o robô comemorar e fazer a zombação antes da ignição
    await wait(reduced ? 600 : 1800);

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
    if (event.key === "Escape" && booted) {
      event.preventDefault();
      void choose(readSide());
      return;
    }
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

  const currentTaunt =
    copy.side.gateTaunts && copy.side.gateTaunts.length > 0
      ? copy.side.gateTaunts[tauntIndex % copy.side.gateTaunts.length]
      : null;

  const speechLight = chosen
    ? victoryQuotes?.light
    : activeSpeaker === "light"
      ? currentTaunt?.light
      : "";
  const speechDark = chosen
    ? victoryQuotes?.dark
    : activeSpeaker === "dark"
      ? currentTaunt?.dark
      : "";

  const robotStateLight = chosen
    ? chosen === "light"
      ? "celebrating"
      : "sleeping"
    : activeSpeaker === "light"
      ? "speaking"
      : "idle";

  const robotStateDark = chosen
    ? chosen === "dark"
      ? "celebrating"
      : "sleeping"
    : activeSpeaker === "dark"
      ? "speaking"
      : "idle";

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
        {(["light", "dark"] as const).map((side, index) => {
          const isLight = side === "light";
          const speech = isLight ? speechLight : speechDark;
          const robotState = isLight ? robotStateLight : robotStateDark;
          const gazeTarget =
            typeof window !== "undefined"
              ? {
                  x: isLight ? window.innerWidth * 0.75 : window.innerWidth * 0.25,
                  y: window.innerHeight * 0.45,
                }
              : null;
          const isWinner = chosen === side;
          const isLoser = chosen !== null && chosen !== side;

          return (
            <div key={side} className="contents">
              {index === 1 ? <span className="side-gate-split" aria-hidden="true" /> : null}
              <button
                ref={isLight ? lightRef : darkRef}
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
                {/* Droid & Speech Container */}
                <div
                  className={cn(
                    "side-gate-droid-box pointer-events-none mb-3 flex flex-col items-center",
                    isWinner && "is-winner",
                    isLoser && "is-loser",
                  )}
                >
                  <div
                    className={cn(
                      "side-gate-bubble pointer-events-auto",
                      `side-gate-bubble-${side}`,
                      speech ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
                      isWinner && "side-gate-bubble-victory",
                    )}
                  >
                    <span className="side-gate-bubble-name block font-mono text-[0.625rem] tracking-wider uppercase">
                      {isLight ? copy.robot.nameLight : copy.robot.nameDark}
                    </span>
                    <p className="mt-1 text-xs md:text-sm font-medium leading-relaxed">
                      {speech}
                    </p>
                  </div>

                  <div
                    className="side-gate-robot-wrapper relative mt-2"
                    style={{ width: 68, height: 76 }}
                  >
                    <Robot
                      side={side}
                      state={robotState}
                      facing={isLight ? 1 : -1}
                      attentive={active === side}
                      gazeTarget={gazeTarget}
                      live
                    />
                    <span className="robot-shadow" aria-hidden="true" />
                  </div>
                </div>

                <span className="side-gate-name">
                  {isLight ? copy.side.lightName : copy.side.darkName}
                </span>
                <span className="side-gate-tagline">
                  {isLight ? copy.side.lightTagline : copy.side.darkTagline}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <footer className="side-gate-bar side-gate-footer">
        <p>{copy.side.footnote}</p>
        {booted ? (
          <button
            type="button"
            className="side-gate-link"
            disabled={chosen !== null}
            onClick={() => void choose(readSide())}
          >
            {copy.side.backToSite}
          </button>
        ) : null}

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
