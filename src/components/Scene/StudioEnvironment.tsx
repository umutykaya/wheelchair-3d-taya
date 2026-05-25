import { Environment, ContactShadows } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

interface Props {
  theme: "light" | "dark";
}

/**
 * Lights, floor, environment for a clean medical studio look.
 * - One warm key (directional, shadow-casting)
 * - One cool fill (directional, no shadow)
 * - One soft ambient
 * - PMREM environment for reflections
 * - Background and fog driven by theme
 */
export function StudioEnvironment({ theme }: Props) {
  const { scene } = useThree();

  useEffect(() => {
    const bg = theme === "dark" ? "#0F1117" : "#F1F3F6";
    scene.background = new THREE.Color(bg);
    scene.fog = new THREE.Fog(bg, 8, 22);
  }, [theme, scene]);

  return (
    <>
      <ambientLight intensity={0.45} color={theme === "dark" ? "#8090A8" : "#FFFFFF"} />
      {/* Warm key */}
      <directionalLight
        position={[4.5, 5.5, 3.5]}
        intensity={theme === "dark" ? 0.9 : 1.4}
        color="#FFE6C8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      {/* Cool fill */}
      <directionalLight
        position={[-4, 3, -2]}
        intensity={theme === "dark" ? 0.5 : 0.6}
        color="#B8D8FF"
      />
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={theme === "dark" ? 0.55 : 0.4}
        scale={9}
        blur={2.6}
        far={4}
        color={theme === "dark" ? "#000000" : "#1A1A2E"}
      />
      <Environment preset="studio" environmentIntensity={0.6} />
    </>
  );
}
