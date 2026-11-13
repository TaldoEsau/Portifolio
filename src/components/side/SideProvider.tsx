"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useCopy } from "@/hooks/useCopy";
import {
  applySide,
  clearSide,
  persistSide,
  readGateOpen,
  readSide,
  sideFromQuery,
  type Side,
  type SideOrigin,
} from "@/lib/side";

type SideContextValue = {
  side: Side;
  gateOpen: boolean;
  choose: (side: Side, origin?: SideOrigin) => Promise<void>;
  toggle: (origin?: SideOrigin) => Promise<void>;
  reopenGate: () => void;
};

const SideContext = createContext<SideContextValue | null>(null);

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-side", "data-gate"],
  });
  return () => observer.disconnect();
}

export function SideProvider({ children }: { children: ReactNode }) {
  const copy = useCopy();
  const side = useSyncExternalStore(subscribe, readSide, () => "dark" as Side);
  const gateOpen = useSyncExternalStore(subscribe, readGateOpen, () => false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const fromQuery = sideFromQuery(window.location.search);
    if (!fromQuery) return;
    persistSide(fromQuery);
    const url = new URL(window.location.href);
    url.searchParams.delete("lado");
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const choose = useCallback(
    async (next: Side, origin?: SideOrigin) => {
      persistSide(next);
      await applySide(next, origin);
      setAnnouncement(next === "light" ? copy.side.announceLight : copy.side.announceDark);
    },
    [copy],
  );

  const toggle = useCallback(
    (origin?: SideOrigin) => choose(readSide() === "light" ? "dark" : "light", origin),
    [choose],
  );

  const reopenGate = useCallback(() => {
    clearSide();
    document.documentElement.dataset.gate = "open";
  }, []);

  const value = useMemo(
    () => ({ side, gateOpen, choose, toggle, reopenGate }),
    [side, gateOpen, choose, toggle, reopenGate],
  );

  return (
    <SideContext.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="polite" role="status">
        {announcement}
      </p>
    </SideContext.Provider>
  );
}

export function useSide() {
  const context = useContext(SideContext);
  if (!context) throw new Error("useSide must be used inside SideProvider");
  return context;
}
