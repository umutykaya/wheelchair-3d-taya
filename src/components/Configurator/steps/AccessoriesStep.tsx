import { useTranslation } from "react-i18next";
import { ACCESSORIES } from "@/config/options";
import { useConfigStore } from "@/store/useConfigStore";
import { formatPrice } from "@/domain/pricing";
import { ToggleRow } from "@/components/ui/ToggleRow";
import { mapLocale } from "../localeMap";

export function AccessoriesStep() {
  const { t, i18n } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const toggle = useConfigStore((s) => s.toggleAccessory);
  const fmt = (n: number) => formatPrice(n, mapLocale(i18n.language));

  return (
    <div className="flex flex-col gap-2">
      {ACCESSORIES.map((a) => (
        <ToggleRow
          key={a.id}
          label={t(a.labelKey)}
          priceDelta={a.priceDelta}
          formatPrice={fmt}
          checked={config.accessories.includes(a.id)}
          onToggle={() => toggle(a.id)}
        />
      ))}
    </div>
  );
}
