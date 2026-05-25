import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { WHEELCHAIR_MODELS } from "@/config/options";
import { useConfigStore } from "@/store/useConfigStore";
import { formatPrice } from "@/domain/pricing";
import { mapLocale } from "../localeMap";
import { cn } from "@/lib/utils";

export function ModelStep() {
  const { t, i18n } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const setModel = useConfigStore((s) => s.setModel);
  const fmt = (n: number) => formatPrice(n, mapLocale(i18n.language));

  return (
    <div className="flex flex-col gap-3" role="radiogroup" aria-label={t("steps.model")}>
      {WHEELCHAIR_MODELS.map((m) => {
        const selected = config.model === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setModel(m.id)}
            className={cn(
              "group flex w-full flex-col gap-2 rounded-lg border px-4 py-3.5 text-left",
              "transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "border-foreground bg-foreground/5"
                : "border-border hover:border-foreground/40",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    selected ? "border-foreground bg-foreground text-background" : "border-border",
                  )}
                  aria-hidden
                >
                  {selected && <Check className="h-3 w-3" />}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {t(m.nameKey)}
                </span>
              </div>
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                {fmt(m.basePrice)}
              </span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              {t(m.descriptionKey)}
            </p>
            <ul className="mt-1 flex flex-col gap-0.5">
              {m.featureKeys.map((k) => (
                <li key={k} className="text-[11.5px] text-muted-foreground">
                  · {t(k)}
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}
