"use client";

import { create } from "zustand";
import { type Locale } from "@/lib/locale";
import { SCENE_IDS, type SceneId } from "@/lib/scenes";
import { readStorage, writeStorage } from "@/lib/storage";

export type { Locale };

export type ToastItem = {
  id: number;
  title: string;
  body: string;
};

export type StageSignal = {
  id: number;
  type: string;
  detail?: string;
};

type Persisted = {
  achievements: string[];
  explored: SceneId[];
  locale: Locale;
  soundEnabled: boolean;
  guideMuted: boolean;
};

const STORAGE_KEY = "holonet-terminal";

type StageState = {
  scene: SceneId;
  pendingScene: SceneId | null;
  transitionId: number;
  transitioning: boolean;
  booted: boolean;
  soundEnabled: boolean;
  guideMuted: boolean;
  reducedMotion: boolean;
  chatOpen: boolean;
  chatPaused: boolean;
  locale: Locale;
  achievements: string[];
  explored: SceneId[];
  toasts: ToastItem[];
  dossierOpen: boolean;
  signal: StageSignal;
  scanId: number;
  hydrated: boolean;
  boot: (scene?: SceneId) => void;
  requestScene: (scene: SceneId) => void;
  commitScene: () => void;
  finishTransition: () => void;
  setSound: (enabled: boolean) => void;
  setGuideMuted: (muted: boolean) => void;
  setLocale: (locale: Locale) => void;
  setReducedMotion: (value: boolean) => void;
  setChatOpen: (open: boolean) => void;
  toggleChatPaused: () => void;
  setDossierOpen: (open: boolean) => void;
  pushToast: (title: string, body: string) => void;
  shiftToast: () => void;
  pushSignal: (type: string, detail?: string) => void;
  markExplored: (scene: SceneId) => void;
  grant: (id: string) => boolean;
  resetProgress: () => void;
  flashScan: () => void;
  hydrate: () => void;
};

function loadPersisted(): Persisted | null {
  const raw = readStorage(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    const explored = (parsed.explored ?? []).filter((id): id is SceneId =>
      (SCENE_IDS as readonly string[]).includes(id),
    );
    return {
      achievements: Array.isArray(parsed.achievements)
        ? parsed.achievements.filter((item) => typeof item === "string")
        : [],
      explored,
      locale: parsed.locale === "en" ? "en" : "pt",
      soundEnabled: Boolean(parsed.soundEnabled),
      guideMuted: Boolean(parsed.guideMuted),
    };
  } catch {
    return null;
  }
}

function persist(state: StageState) {
  const payload: Persisted = {
    achievements: state.achievements,
    explored: state.explored,
    locale: state.locale,
    soundEnabled: state.soundEnabled,
    guideMuted: state.guideMuted,
  };
  writeStorage(STORAGE_KEY, JSON.stringify(payload));
}

let toastSeq = 1;
let signalSeq = 1;

export const useStage = create<StageState>((set, get) => ({
  scene: "intro",
  pendingScene: null,
  transitionId: 0,
  transitioning: false,
  booted: false,
  soundEnabled: false,
  guideMuted: false,
  reducedMotion: false,
  chatOpen: false,
  chatPaused: false,
  locale: "pt",
  achievements: [],
  explored: [],
  toasts: [],
  dossierOpen: false,
  signal: { id: 0, type: "idle" },
  scanId: 0,
  hydrated: false,
  boot: (scene) => set({ booted: true, scene: scene ?? get().scene }),
  requestScene: (scene) => {
    const current = get();
    if (!current.booted || current.dossierOpen || current.transitioning) return;
    if (scene === current.scene) return;
    if (current.reducedMotion) {
      set({ scene });
      return;
    }
    set({
      transitioning: true,
      pendingScene: scene,
      transitionId: current.transitionId + 1,
    });
  },
  commitScene: () => {
    const pending = get().pendingScene;
    if (!pending) return;
    set({ scene: pending });
  },
  finishTransition: () => set({ transitioning: false, pendingScene: null }),
  setSound: (enabled) => {
    set({ soundEnabled: enabled });
    persist(get());
  },
  setGuideMuted: (muted) => {
    set({ guideMuted: muted });
    persist(get());
  },
  setLocale: (locale) => {
    set({ locale });
    persist(get());
  },
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setChatOpen: (open) => set({ chatOpen: open }),
  toggleChatPaused: () => set({ chatPaused: !get().chatPaused }),
  setDossierOpen: (open) => set({ dossierOpen: open }),
  pushToast: (title, body) =>
    set({ toasts: [...get().toasts, { id: toastSeq++, title, body }] }),
  shiftToast: () => set({ toasts: get().toasts.slice(1) }),
  pushSignal: (type, detail) =>
    set({ signal: { id: signalSeq++, type, detail } }),
  markExplored: (scene) => {
    if (get().explored.includes(scene)) return;
    set({ explored: [...get().explored, scene] });
    persist(get());
  },
  grant: (id) => {
    if (get().achievements.includes(id)) return false;
    set({ achievements: [...get().achievements, id] });
    persist(get());
    return true;
  },
  resetProgress: () => {
    set({ achievements: [], explored: [get().scene] });
    persist(get());
  },
  flashScan: () => set({ scanId: get().scanId + 1 }),
  hydrate: () => {
    const saved = loadPersisted();
    if (!saved) {
      set({ hydrated: true });
      return;
    }
    set({
      hydrated: true,
      achievements: saved.achievements,
      explored: Array.from(new Set([...saved.explored, ...get().explored])),
      locale: saved.locale,
      soundEnabled: saved.soundEnabled,
      guideMuted: saved.guideMuted,
    });
  },
}));
