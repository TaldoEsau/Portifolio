"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Robot } from "@/components/robot/Robot";
import { RobotBubble } from "@/components/robot/RobotBubble";
import { useRobotBrain } from "@/components/robot/useRobotBrain";
import { useSide } from "@/components/side/SideProvider";
import { useCopy } from "@/hooks/useCopy";
import { SCENES, type SceneId } from "@/lib/scenes";
import { playRobot } from "@/lib/sound";
import { cn, fill } from "@/lib/utils";
import { useStage } from "@/store/stage";

const ANCHORS: Record<SceneId, number> = {
  intro: 0.84,
  sobre: 0.16,
  projetos: 0.88,
  stack: 0.12,
  lab: 0.8,
  contato: 0.5,
};

function subscribe(callback: () => void) {
  const main = document.getElementById("conteudo");
  const observer = new ResizeObserver(callback);
  if (main) observer.observe(main);
  window.addEventListener("resize", callback);
  window.addEventListener("scroll", callback, true);
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", callback);
    window.removeEventListener("scroll", callback, true);
  };
}

function snapshot() {
  const main = document.getElementById("conteudo");
  if (!main) return "";
  const bounds = main.getBoundingClientRect();
  const gap = Math.max(0, window.innerHeight - Math.min(bounds.bottom, window.innerHeight));
  const mini = window.innerWidth < 768 ? 1 : 0;
  return `${Math.round(bounds.left)}|${Math.round(bounds.width)}|${Math.round(gap)}|${mini}`;
}

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
  );
}

export function RobotGuide() {
  const copy = useCopy();
  const { side } = useSide();
  const scene = useStage((state) => state.scene);
  const booted = useStage((state) => state.booted);
  const dossierOpen = useStage((state) => state.dossierOpen);
  const reduced = useStage((state) => state.reducedMotion);
  const sound = useStage((state) => state.soundEnabled);
  const muted = useStage((state) => state.guideMuted);
  const setGuideMuted = useStage((state) => state.setGuideMuted);
  const requestScene = useStage((state) => state.requestScene);
  const grant = useStage((state) => state.grant);
  const pushToast = useStage((state) => state.pushToast);
  const bounds = useSyncExternalStore(subscribe, snapshot, () => "");
  const sideLines = copy.robot[side];
  const brain = useRobotBrain({ side, reduced, muted, sound, lines: sideLines });
  const { say, clearSpeech } = brain;
  const [line, setLine] = useState({ scene, index: 0 });
  const [open, setOpen] = useState(true);
  const [watching, setWatching] = useState(false);
  const [attentive, setAttentive] = useState(false);
  const [tour, setTour] = useState<number | null>(null);
  const [pointAt, setPointAt] = useState<{ x: number; y: number } | null>(null);
  const [track, setTrack] = useState({ x: -1, facing: 1, moving: false });

  const [left, width, gap, mini] = bounds ? bounds.split("|").map(Number) : [0, 0, 0, 0];
  const size = mini ? 52 : 64;
  const corner = left + width - size - 12;
  const anchor = watching ? corner : left + width * ANCHORS[scene] - size / 2;
  const target = Math.round(Math.min(Math.max(anchor, left + 12), corner));

  if (line.scene !== scene) {
    setLine({ scene, index: 0 });
    setWatching(false);
    if (!muted) setOpen(true);
    clearSpeech();
  }

  if (bounds && target !== track.x) {
    setTrack({
      x: target,
      facing: track.x < 0 ? track.facing : target < track.x ? 1 : -1,
      moving: track.x >= 0 && !reduced,
    });
  }

  useEffect(() => {
    return useStage.subscribe((state, previous) => {
      if (state.signal.id === previous.signal.id || state.signal.type !== "dossier") return;
      setWatching(true);
      say(copy.robot[side].caseOpen, true);
    });
  }, [copy, say, side]);

  useEffect(() => {
    const over = (event: PointerEvent) => {
      const card = event.target instanceof Element ? event.target.closest('[data-panel="projetos"] article') : null;
      if (!card) return;
      setAttentive(true);
      say(copy.robot[side].hover);
    };
    const out = (event: PointerEvent) => {
      const card = event.target instanceof Element ? event.target.closest('[data-panel="projetos"] article') : null;
      const next = event.relatedTarget instanceof Element ? event.relatedTarget.closest('[data-panel="projetos"] article') : null;
      if (card && card !== next) setAttentive(false);
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, [copy, say, side]);

  useEffect(() => {
    if (tour === null) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const heading = document.getElementById(`setor-${SCENES[tour]?.id}`);
        if (!heading) return;
        const box = heading.getBoundingClientRect();
        setPointAt({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [scene, tour]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key.toLowerCase() === "g" && !muted) setOpen((value) => !value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [muted]);

  if (!booted || dossierOpen || !bounds) return null;

  const extra =
    scene === "intro" ? sideLines.welcome : scene === "projetos" ? sideLines.projects : scene === "contato" ? sideLines.contact : null;
  const lines = extra ? [extra, ...copy.guide.lines[scene]] : copy.guide.lines[scene];
  const touring = tour !== null;
  const text = touring
    ? copy.guide.lines[scene][0]
    : (brain.speech?.text ?? lines[line.index % lines.length]);
  const textKey = touring ? `tour-${tour}-${scene}` : brain.speech ? `say-${brain.speech.id}` : `${scene}-${line.index}`;
  const right = watching || ANCHORS[scene] > 0.5;
  const state = touring && !muted ? "pointing" : brain.state;

  const talk = () => {
    if (muted) {
      setGuideMuted(false);
      setOpen(true);
      return;
    }
    if (sound) playRobot(side);
    setOpen(true);
    setWatching(false);
    clearSpeech();
    setLine({ scene, index: line.index + 1 });
    if (grant("droide")) {
      pushToast(copy.alerts.protocolTitle, copy.progress.items.droide.name);
    }
  };

  const goTo = (step: number) => {
    const next = SCENES[step];
    if (!next) return;
    setTour(step);
    setOpen(true);
    clearSpeech();
    if (next.id !== scene) requestScene(next.id);
  };

  const endTour = () => {
    setTour(null);
    setPointAt(null);
  };

  const step = touring ? SCENES[tour] : null;
  const announcement =
    touring && step
      ? `${fill(copy.robot.tourStep, { n: tour + 1, total: SCENES.length, name: copy.deck.sectors[step.id].name })}. ${text}`
      : "";

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <motion.div
        className="pointer-events-none fixed left-0 z-40"
        style={{ bottom: `calc(${gap + 12}px + env(safe-area-inset-bottom, 0px))` }}
        initial={false}
        animate={{ x: track.x }}
        transition={{ duration: reduced ? 0 : 1.15, ease: [0.65, 0, 0.35, 1] }}
        onAnimationComplete={() => setTrack((current) => ({ ...current, moving: false }))}
      >
        {open && !muted ? (
          <RobotBubble
            side={side}
            name={copy.guide.name}
            text={text}
            textKey={textKey}
            instant={reduced}
            closeLabel={copy.guide.hide}
            onClose={() => setOpen(false)}
            align={right ? "right" : "left"}
          >
            <div className="mt-2 flex flex-wrap gap-x-1 font-mono text-[0.6875rem]">
              {touring ? (
                <>
                  <button
                    type="button"
                    className="robot-action"
                    disabled={tour === 0}
                    onClick={() => goTo(tour - 1)}
                  >
                    {copy.robot.prev}
                  </button>
                  {tour < SCENES.length - 1 ? (
                    <button type="button" className="robot-action" onClick={() => goTo(tour + 1)}>
                      {copy.robot.next}
                    </button>
                  ) : null}
                  <button type="button" className="robot-action" onClick={endTour}>
                    {copy.robot.end}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="robot-action" onClick={() => goTo(0)}>
                    {copy.robot.tour}
                  </button>
                  <button
                    type="button"
                    className="robot-action"
                    aria-describedby="robot-shortcut"
                    onClick={() => {
                      endTour();
                      setGuideMuted(true);
                      clearSpeech();
                    }}
                  >
                    {copy.robot.mute}
                  </button>
                </>
              )}
            </div>
            <p id="robot-shortcut" className="sr-only">
              {copy.robot.shortcut}
            </p>
          </RobotBubble>
        ) : null}
        <button
          type="button"
          data-spark=""
          aria-label={muted ? copy.robot.unmute : copy.guide.talk}
          className={cn("robot-button pointer-events-auto relative block cursor-pointer p-1", muted && "is-muted")}
          style={{ width: size, height: size + 8 }}
          onClick={talk}
        >
          <Robot
            side={brain.artSide}
            state={state}
            phase={brain.phase}
            attentive={attentive}
            moving={track.moving}
            facing={track.facing}
            gazeTarget={touring ? pointAt : watching ? { x: left + width / 2, y: window.innerHeight / 2 } : null}
            live={!reduced}
            className="mx-auto h-full w-full"
          />
          <span className="robot-shadow" aria-hidden="true" />
        </button>
      </motion.div>
    </>
  );
}
