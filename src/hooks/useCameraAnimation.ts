import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { CameraPreset } from "@/types/scene.types";

/**
 * Smoothly lerps the camera position and OrbitControls target toward the preset.
 * Damping speed is in units of "per second".
 */
export function useCameraAnimation(
  preset: CameraPreset,
  controlsRef: React.RefObject<{
    target: THREE.Vector3;
    update: () => void;
    enabled: boolean;
  } | null>,
  speed = 2.8,
): void {
  const targetPos = useRef(new THREE.Vector3(...preset.position));
  const targetLook = useRef(new THREE.Vector3(...preset.target));

  useEffect(() => {
    targetPos.current.set(...preset.position);
    targetLook.current.set(...preset.target);
  }, [preset]);

  const { camera } = useThree();

  useFrame((_, dt) => {
    const t = Math.min(1, dt * speed);
    camera.position.lerp(targetPos.current, t);
    const ctrl = controlsRef.current;
    if (ctrl) {
      ctrl.target.lerp(targetLook.current, t);
      ctrl.update();
    } else {
      camera.lookAt(targetLook.current);
    }
  });
}
