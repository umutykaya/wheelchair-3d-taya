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
  getModelOption,
} from "@/config/options";
import type { WheelchairConfig } from "@/types/config.types";

interface Priced {
  id: string;
  priceDelta: number;
}

function delta(list: Priced[], id: string): number {
  return list.find((o) => o.id === id)?.priceDelta ?? 0;
}

export interface PriceBreakdown {
  base: number;
  lines: { key: string; label: string; amount: number }[];
  total: number;
}

export function calculatePrice(config: WheelchairConfig): PriceBreakdown {
  const lines: PriceBreakdown["lines"] = [];

  const addLine = (key: string, label: string, amount: number) => {
    if (amount !== 0) lines.push({ key, label, amount });
  };

  addLine("frame.color", config.frame.color, delta(FRAME_COLORS, frameColorIdFromHex(config.frame.color)));
  addLine("frame.finish", config.frame.finish, delta(FRAME_FINISHES, config.frame.finish));
  addLine("wheels.style", config.wheels.style, delta(WHEEL_STYLES, config.wheels.style));
  addLine("wheels.tire", config.wheels.tire, delta(TIRE_COLORS, config.wheels.tire));
  addLine(
    "upholstery.color",
    config.upholstery.color,
    delta(UPHOLSTERY_COLORS, upholsteryColorIdFromHex(config.upholstery.color)),
  );
  addLine(
    "upholstery.material",
    config.upholstery.material,
    delta(UPHOLSTERY_MATERIALS, config.upholstery.material),
  );
  addLine("armrests.style", config.armrests.style, delta(ARMREST_STYLES, config.armrests.style));
  if (config.armrests.heightAdjustable) addLine("armrests.heightAdjustable", "true", 70);
  addLine("footrests.style", config.footrests.style, delta(FOOTREST_STYLES, config.footrests.style));
  addLine("backrest.height", config.backrest.height, delta(BACKREST_HEIGHTS, config.backrest.height));
  if (config.backrest.lumbar) addLine("backrest.lumbar", "true", 90);

  for (const accId of config.accessories) {
    addLine(`accessory.${accId}`, accId, delta(ACCESSORIES, accId));
  }

  const base = getModelOption(config.model).basePrice;
  const total = base + lines.reduce((s, l) => s + l.amount, 0);

  return { base, lines, total };
}

export function frameColorIdFromHex(hex: string): string {
  return FRAME_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase())?.id ?? "graphite";
}

export function upholsteryColorIdFromHex(hex: string): string {
  return UPHOLSTERY_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase())?.id ?? "obsidian";
}

export function formatPrice(n: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
