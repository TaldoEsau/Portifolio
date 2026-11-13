"use client";

import {
  type CSSProperties,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
  useExpandableScreen,
} from "@/components/cult-ui/expandable-screen";
import { SceneFrame } from "@/components/stage/SceneFrame";
import { Robot } from "@/components/robot/Robot";
import { useSide } from "@/components/side/SideProvider";
import { BlueprintSlot } from "@/components/ui/BlueprintSlot";
import { CountUp } from "@/components/ui/CountUp";
import { useCopy } from "@/hooks/useCopy";
import type { GithubContributions } from "@/lib/github";
import type { TwitchStatus } from "@/lib/twitch";
import type { BlueprintId } from "@/remotion/diagram-props";
import { useStage } from "@/store/stage";

const COMPOSITIONS: BlueprintId[] = [
  "hyperspace-boot",
  "gemini-pipeline",
  "arduino-clip",
];

export function Lab() {
  const copy = useCopy();
  const scene = useStage((state) => state.scene);
  const setDossierOpen = useStage((state) => state.setDossierOpen);
  const active = scene === "lab";
  const [composition, setComposition] = useState<BlueprintId>("gemini-pipeline");

  return (
    <SceneFrame id="lab">
      <p className="max-w-[62ch] text-muted">{copy.lab.lead}</p>
      <section className="grid gap-3" aria-labelledby="console-remotion">
        <h2 id="console-remotion" className="font-display text-2xl">
          {copy.lab.console}
        </h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label={copy.lab.console}>
          {COMPOSITIONS.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={composition === id}
              className="min-h-11 cursor-pointer border border-line px-3 font-mono text-xs"
              onClick={() => setComposition(id)}
            >
              {copy.lab.compositions[id]}
            </button>
          ))}
        </div>
        {active ? (
          <BlueprintSlot key={composition} id={composition} />
        ) : (
          <div className="aspect-video border border-line" />
        )}
      </section>
      <CommitRadar active={active} />
      <TwitchMonitor active={active} />
      <ExpandableScreen
        layoutId="lab-notes"
        onExpandChange={setDossierOpen}
      >
        <ExpandableScreenTrigger>
          <span className="inline-flex min-h-11 items-center border border-accent px-4 font-mono text-sm text-accent">
            {copy.lab.howTitle}
          </span>
        </ExpandableScreenTrigger>
        <ExpandableScreenContent closeLabel={copy.a11y.closeDossier}>
          <LabNotes />
        </ExpandableScreenContent>
      </ExpandableScreen>
    </SceneFrame>
  );
}

function LabNotes() {
  const copy = useCopy();
  const { labelId } = useExpandableScreen();
  return (
    <article className="grid max-w-[68ch] gap-4">
      <h2 id={labelId} tabIndex={-1} className="font-display text-3xl outline-none">
        {copy.lab.howTitle}
      </h2>
      {copy.lab.howBody.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </article>
  );
}

function CommitRadar({ active }: { active: boolean }) {
  const copy = useCopy();
  const { side } = useSide();
  const reduced = useStage((state) => state.reducedMotion);
  const [data, setData] = useState<GithubContributions | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    fetch("/api/github/contributions")
      .then((response) => response.json())
      .then((payload: GithubContributions) => {
        if (!cancelled) setData(payload);
      })
      .catch(() => {
        if (!cancelled) setData({ ok: false, mode: "telemetry-offline" });
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  const online = data?.ok === true;
  const years = online ? data.years : [];
  const selected =
    years.find((item) => item.year === picked) ?? years[years.length - 1];
  const weeks = selected ? chunkWeeks(selected.days) : EMPTY_WEEKS;
  const stats = selected
    ? [
        { label: copy.lab.radarTotal, value: selected.total },
        { label: copy.lab.radarStreak, value: selected.streak },
        { label: copy.lab.radarPeak, value: selected.peak },
      ]
    : [];

  return (
    <section className="grid gap-3" aria-labelledby="radar-commits">
      <h2 id="radar-commits" className="font-display text-2xl">
        {copy.lab.radar}
      </h2>
      <p className="max-w-[62ch] text-muted">{copy.lab.radarCaption}</p>
      {years.length > 0 ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label={copy.lab.radarYears}>
          {years.map((item) => (
            <button
              key={item.year}
              type="button"
              aria-pressed={selected?.year === item.year}
              className="min-h-11 cursor-pointer border border-line px-3 font-mono text-xs aria-pressed:border-accent aria-pressed:text-accent"
              onClick={() => setPicked(item.year)}
            >
              {item.year} · {item.total}
            </button>
          ))}
        </div>
      ) : null}
      <div className="radar-frame relative border border-line bg-bg px-3 pt-9 pb-3">
        <div className="absolute inset-x-3 top-0 h-9" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span key={index} className={`radar-droid radar-droid-${index}`}>
              <span className="radar-droid-face block h-full w-full">
                <Robot side={side} live={false} className="h-full w-full" />
              </span>
              <span className="radar-droid-beam" />
            </span>
          ))}
        </div>
        <div className="flex justify-between font-mono text-[0.625rem] tracking-[0.16em] text-muted">
          <span>
            {copy.lab.radarStart} {selected?.year ?? ""}
          </span>
          <span className="text-hologram">{copy.lab.radarSweep}</span>
          <span>
            {copy.lab.radarEnd} {selected?.year ?? ""}
          </span>
        </div>
        <div className="relative mt-2 overflow-x-auto" aria-hidden="true">
          <div className="radar-grid flex w-max gap-[3px]">
            {weeks.map((week, column) => (
              <div
                key={column}
                className="grid gap-[3px]"
                style={{ "--c": column } as CSSProperties}
              >
                {week.map((day, row) => (
                  <span
                    key={day.date || row}
                    title={day.date ? `${day.date} · ${day.count}` : undefined}
                    className={levelClass(day.level)}
                  />
                ))}
              </div>
            ))}
          </div>
          <span className="radar-sweep" />
        </div>
        {online ? null : (
          <p className="mt-3 font-mono text-sm text-accent">{copy.lab.radarEmpty}</p>
        )}
      </div>
      {online ? (
        <dl className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse border-l border-line pl-4">
              <dt className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                {stat.label}
              </dt>
              <dd className="stat-outline font-display">
                <CountUp
                  key={`${selected?.year}-${stat.label}`}
                  value={stat.value}
                  active={active}
                  instant={reduced}
                />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}

const EMPTY_WEEKS = Array.from({ length: 53 }, () =>
  Array.from({ length: 7 }, () => ({ date: "", count: 0, level: 0 })),
);

function TwitchMonitor({ active }: { active: boolean }) {
  const copy = useCopy();
  const [status, setStatus] = useState<TwitchStatus | null>(null);
  const parent = useSyncExternalStore(
    () => () => undefined,
    () => window.location.hostname,
    () => "",
  );

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    fetch("/api/twitch/status")
      .then((response) => response.json())
      .then((payload: TwitchStatus) => {
        if (!cancelled) setStatus(payload);
      })
      .catch(() => {
        if (!cancelled) {
          setStatus({ ok: false, live: false, mode: "telemetry-offline" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <section className="grid gap-3" aria-labelledby="monitor-twitch">
      <h2 id="monitor-twitch" className="font-display text-2xl">
        {copy.lab.monitor}
      </h2>
      <p className="text-muted">{copy.lab.overlayNote}</p>
      {status?.live && parent ? (
        <div className="aspect-video border border-line">
          <iframe
            title={copy.lab.liveEmbed}
            src={`https://player.twitch.tv/?channel=taldosatis&parent=${parent}&muted=true`}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="grid aspect-video place-items-center border border-line px-4 text-center">
          <p className="font-mono text-sm">
            {status?.mode === "telemetry-offline"
              ? copy.offline
              : copy.lab.offlineLine}
          </p>
        </div>
      )}
      <a
        className="inline-flex min-h-11 items-center font-mono text-sm text-hologram"
        href="https://www.twitch.tv/taldosatis"
        target="_blank"
        rel="noreferrer"
      >
        {copy.lab.channel}
      </a>
    </section>
  );
}

function chunkWeeks(days: { date: string; count: number; level: number }[]) {
  const weeks = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }
  return weeks;
}

function levelClass(level: number) {
  if (level >= 4) return "radar-cell radar-hot block h-3 w-3 bg-accent";
  if (level === 3) return "radar-cell block h-3 w-3 bg-hologram";
  if (level === 2) return "radar-cell block h-3 w-3 bg-telemetry";
  if (level === 1) return "radar-cell block h-3 w-3 bg-line-bright";
  return "radar-cell block h-3 w-3 bg-surface-2";
}
