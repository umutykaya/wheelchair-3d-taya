import { create } from "zustand";
import type {
  AccessoryId,
  StepId,
  Theme,
  WheelchairConfig,
  WheelchairModelId,
} from "@/types/config.types";
import { FRAME_COLORS, STEPS, UPHOLSTERY_COLORS } from "@/config/options";

interface ConfigStore {
  config: WheelchairConfig;
  currentStep: StepId;
  theme: Theme;
  // actions
  setModel: (id: WheelchairModelId) => void;
  setFrameColor: (hex: string) => void;
  setFrameFinish: (finish: WheelchairConfig["frame"]["finish"]) => void;
  setWheelStyle: (style: WheelchairConfig["wheels"]["style"]) => void;
  setTire: (tire: WheelchairConfig["wheels"]["tire"]) => void;
  setUpholsteryColor: (hex: string) => void;
  setUpholsteryMaterial: (m: WheelchairConfig["upholstery"]["material"]) => void;
  setArmrestStyle: (s: WheelchairConfig["armrests"]["style"]) => void;
  setArmrestAdjustable: (v: boolean) => void;
  setFootrestStyle: (s: WheelchairConfig["footrests"]["style"]) => void;
  setFootrestColorMatch: (v: boolean) => void;
  setBackrestHeight: (h: WheelchairConfig["backrest"]["height"]) => void;
  setLumbar: (v: boolean) => void;
  toggleAccessory: (id: AccessoryId) => void;
  setStep: (id: StepId) => void;
  nextStep: () => void;
  prevStep: () => void;
  setTheme: (t: Theme) => void;
  reset: () => void;
}

const initialConfig: WheelchairConfig = {
  model: "mini-air",
  frame: { color: FRAME_COLORS[0].hex, finish: "satin" },
  wheels: { style: "spoke", tire: "black" },
  upholstery: { color: UPHOLSTERY_COLORS[0].hex, material: "mesh" },
  armrests: { style: "full", heightAdjustable: false },
  footrests: { style: "swing-away", colorMatch: true },
  backrest: { height: "mid", lumbar: false },
  accessories: [],
};

function detectInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("wcs-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: initialConfig,
  currentStep: "model",
  theme: detectInitialTheme(),

  setModel: (id) =>
    set((s) => {
      const next: WheelchairConfig = { ...s.config, model: id };
      // Coerce incompatibles for Standard model
      if (id === "standard") {
        if (next.armrests.style === "none") {
          next.armrests = { ...next.armrests, style: "full" };
        }
        if (next.wheels.style === "mag") {
          next.wheels = { ...next.wheels, style: "spoke" };
        }
      }
      return { config: next };
    }),
  setFrameColor: (hex) =>
    set((s) => ({ config: { ...s.config, frame: { ...s.config.frame, color: hex } } })),
  setFrameFinish: (finish) =>
    set((s) => ({ config: { ...s.config, frame: { ...s.config.frame, finish } } })),
  setWheelStyle: (style) =>
    set((s) => ({ config: { ...s.config, wheels: { ...s.config.wheels, style } } })),
  setTire: (tire) =>
    set((s) => ({ config: { ...s.config, wheels: { ...s.config.wheels, tire } } })),
  setUpholsteryColor: (hex) =>
    set((s) => ({
      config: { ...s.config, upholstery: { ...s.config.upholstery, color: hex } },
    })),
  setUpholsteryMaterial: (material) =>
    set((s) => ({
      config: { ...s.config, upholstery: { ...s.config.upholstery, material } },
    })),
  setArmrestStyle: (style) =>
    set((s) => ({ config: { ...s.config, armrests: { ...s.config.armrests, style } } })),
  setArmrestAdjustable: (v) =>
    set((s) => ({
      config: { ...s.config, armrests: { ...s.config.armrests, heightAdjustable: v } },
    })),
  setFootrestStyle: (style) =>
    set((s) => ({
      config: { ...s.config, footrests: { ...s.config.footrests, style } },
    })),
  setFootrestColorMatch: (v) =>
    set((s) => ({
      config: { ...s.config, footrests: { ...s.config.footrests, colorMatch: v } },
    })),
  setBackrestHeight: (height) =>
    set((s) => ({
      config: { ...s.config, backrest: { ...s.config.backrest, height } },
    })),
  setLumbar: (v) =>
    set((s) => ({ config: { ...s.config, backrest: { ...s.config.backrest, lumbar: v } } })),
  toggleAccessory: (id) =>
    set((s) => ({
      config: {
        ...s.config,
        accessories: s.config.accessories.includes(id)
          ? s.config.accessories.filter((a) => a !== id)
          : [...s.config.accessories, id],
      },
    })),
  setStep: (id) => set({ currentStep: id }),
  nextStep: () =>
    set((s) => {
      const i = STEPS.findIndex((st) => st.id === s.currentStep);
      const next = STEPS[Math.min(i + 1, STEPS.length - 1)];
      return { currentStep: next.id };
    }),
  prevStep: () =>
    set((s) => {
      const i = STEPS.findIndex((st) => st.id === s.currentStep);
      const prev = STEPS[Math.max(i - 1, 0)];
      return { currentStep: prev.id };
    }),
  setTheme: (t) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", t === "dark");
      localStorage.setItem("wcs-theme", t);
    }
    set({ theme: t });
  },
  reset: () => set({ config: initialConfig, currentStep: "model" }),
}));
