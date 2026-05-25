import { useTranslation } from "react-i18next";
import { ARMREST_STYLES } from "@/config/options";
import { useConfigStore } from "@/store/useConfigStore";
import { formatPrice } from "@/domain/pricing";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { ToggleRow } from "@/components/ui/ToggleRow";
import { mapLocale } from "../localeMap";

export function ArmrestsStep() {
  const { t, i18n } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const setStyle = useConfigStore((s) => s.setArmrestStyle);
  const setAdj = useConfigStore((s) => s.setArmrestAdjustable);
  const fmt = (n: number) => formatPrice(n, mapLocale(i18n.language));

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("armrests.styleTitle")}
        </h3>
        <div className="flex flex-col gap-2">
          {ARMREST_STYLES.map((a) => (
            <ChoiceButton
              key={a.id}
              label={t(a.labelKey)}
              selected={config.armrests.style === a.id}
              onClick={() => setStyle(a.id)}
              priceDelta={a.priceDelta}
              formatPrice={fmt}
            />
          ))}
        </div>
      </section>
      <ToggleRow
        label={t("armrests.adjustableTitle")}
        priceDelta={70}
        formatPrice={fmt}
        checked={config.armrests.heightAdjustable}
        disabled={config.armrests.style === "none"}
        onToggle={() => setAdj(!config.armrests.heightAdjustable)}
      />
    </div>
  );
}
