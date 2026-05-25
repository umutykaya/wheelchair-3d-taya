import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { STEPS } from "@/config/options";
import { useConfigStore } from "@/store/useConfigStore";
import { cn } from "@/lib/utils";

export function StepIndicator() {
  const { t } = useTranslation();
  const currentStep = useConfigStore((s) => s.currentStep);
  const setStep = useConfigStore((s) => s.setStep);
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <ol className="flex flex-col gap-1">
      {STEPS.map((step, idx) => {
        const active = step.id === currentStep;
        const completed = idx < currentIdx;
        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => setStep(step.id)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-foreground/10 text-foreground"
                  : "text-foreground/70 hover:bg-foreground/5",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                  active
                    ? "bg-foreground text-background"
                    : completed
                      ? "bg-foreground/20 text-foreground"
                      : "bg-muted text-muted-foreground",
                )}
                aria-hidden
              >
                {completed ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </span>
              <span className="text-sm font-medium">{t(step.labelKey)}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
