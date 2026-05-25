import { useTranslation } from "react-i18next";
import { BACKREST_HEIGHTS } from "@/config/options";
import { useConfigStore } from "@/store/useConfigStore";
import { formatPrice } from "@/domain/pricing";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { ToggleRow } from "@/components/ui/ToggleRow";
import { mapLocale } from "../localeMap";

export function BackrestStep() {
  const { t, i18n } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const setHeight = useConfigStore((s) => s.setBackrestHeight);
  const setLumbar = useConfigStore((s) => s.setLumbar);
  const fmt = (n: number) => formatPrice(n, mapLocale(i18n.language));

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("backrest.heightTitle")}
        </h3>
        <div className="flex flex-col gap-2">
          {BACKREST_HEIGHTS.map((b) => (
            <ChoiceButton
              key={b.id}
              label={t(b.labelKey)}
              selected={config.backrest.height === b.id}
              onClick={() => setHeight(b.id)}
              priceDelta={b.priceDelta}
              formatPrice={fmt}
            />
          ))}
        </div>
      </section>
      <ToggleRow
        label={t("backrest.lumbarTitle")}
        priceDelta={90}
        formatPrice={fmt}
        checked={config.backrest.lumbar}
        onToggle={() => setLumbar(!config.backrest.lumbar)}
      />
    </div>
  );
}
