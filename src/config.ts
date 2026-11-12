import type { LovelaceCardConfig, VentilationVisibility } from "./types";

/**
 * Versions up to 0.1.0 kept per-component visibility under the top-level
 * `visibility` key. Home Assistant reserves that key for an array of card
 * visibility conditions, so an object there makes hui-card throw.
 *
 * Move an old-style object to `component_visibility` so existing configs keep
 * hiding the same components. Arrays belong to Home Assistant and are left alone.
 * Keys already set in `component_visibility` win over the old ones.
 */
export function normalizeConfig<T extends LovelaceCardConfig>(config: T): T {
  const legacy: unknown = config.visibility;
  if (!legacy || typeof legacy !== "object" || Array.isArray(legacy)) {
    return config;
  }

  const next = { ...config };
  delete next.visibility;
  next.component_visibility = { ...(legacy as VentilationVisibility), ...config.component_visibility };
  return next;
}
