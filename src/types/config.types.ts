export type FrameFinish = "matte" | "satin" | "gloss";
export type WheelStyle = "spoke" | "mag" | "solid";
export type TireColor = "black" | "grey" | "white";
export type UpholsteryMaterial = "mesh" | "vinyl" | "foam";
export type ArmrestStyle = "full" | "desk" | "none";
export type FootrestStyle = "swing-away" | "elevating" | "fixed";
export type BackrestHeight = "low" | "mid" | "high";
export type AccessoryId =
  | "headrest"
  | "anti-tip"
  | "cup-holder"
  | "bag"
  | "side-guards";

export type WheelchairModelId = "mini-air" | "standard";

export type StepId =
  | "model"
  | "frame"
  | "wheels"
  | "upholstery"
  | "armrests"
  | "footrests"
  | "backrest"
  | "accessories"
  | "summary";

export interface WheelchairConfig {
  model: WheelchairModelId;
  frame: {
    color: string; // hex
    finish: FrameFinish;
  };
  wheels: {
    style: WheelStyle;
    tire: TireColor;
  };
  upholstery: {
    color: string; // hex
    material: UpholsteryMaterial;
  };
  armrests: {
    style: ArmrestStyle;
    heightAdjustable: boolean;
  };
  footrests: {
    style: FootrestStyle;
    colorMatch: boolean;
  };
  backrest: {
    height: BackrestHeight;
    lumbar: boolean;
  };
  accessories: AccessoryId[];
}

export interface CompatibilityIssue {
  level: "info" | "warning" | "incompatible";
  messageKey: string; // i18n key
}

export interface CompatibilityResult {
  issues: CompatibilityIssue[];
  blocked: boolean;
}

export type Theme = "light" | "dark";
export type Locale = "en" | "de" | "fr";
