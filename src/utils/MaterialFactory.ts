import * as THREE from "three";
import {
  FRAME_FINISH_PARAMS,
  TIRE_COLOR_HEX,
  UPHOLSTERY_MATERIAL_PARAMS,
} from "@/config/materials";
import type {
  FrameFinish,
  TireColor,
  UpholsteryMaterial,
} from "@/types/config.types";

/**
 * MaterialFactory: pure functions that build THREE materials from config keys.
 * Callers should memoize and dispose() as needed.
 */
export const MaterialFactory = {
  frame(color: string, finish: FrameFinish): THREE.MeshPhysicalMaterial {
    const p = FRAME_FINISH_PARAMS[finish];
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: p.roughness,
      metalness: p.metalness,
      clearcoat: p.clearcoat ?? 0,
      clearcoatRoughness: p.clearcoatRoughness ?? 0.4,
      envMapIntensity: p.envMapIntensity ?? 1,
    });
  },

  upholstery(color: string, material: UpholsteryMaterial): THREE.MeshPhysicalMaterial {
    const p = UPHOLSTERY_MATERIAL_PARAMS[material];
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: p.roughness,
      metalness: p.metalness,
      sheen: p.sheen ?? 0,
      sheenRoughness: 0.6,
      clearcoat: p.clearcoat ?? 0,
      clearcoatRoughness: p.clearcoatRoughness ?? 0.4,
    });
  },

  tire(tire: TireColor): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(TIRE_COLOR_HEX[tire] ?? "#0d0d0d"),
      roughness: 0.85,
      metalness: 0.05,
    });
  },

  handrim(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#A8B0B8"),
      roughness: 0.2,
      metalness: 0.9,
    });
  },

  hub(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1a1a"),
      roughness: 0.35,
      metalness: 0.8,
    });
  },

  accent(color: string): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.45,
      metalness: 0.4,
    });
  },
};
