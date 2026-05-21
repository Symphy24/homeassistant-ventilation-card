import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { EntityDisplay, HassEntity, HomeAssistant, LovelaceCardConfig, VentilationEntities } from "./types";

const UNAVAILABLE_STATES = new Set(["unknown", "unavailable", "none", ""]);

const ENTITY_LABELS: Record<keyof VentilationEntities, string> = {
  outdoor_temp: "Outdoor",
  supply_temp: "Supply",
  extract_temp: "Extract",
  exhaust_temp: "Exhaust",
  supply_fan: "Supply fan",
  extract_fan: "Extract fan",
  heat_exchanger_speed: "Heat exchanger",
  heater_output: "Heater",
  filter_alarm: "Filter alarm",
  alarm: "Alarm",
  mode: "Mode",
};

@customElement("ventilation-card")
export class VentilationCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: LovelaceCardConfig;

  public setConfig(config: LovelaceCardConfig): void {
    if (!config) {
      throw new Error("Invalid ventilation-card configuration");
    }

    this.config = {
      name: "Ventilation",
      exchanger_type: "rotary",
      show_airflow: true,
      entities: {},
      ...config,
    };
  }

  public getCardSize(): number {
    return 5;
  }

  protected render() {
    const config = this.config;

    if (!config) {
      return nothing;
    }

    const entities = config.entities ?? {};
    const showAirflow = config.show_airflow !== false;

    return html`
      <ha-card>
        <div class="card">
          <header class="header">
            <h2>${config.name ?? "Ventilation"}</h2>
            <span>${config.exchanger_type ?? "rotary"}</span>
          </header>

          <div class="schematic" aria-label="Ventilation unit schematic">
            ${this.renderSchematic(entities, showAirflow)}
          </div>

          <div class="readings">
            ${this.renderReading("outdoor_temp", entities)}
            ${this.renderReading("supply_temp", entities)}
            ${this.renderReading("extract_temp", entities)}
            ${this.renderReading("exhaust_temp", entities)}
            ${this.renderReading("supply_fan", entities)}
            ${this.renderReading("extract_fan", entities)}
            ${this.renderReading("heat_exchanger_speed", entities)}
            ${this.renderReading("heater_output", entities)}
            ${this.renderReading("filter_alarm", entities)}
            ${this.renderReading("alarm", entities)}
            ${this.renderReading("mode", entities)}
          </div>
        </div>
      </ha-card>
    `;
  }

  private renderSchematic(entities: VentilationEntities, showAirflow: boolean) {
    const outdoorTemp = this.entityDisplay("outdoor_temp", entities).value;
    const supplyTemp = this.entityDisplay("supply_temp", entities).value;
    const extractTemp = this.entityDisplay("extract_temp", entities).value;
    const exhaustTemp = this.entityDisplay("exhaust_temp", entities).value;
    const supplyFan = this.entityDisplay("supply_fan", entities).value;
    const extractFan = this.entityDisplay("extract_fan", entities).value;

    return html`
      <svg viewBox="0 0 760 360" role="img">
        <defs>
          <marker id="arrow-cool" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" class="arrow-head cool"></path>
          </marker>
          <marker id="arrow-warm" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" class="arrow-head warm"></path>
          </marker>
          <marker id="arrow-neutral" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" class="arrow-head neutral"></path>
          </marker>
        </defs>

        <rect x="185" y="70" width="390" height="220" rx="10" class="unit-shell"></rect>
        <line x1="185" y1="180" x2="575" y2="180" class="divider"></line>

        <path d="M35 120 H225 H330" class="duct cool ${showAirflow ? "flow" : ""}" marker-end="url(#arrow-cool)"></path>
        <path d="M430 120 H610 H725" class="duct neutral ${showAirflow ? "flow" : ""}" marker-end="url(#arrow-neutral)"></path>
        <path d="M725 240 H535 H430" class="duct warm ${showAirflow ? "flow reverse" : ""}" marker-end="url(#arrow-warm)"></path>
        <path d="M330 240 H150 H35" class="duct exhaust ${showAirflow ? "flow reverse" : ""}" marker-end="url(#arrow-neutral)"></path>

        <g class="exchanger" transform="translate(380 180)">
          <circle r="58"></circle>
          <path d="M0 -44 A44 44 0 0 1 44 0 L18 0 A18 18 0 0 0 0 -18 Z"></path>
          <path d="M0 44 A44 44 0 0 1 -44 0 L-18 0 A18 18 0 0 0 0 18 Z"></path>
          <line x1="-41" y1="-41" x2="41" y2="41"></line>
          <line x1="-41" y1="41" x2="41" y2="-41"></line>
        </g>

        <g class="fan supply" transform="translate(510 120)">
          <circle r="31"></circle>
          <path d="M0 -24 C18 -15 18 15 0 24 C8 8 8 -8 0 -24"></path>
          <path d="M-21 12 C-17 -9 9 -23 24 -7 C7 -8 -7 -2 -21 12"></path>
          <path d="M21 12 C3 25 -23 14 -24 -7 C-11 2 4 8 21 12"></path>
        </g>

        <g class="fan extract" transform="translate(250 240)">
          <circle r="31"></circle>
          <path d="M0 -24 C18 -15 18 15 0 24 C8 8 8 -8 0 -24"></path>
          <path d="M-21 12 C-17 -9 9 -23 24 -7 C7 -8 -7 -2 -21 12"></path>
          <path d="M21 12 C3 25 -23 14 -24 -7 C-11 2 4 8 21 12"></path>
        </g>

        <g class="labels">
          <text x="35" y="92">Outdoor air</text>
          <text x="35" y="146">${outdoorTemp}</text>
          <text x="620" y="92">Supply air</text>
          <text x="620" y="146">${supplyTemp}</text>
          <text x="620" y="268">Extract air</text>
          <text x="620" y="224">${extractTemp}</text>
          <text x="35" y="268">Exhaust air</text>
          <text x="35" y="224">${exhaustTemp}</text>
          <text x="475" y="74">Supply fan ${supplyFan}</text>
          <text x="210" y="310">Extract fan ${extractFan}</text>
        </g>
      </svg>
    `;
  }

  private renderReading(key: keyof VentilationEntities, entities: VentilationEntities) {
    const display = this.entityDisplay(key, entities);

    return html`
      <div class="reading ${display.tone ?? "normal"}">
        <span>${display.label}</span>
        <strong>${display.value}</strong>
      </div>
    `;
  }

  private entityDisplay(key: keyof VentilationEntities, entities: VentilationEntities): EntityDisplay {
    const entityId = entities[key];
    const stateObj = entityId ? this.hass?.states[entityId] : undefined;
    const value = this.formatEntityValue(stateObj);
    const tone = this.entityTone(stateObj);

    return {
      label: ENTITY_LABELS[key],
      value,
      tone,
    };
  }

  private formatEntityValue(entity?: HassEntity): string {
    if (!entity || UNAVAILABLE_STATES.has(String(entity.state).toLowerCase())) {
      return "—";
    }

    const unit = entity.attributes.unit_of_measurement;
    return unit ? `${entity.state} ${unit}` : entity.state;
  }

  private entityTone(entity?: HassEntity): EntityDisplay["tone"] {
    if (!entity || UNAVAILABLE_STATES.has(String(entity.state).toLowerCase())) {
      return "normal";
    }

    const normalized = String(entity.state).toLowerCase();
    if (["on", "problem", "detected", "active", "true"].includes(normalized)) {
      return "danger";
    }

    if (["warning", "pending"].includes(normalized)) {
      return "warning";
    }

    return "normal";
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color, #111);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }

    .card {
      padding: 16px;
    }

    .header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
    }

    .header span {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      text-transform: uppercase;
    }

    .schematic {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
      border-radius: 8px;
      background:
        linear-gradient(90deg, rgba(65, 148, 216, 0.08), transparent 30%, transparent 70%, rgba(229, 126, 62, 0.08)),
        var(--secondary-background-color, rgba(127, 127, 127, 0.08));
      overflow: hidden;
    }

    svg {
      display: block;
      width: 100%;
      height: auto;
      min-height: 230px;
    }

    .unit-shell {
      fill: var(--card-background-color, #fff);
      stroke: var(--primary-text-color, #111);
      stroke-opacity: 0.28;
      stroke-width: 2;
    }

    .divider {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.45));
      stroke-width: 2;
    }

    .duct {
      fill: none;
      stroke-width: 18;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 28 18;
    }

    .duct.cool {
      stroke: var(--info-color, #2196f3);
    }

    .duct.neutral {
      stroke: var(--success-color, #43a047);
    }

    .duct.warm {
      stroke: var(--warning-color, #f6a623);
    }

    .duct.exhaust {
      stroke: var(--secondary-text-color, #727272);
    }

    .flow {
      animation: airflow 1.4s linear infinite;
    }

    .flow.reverse {
      animation-direction: reverse;
    }

    .arrow-head {
      stroke: none;
    }

    .arrow-head.cool {
      fill: var(--info-color, #2196f3);
    }

    .arrow-head.warm {
      fill: var(--warning-color, #f6a623);
    }

    .arrow-head.neutral {
      fill: var(--success-color, #43a047);
    }

    .exchanger circle,
    .fan circle {
      fill: var(--ha-card-background, var(--card-background-color, #fff));
      stroke: var(--primary-text-color, #111);
      stroke-opacity: 0.45;
      stroke-width: 3;
    }

    .exchanger path,
    .fan path {
      fill: var(--secondary-text-color, #727272);
      opacity: 0.72;
    }

    .exchanger line {
      stroke: var(--primary-text-color, #111);
      stroke-opacity: 0.35;
      stroke-width: 3;
    }

    .labels text {
      fill: var(--primary-text-color, #111);
      font-size: 18px;
      font-weight: 600;
    }

    .labels text:nth-child(2n) {
      fill: var(--secondary-text-color, #727272);
      font-size: 16px;
      font-weight: 500;
    }

    .readings {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
      margin-top: 12px;
    }

    .reading {
      min-width: 0;
      padding: 10px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.06));
    }

    .reading span,
    .reading strong {
      display: block;
      overflow-wrap: anywhere;
    }

    .reading span {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      line-height: 1.2;
    }

    .reading strong {
      margin-top: 4px;
      color: var(--primary-text-color, #111);
      font-size: 15px;
      font-weight: 600;
      line-height: 1.25;
    }

    .reading.warning strong {
      color: var(--warning-color, #f6a623);
    }

    .reading.danger strong {
      color: var(--error-color, #db4437);
    }

    @keyframes airflow {
      to {
        stroke-dashoffset: -46;
      }
    }

    @media (max-width: 520px) {
      .card {
        padding: 12px;
      }

      h2 {
        font-size: 18px;
      }

      .labels text {
        font-size: 15px;
      }

      .labels text:nth-child(2n) {
        font-size: 13px;
      }
    }
  `;
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ventilation-card",
  name: "Ventilation Card",
  description: "Residential ventilation/AHU visualization card.",
});
