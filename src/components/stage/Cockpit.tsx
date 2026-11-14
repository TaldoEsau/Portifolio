"use client";

import { useEffect, useRef } from "react";
import { LayoutGroup, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { AlertHost } from "@/components/alerts/AlertHost";
import { ChatDock } from "@/components/chat/ChatDock";
import { SceneDeck } from "@/components/deck/SceneDeck";
import { HudBar } from "@/components/hud/HudBar";
import { ClickSpark } from "@/components/react-bits/ClickSpark";
import { Starfield } from "@/components/react-bits/Starfield";
import { About } from "@/components/scenes/About";
import { Contact } from "@/components/scenes/Contact";
import { Intro } from "@/components/scenes/Intro";
import { Lab } from "@/components/scenes/Lab";
import { Projects } from "@/components/scenes/Projects";
import { Stack } from "@/components/scenes/Stack";
import { SideGate } from "@/components/side/SideGate";
import { useSide } from "@/components/side/SideProvider";
import { BootScreen } from "@/components/stage/BootScreen";
import { StingerOverlay } from "@/components/stage/StingerOverlay";
import { SkipLink } from "@/components/ui/SkipLink";
import { useCopy } from "@/hooks/useCopy";
import { useHashScene } from "@/hooks/useHashScene";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { focusSectorHeading } from "@/lib/a11y";
import { fill } from "@/lib/utils";
import { SCENES } from "@/lib/scenes";
import { playHum } from "@/lib/sound";
import { useStage } from "@/store/stage";

const RobotGuide = dynamic(
  () => import("@/components/robot/RobotGuide").then((mod) => mod.RobotGuide),
  { ssr: false },
);

export function Cockpit() {
  const copy = useCopy();
  const scene = useStage((state) => state.scene);
  const booted = useStage((state) => state.booted);
  const locale = useStage((state) => state.locale);
  const dossierOpen = useStage((state) => state.dossierOpen);
  const scanId = useStage((state) => state.scanId);
  const sound = useStage((state) => state.soundEnabled);
  const reduced = useStage((state) => state.reducedMotion);
  const hydrate = useStage((state) => state.hydrate);
  const markExplored = useStage((state) => state.markExplored);
  const grant = useStage((state) => state.grant);
  const pushToast = useStage((state) => state.pushToast);
  const pushSignal = useStage((state) => state.pushSignal);
  const requestScene = useStage((state) => state.requestScene);
  const setChatOpen = useStage((state) => state.setChatOpen);
  const { gateOpen } = useSide();
  const signal = useStage((state) => state.signal);
  const seen = useRef(false);
  const meta = SCENES.find((item) => item.id === scene);
  const announcement = booted
    ? fill(copy.a11y.scene, {
        n: meta?.index ?? 1,
        total: SCENES.length,
        name: copy.deck.sectors[scene].name,
      })
    : "";
  const glitch =
    !reduced && (signal.type === "interferencia" || signal.type === "raid");

  useHashScene();
  useKeyboardNav();
  useReducedMotion();

  useEffect(() => {
    hydrate();
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    if (wide) setChatOpen(true);
  }, [hydrate, setChatOpen]);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "pt-BR";
  }, [locale]);

  useEffect(() => {
    if (!booted) return;
    markExplored(scene);
    if (!useStage.getState().dossierOpen) focusSectorHeading(scene);
    if (seen.current) pushSignal("scene", copy.deck.sectors[scene].name);
    seen.current = true;
  }, [booted, copy, markExplored, pushSignal, scene]);

  useEffect(() => {
    if (!booted || gateOpen) return;
    if (!useStage.getState().dossierOpen) focusSectorHeading(useStage.getState().scene);
  }, [booted, gateOpen]);

  useEffect(() => {
    if (!booted) return;
    const explored = useStage.getState().explored;
    if (explored.length < SCENES.length) return;
    if (grant("explorer")) {
      pushToast(copy.alerts.explorerTitle, copy.alerts.explorerBody);
    }
  }, [booted, copy, grant, pushToast, scene]);

  useEffect(() => {
    if (signal.type === "interferencia" || signal.type === "raid" || signal.type === "dossier") {
      grant(signal.type);
    }
  }, [grant, signal]);

  useEffect(() => {
    if (!booted) return;
    const node = document.getElementById("conteudo");
    if (!node) return;
    let startX = 0;
    let startY = 0;
    const down = (event: PointerEvent) => {
      startX = event.clientX;
      startY = event.clientY;
    };
    const up = (event: PointerEvent) => {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy)) return;
      const index = SCENES.findIndex((item) => item.id === useStage.getState().scene);
      const next = SCENES[index + (dx < 0 ? 1 : -1)];
      if (next) {
        if (sound) playHum();
        requestScene(next.id);
      }
    };
    node.addEventListener("pointerdown", down);
    node.addEventListener("pointerup", up);
    return () => {
      node.removeEventListener("pointerdown", down);
      node.removeEventListener("pointerup", up);
    };
  }, [booted, requestScene, sound]);

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <ClickSpark>
          <div>
            <div
              className="relative flex min-h-dvh flex-col lg:h-dvh lg:max-h-dvh lg:overflow-hidden lg:flex-row"
              {...(!booted || gateOpen ? { inert: true, "aria-hidden": true } : {})}
            >
              <SkipLink label={copy.a11y.skip} />
              <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:h-full lg:min-h-0">
                <HudBar />
                <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                  <div className="order-2 lg:order-1 lg:h-full">
                    <SceneDeck />
                  </div>
                  <main
                    id="conteudo"
                    tabIndex={-1}
                    className="relative order-1 min-h-0 flex-1 overflow-y-auto outline-none lg:order-2"
                  >
                    <div className="pointer-events-none absolute inset-0">
                      <Starfield />
                    </div>
                    <div className="relative z-10">
                      <Intro />
                      <About />
                      <Projects />
                      <Stack />
                      <Lab />
                      <Contact />
                    </div>
                  </main>
                </div>
              </div>
              <ChatDock />
            </div>
            <p className="sr-only" aria-live="polite">
              {announcement}
            </p>
            {booted ? null : <BootScreen />}
            {gateOpen || !booted ? <SideGate /> : null}
            {gateOpen ? null : <RobotGuide />}
            <StingerOverlay />
            <AlertHost />
            {glitch ? (
              <div
                key={signal.id}
                className="intercept pointer-events-none fixed inset-0 z-[65]"
                aria-hidden="true"
              />
            ) : null}
            {scanId > 0 && !reduced ? (
              <div key={scanId} className="holo-scan" aria-hidden="true" />
            ) : null}
            <noscript>
              <style>{`.boot-layer{display:none!important}.scene-panel{display:block!important}`}</style>
            </noscript>
          </div>
        </ClickSpark>
      </LayoutGroup>
    </MotionConfig>
  );
}
