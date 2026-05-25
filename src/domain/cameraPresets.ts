import type { StepId, WheelchairModelId } from "@/types/config.types";
import type { CameraPreset } from "@/types/scene.types";

// Each preset frames the relevant component of the wheelchair.
// Coordinates are in scene units (~meters).
const MINI_AIR_PRESETS: Record<StepId, CameraPreset> = {
  model: {
    position: [3.0, 1.8, 4.0],
    target: [0, 0.7, 0],
  },
  frame: {
    position: [2.8, 1.8, 3.2],
    target: [0, 0.7, 0],
  },
  wheels: {
    position: [2.4, 0.6, 2.0],
    target: [0.55, 0.5, -0.05],
  },
  upholstery: {
    position: [0.4, 1.4, 2.4],
    target: [0, 0.8, 0],
  },
  armrests: {
    position: [2.2, 1.2, 2.2],
    target: [0.5, 0.85, 0],
  },
  footrests: {
    position: [1.6, 0.4, 2.8],
    target: [0, 0.1, 0.55],
  },
  backrest: {
    position: [-1.8, 1.6, 2.4],
    target: [0, 1.1, -0.3],
  },
  accessories: {
    position: [2.6, 1.8, 2.8],
    target: [0, 1.0, 0],
  },
  summary: {
    position: [3.0, 1.8, 3.4],
    target: [0, 0.7, 0],
  },
};

// Standard model is wider and taller — pull camera back a touch.
const STANDARD_PRESETS: Record<StepId, CameraPreset> = {
  model: {
    position: [3.4, 2.0, 4.4],
    target: [0, 0.8, 0],
  },
  frame: {
    position: [3.2, 2.0, 3.6],
    target: [0, 0.8, 0],
  },
  wheels: {
    position: [2.7, 0.7, 2.2],
    target: [0.6, 0.55, -0.05],
  },
  upholstery: {
    position: [0.5, 1.5, 2.7],
    target: [0, 0.9, 0],
  },
  armrests: {
    position: [2.5, 1.3, 2.4],
    target: [0.55, 0.95, 0],
  },
  footrests: {
    position: [1.8, 0.45, 3.0],
    target: [0, 0.15, 0.6],
  },
  backrest: {
    position: [-2.0, 1.8, 2.6],
    target: [0, 1.25, -0.3],
  },
  accessories: {
    position: [2.9, 2.0, 3.0],
    target: [0, 1.1, 0],
  },
  summary: {
    position: [3.4, 2.0, 3.8],
    target: [0, 0.8, 0],
  },
};

export function getCameraPreset(
  step: StepId,
  model: WheelchairModelId,
): CameraPreset {
  return model === "standard" ? STANDARD_PRESETS[step] : MINI_AIR_PRESETS[step];
}

// Backward-compatible export (defaults to mini-air).
export const CAMERA_PRESETS = MINI_AIR_PRESETS;
