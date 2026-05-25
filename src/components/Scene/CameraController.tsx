import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useCameraAnimation } from "@/hooks/useCameraAnimation";
import { getCameraPreset } from "@/domain/cameraPresets";
import type { StepId, WheelchairModelId } from "@/types/config.types";

interface Props {
  step: StepId;
  model: WheelchairModelId;
}

/**
 * OrbitControls with damping + guided tweens between step camera presets.
 */
export function CameraController({ step, model }: Props) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const preset = getCameraPreset(step, model);

  useCameraAnimation(preset, controlsRef);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={0.8}
      maxDistance={3.5}
      minPolarAngle={(5 * Math.PI) / 180}
      maxPolarAngle={(85 * Math.PI) / 180}
    />
  );
}
