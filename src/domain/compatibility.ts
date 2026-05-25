import type {
  CompatibilityIssue,
  CompatibilityResult,
  WheelchairConfig,
} from "@/types/config.types";

/**
 * Pure compatibility engine. No side effects.
 * Returns ordered list of issues; `blocked` if any incompatible exists.
 */
export function checkCompatibility(config: WheelchairConfig): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];

  // Standard model: mag wheels add weight to the heavier frame
  if (config.model === "standard" && config.wheels.style === "mag") {
    issues.push({
      level: "info",
      messageKey: "compat.standardMagWheels",
    });
  }

  // Standard model requires armrests for stability
  if (config.model === "standard" && config.armrests.style === "none") {
    issues.push({
      level: "warning",
      messageKey: "compat.standardNoArmrests",
    });
  }

  // Elevating footrests require armrests for stability
  if (config.footrests.style === "elevating" && config.armrests.style === "none") {
    issues.push({
      level: "warning",
      messageKey: "compat.elevatingNoArmrests",
    });
  }

  // High backrest + headrest = synergy info
  if (config.backrest.height === "high" && config.accessories.includes("headrest")) {
    issues.push({
      level: "info",
      messageKey: "compat.highBackrestHeadrest",
    });
  }

  // Solid wheels only available in matte or satin
  if (config.wheels.style === "solid" && config.frame.finish === "gloss") {
    issues.push({
      level: "incompatible",
      messageKey: "compat.solidWheelsGlossFrame",
    });
  }

  // Mag wheels + foam upholstery: weight info
  if (config.wheels.style === "mag" && config.upholstery.material === "foam") {
    issues.push({
      level: "info",
      messageKey: "compat.magFoamWeight",
    });
  }

  // White tires + outdoor: maintenance warning
  if (config.wheels.tire === "white") {
    issues.push({
      level: "info",
      messageKey: "compat.whiteTiresMaintenance",
    });
  }

  // Lumbar support requires mid or high backrest
  if (config.backrest.lumbar && config.backrest.height === "low") {
    issues.push({
      level: "incompatible",
      messageKey: "compat.lumbarLowBackrest",
    });
  }

  // Anti-tip recommended with elevating footrests
  if (
    config.footrests.style === "elevating" &&
    !config.accessories.includes("anti-tip")
  ) {
    issues.push({
      level: "warning",
      messageKey: "compat.elevatingNoAntiTip",
    });
  }

  // Desk armrests + side guards = info synergy
  if (config.armrests.style === "desk" && config.accessories.includes("side-guards")) {
    issues.push({
      level: "info",
      messageKey: "compat.deskArmrestsSideGuards",
    });
  }

  return {
    issues,
    blocked: issues.some((i) => i.level === "incompatible"),
  };
}
