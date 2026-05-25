import { useTranslation } from "react-i18next";
import { UPHOLSTERY_COLORS, UPHOLSTERY_MATERIALS } from "@/config/options";
import { useConfigStore } from "@/store/useConfigStore";
import { formatPrice } from "@/domain/pricing";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { mapLocale } from "../localeMap";

export function UpholsteryStep() {
  const { t, i18n } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const setColor = useConfigStore((s) => s.setUpholsteryColor);
  const setMat = useConfigStore((s) => s.setUpholsteryMaterial);
  const fmt = (n: number) => formatPrice(n, mapLocale(i18n.language));

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("upholstery.colorTitle")}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {UPHOLSTERY_COLORS.map((c) => (
            <ColorSwatch
              key={c.id}
              hex={c.hex}
              label={t(c.labelKey)}
              selected={config.upholstery.color === c.hex}
              onClick={() => setColor(c.hex)}
              ariaLabel={t("aria.upholsterySwatch", { name: t(c.labelKey) })}
            />
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("upholstery.materialTitle")}
        </h3>
        <div className="flex flex-col gap-2">
          {UPHOLSTERY_MATERIALS.map((m) => (
            <ChoiceButton
              key={m.id}
              label={t(m.labelKey)}
              selected={config.upholstery.material === m.id}
              onClick={() => setMat(m.id)}
              priceDelta={m.priceDelta}
              formatPrice={fmt}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
