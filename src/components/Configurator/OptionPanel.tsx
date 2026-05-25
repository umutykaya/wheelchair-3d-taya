import { useMemo } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useConfigStore } from "@/store/useConfigStore";
import { STEPS } from "@/config/options";
import { checkCompatibility } from "@/domain/compatibility";
import { CompatibilityBanner } from "@/components/ui/CompatibilityBanner";
import { FrameStep } from "./steps/FrameStep";
import { WheelsStep } from "./steps/WheelsStep";
import { UpholsteryStep } from "./steps/UpholsteryStep";
import { ArmrestsStep } from "./steps/ArmrestsStep";
import { FootrestsStep } from "./steps/FootrestsStep";
import { BackrestStep } from "./steps/BackrestStep";
import { AccessoriesStep } from "./steps/AccessoriesStep";
import { ModelStep } from "./steps/ModelStep";

export function OptionPanel() {
  const { t } = useTranslation();
  const currentStep = useConfigStore((s) => s.currentStep);
  const config = useConfigStore((s) => s.config);
  const nextStep = useConfigStore((s) => s.nextStep);
  const prevStep = useConfigStore((s) => s.prevStep);
  const reset = useConfigStore((s) => s.reset);

  const idx = STEPS.findIndex((s) => s.id === currentStep);
  const isFirst = idx === 0;
  const isLast = idx === STEPS.length - 1;

  const compat = useMemo(() => checkCompatibility(config), [config]);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-border px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("steps." + currentStep)}
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">
          {t(`stepHelp.${currentStep}`, "")}
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <StepView step={currentStep} />
          </motion.div>
        </AnimatePresence>

        {compat.issues.length > 0 && (
          <div className="mt-5">
            <CompatibilityBanner issues={compat.issues} />
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-border px-5 py-3">
        <button
          type="button"
          onClick={reset}
          aria-label={t("actions.reset")}
          className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t("actions.reset")}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevStep}
            disabled={isFirst}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("actions.back")}
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={compat.blocked || isLast}
            className="inline-flex h-9 items-center gap-1 rounded-md bg-foreground px-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isLast ? t("actions.viewSummary") : t("actions.next")}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

function StepView({ step }: { step: string }) {
  switch (step) {
    case "model":
      return <ModelStep />;
    case "frame":
      return <FrameStep />;
    case "wheels":
      return <WheelsStep />;
    case "upholstery":
      return <UpholsteryStep />;
    case "armrests":
      return <ArmrestsStep />;
    case "footrests":
      return <FootrestsStep />;
    case "backrest":
      return <BackrestStep />;
    case "accessories":
      return <AccessoriesStep />;
    default:
      return null;
  }
}
