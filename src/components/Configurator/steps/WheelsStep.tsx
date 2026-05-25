import { useTranslation } from "react-i18next";
import { WHEEL_STYLES, TIRE_COLORS } from "@/config/options";
import { useConfigStore } from "@/store/useConfigStore";
import { formatPrice } from "@/domain/pricing";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { mapLocale } from "../localeMap";

export function WheelsStep() {
  const { t, i18n } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const setStyle = useConfigStore((s) => s.setWheelStyle);
  const setTire = useConfigStore((s) => s.setTire);
  const fmt = (n: number) => formatPrice(n, mapLocale(i18n.language));

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("wheels.styleTitle")}
        </h3>
        <div className="flex flex-col gap-2">
          {WHEEL_STYLES.map((w) => (
            <ChoiceButton
              key={w.id}
              label={t(w.labelKey)}
              selected={config.wheels.style === w.id}
              onClick={() => setStyle(w.id)}
              priceDelta={w.priceDelta}
              formatPrice={fmt}
            />
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("wheels.tireTitle")}
        </h3>
        <div className="flex flex-col gap-2">
          {TIRE_COLORS.map((c) => (
            <ChoiceButton
              key={c.id}
              label={t(c.labelKey)}
              selected={config.wheels.tire === c.id}
              onClick={() => setTire(c.id)}
              priceDelta={c.priceDelta}
              formatPrice={fmt}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
