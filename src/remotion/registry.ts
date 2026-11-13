import {
  ARDUINO_FRAMES,
  ArduinoClipPipeline,
} from "@/remotion/ArduinoClipPipeline";
import { HYPERSPACE_FRAMES, HyperspaceBoot } from "@/remotion/HyperspaceBoot";
import {
  GEMINI_FRAMES,
  GeminiPipeline,
} from "@/remotion/GeminiPipeline";
import type { BlueprintId, DiagramProps } from "@/remotion/diagram-props";
import { FPS, HEIGHT, WIDTH } from "@/remotion/palette";
import type { ComponentType } from "react";

export const BLUEPRINTS: Record<
  BlueprintId,
  {
    id: BlueprintId;
    component: ComponentType<DiagramProps>;
    duration: number;
    fps: number;
    width: number;
    height: number;
  }
> = {
  "hyperspace-boot": {
    id: "hyperspace-boot",
    component: HyperspaceBoot,
    duration: HYPERSPACE_FRAMES,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
  },
  "gemini-pipeline": {
    id: "gemini-pipeline",
    component: GeminiPipeline,
    duration: GEMINI_FRAMES,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
  },
  "arduino-clip": {
    id: "arduino-clip",
    component: ArduinoClipPipeline,
    duration: ARDUINO_FRAMES,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
  },
};
