import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MaterialFactory } from "@/utils/MaterialFactory";
import type { WheelchairConfig } from "@/types/config.types";

interface Props {
  config: WheelchairConfig;
}

/**
 * Programmatic wheelchair built from primitives.
 * Groups are organized by part so a single material can be applied to each.
 *
 *   - frameGroup       : tubular frame
 *   - upholsteryGroup  : seat + back cushion
 *   - wheelsGroup      : drive wheels (varies by style)
 *   - armrestsGroup    : armrests (varies by style)
 *   - footrestsGroup   : footrest mechanism (varies)
 *   - backrestGroup    : backrest geometry (height varies)
 *   - accessoriesGroup : optional add-ons
 */
export function MiniAirModel({ config }: Props) {
  const frameMat = useMemo(
    () => MaterialFactory.frame(config.frame.color, config.frame.finish),
    [config.frame.color, config.frame.finish],
  );
  const upholsteryMat = useMemo(
    () => MaterialFactory.upholstery(config.upholstery.color, config.upholstery.material),
    [config.upholstery.color, config.upholstery.material],
  );
  const tireMat = useMemo(
    () => MaterialFactory.tire(config.wheels.tire),
    [config.wheels.tire],
  );
  const handrimMat = useMemo(() => MaterialFactory.handrim(), []);
  const hubMat = useMemo(() => MaterialFactory.hub(), []);
  const footrestMat = useMemo(
    () =>
      config.footrests.colorMatch
        ? frameMat
        : MaterialFactory.accent("#2A2D34"),
    [config.footrests.colorMatch, frameMat],
  );

  // Subtle idle motion
  const root = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (root.current) {
      root.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.015;
    }
  });

  return (
    <group ref={root}>
      <FrameGroup material={frameMat} />
      <UpholsteryGroup material={upholsteryMat} />
      <BackrestGroup
        material={upholsteryMat}
        frameMat={frameMat}
        height={config.backrest.height}
        lumbar={config.backrest.lumbar}
      />
      <WheelsGroup
        style={config.wheels.style}
        tireMat={tireMat}
        handrimMat={handrimMat}
        hubMat={hubMat}
      />
      <ArmrestsGroup
        material={frameMat}
        padMat={upholsteryMat}
        style={config.armrests.style}
        adjustable={config.armrests.heightAdjustable}
      />
      <FootrestsGroup material={footrestMat} style={config.footrests.style} />
      <AccessoriesGroup
        accessories={config.accessories}
        frameMat={frameMat}
        upholsteryMat={upholsteryMat}
      />
    </group>
  );
}

/* ---------- Frame ---------- */

function FrameGroup({ material }: { material: THREE.Material }) {
  return (
    <group>
      {/* Side rails */}
      {[-0.46, 0.46].map((x) => (
        <mesh key={x} position={[x, 0.3, 0]} castShadow receiveShadow material={material}>
          <boxGeometry args={[0.05, 0.55, 0.95]} />
        </mesh>
      ))}
      {/* Front cross tube */}
      <mesh
        position={[0, 0.18, 0.42]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        material={material}
      >
        <cylinderGeometry args={[0.022, 0.022, 0.95, 16]} />
      </mesh>
      {/* Rear cross tube */}
      <mesh
        position={[0, 0.18, -0.42]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        material={material}
      >
        <cylinderGeometry args={[0.022, 0.022, 0.95, 16]} />
      </mesh>
      {/* Front forks to casters */}
      {[-0.32, 0.32].map((x) => (
        <mesh key={`fk${x}`} position={[x, 0.18, 0.5]} castShadow material={material}>
          <cylinderGeometry args={[0.018, 0.018, 0.36, 12]} />
        </mesh>
      ))}
      {/* Caster wheels */}
      {[-0.32, 0.32].map((x) => (
        <mesh
          key={`c${x}`}
          position={[x, 0.08, 0.55]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <torusGeometry args={[0.08, 0.03, 12, 24]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.6} />
        </mesh>
      ))}
      {/* Push handles up to rear backrest stems */}
      {[-0.42, 0.42].map((x) => (
        <mesh key={`ph${x}`} position={[x, 1.55, -0.42]} castShadow material={material}>
          <cylinderGeometry args={[0.022, 0.022, 0.2, 16]} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Seat upholstery ---------- */

function UpholsteryGroup({ material }: { material: THREE.Material }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow material={material}>
        <boxGeometry args={[0.9, 0.07, 0.85]} />
      </mesh>
      <mesh position={[0, 0.55, -0.36]} castShadow material={material}>
        <boxGeometry args={[0.86, 0.06, 0.1]} />
      </mesh>
    </group>
  );
}

/* ---------- Backrest ---------- */

function BackrestGroup({
  material,
  frameMat,
  height,
  lumbar,
}: {
  material: THREE.Material;
  frameMat: THREE.Material;
  height: "low" | "mid" | "high";
  lumbar: boolean;
}) {
  const h = height === "low" ? 0.55 : height === "mid" ? 0.85 : 1.15;
  const yCenter = 0.55 + h / 2;
  return (
    <group>
      {/* Vertical frame posts */}
      {[-0.42, 0.42].map((x) => (
        <mesh
          key={x}
          position={[x, yCenter, -0.4]}
          castShadow
          material={frameMat}
        >
          <cylinderGeometry args={[0.022, 0.022, h + 0.08, 16]} />
        </mesh>
      ))}
      {/* Back panel */}
      <mesh
        position={[0, yCenter, -0.42]}
        rotation={[-0.06, 0, 0]}
        castShadow
        material={material}
      >
        <boxGeometry args={[0.86, h, 0.06]} />
      </mesh>
      {/* Lumbar bulge */}
      {lumbar && (
        <mesh
          position={[0, 0.55 + h * 0.35, -0.38]}
          castShadow
          material={material}
        >
          <boxGeometry args={[0.72, 0.18, 0.08]} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- Wheels ---------- */

function WheelsGroup({
  style,
  tireMat,
  handrimMat,
  hubMat,
}: {
  style: "spoke" | "mag" | "solid";
  tireMat: THREE.Material;
  handrimMat: THREE.Material;
  hubMat: THREE.Material;
}) {
  return (
    <>
      <Wheel position={[-0.55, 0.5, -0.05]} style={style} tireMat={tireMat} handrimMat={handrimMat} hubMat={hubMat} />
      <Wheel position={[0.55, 0.5, -0.05]} style={style} tireMat={tireMat} handrimMat={handrimMat} hubMat={hubMat} />
    </>
  );
}

function Wheel({
  position,
  style,
  tireMat,
  handrimMat,
  hubMat,
}: {
  position: [number, number, number];
  style: "spoke" | "mag" | "solid";
  tireMat: THREE.Material;
  handrimMat: THREE.Material;
  hubMat: THREE.Material;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.x += dt * 0.35;
  });

  return (
    <group ref={ref} position={position}>
      {/* Tire */}
      <mesh castShadow material={tireMat}>
        <torusGeometry args={[0.5, 0.05, 16, 64]} />
      </mesh>
      {/* Handrim */}
      <mesh material={handrimMat}>
        <torusGeometry args={[0.44, 0.022, 12, 48]} />
      </mesh>
      {/* Hub */}
      <mesh material={hubMat}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 24]} />
      </mesh>

      {style === "spoke" &&
        Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2;
          return (
            <mesh key={i} rotation={[0, 0, a]} material={handrimMat}>
              <boxGeometry args={[0.008, 0.88, 0.008]} />
            </mesh>
          );
        })}
      {style === "mag" &&
        Array.from({ length: 5 }).map((_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <mesh key={i} rotation={[0, 0, a]} material={hubMat}>
              <boxGeometry args={[0.04, 0.88, 0.012]} />
            </mesh>
          );
        })}
      {style === "solid" && (
        <mesh rotation={[Math.PI / 2, 0, 0]} material={hubMat}>
          <cylinderGeometry args={[0.44, 0.44, 0.022, 48]} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- Armrests ---------- */

function ArmrestsGroup({
  material,
  padMat,
  style,
  adjustable,
}: {
  material: THREE.Material;
  padMat: THREE.Material;
  style: "full" | "desk" | "none";
  adjustable: boolean;
}) {
  if (style === "none") return null;
  const length = style === "full" ? 0.7 : 0.4;
  const zCenter = style === "full" ? 0 : -0.15;
  const padY = adjustable ? 0.96 : 0.88;
  return (
    <group>
      {[-0.5, 0.5].map((x) => (
        <group key={x}>
          {/* Vertical mount */}
          <mesh position={[x, 0.74, -0.32]} castShadow material={material}>
            <cylinderGeometry args={[0.022, 0.022, 0.42, 16]} />
          </mesh>
          {/* Horizontal rail */}
          <mesh
            position={[x, padY, zCenter]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            material={material}
          >
            <cylinderGeometry args={[0.022, 0.022, length, 16]} />
          </mesh>
          {/* Pad */}
          <mesh position={[x, padY + 0.04, zCenter]} castShadow material={padMat}>
            <boxGeometry args={[0.07, 0.025, length - 0.02]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Footrests ---------- */

function FootrestsGroup({
  material,
  style,
}: {
  material: THREE.Material;
  style: "swing-away" | "elevating" | "fixed";
}) {
  const angle = style === "elevating" ? -0.55 : style === "fixed" ? 0 : -0.05;
  return (
    <group position={[0, 0.18, 0.56]}>
      {/* Crossbar */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={material}>
        <cylinderGeometry args={[0.022, 0.022, 0.65, 16]} />
      </mesh>
      {/* Hangers */}
      {[-0.22, 0.22].map((x) => (
        <mesh
          key={x}
          position={[x, -0.06 + angle * 0.05, 0.08]}
          rotation={[angle, 0, 0]}
          castShadow
          material={material}
        >
          <cylinderGeometry args={[0.018, 0.018, 0.35, 12]} />
        </mesh>
      ))}
      {/* Footplate */}
      <mesh
        position={[0, -0.12 + angle * 0.08, 0.18]}
        rotation={[angle, 0, 0]}
        castShadow
        material={material}
      >
        <boxGeometry args={[0.6, 0.022, 0.18]} />
      </mesh>
    </group>
  );
}

/* ---------- Accessories ---------- */

function AccessoriesGroup({
  accessories,
  frameMat,
  upholsteryMat,
}: {
  accessories: string[];
  frameMat: THREE.Material;
  upholsteryMat: THREE.Material;
}) {
  return (
    <group>
      {accessories.includes("headrest") && (
        <group>
          <mesh position={[0, 1.7, -0.42]} castShadow material={frameMat}>
            <cylinderGeometry args={[0.018, 0.018, 0.22, 16]} />
          </mesh>
          <mesh position={[0, 1.82, -0.42]} castShadow material={upholsteryMat}>
            <boxGeometry args={[0.32, 0.14, 0.1]} />
          </mesh>
        </group>
      )}
      {accessories.includes("anti-tip") && (
        <>
          {[-0.38, 0.38].map((x) => (
            <mesh key={x} position={[x, 0.12, -0.55]} castShadow material={frameMat}>
              <cylinderGeometry args={[0.018, 0.018, 0.28, 12]} />
            </mesh>
          ))}
          {[-0.38, 0.38].map((x) => (
            <mesh key={`w${x}`} position={[x, 0.05, -0.65]} castShadow>
              <torusGeometry args={[0.05, 0.018, 12, 24]} />
              <meshStandardMaterial color="#0a0a0a" />
            </mesh>
          ))}
        </>
      )}
      {accessories.includes("cup-holder") && (
        <group position={[0.6, 0.95, 0]}>
          <mesh castShadow material={frameMat}>
            <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
          </mesh>
        </group>
      )}
      {accessories.includes("bag") && (
        <mesh position={[0, 0.32, 0]} castShadow material={upholsteryMat}>
          <boxGeometry args={[0.6, 0.18, 0.5]} />
        </mesh>
      )}
      {accessories.includes("side-guards") && (
        <>
          {[-0.48, 0.48].map((x) => (
            <mesh key={x} position={[x, 0.6, -0.05]} castShadow material={upholsteryMat}>
              <boxGeometry args={[0.02, 0.32, 0.7]} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
