export const SCENE_IDS = [
  "intro",
  "sobre",
  "projetos",
  "stack",
  "lab",
  "contato",
] as const;

export type SceneId = (typeof SCENE_IDS)[number];

export const SCENES: readonly {
  id: SceneId;
  index: number;
  shortcut: string;
  coords: string;
}[] = [
  { id: "intro", index: 1, shortcut: "1", coords: "OR-01 / 118.4" },
  { id: "sobre", index: 2, shortcut: "2", coords: "OR-02 / 204.7" },
  { id: "projetos", index: 3, shortcut: "3", coords: "OR-03 / 331.2" },
  { id: "stack", index: 4, shortcut: "4", coords: "OR-04 / 412.9" },
  { id: "lab", index: 5, shortcut: "5", coords: "OR-05 / 508.1" },
  { id: "contato", index: 6, shortcut: "6", coords: "OR-06 / 640.0" },
];

export function isSceneId(value: string): value is SceneId {
  return (SCENE_IDS as readonly string[]).includes(value);
}

export function parseHash(hash: string): SceneId | null {
  const id = hash.replace(/^#/, "").split(/[?&]/)[0] ?? "";
  return isSceneId(id) ? id : null;
}

export function sceneById(id: SceneId) {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}

export function adjacentScene(id: SceneId, direction: 1 | -1): SceneId {
  const index = SCENE_IDS.indexOf(id);
  const next = (index + direction + SCENE_IDS.length) % SCENE_IDS.length;
  return SCENE_IDS[next] ?? id;
}
