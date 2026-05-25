import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MaterialFactory } from "@/utils/MaterialFactory";
import type { WheelchairConfig } from "@/types/config.types";

interface Props {
  config: WheelchairConfig;
}

/* ============================================================
 * Coordinate convention (matches MiniAirModel for visual parity):
 *   - y = 0 is the floor; wheels touch ground at y = wheelRadius
 *   - +x = chair right (rider POV)
 *   - +z = forward (casters), -z = backward (push handles)
 *
 * Shared dimensions
 * ============================================================ */

const DRIVE_R = 0.5;
const CASTER_R = 0.09;
const SEAT_Y = 0.5;
const FRAME_R = 0.026;
const WHEEL_X = 0.55;
const WHEEL_Z = -0.05;
const POST_Z = -0.42;
const RAIL_X = 0.46;
const FRONT_POST_Z = 0.45;
const TOP_RAIL_Y = SEAT_Y - 0.03;
const BOT_RAIL_Y = 0.18;

/**
 * Standard manual wheelchair — folding-frame look.
 *
 * Differences vs Mini Air:
 *   - chunkier tubular frame with X cross-brace under the seat
 *   - sling-style seat + back panel with continuous push-handle bend
 *   - large rear wheels with 24 default spokes + brake levers
 *   - always-padded armrests with flip-up bracket
 *   - swing-away footrests with calf strap and heel loops
 *   - rear anti-tip kickers welded to the rear post
 */
export function StandardModel({ config }: Props) {
  const frameMat = useMemo(
    () => MaterialFactory.frame(config.frame.color, config.frame.finish),
    [config.frame.color, config.frame.finish],
  );
  const upholsteryMat = useMemo(
    () => MaterialFactory.upholstery(config.upholstery.color, config.upholstery.material),
    [config.upholstery.color, config.upholstery.material],
  );
  const tireMat = useMemo(() => MaterialFactory.tire(config.wheels.tire), [config.wheels.tire]);
  const handrimMat = useMemo(() => MaterialFactory.handrim(), []);
  const hubMat = useMemo(() => MaterialFactory.hub(), []);
  const footrestMat = useMemo(
    () => (config.footrests.colorMatch ? frameMat : MaterialFactory.accent("#2A2D34")),
    [config.footrests.colorMatch, frameMat],
  );

  const root = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (root.current) {
      root.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.008;
    }
  });

  return (
    <group ref={root}>
      <FrameGroup material={frameMat} />
      <CrossBraceGroup material={frameMat} />
      <SeatSlingGroup material={upholsteryMat} />
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
      <CastersGroup material={frameMat} />
      <ArmrestsGroup
        material={frameMat}
        padMat={upholsteryMat}
        style={config.armrests.style}
        adjustable={config.armrests.heightAdjustable}
      />
      <FootrestsGroup
        material={footrestMat}
        upholsteryMat={upholsteryMat}
        style={config.footrests.style}
      />
      <RearKickers material={frameMat} />
      <BrakeLevers material={frameMat} />
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
  const RAIL_LEN = 0.78;
  const RAIL_CENTRE_Z = 0.06;

  const TOP_RAIL_LEN = 0.95;

  const POST_TOP_Y = 1.42;
  const POST_CENTRE_Y = (BOT_RAIL_Y + POST_TOP_Y) / 2;
  const POST_H = POST_TOP_Y - BOT_RAIL_Y;

  const FRONT_POST_CENTRE_Y = (BOT_RAIL_Y + TOP_RAIL_Y) / 2;
  const FRONT_POST_H = TOP_RAIL_Y - BOT_RAIL_Y;

  const FORK_TOP_Y = BOT_RAIL_Y;
  const FORK_BOTTOM_Y = CASTER_R + 0.05;
  const FORK_H = FORK_TOP_Y - FORK_BOTTOM_Y;
  const FORK_CENTRE_Y = (FORK_TOP_Y + FORK_BOTTOM_Y) / 2;

  return (
    <group>
      {/* Bottom side rails */}
      {[-RAIL_X, RAIL_X].map((x) => (
        <mesh
          key={`b${x}`}
          position={[x, BOT_RAIL_Y, RAIL_CENTRE_Z]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
          material={material}
        >
          <cylinderGeometry args={[FRAME_R, FRAME_R, RAIL_LEN, 16]} />
        </mesh>
      ))}

      {/* Top seat rails */}
      {[-RAIL_X, RAIL_X].map((x) => (
        <mesh
          key={`t${x}`}
          position={[x, TOP_RAIL_Y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          material={material}
        >
          <cylinderGeometry args={[FRAME_R, FRAME_R, TOP_RAIL_LEN, 16]} />
        </mesh>
      ))}

      {/* Rear vertical posts */}
      {[-RAIL_X, RAIL_X].map((x) => (
        <mesh
          key={`rp${x}`}
          position={[x, POST_CENTRE_Y, POST_Z]}
          castShadow
          material={material}
        >
          <cylinderGeometry args={[FRAME_R, FRAME_R, POST_H, 16]} />
        </mesh>
      ))}

      {/* Front vertical posts (bottom rail → top seat rail) */}
      {[-RAIL_X, RAIL_X].map((x) => (
        <mesh
          key={`fp${x}`}
          position={[x, FRONT_POST_CENTRE_Y, FRONT_POST_Z]}
          castShadow
          material={material}
        >
          <cylinderGeometry args={[FRAME_R, FRAME_R, FRONT_POST_H, 16]} />
        </mesh>
      ))}

      {/* Caster down-tubes (bottom rail → fork yoke) */}
      {[-RAIL_X, RAIL_X].map((x) => (
        <mesh
          key={`fk${x}`}
          position={[x, FORK_CENTRE_Y, FRONT_POST_Z]}
          castShadow
          material={material}
        >
          <cylinderGeometry args={[FRAME_R * 0.85, FRAME_R * 0.85, FORK_H, 14]} />
        </mesh>
      ))}

      {/* Push handles — continuous bend extending from the rear post */}
      {[-RAIL_X, RAIL_X].map((x) => (
        <group key={`ph${x}`}>
          {/* Bend section continuing the post upward & forward */}
          <mesh
            position={[x, POST_TOP_Y + 0.06, POST_Z + 0.04]}
            rotation={[0.55, 0, 0]}
            castShadow
            material={material}
          >
            <cylinderGeometry args={[FRAME_R, FRAME_R, 0.14, 16]} />
          </mesh>
          {/* Grip extension */}
          <mesh
            position={[x, POST_TOP_Y + 0.13, POST_Z + 0.15]}
            rotation={[1.1, 0, 0]}
            castShadow
            material={material}
          >
            <cylinderGeometry args={[FRAME_R, FRAME_R, 0.2, 16]} />
          </mesh>
          {/* Foam handgrip */}
          <mesh
            position={[x, POST_TOP_Y + 0.16, POST_Z + 0.24]}
            rotation={[1.1, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.034, 0.034, 0.13, 16]} />
            <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- X cross-brace under the seat ---------- */

function CrossBraceGroup({ material }: { material: THREE.Material }) {
  const DY = TOP_RAIL_Y - BOT_RAIL_Y;
  const DX = RAIL_X * 2;
  const LEN = Math.sqrt(DX * DX + DY * DY);
  const ANG = Math.atan2(DX, DY);
  const MID_Y = (BOT_RAIL_Y + TOP_RAIL_Y) / 2;

  return (
    <group>
      {[-0.26, 0.26].map((z) => (
        <group key={z} position={[0, MID_Y, z]}>
          <mesh rotation={[0, 0, -ANG]} castShadow material={material}>
            <cylinderGeometry args={[FRAME_R * 0.8, FRAME_R * 0.8, LEN, 14]} />
          </mesh>
          <mesh rotation={[0, 0, ANG]} castShadow material={material}>
            <cylinderGeometry args={[FRAME_R * 0.8, FRAME_R * 0.8, LEN, 14]} />
          </mesh>
          {/* Centre pivot pin */}
          <mesh castShadow>
            <sphereGeometry args={[FRAME_R * 1.1, 14, 14]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Seat sling ---------- */

function SeatSlingGroup({ material }: { material: THREE.Material }) {
  return (
    <group>
      {/* Main sling sits just above the top rails */}
      <mesh position={[0, SEAT_Y + 0.01, 0]} castShadow receiveShadow material={material}>
        <boxGeometry args={[0.95, 0.04, 0.88]} />
      </mesh>
      {/* Front bolster */}
      <mesh position={[0, SEAT_Y + 0.03, 0.34]} castShadow material={material}>
        <boxGeometry args={[0.92, 0.04, 0.12]} />
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
  const h = height === "low" ? 0.55 : height === "mid" ? 0.78 : 1.0;
  const baseY = SEAT_Y + 0.03;
  const yCenter = baseY + h / 2;

  return (
    <group>
      {/* Sling back panel, slight rearward lean */}
      <mesh
        position={[0, yCenter, POST_Z + 0.015]}
        rotation={[-0.08, 0, 0]}
        castShadow
        material={material}
      >
        <boxGeometry args={[0.95, h, 0.05]} />
      </mesh>

      {/* Horizontal top bar between rear posts */}
      <mesh
        position={[0, baseY + h + 0.02, POST_Z]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        material={frameMat}
      >
        <cylinderGeometry args={[FRAME_R, FRAME_R, RAIL_X * 2, 16]} />
      </mesh>

      {lumbar && (
        <mesh
          position={[0, baseY + h * 0.35, POST_Z + 0.06]}
          castShadow
          material={material}
        >
          <boxGeometry args={[0.78, 0.2, 0.07]} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- Drive wheels ---------- */

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
      <Wheel
        position={[-WHEEL_X, DRIVE_R, WHEEL_Z]}
        style={style}
        tireMat={tireMat}
        handrimMat={handrimMat}
        hubMat={hubMat}
      />
      <Wheel
        position={[WHEEL_X, DRIVE_R, WHEEL_Z]}
        style={style}
        tireMat={tireMat}
        handrimMat={handrimMat}
        hubMat={hubMat}
      />
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
    if (ref.current) ref.current.rotation.x += dt * 0.3;
  });

  const R = DRIVE_R;
  return (
    <group ref={ref} position={position}>
      <mesh castShadow material={tireMat}>
        <torusGeometry args={[R, 0.055, 18, 72]} />
      </mesh>
      <mesh position={[0, 0, 0.02]} material={handrimMat}>
        <torusGeometry args={[R - 0.07, 0.022, 14, 56]} />
      </mesh>
      <mesh material={hubMat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.07, 24]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.12, 16]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.35} metalness={0.85} />
      </mesh>

      {style === "spoke" &&
        Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <mesh key={i} rotation={[0, 0, a]} material={handrimMat}>
              <boxGeometry args={[0.006, (R - 0.07) * 2 - 0.04, 0.006]} />
            </mesh>
          );
        })}
      {style === "mag" &&
        Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} rotation={[0, 0, a]} material={hubMat}>
              <boxGeometry args={[0.05, (R - 0.07) * 2 - 0.04, 0.014]} />
            </mesh>
          );
        })}
      {style === "solid" && (
        <mesh rotation={[Math.PI / 2, 0, 0]} material={hubMat}>
          <cylinderGeometry args={[R - 0.07, R - 0.07, 0.02, 56]} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- Casters ---------- */

function CastersGroup({ material }: { material: THREE.Material }) {
  const chrome = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#B8C0C8"),
        roughness: 0.22,
        metalness: 0.92,
      }),
    [],
  );
  const tire = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.6 }),
    [],
  );
  const casterHub = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.4, metalness: 0.6 }),
    [],
  );

  const YOKE_Y = CASTER_R + 0.05; // 0.14
  const WHEEL_Y = CASTER_R;

  return (
    <group>
      {[-RAIL_X, RAIL_X].map((x) => (
        <group key={x} position={[x, 0, FRONT_POST_Z]}>
          {/* Fork yoke */}
          <mesh position={[0, YOKE_Y, 0]} castShadow material={chrome}>
            <boxGeometry args={[0.06, 0.06, 0.06]} />
          </mesh>
          {/* Fork arms */}
          {[-0.035, 0.035].map((zo) => (
            <mesh
              key={zo}
              position={[0, (YOKE_Y + WHEEL_Y) / 2, zo]}
              castShadow
              material={chrome}
            >
              <cylinderGeometry args={[0.008, 0.008, YOKE_Y - WHEEL_Y, 10]} />
            </mesh>
          ))}
          {/* Caster wheel */}
          <mesh
            position={[0, WHEEL_Y, 0]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
            material={tire}
          >
            <torusGeometry args={[CASTER_R, 0.028, 14, 32]} />
          </mesh>
          {/* Hub disc */}
          <mesh
            position={[0, WHEEL_Y, 0]}
            rotation={[0, 0, Math.PI / 2]}
            material={casterHub}
          >
            <cylinderGeometry args={[0.04, 0.04, 0.05, 18]} />
          </mesh>
          {/* Stem bolt */}
          <mesh position={[0, YOKE_Y + 0.035, 0]} castShadow material={material}>
            <cylinderGeometry args={[0.018, 0.018, 0.03, 12]} />
          </mesh>
        </group>
      ))}
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
  const length = style === "full" ? 0.7 : 0.45;
  const zCenter = style === "full" ? -0.02 : -0.16;
  const padY = adjustable ? 0.96 : 0.88;
  const MOUNT_BOTTOM_Y = TOP_RAIL_Y;
  const MOUNT_TOP_Y = padY;
  const MOUNT_H = MOUNT_TOP_Y - MOUNT_BOTTOM_Y;
  const MOUNT_CENTRE_Y = (MOUNT_TOP_Y + MOUNT_BOTTOM_Y) / 2;
  const MOUNT_X = RAIL_X + 0.04;
  const MOUNT_Z = -0.32;

  return (
    <group>
      {[-MOUNT_X, MOUNT_X].map((x) => (
        <group key={x}>
          {/* Vertical mount */}
          <mesh position={[x, MOUNT_CENTRE_Y, MOUNT_Z]} castShadow material={material}>
            <cylinderGeometry args={[0.02, 0.02, MOUNT_H, 14]} />
          </mesh>
          {/* Flip-up bracket */}
          <mesh
            position={[x, padY - 0.035, MOUNT_Z]}
            castShadow
            material={material}
          >
            <boxGeometry args={[0.045, 0.05, 0.06]} />
          </mesh>
          {/* Horizontal rail under pad */}
          <mesh
            position={[x, padY, zCenter]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            material={material}
          >
            <cylinderGeometry args={[0.018, 0.018, length, 14]} />
          </mesh>
          {/* Padded top */}
          <mesh position={[x, padY + 0.035, zCenter]} castShadow material={padMat}>
            <boxGeometry args={[0.08, 0.038, length - 0.02]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Footrests ---------- */

function FootrestsGroup({
  material,
  upholsteryMat,
  style,
}: {
  material: THREE.Material;
  upholsteryMat: THREE.Material;
  style: "swing-away" | "elevating" | "fixed";
}) {
  const HANG_TOP_Y = TOP_RAIL_Y;
  const HANG_TOP_Z = FRONT_POST_Z;
  const FOOT_Y_BASE = 0.13;
  const FOOT_Z_BASE = 0.62;
  const FOOT_Z = style === "elevating" ? 0.78 : FOOT_Z_BASE;
  const FOOT_Y = style === "elevating" ? FOOT_Y_BASE + 0.22 : FOOT_Y_BASE;

  const HANG_DY = HANG_TOP_Y - FOOT_Y;
  const HANG_DZ = FOOT_Z - HANG_TOP_Z;
  const HANG_LEN = Math.hypot(HANG_DY, HANG_DZ);
  const HANG_ANGLE = -Math.atan2(HANG_DZ, HANG_DY);
  const HANG_CENTRE_Y = (HANG_TOP_Y + FOOT_Y) / 2;
  const HANG_CENTRE_Z = (HANG_TOP_Z + FOOT_Z) / 2;

  return (
    <group>
      {[-0.3, 0.3].map((x) => (
        <group key={x}>
          {/* Hanger tube */}
          <mesh
            position={[x, HANG_CENTRE_Y, HANG_CENTRE_Z]}
            rotation={[HANG_ANGLE, 0, 0]}
            castShadow
            material={material}
          >
            <cylinderGeometry args={[0.02, 0.02, HANG_LEN, 14]} />
          </mesh>
          {/* Footplate */}
          <mesh
            position={[x, FOOT_Y, FOOT_Z + 0.05]}
            castShadow
            material={material}
          >
            <boxGeometry args={[0.2, 0.022, 0.18]} />
          </mesh>
          {/* Heel loop strap */}
          <mesh
            position={[x, FOOT_Y + 0.04, FOOT_Z - 0.04]}
            castShadow
            material={upholsteryMat}
          >
            <boxGeometry args={[0.17, 0.05, 0.012]} />
          </mesh>
        </group>
      ))}
      {/* Calf strap (not present on fixed footrests) */}
      {style !== "fixed" && (
        <mesh
          position={[0, HANG_CENTRE_Y + 0.04, HANG_CENTRE_Z - 0.02]}
          rotation={[HANG_ANGLE, 0, 0]}
          castShadow
          material={upholsteryMat}
        >
          <boxGeometry args={[0.5, 0.04, 0.012]} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- Rear anti-tip kickers ---------- */

function RearKickers({ material }: { material: THREE.Material }) {
  const TOP_Y = 0.24;
  const TOP_Z = POST_Z;
  const BOT_Y = 0.08;
  const BOT_Z = POST_Z - 0.18;
  const DY = TOP_Y - BOT_Y;
  const DZ = BOT_Z - TOP_Z;
  const LEN = Math.hypot(DY, DZ);
  const ANG = Math.atan2(-DZ, DY);
  const CY = (TOP_Y + BOT_Y) / 2;
  const CZ = (TOP_Z + BOT_Z) / 2;

  return (
    <group>
      {[-RAIL_X, RAIL_X].map((x) => (
        <group key={x}>
          <mesh
            position={[x, CY, CZ]}
            rotation={[-ANG, 0, 0]}
            castShadow
            material={material}
          >
            <cylinderGeometry args={[0.016, 0.016, LEN, 12]} />
          </mesh>
          {/* Small rubber roller at the end */}
          <mesh position={[x, BOT_Y, BOT_Z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 18]} />
            <meshStandardMaterial color="#0d0d0d" roughness={0.75} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Brake levers ---------- */

function BrakeLevers({ material }: { material: THREE.Material }) {
  const Z = WHEEL_Z + 0.16;
  return (
    <group>
      {[-RAIL_X, RAIL_X].map((x) => (
        <group key={x}>
          {/* Mount block */}
          <mesh position={[x, 0.22, Z]} castShadow material={material}>
            <boxGeometry args={[0.035, 0.06, 0.06]} />
          </mesh>
          {/* Lever arm */}
          <mesh position={[x, 0.32, Z]} castShadow material={material}>
            <cylinderGeometry args={[0.011, 0.011, 0.2, 12]} />
          </mesh>
          {/* Lever knob */}
          <mesh position={[x, 0.42, Z]} castShadow>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshStandardMaterial color="#111" roughness={0.85} />
          </mesh>
        </group>
      ))}
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
          <mesh position={[0, 1.62, POST_Z]} castShadow material={frameMat}>
            <cylinderGeometry args={[0.018, 0.018, 0.22, 16]} />
          </mesh>
          <mesh position={[0, 1.76, POST_Z + 0.02]} castShadow material={upholsteryMat}>
            <boxGeometry args={[0.32, 0.16, 0.1]} />
          </mesh>
        </group>
      )}
      {accessories.includes("anti-tip") && (
        <>
          {[-0.42, 0.42].map((x) => (
            <group key={x}>
              <mesh
                position={[x, 0.16, POST_Z - 0.28]}
                rotation={[0.6, 0, 0]}
                castShadow
                material={frameMat}
              >
                <cylinderGeometry args={[0.016, 0.016, 0.28, 12]} />
              </mesh>
              <mesh
                position={[x, 0.045, POST_Z - 0.4]}
                rotation={[0, 0, Math.PI / 2]}
                castShadow
              >
                <cylinderGeometry args={[0.045, 0.045, 0.03, 18]} />
                <meshStandardMaterial color="#0d0d0d" roughness={0.7} />
              </mesh>
            </group>
          ))}
        </>
      )}
      {accessories.includes("cup-holder") && (
        <group position={[RAIL_X + 0.12, 1.0, -0.02]}>
          <mesh castShadow material={frameMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.18, 12]} />
          </mesh>
          <mesh position={[0.03, 0.09, 0]} castShadow material={frameMat}>
            <cylinderGeometry args={[0.045, 0.045, 0.09, 16]} />
          </mesh>
        </group>
      )}
      {accessories.includes("bag") && (
        <mesh position={[0, 0.32, POST_Z - 0.04]} castShadow material={upholsteryMat}>
          <boxGeometry args={[0.7, 0.22, 0.08]} />
        </mesh>
      )}
      {accessories.includes("side-guards") && (
        <>
          {[-(RAIL_X + 0.03), RAIL_X + 0.03].map((x) => (
            <mesh key={x} position={[x, 0.66, -0.06]} castShadow material={upholsteryMat}>
              <boxGeometry args={[0.022, 0.32, 0.74]} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
