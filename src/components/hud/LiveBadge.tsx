"use client";

import { useEffect, useState } from "react";
import { useCopy } from "@/hooks/useCopy";
import { useStage } from "@/store/stage";

type Status = {
  live: boolean;
  mode: "live" | "offline" | "telemetry-offline";
};

export function LiveBadge() {
  const copy = useCopy();
  const pushToast = useStage((state) => state.pushToast);
  const grant = useStage((state) => state.grant);
  const [status, setStatus] = useState<Status>({
    live: false,
    mode: "telemetry-offline",
  });
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/twitch/status")
      .then((response) => response.json())
      .then((payload: Status) => {
        if (!cancelled) setStatus(payload);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (clicks === 0) return;
    const timer = window.setTimeout(() => setClicks(0), 2000);
    return () => window.clearTimeout(timer);
  }, [clicks]);

  const label =
    status.mode === "live"
      ? `${copy.hud.live} // ${copy.hud.freq}`
      : status.mode === "offline"
        ? copy.hud.standby
        : `${copy.hud.transmitting} // ${copy.hud.freq}`;

  return (
    <button
      type="button"
      className="inline-flex min-h-11 cursor-pointer items-center gap-2 font-mono text-xs text-text"
      aria-label={copy.a11y.badge}
      onClick={() => {
        const next = clicks + 1;
        if (next >= 5) {
          setClicks(0);
          grant("bastidores");
          pushToast(copy.alerts.secretTitle, copy.alerts.secretBody);
          return;
        }
        setClicks(next);
      }}
    >
      <span
        className={
          status.live
            ? "live-pip inline-block h-2 w-2 bg-live"
            : "inline-block h-2 w-2 bg-telemetry"
        }
        aria-hidden="true"
      />
      <span>{label}</span>
    </button>
  );
}
