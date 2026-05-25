import { useTranslation } from "react-i18next";
import { FRAME_COLORS, FRAME_FINISHES } from "@/config/options";
import { useConfigStore } from "@/store/useConfigStore";
import { formatPrice } from "@/domain/pricing";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { mapLocale } from "../localeMap";

export function FrameStep() {
  const { t, i18n } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const setColor = useConfigStore((s) => s.setFrameColor);
  const setFinish = useConfigStore((s) => s.setFrameFinish);
  const fmt = (n: number) => formatPrice(n, mapLocale(i18n.language));

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("frame.colorTitle")}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {FRAME_COLORS.map((c) => (
            <ColorSwatch
              key={c.id}
              hex={c.hex}
              label={t(c.labelKey)}
              selected={config.frame.color === c.hex}
              onClick={() => setColor(c.hex)}
              ariaLabel={t("aria.frameSwatch", { name: t(c.labelKey) })}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("frame.finish.title")}
        </h3>
        <div className="flex flex-col gap-2">
          {FRAME_FINISHES.map((f) => (
            <ChoiceButton
              key={f.id}
              label={t(f.labelKey)}
              selected={config.frame.finish === f.id}
              onClick={() => setFinish(f.id)}
              priceDelta={f.priceDelta}
              formatPrice={fmt}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
