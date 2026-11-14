"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Robot } from "@/components/robot/Robot";
import { RobotBubble } from "@/components/robot/RobotBubble";
import { useRobotBrain } from "@/components/robot/useRobotBrain";
import { useSide } from "@/components/side/SideProvider";
import { useCopy } from "@/hooks/useCopy";
import { SCENES, type SceneId } from "@/lib/scenes";
import type { Side } from "@/lib/side";
import { playHum, playRobot } from "@/lib/sound";
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

function shuffle(length: number) {
  const bag = Array.from({ length }, (_, index) => index);
  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j]!, bag[i]!];
  }
  return bag;
}

type EncounterState = {
  sceneId: string;
  turns: readonly { speaker: "light" | "dark"; text: string }[];
  stepIndex: number;
  phase: "arriving" | "arguing" | "leaving";
  rivalSpawnX: number;
  rivalTargetX: number;
  rivalFacing: number;
  rivalSide: Side;
};

export function RobotGuide() {
  const copy = useCopy();
  const { side, reopenGate } = useSide();
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
  const touring = tour !== null;
  const tourRef = useRef(tour);

  useEffect(() => {
    tourRef.current = tour;
  }, [tour]);
  const [pointAt, setPointAt] = useState<{ x: number; y: number } | null>(null);
  const [track, setTrack] = useState({ x: -1, facing: 1, moving: false });
  const [moveDuration, setMoveDuration] = useState(1.15);
  const [isHoveringBubble, setIsHoveringBubble] = useState(false);
  const [encounter, setEncounter] = useState<EncounterState | null>(null);
  const trackRef = useRef(track);
  const encounterRef = useRef(encounter);

  useEffect(() => {
    trackRef.current = track;
  }, [track]);

  useEffect(() => {
    encounterRef.current = encounter;
  }, [encounter]);

  const [left, width, gap, mini] = bounds ? bounds.split("|").map(Number) : [0, 0, 0, 0];
  const size = mini ? 52 : 64;
  const corner = left + width - size - 12;
  const minX = left + 20;
  const maxX = corner;
  const anchor = watching ? corner : left + width * ANCHORS[scene] - size / 2;
  const clampedAnchor = Math.round(Math.min(Math.max(anchor, minX), maxX));

  if (line.scene !== scene) {
    setLine({ scene, index: 0 });
    setWatching(false);
    clearSpeech();
  }

  // Se estiver em visita guiada ou com dossiê aberto, segue o alvo estrito e encerra encontro
  const tourStep = tour !== null ? SCENES[tour] : null;
  const tourTarget = tourStep
    ? Math.round(Math.min(Math.max(left + width * ANCHORS[tourStep.id] - size / 2, minX), maxX))
    : clampedAnchor;
  const strictTarget = watching ? corner : tour !== null ? tourTarget : track.x < 0 ? clampedAnchor : null;

  if (bounds && strictTarget !== null && strictTarget !== track.x && encounter === null) {
    setTrack({
      x: strictTarget,
      facing: track.x < 0 ? track.facing : strictTarget < track.x ? 1 : -1,
      moving: track.x >= 0 && !reduced,
    });
  }

  useEffect(() => {
    if (watching || dossierOpen) {
      setEncounter(null);
    }
  }, [watching, dossierOpen]);

  useEffect(() => {
    setEncounter(null);
  }, [side]);

  const layoutRef = useRef({ left, width, minX, maxX, clampedAnchor });
  useEffect(() => {
    layoutRef.current = { left, width, minX, maxX, clampedAnchor };
  }, [left, width, minX, maxX, clampedAnchor]);

  const brainRef = useRef(brain);
  useEffect(() => {
    brainRef.current = brain;
  }, [brain]);

  const soundRef = useRef({ sound, muted, reduced });
  useEffect(() => {
    soundRef.current = { sound, muted, reduced };
  }, [sound, muted, reduced]);

  const copyRef = useRef(copy);
  useEffect(() => {
    copyRef.current = copy;
  }, [copy]);

  // Vida própria: patrulha autônoma quando o robô está livre e não está em encontro
  useEffect(() => {
    if (!booted || tour !== null || watching || dossierOpen || !bounds || encounter !== null) return;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!document.hidden && tour === null && !watching && !dossierOpen && encounterRef.current === null) {
          const { minX: mX, maxX: maX, clampedAnchor: cAnchor, width: w } = layoutRef.current;
          if (w > 200) {
            const currentX = trackRef.current.x < 0 ? cAnchor : trackRef.current.x;
            let nextX = mX + Math.random() * (maX - mX);
            if (Math.abs(nextX - currentX) < 110) {
              nextX = nextX > (mX + maX) / 2 ? nextX - 140 : nextX + 140;
            }
            nextX = Math.round(Math.min(Math.max(nextX, mX), maX));
            const dist = Math.abs(nextX - currentX);
            const duration = Math.min(3.2, Math.max(1.2, dist / 220));
            const newFacing = nextX < currentX ? -1 : 1;
            setMoveDuration(duration);
            setTrack({ x: nextX, facing: newFacing, moving: !soundRef.current.reduced });
            if (soundRef.current.sound && !soundRef.current.muted) playHum();
          }
        }
        schedule();
      }, 10000 + Math.random() * 6000);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [booted, bounds, dossierOpen, encounter, tour, watching]);

  // Temporizador para os dois robôs se encontrarem e discutirem
  const encounterBag = useRef<number[]>([]);
  const tourEncounterBag = useRef<number[]>([]);
  const isFirstEncounter = useRef(true);

  const startEncounter = useCallback(() => {
    if (encounterRef.current !== null) return;
    const isTour = tourRef.current !== null;
    const residentSide = brainRef.current.artSide;
    const rivalSide: Side = residentSide === "light" ? "dark" : "light";
    const { minX: mX, maxX: maX, left: l, width: w, clampedAnchor: cAnchor } = layoutRef.current;

    if (w <= 200) return;

    let chosenSceneId: string;
    let chosenTurns: readonly { speaker: "light" | "dark"; text: string }[];

    if (isTour) {
      const tourList = copyRef.current.robot.tourEncounters;
      if (!tourList || tourList.length === 0) return;
      if (tourEncounterBag.current.length === 0) {
        tourEncounterBag.current = shuffle(tourList.length);
      }
      const idx = tourEncounterBag.current.pop() ?? 0;
      const item = tourList[idx] ?? tourList[0]!;
      chosenSceneId = item.id;
      chosenTurns = item.turns.map((t) => ({
        speaker: (t.speaker === "guide" ? residentSide : rivalSide) as "light" | "dark",
        text: t.text,
      }));
    } else {
      const encounters = copyRef.current.robot.encounters;
      if (!encounters || encounters.length === 0) return;
      if (encounterBag.current.length === 0) {
        encounterBag.current = shuffle(encounters.length);
      }
      const sceneIdx = encounterBag.current.pop() ?? 0;
      const chosenScene = encounters[sceneIdx] ?? encounters[0]!;
      chosenSceneId = chosenScene.id;
      chosenTurns = chosenScene.turns;
    }

    const currentX = trackRef.current.x < 0 ? cAnchor : trackRef.current.x;
    const centerX = l + w / 2;

    let residentMeetX: number;
    let rivalTargetX: number;
    let rivalSpawnX: number;
    let residentFacing: number;
    let rivalFacing: number;

    if (currentX < centerX) {
      residentMeetX = Math.round(Math.max(mX, Math.min(currentX + 80, centerX - 55)));
      rivalTargetX = Math.round(Math.min(maX, residentMeetX + 110));
      rivalSpawnX = l + w + 90;
      residentFacing = 1;
      rivalFacing = -1;
    } else {
      residentMeetX = Math.round(Math.min(maX, Math.max(currentX - 80, centerX + 55)));
      rivalTargetX = Math.round(Math.max(mX, residentMeetX - 110));
      rivalSpawnX = l - 90;
      residentFacing = -1;
      rivalFacing = 1;
    }

    isFirstEncounter.current = false;
    setMoveDuration(1.6);
    setTrack({ x: residentMeetX, facing: residentFacing, moving: !soundRef.current.reduced });
    setEncounter({
      sceneId: chosenSceneId,
      turns: chosenTurns,
      stepIndex: 0,
      phase: "arriving",
      rivalSpawnX,
      rivalTargetX,
      rivalFacing,
      rivalSide,
    });
    if (soundRef.current.sound && !soundRef.current.muted) playHum();
  }, []);

  // Temporizador para os dois robôs se encontrarem em navegação livre
  useEffect(() => {
    if (!booted || tour !== null || watching || dossierOpen || encounter !== null) return;
    let timer = 0;
    const schedule = () => {
      const waitTime = isFirstEncounter.current
        ? 8000 + Math.random() * 4000
        : 22000 + Math.random() * 10000;

      timer = window.setTimeout(() => {
        if (!document.hidden && tourRef.current === null && !watching && !dossierOpen && encounterRef.current === null) {
          startEncounter();
        }
      }, waitTime);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [booted, dossierOpen, encounter, startEncounter, tour, watching]);

  // Temporizador para o rival invadir e alfinetar durante a visita guiada
  useEffect(() => {
    if (!booted || tour === null || watching || dossierOpen) return;

    const waitTime = 5000 + Math.random() * 3000;
    const timer = window.setTimeout(() => {
      if (!document.hidden && tourRef.current !== null && !watching && !dossierOpen && encounterRef.current === null) {
        startEncounter();
      }
    }, waitTime);

    return () => window.clearTimeout(timer);
  }, [booted, dossierOpen, startEncounter, tour, watching]);

// Transição garantida das fases do encontro (arriving -> arguing e leaving -> null)
useEffect(() => {
  if (!encounter) return;
  if (encounter.phase === "arriving") {
    const timer = window.setTimeout(() => {
      setEncounter((prev) => (prev && prev.phase === "arriving" ? { ...prev, phase: "arguing" } : prev));
    }, 1900);
    return () => window.clearTimeout(timer);
  }
  if (encounter.phase === "leaving") {
    const timer = window.setTimeout(() => {
      setEncounter(null);
    }, 1900);
    return () => window.clearTimeout(timer);
  }
}, [encounter?.phase]);

// Avança os turnos de fala da discussão entre os dois robôs
useEffect(() => {
  if (!encounter || encounter.phase !== "arguing") return;
  const currentTurn = encounter.turns[encounter.stepIndex];
  if (!currentTurn) return;

  if (sound && !muted) {
    playRobot(currentTurn.speaker);
  }

  const duration = Math.min(5000, Math.max(3000, currentTurn.text.length * 48));
  const timer = window.setTimeout(() => {
    setEncounter((prev) => {
      if (!prev || prev.phase !== "arguing") return null;
      if (prev.stepIndex + 1 < prev.turns.length) {
        return {
          ...prev,
          stepIndex: prev.stepIndex + 1,
        };
      }
      return {
        ...prev,
        phase: "leaving",
      };
    });
  }, duration);

  return () => window.clearTimeout(timer);
  }, [encounter?.phase, encounter?.stepIndex, muted, sound]);

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

/* Farpas aleatórias entre os lados, sem repetir até esgotar o baralho. */
const banterBag = useRef<number[]>([]);

useEffect(() => {
  if (!booted) return;
  const pool = copy.robot[side].banter;
  let timer = 0;
  const schedule = () => {
    timer = window.setTimeout(() => {
      if (!document.hidden && tour === null && !dossierOpen && pool.length > 0) {
        if (banterBag.current.length === 0) {
          banterBag.current = shuffle(pool.length);
        }
        const index = banterBag.current.pop();
        const text = index === undefined ? undefined : pool[index];
        if (text) {
          say(text, true);
          setOpen(true);
          if (sound && !muted) playRobot(side);
        }
      }
      schedule();
    }, 16000 + Math.random() * 14000);
  };
  schedule();
  return () => window.clearTimeout(timer);
}, [booted, copy, dossierOpen, muted, say, side, sound, tour]);

// Fecha o balão de fala autônoma após alguns segundos para não cobrir a tela, salvo se estiver interagindo
useEffect(() => {
  if (!open || touring || isHoveringBubble) return;
  const timer = window.setTimeout(() => {
    setOpen(false);
  }, 9500);
  return () => window.clearTimeout(timer);
}, [open, touring, isHoveringBubble, brain.speech]);

if (!booted || dossierOpen || !bounds) return null;

const extra =
  scene === "intro" ? sideLines.welcome : scene === "projetos" ? sideLines.projects : scene === "contato" ? sideLines.contact : null;
const lines = extra ? [extra, ...copy.guide.lines[scene]] : copy.guide.lines[scene];
const text = touring
  ? copy.guide.lines[scene][0]
  : (brain.speech?.text ?? lines[line.index % lines.length]);
const textKey = touring ? `tour-${tour}-${scene}` : brain.speech ? `say-${brain.speech.id}` : `${scene}-${line.index}`;
const right = watching || ANCHORS[scene] > 0.5;
const state = touring && !muted ? "pointing" : brain.state;

const flightGaze = track.moving
  ? { x: track.facing > 0 ? left + width + 100 : left - 100, y: window.innerHeight - 80 }
  : null;
const gaze = touring ? pointAt : watching ? { x: left + width / 2, y: window.innerHeight / 2 } : flightGaze;

const encounterTurn =
  encounter && encounter.phase === "arguing" ? encounter.turns[encounter.stepIndex] : null;
const isResidentEncounterSpeaker = Boolean(encounterTurn && encounterTurn.speaker === brain.artSide);
const isRivalEncounterSpeaker = Boolean(encounterTurn && encounterTurn.speaker === encounter?.rivalSide);

const residentGaze = encounter
  ? { x: encounter.rivalTargetX + size / 2, y: window.innerHeight - 50 }
  : gaze;

const residentState = encounter
  ? encounter.phase === "arguing" && isResidentEncounterSpeaker
    ? "speaking"
    : "idle"
  : state;

const talk = () => {
  if (encounter) setEncounter(null);
  if (sound && !muted) playRobot(side);
  setOpen(true);
  setWatching(false);
  clearSpeech();
  setLine({ scene, index: line.index + 1 });
  if (grant("droide")) {
    pushToast(copy.alerts.protocolTitle, copy.progress.items.droide.name);
  }
};

const goTo = (step: number) => {
    if (encounter) setEncounter(null);
    const next = SCENES[step];
  if (!next) return;
  setTour(step);
  setOpen(true);
  clearSpeech();
  if (next.id !== scene) requestScene(next.id);
};

const endTour = () => {
    if (encounter) setEncounter(null);
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
      transition={{ duration: reduced ? 0 : moveDuration, ease: [0.45, 0, 0.25, 1] }}
      onAnimationComplete={() => setTrack((current) => ({ ...current, moving: false }))}
    >
      {encounter && encounter.phase === "arguing" && isResidentEncounterSpeaker && encounterTurn ? (
        <RobotBubble
          side={brain.artSide}
          name={brain.artSide === "light" ? copy.robot.nameLight : copy.robot.nameDark}
          text={encounterTurn.text}
          textKey={`encounter-${encounter.sceneId}-${encounter.stepIndex}`}
          instant={reduced}
          closeLabel={copy.guide.hide}
          onClose={() => setEncounter(null)}
          align={encounter.rivalTargetX > track.x ? "left" : "right"}
        />
      ) : open && !encounter ? (
        <div
          onPointerEnter={() => setIsHoveringBubble(true)}
          onPointerLeave={() => setIsHoveringBubble(false)}
        >
          <RobotBubble
            side={brain.artSide}
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
                  <button type="button" className="robot-action" onClick={reopenGate}>
                    {copy.side.chooseAgain}
                  </button>
                  <button
                    type="button"
                    className="robot-action"
                    aria-describedby="robot-shortcut"
                    onClick={() => {
                      endTour();
                      setGuideMuted(!muted);
                    }}
                  >
                    {muted ? copy.robot.unmute : copy.robot.mute}
                  </button>
                </>
              )}
            </div>
            <p id="robot-shortcut" className="sr-only">
              {copy.robot.shortcut}
            </p>
          </RobotBubble>
        </div>
      ) : null}
      <button
        type="button"
        data-spark=""
        data-side={brain.artSide}
        aria-label={muted ? copy.robot.unmute : copy.guide.talk}
        className={cn("robot-button pointer-events-auto relative block cursor-pointer p-1", muted && "is-muted")}
        style={{ width: size, height: size + 8 }}
        onClick={talk}
      >
        <Robot
          side={brain.artSide}
          state={residentState}
          phase={brain.phase}
          attentive={attentive}
          moving={track.moving}
          facing={track.facing}
          gazeTarget={residentGaze}
          live={!reduced}
          className="mx-auto h-full w-full"
        />
        <span className="robot-shadow" aria-hidden="true" />
      </button>
    </motion.div>

    {encounter ? (
      <motion.div
        className="pointer-events-none fixed left-0 z-40"
        style={{ bottom: `calc(${gap + 12}px + env(safe-area-inset-bottom, 0px))` }}
        initial={{ x: encounter.rivalSpawnX }}
        animate={{
          x: encounter.phase === "leaving" ? encounter.rivalSpawnX : encounter.rivalTargetX,
        }}
        transition={{ duration: reduced ? 0 : 1.7, ease: [0.45, 0, 0.25, 1] }}
        onAnimationComplete={() => {
          if (encounter.phase === "arriving") {
            setEncounter((prev) => (prev ? { ...prev, phase: "arguing" } : null));
          } else if (encounter.phase === "leaving") {
            setEncounter(null);
          }
        }}
      >
        {encounter.phase === "arguing" && isRivalEncounterSpeaker && encounterTurn ? (
          <RobotBubble
            side={encounter.rivalSide}
            name={encounter.rivalSide === "light" ? copy.robot.nameLight : copy.robot.nameDark}
            text={encounterTurn.text}
            textKey={`encounter-${encounter.sceneId}-${encounter.stepIndex}`}
            instant={reduced}
            closeLabel={copy.guide.hide}
            onClose={() => setEncounter(null)}
            align={track.x > encounter.rivalTargetX ? "left" : "right"}
          />
        ) : null}
        <div
          className="robot-button pointer-events-auto relative block p-1"
          data-side={encounter.rivalSide}
          style={{ width: size, height: size + 8 }}
        >
          <Robot
            side={encounter.rivalSide}
            state={encounter.phase === "arguing" && isRivalEncounterSpeaker ? "speaking" : "idle"}
            moving={encounter.phase !== "arguing"}
            facing={
              encounter.phase === "leaving"
                ? encounter.rivalSpawnX > encounter.rivalTargetX
                  ? 1
                  : -1
                : encounter.rivalFacing
            }
            gazeTarget={{ x: track.x + size / 2, y: window.innerHeight - 50 }}
            live={!reduced}
            className="mx-auto h-full w-full"
          />
          <span className="robot-shadow" aria-hidden="true" />
        </div>
      </motion.div>
    ) : null}
  </>
);
}
