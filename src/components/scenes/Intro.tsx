"use client";

import Image from "next/image";
import { SceneFrame } from "@/components/stage/SceneFrame";
import { ChamferPanel } from "@/components/ui/ChamferPanel";
import { useCopy } from "@/hooks/useCopy";
import { playClick } from "@/lib/sound";
import { useStage } from "@/store/stage";

export function Intro() {
  const copy = useCopy();
  const requestScene = useStage((state) => state.requestScene);
  const sound = useStage((state) => state.soundEnabled);
  const reduced = useStage((state) => state.reducedMotion);

  const go = (scene: "projetos" | "contato") => {
    if (sound) playClick();
    requestScene(scene);
  };

  return (
    <SceneFrame id="intro">
      <HeroMark mark={copy.intro.mark} role={copy.intro.markRole} reduced={reduced} />
      <p className="max-w-[42rem] text-lg text-text md:text-xl">
        {copy.intro.headline}
      </p>
      <p className="max-w-[46rem] text-muted">{copy.intro.support}</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          data-spark=""
          className="min-h-11 cursor-pointer bg-accent px-4 font-mono text-sm text-on-accent"
          onClick={() => go("projetos")}
        >
          {copy.intro.ctaProjects}
        </button>
        <button
          type="button"
          data-spark=""
          className="min-h-11 cursor-pointer border border-line-bright px-4 font-mono text-sm"
          onClick={() => go("contato")}
        >
          {copy.intro.ctaContact}
        </button>
      </div>
      <p className="font-mono text-xs text-muted">{copy.intro.keys}</p>
      <ChamferPanel className="grid gap-4 md:grid-cols-[180px_1fr]">
        <div
          className="scanlines relative h-44 overflow-hidden border border-line bg-bg"
          onMouseMove={(event) => {
            if (reduced) return;
            const target = event.currentTarget;
            const bounds = target.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            target.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
          }}
        >
          <Image
            src="/foto/foto-perfil.jpg"
            alt={copy.intro.photoStatus}
            fill
            sizes="180px"
            className="object-cover"
          />
        </div>
        <div className="grid gap-2 font-mono text-sm">
          <p className="text-xs text-accent">{copy.intro.projector}</p>
          <p>
            {copy.intro.station}: {copy.intro.stationValue}
          </p>
          <p>
            {copy.intro.location}: {copy.intro.locationValue}
          </p>
          <p>
            {copy.intro.stack}: {copy.intro.stackValue}
          </p>
        </div>
      </ChamferPanel>
    </SceneFrame>
  );
}

function HeroMark({
  mark,
  role,
  reduced,
}: {
  mark: string;
  role: string;
  reduced: boolean;
}) {
  return (
    <div
      className="hero-mark relative -mx-2 overflow-hidden select-none"
      aria-hidden="true"
      onPointerMove={(event) => {
        if (reduced) return;
        const target = event.currentTarget;
        const bounds = target.getBoundingClientRect();
        target.style.setProperty("--px", String((event.clientX - bounds.left) / bounds.width - 0.5));
        target.style.setProperty("--py", String((event.clientY - bounds.top) / bounds.height - 0.5));
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--px", "0");
        event.currentTarget.style.setProperty("--py", "0");
      }}
    >
      <svg viewBox="0 0 640 196" className="hero-layer hero-ghost block w-full">
        <text x="8" y="180" className="hero-text">
          {mark}
        </text>
      </svg>
      <svg viewBox="0 0 640 196" className="hero-layer hero-main absolute inset-0 block w-full">
        <text x="8" y="180" className="hero-text hero-draw">
          {mark}
        </text>
      </svg>
      <span className="hero-sweep" />
      <p className="hero-role absolute right-2 bottom-2 font-mono text-[0.625rem] tracking-[0.2em] text-hologram sm:text-xs">
        {role}
      </p>
    </div>
  );
}
