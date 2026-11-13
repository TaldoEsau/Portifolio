export type Side = "light" | "dark";
export type SideOrigin = { x: number; y: number };

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const QUERY_MAP: Record<string, Side> = { luz: "light", sombra: "dark" };

export function isSide(value: unknown): value is Side {
  return value === "light" || value === "dark";
}

export function readSide(): Side {
  if (typeof document === "undefined") return "dark";
  const value = document.documentElement.dataset.side;
  return isSide(value) ? value : "dark";
}

export function readGateOpen(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.gate === "open";
}

export function sideFromQuery(search: string): Side | null {
  return QUERY_MAP[new URLSearchParams(search).get("lado") ?? ""] ?? null;
}

export function persistSide(side: Side) {
  try {
    document.cookie = `side=${side}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
  } catch {}
  try {
    localStorage.setItem("side", side);
  } catch {}
}

export function clearSide() {
  try {
    document.cookie = "side=; Max-Age=0; Path=/; SameSite=Lax";
  } catch {}
  try {
    localStorage.removeItem("side");
  } catch {}
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Swaps data-side on <html>, with a circular reveal from origin when View Transitions are available. */
export function applySide(side: Side, origin?: SideOrigin): Promise<void> {
  const root = document.documentElement;
  const commit = () => {
    root.dataset.side = side;
    root.dataset.gate = "done";
  };
  if (root.dataset.side === side) {
    commit();
    return Promise.resolve();
  }
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  root.style.setProperty("--vt-x", `${x}px`);
  root.style.setProperty("--vt-y", `${y}px`);
  if (!document.startViewTransition || prefersReducedMotion()) {
    commit();
    return Promise.resolve();
  }
  return document.startViewTransition(commit).finished.catch(() => undefined);
}
