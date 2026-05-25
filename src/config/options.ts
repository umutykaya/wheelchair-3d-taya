import type {
  AccessoryId,
  ArmrestStyle,
  BackrestHeight,
  FootrestStyle,
  FrameFinish,
  StepId,
  TireColor,
  UpholsteryMaterial,
  WheelchairModelId,
  WheelStyle,
} from "@/types/config.types";

export interface SwatchOption {
  id: string;
  hex: string;
  labelKey: string;
  priceDelta: number;
}

export interface ChoiceOption<T extends string> {
  id: T;
  labelKey: string;
  priceDelta: number;
  descriptionKey?: string;
}

export interface WheelchairModelOption {
  id: WheelchairModelId;
  nameKey: string;
  descriptionKey: string;
  basePrice: number;
  featureKeys: string[];
}

export const WHEELCHAIR_MODELS: WheelchairModelOption[] = [
  {
    id: "mini-air",
    nameKey: "models.miniAir.name",
    descriptionKey: "models.miniAir.description",
    basePrice: 4800,
    featureKeys: [
      "models.miniAir.feat1",
      "models.miniAir.feat2",
      "models.miniAir.feat3",
    ],
  },
  {
    id: "standard",
    nameKey: "models.standard.name",
    descriptionKey: "models.standard.description",
    basePrice: 2200,
    featureKeys: [
      "models.standard.feat1",
      "models.standard.feat2",
      "models.standard.feat3",
    ],
  },
];

export function getModelOption(id: WheelchairModelId): WheelchairModelOption {
  return WHEELCHAIR_MODELS.find((m) => m.id === id) ?? WHEELCHAIR_MODELS[0];
}

// Kept for backward compatibility; equals Mini Air base price.
export const BASE_PRICE = WHEELCHAIR_MODELS[0].basePrice;

// 10 RAL-inspired frame colors
export const FRAME_COLORS: SwatchOption[] = [
  { id: "graphite", hex: "#2A2D34", labelKey: "frame.colors.graphite", priceDelta: 0 },
  { id: "snow", hex: "#F4F4F2", labelKey: "frame.colors.snow", priceDelta: 0 },
  { id: "titanium", hex: "#9098A1", labelKey: "frame.colors.titanium", priceDelta: 60 },
  { id: "midnight", hex: "#1B2A4E", labelKey: "frame.colors.midnight", priceDelta: 80 },
  { id: "forest", hex: "#2C4A3E", labelKey: "frame.colors.forest", priceDelta: 80 },
  { id: "sage", hex: "#7C8A6E", labelKey: "frame.colors.sage", priceDelta: 100 },
  { id: "ruby", hex: "#8E2A3A", labelKey: "frame.colors.ruby", priceDelta: 120 },
  { id: "sunrise", hex: "#D97B3A", labelKey: "frame.colors.sunrise", priceDelta: 120 },
  { id: "champagne", hex: "#C8A86B", labelKey: "frame.colors.champagne", priceDelta: 160 },
  { id: "cobalt", hex: "#2563EB", labelKey: "frame.colors.cobalt", priceDelta: 160 },
];

export const FRAME_FINISHES: ChoiceOption<FrameFinish>[] = [
  { id: "matte", labelKey: "frame.finish.matte", priceDelta: 0 },
  { id: "satin", labelKey: "frame.finish.satin", priceDelta: 60 },
  { id: "gloss", labelKey: "frame.finish.gloss", priceDelta: 120 },
];

export const WHEEL_STYLES: ChoiceOption<WheelStyle>[] = [
  { id: "spoke", labelKey: "wheels.style.spoke", priceDelta: 0 },
  { id: "mag", labelKey: "wheels.style.mag", priceDelta: 140 },
  { id: "solid", labelKey: "wheels.style.solid", priceDelta: 90 },
];

export const TIRE_COLORS: ChoiceOption<TireColor>[] = [
  { id: "black", labelKey: "wheels.tire.black", priceDelta: 0 },
  { id: "grey", labelKey: "wheels.tire.grey", priceDelta: 30 },
  { id: "white", labelKey: "wheels.tire.white", priceDelta: 30 },
];

export const UPHOLSTERY_COLORS: SwatchOption[] = [
  { id: "obsidian", hex: "#0F1117", labelKey: "upholstery.colors.obsidian", priceDelta: 0 },
  { id: "smoke", hex: "#52555E", labelKey: "upholstery.colors.smoke", priceDelta: 0 },
  { id: "sand", hex: "#C8B79A", labelKey: "upholstery.colors.sand", priceDelta: 40 },
  { id: "navy", hex: "#1F2A44", labelKey: "upholstery.colors.navy", priceDelta: 40 },
  { id: "moss", hex: "#3F5446", labelKey: "upholstery.colors.moss", priceDelta: 60 },
  { id: "claret", hex: "#5B1A26", labelKey: "upholstery.colors.claret", priceDelta: 60 },
];

export const UPHOLSTERY_MATERIALS: ChoiceOption<UpholsteryMaterial>[] = [
  { id: "mesh", labelKey: "upholstery.material.mesh", priceDelta: 0 },
  { id: "vinyl", labelKey: "upholstery.material.vinyl", priceDelta: 60 },
  { id: "foam", labelKey: "upholstery.material.foam", priceDelta: 140 },
];

export const ARMREST_STYLES: ChoiceOption<ArmrestStyle>[] = [
  { id: "full", labelKey: "armrests.style.full", priceDelta: 80 },
  { id: "desk", labelKey: "armrests.style.desk", priceDelta: 60 },
  { id: "none", labelKey: "armrests.style.none", priceDelta: 0 },
];

export const FOOTREST_STYLES: ChoiceOption<FootrestStyle>[] = [
  { id: "swing-away", labelKey: "footrests.style.swingAway", priceDelta: 0 },
  { id: "elevating", labelKey: "footrests.style.elevating", priceDelta: 220 },
  { id: "fixed", labelKey: "footrests.style.fixed", priceDelta: -40 },
];

export const BACKREST_HEIGHTS: ChoiceOption<BackrestHeight>[] = [
  { id: "low", labelKey: "backrest.height.low", priceDelta: 0 },
  { id: "mid", labelKey: "backrest.height.mid", priceDelta: 40 },
  { id: "high", labelKey: "backrest.height.high", priceDelta: 120 },
];

export interface AccessoryOption {
  id: AccessoryId;
  labelKey: string;
  priceDelta: number;
}

export const ACCESSORIES: AccessoryOption[] = [
  { id: "headrest", labelKey: "accessories.headrest", priceDelta: 180 },
  { id: "anti-tip", labelKey: "accessories.antiTip", priceDelta: 90 },
  { id: "cup-holder", labelKey: "accessories.cupHolder", priceDelta: 35 },
  { id: "bag", labelKey: "accessories.bag", priceDelta: 60 },
  { id: "side-guards", labelKey: "accessories.sideGuards", priceDelta: 110 },
];

export const STEPS: { id: StepId; labelKey: string }[] = [
  { id: "model", labelKey: "steps.model" },
  { id: "frame", labelKey: "steps.frame" },
  { id: "wheels", labelKey: "steps.wheels" },
  { id: "upholstery", labelKey: "steps.upholstery" },
  { id: "armrests", labelKey: "steps.armrests" },
  { id: "footrests", labelKey: "steps.footrests" },
  { id: "backrest", labelKey: "steps.backrest" },
  { id: "accessories", labelKey: "steps.accessories" },
  { id: "summary", labelKey: "steps.summary" },
];
