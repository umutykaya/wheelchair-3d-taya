import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useConfigStore } from "@/store/useConfigStore";
import { StudioEnvironment } from "./StudioEnvironment";
import { CameraController } from "./CameraController";
import { WheelchairModel } from "./WheelchairModel";

interface Props {
  onCanvasReady?: (el: HTMLCanvasElement) => void;
}

/**
 * Top-level R3F Canvas. preserveDrawingBuffer enables PDF snapshots.
 */
export function WheelchairScene({ onCanvasReady }: Props) {
  const { t } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const step = useConfigStore((s) => s.currentStep);
  const theme = useConfigStore((s) => s.theme);

  return (
    <div
      className="relative h-full w-full"
      role="img"
      aria-label={t("aria.scene")}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.4, 1.6, 3.4], fov: 32, near: 0.1, far: 60 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onCreated={({ gl }) => {
          if (onCanvasReady) onCanvasReady(gl.domElement);
        }}
      >
        <Suspense fallback={null}>
          <StudioEnvironment theme={theme} />
          <WheelchairModel config={config} />
          <CameraController step={step} model={config.model} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 start-1/2 -translate-x-1/2 rounded-full bg-background/70 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur-md">
        {t("controls.drag")}
      </div>
    </div>
  );
}
