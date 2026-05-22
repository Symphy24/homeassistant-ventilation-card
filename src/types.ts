export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
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

export type ExchangerType = "rotary" | "crossflow" | "counterflow" | "none" | (string & {});

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
  text_color?: string;
}

export interface LovelaceCardConfig {
  type: string;
  name?: string;
  exchanger_type?: ExchangerType;
  show_airflow?: boolean;
  entities?: VentilationEntities;
  labels?: VentilationLabels;
  colors?: VentilationColors;
  value_box?: VentilationValueBoxConfig;
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
