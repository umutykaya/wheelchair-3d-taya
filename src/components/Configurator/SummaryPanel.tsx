import { useMemo, useState } from "react";
import { Download, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import { useConfigStore } from "@/store/useConfigStore";
import { calculatePrice, formatPrice } from "@/domain/pricing";
import {
  ACCESSORIES,
  ARMREST_STYLES,
  BACKREST_HEIGHTS,
  FOOTREST_STYLES,
  FRAME_COLORS,
  FRAME_FINISHES,
  TIRE_COLORS,
  UPHOLSTERY_COLORS,
  UPHOLSTERY_MATERIALS,
  WHEEL_STYLES,
  WHEELCHAIR_MODELS,
} from "@/config/options";
import { snapshotCanvas } from "@/utils/snapshotCanvas";
import { mapLocale } from "./localeMap";
import { QuoteModal } from "./QuoteModal";

interface Props {
  canvas: HTMLCanvasElement | null;
}

export function SummaryPanel({ canvas }: Props) {
  const { t, i18n } = useTranslation();
  const config = useConfigStore((s) => s.config);
  const fmt = (n: number) => formatPrice(n, mapLocale(i18n.language));
  const [quoteOpen, setQuoteOpen] = useState(false);

  const breakdown = useMemo(() => calculatePrice(config), [config]);
  const thumb = useMemo(() => snapshotCanvas(canvas), [canvas, config]);

  const rows = useMemo(
    () => buildSpecRows(config, t),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, i18n.language],
  );

  const handlePdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const page = doc.internal.pageSize.getWidth();
    doc.setFontSize(20);
    doc.text(t("app.title"), 40, 50);
    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text(t("summary.specSheet"), 40, 68);
    doc.setTextColor(20);

    let y = 100;
    if (thumb) {
      try {
        doc.addImage(thumb, "PNG", 40, y, 220, 165);
      } catch {
        // ignore
      }
    }

    let textX = thumb ? 280 : 40;
    let textY = thumb ? y + 6 : y;
    doc.setFontSize(11);
    for (const r of rows) {
      doc.setTextColor(120);
      doc.text(r.label, textX, textY);
      doc.setTextColor(20);
      doc.text(r.value, textX + 110, textY);
      textY += 16;
      if (textY > 760) {
        doc.addPage();
        textY = 60;
      }
    }

    y = Math.max(textY, y + 200) + 20;
    doc.setDrawColor(220);
    doc.line(40, y, page - 40, y);
    y += 24;
    doc.setFontSize(12);
    doc.text(t("summary.base"), 40, y);
    doc.text(fmt(breakdown.base), page - 40, y, { align: "right" });
    y += 18;
    for (const line of breakdown.lines) {
      doc.setTextColor(120);
      doc.text(line.label, 40, y);
      doc.setTextColor(20);
      doc.text(`+${fmt(line.amount)}`, page - 40, y, { align: "right" });
      y += 16;
    }
    y += 10;
    doc.setDrawColor(40);
    doc.line(40, y, page - 40, y);
    y += 22;
    doc.setFontSize(14);
    doc.text(t("summary.total"), 40, y);
    doc.text(fmt(breakdown.total), page - 40, y, { align: "right" });

    doc.save(`taya-configuration-${Date.now()}.pdf`);
  };

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-5">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">{t("summary.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("summary.subtitle")}</p>
      </header>

      {thumb && (
        <div className="overflow-hidden rounded-lg border border-border">
          <img
            src={thumb}
            alt={t("summary.snapshot")}
            className="block w-full bg-muted"
          />
        </div>
      )}

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("summary.specSheet")}
        </h3>
        <dl className="divide-y divide-border rounded-lg border border-border">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex justify-between gap-3 px-3 py-2 text-sm"
            >
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="font-medium text-foreground">{r.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-border p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("summary.base")}</span>
          <span className="font-medium">{fmt(breakdown.base)}</span>
        </div>
        {breakdown.lines.map((line) => (
          <div key={line.key} className="mt-1 flex justify-between text-[12.5px]">
            <span className="truncate text-muted-foreground">{line.label}</span>
            <span className="shrink-0">+{fmt(line.amount)}</span>
          </div>
        ))}
        <div className="mt-3 border-t border-border pt-3 flex justify-between text-base font-semibold">
          <span>{t("summary.total")}</span>
          <span>{fmt(breakdown.total)}</span>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {t("summary.disclaimer")}
        </p>
      </section>

      <div className="mt-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={handlePdf}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Download className="h-4 w-4" /> {t("actions.downloadPdf")}
        </button>
        <button
          type="button"
          onClick={() => setQuoteOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Mail className="h-4 w-4" /> {t("actions.requestQuote")}
        </button>
      </div>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}

function buildSpecRows(
  config: import("@/types/config.types").WheelchairConfig,
  t: (k: string, o?: Record<string, unknown>) => string,
): { label: string; value: string }[] {
  const fc = FRAME_COLORS.find((c) => c.hex === config.frame.color);
  const ff = FRAME_FINISHES.find((c) => c.id === config.frame.finish);
  const ws = WHEEL_STYLES.find((c) => c.id === config.wheels.style);
  const tc = TIRE_COLORS.find((c) => c.id === config.wheels.tire);
  const uc = UPHOLSTERY_COLORS.find((c) => c.hex === config.upholstery.color);
  const um = UPHOLSTERY_MATERIALS.find((c) => c.id === config.upholstery.material);
  const ar = ARMREST_STYLES.find((c) => c.id === config.armrests.style);
  const fr = FOOTREST_STYLES.find((c) => c.id === config.footrests.style);
  const bh = BACKREST_HEIGHTS.find((c) => c.id === config.backrest.height);
  const md = WHEELCHAIR_MODELS.find((m) => m.id === config.model);
  const accLabels = config.accessories
    .map((id) => ACCESSORIES.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => t(a.labelKey))
    .join(", ");

  return [
    { label: t("steps.model"), value: md ? t(md.nameKey) : "—" },
    { label: t("steps.frame"), value: `${fc ? t(fc.labelKey) : "—"} · ${ff ? t(ff.labelKey) : "—"}` },
    { label: t("steps.wheels"), value: `${ws ? t(ws.labelKey) : "—"} · ${tc ? t(tc.labelKey) : "—"}` },
    { label: t("steps.upholstery"), value: `${uc ? t(uc.labelKey) : "—"} · ${um ? t(um.labelKey) : "—"}` },
    {
      label: t("steps.armrests"),
      value: `${ar ? t(ar.labelKey) : "—"}${config.armrests.heightAdjustable ? ` · ${t("armrests.adjustableTitle")}` : ""}`,
    },
    { label: t("steps.footrests"), value: fr ? t(fr.labelKey) : "—" },
    {
      label: t("steps.backrest"),
      value: `${bh ? t(bh.labelKey) : "—"}${config.backrest.lumbar ? ` · ${t("backrest.lumbarTitle")}` : ""}`,
    },
    {
      label: t("steps.accessories"),
      value: accLabels || t("summary.included"),
    },
  ];
}
