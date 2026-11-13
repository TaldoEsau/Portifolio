"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  IDLE_MS,
  SPEECH_GAP_MS,
  SWITCH_MS,
  type RobotState,
} from "@/components/robot/robot.config";
import type { Side } from "@/lib/side";
import { playRobot } from "@/lib/sound";
import { useStage } from "@/store/stage";

export type SwitchPhase = "off" | "morph" | "on" | null;
export type Speech = { id: number; text: string };

type BrainInput = {
  side: Side;
  reduced: boolean;
  muted: boolean;
  sound: boolean;
  lines: { secret: string; switch: string; idle: string };
};

let speechSeq = 1;

export function useRobotBrain({ side, reduced, muted, sound, lines }: BrainInput) {
  const [artSide, setArtSide] = useState<Side>(side);
  const [phase, setPhase] = useState<SwitchPhase>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [speech, setSpeech] = useState<Speech | null>(null);
  const lastSpoke = useRef(0);
  const previousSide = useRef(side);
  const live = useRef({ muted, sound, lines, sleeping });

  useEffect(() => {
    live.current = { muted, sound, lines, sleeping };
  }, [muted, sound, lines, sleeping]);

  const say = useCallback((text: string, force = false) => {
    if (live.current.muted) return false;
    const now = Date.now();
    if (!force && now - lastSpoke.current < SPEECH_GAP_MS) return false;
    lastSpoke.current = now;
    setSpeech({ id: speechSeq++, text });
    return true;
  }, []);

  const clearSpeech = useCallback(() => setSpeech(null), []);

  useEffect(() => {
    if (previousSide.current === side) return;
    previousSide.current = side;
    const timers: number[] = [];
    const at = (ms: number, run: () => void) => timers.push(window.setTimeout(run, ms));
    const finish = () => {
      setPhase(null);
      if (live.current.sound && !live.current.muted) playRobot(side);
      say(live.current.lines.switch, true);
    };
    if (reduced) {
      at(0, () => {
        setArtSide(side);
        finish();
      });
    } else {
      at(0, () => setPhase("off"));
      at(300, () => {
        setPhase("morph");
        setArtSide(side);
      });
      at(600, () => setPhase("on"));
      at(SWITCH_MS, finish);
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduced, say, side]);

  useEffect(() => {
    let timer = 0;
    return useStage.subscribe((state, previous) => {
      if (!previous.hydrated || state.achievements.length <= previous.achievements.length) return;
      setCelebrating(true);
      say(live.current.lines.secret, true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setCelebrating(false), 1200);
    });
  }, [say]);

  useEffect(() => {
    let timer = 0;
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (say(live.current.lines.idle)) setSleeping(true);
      }, IDLE_MS);
    };
    const wake = () => {
      if (live.current.sleeping) setSleeping(false);
      arm();
    };
    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((name) => window.addEventListener(name, wake, { passive: true }));
    arm();
    return () => {
      window.clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, wake));
    };
  }, [say]);

  let state: RobotState = "idle";
  if (muted) state = "muted";
  else if (phase) state = "switching";
  else if (celebrating) state = "celebrating";
  else if (sleeping) state = "sleeping";
  else if (speech) state = "speaking";

  return { artSide, phase, state, speech, say, clearSpeech };
}
