import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useConfigStore } from "@/store/useConfigStore";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { OptionPanel } from "./OptionPanel";
import { SummaryPanel } from "./SummaryPanel";
import { SceneErrorBoundary } from "@/components/Scene/SceneErrorBoundary";

const WheelchairScene = lazy(() =>
  import("@/components/Scene/WheelchairScene").then((m) => ({
    default: m.WheelchairScene,
  })),
);

export function ConfiguratorLayout() {
  const { t } = useTranslation();
  const step = useConfigStore((s) => s.currentStep);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const isSummary = step === "summary";

  return (
    <div className="flex h-dvh w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-baseline gap-3">
          <span className="text-base font-semibold tracking-tight">
            {t("app.title")}
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {t("app.subtitle")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_380px]">
        <aside className="hidden border-e border-border lg:block">
          <div className="p-3">
            <StepIndicator />
          </div>
        </aside>

        <main className="relative min-h-[360px] bg-muted/30">
          <SceneErrorBoundary fallback={<SceneFallback />}>
            <Suspense fallback={<SceneSkeleton />}>
              <WheelchairScene onCanvasReady={setCanvas} />
            </Suspense>
          </SceneErrorBoundary>
        </main>

        <section className="border-t border-border lg:border-s lg:border-t-0">
          {isSummary ? <SummaryPanel canvas={canvas} /> : <OptionPanel />}
        </section>
      </div>
    </div>
  );
}

function SceneSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
        <span className="text-xs">Loading 3D preview…</span>
      </div>
    </div>
  );
}

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 text-center">
      <p className="max-w-xs text-sm text-muted-foreground">
        The 3D preview is unavailable on this device. Your configuration is still
        being saved.
      </p>
    </div>
  );
}
