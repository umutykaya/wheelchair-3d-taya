import { useTranslation } from "react-i18next";
import { FOOTREST_STYLES } from "@/config/options";
import { useConfigStore } from "@/store/useConfigStore";
import { formatPrice } from "@/domain/pricing";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { ToggleRow } from "@/components/ui/ToggleRow";
import { mapLocale } from "../localeMap";

export function FootrestsStep() {
  const { t, i18n } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const setStyle = useConfigStore((s) => s.setFootrestStyle);
  const setMatch = useConfigStore((s) => s.setFootrestColorMatch);
  const fmt = (n: number) => formatPrice(n, mapLocale(i18n.language));

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("footrests.styleTitle")}
        </h3>
        <div className="flex flex-col gap-2">
          {FOOTREST_STYLES.map((f) => (
            <ChoiceButton
              key={f.id}
              label={t(f.labelKey)}
              selected={config.footrests.style === f.id}
              onClick={() => setStyle(f.id)}
              priceDelta={f.priceDelta}
              formatPrice={fmt}
            />
          ))}
        </div>
      </section>
      <ToggleRow
        label={t("footrests.colorMatchTitle")}
        checked={config.footrests.colorMatch}
        onToggle={() => setMatch(!config.footrests.colorMatch)}
      />
    </div>
  );
}
