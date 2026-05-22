export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  language?: string;
  selectedLanguage?: string;
  localize?: (key: string, ...args: unknown[]) => string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    [key: string]: unknown;
  };
}

export type ExchangerType = "rotary" | "crossflow" | "none" | (string & {});

export interface VentilationEntities {
  outdoor_temp?: string;
  supply_temp?: string;
  extract_temp?: string;
  exhaust_temp?: string;
  supply_fan?: string;
  extract_fan?: string;
  heat_exchanger_speed?: string;
  heater_output?: string;
  filter_alarm?: string;
  alarm?: string;
  mode?: string;
}

export type VentilationLabels = Partial<Record<keyof VentilationEntities, string>>;

export interface VentilationColors {
  outdoor_air?: string;
  supply_air?: string;
  extract_air?: string;
  exhaust_air?: string;
}

export interface VentilationValueBoxConfig {
  border_color?: string;
  background_color?: string;
}

export type ValueBoxKey = keyof VentilationEntities;
export type VentilationLayoutSize = "compact" | "normal" | "large";

export interface VentilationValueBoxOverride {
  border_color?: string;
  font_size?: number;
}

export type VentilationVisibility = Partial<Record<ValueBoxKey, boolean>>;

export interface VentilationAnimationConfig {
  enabled?: boolean;
  airflow_enabled?: boolean;
  fans_enabled?: boolean;
  rotor_enabled?: boolean;
  airflow_max_speed?: number;
  fan_max_speed?: number;
  rotor_max_speed?: number;
  stop_when_zero?: boolean;
}

export interface VentilationComponentSettings {
  animation_enabled?: boolean;
  animation_max_speed?: number;
  animation_speed?: number;
}

export interface VentilationLayoutConfig {
  size?: VentilationLayoutSize;
}

export interface VentilationFormatConfig {
  decimals?: number;
  show_unit?: boolean;
}

export interface LovelaceCardConfig {
  type: string;
  grid_options?: unknown;
  name?: string;
  language?: string;
  exchanger_type?: ExchangerType;
  show_airflow?: boolean;
  entities?: VentilationEntities;
  labels?: VentilationLabels;
  colors?: VentilationColors;
  value_box?: VentilationValueBoxConfig;
  value_boxes?: Partial<Record<ValueBoxKey, VentilationValueBoxOverride>>;
  visibility?: VentilationVisibility;
  animations?: VentilationAnimationConfig;
  component_settings?: Partial<Record<ValueBoxKey, VentilationComponentSettings>>;
  layout?: VentilationLayoutConfig;
  format?: Partial<Record<ValueBoxKey, VentilationFormatConfig>>;
}

export interface EntityDisplay {
  label: string;
  value: string;
  tone?: "normal" | "warning" | "danger";
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
    }>;
  }

  interface HTMLElementTagNameMap {
    "ventilation-card": HTMLElement;
    "ventilation-card-editor": HTMLElement;
  }
}
