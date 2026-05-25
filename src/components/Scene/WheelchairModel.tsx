import type { WheelchairConfig } from "@/types/config.types";
import { MiniAirModel } from "./models/MiniAirModel";
import { StandardModel } from "./models/StandardModel";

interface Props {
  config: WheelchairConfig;
}

/**
 * Top-level wheelchair model router. Dispatches to the appropriate
 * model variant based on `config.model`. Both variants accept the
 * same `config` prop so all downstream selections continue to drive
 * geometry and materials.
 */
export function WheelchairModel({ config }: Props) {
  if (config.model === "standard") {
    return <StandardModel config={config} />;
  }
  return <MiniAirModel config={config} />;
}
