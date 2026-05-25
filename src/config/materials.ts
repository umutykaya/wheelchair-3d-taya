import type { FrameFinish, UpholsteryMaterial } from "@/types/config.types";

export interface MaterialParams {
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  sheen?: number;
  envMapIntensity?: number;
}

export const FRAME_FINISH_PARAMS: Record<FrameFinish, MaterialParams> = {
  matte: { roughness: 0.85, metalness: 0.2, envMapIntensity: 0.4 },
  satin: { roughness: 0.45, metalness: 0.55, envMapIntensity: 0.8 },
  gloss: {
    roughness: 0.12,
    metalness: 0.7,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.2,
  },
};

export const UPHOLSTERY_MATERIAL_PARAMS: Record<UpholsteryMaterial, MaterialParams> = {
  mesh: { roughness: 0.95, metalness: 0, sheen: 0.6 },
  vinyl: { roughness: 0.35, metalness: 0.05, clearcoat: 0.4, clearcoatRoughness: 0.5 },
  foam: { roughness: 0.85, metalness: 0, sheen: 0.3 },
};

export const TIRE_COLOR_HEX: Record<string, string> = {
  black: "#0d0d0d",
  grey: "#6E7079",
  white: "#E8E8E8",
};
