import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./ventilation-card-editor";
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


  public static async getConfigElement(): Promise<HTMLElement> {
    await customElements.whenDefined("ventilation-card-editor");
    return document.createElement("ventilation-card-editor");
  }

  public static getStubConfig(): LovelaceCardConfig {
    return {
      type: "custom:ventilation-card",
      name: "Ventilation",
      exchanger_type: "rotary",
      entities: {},
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
          </header>

          <div class="schematic" style=${this.schematicStyle()} aria-label="Ventilation unit schematic">
            ${this.renderSchematic(entities, showAirflow)}
          </div>

          <footer class="status-strip">
            ${this.renderStatusItem("mode", entities)}
            ${this.renderStatusItem("filter_alarm", entities)}
            ${this.renderStatusItem("alarm", entities)}
          </footer>
        </div>
      </ha-card>
    `;
  }


  private schematicStyle(): string {
    const colors = this.config?.colors;
    const valueBox = this.config?.value_box;
    const styleValues: Array<[string, string | undefined]> = [
      ["--vc-air-outdoor", colors?.outdoor_air],
      ["--vc-air-supply", colors?.supply_air],
      ["--vc-air-extract", colors?.extract_air],
      ["--vc-air-exhaust", colors?.exhaust_air],
      ["--vc-value-box-border-color", valueBox?.border_color],
      ["--vc-value-box-background-color", valueBox?.background_color],
      ["--vc-value-box-text-color", valueBox?.text_color],
    ];

    return styleValues
      .filter(([, value]) => value && value.trim().length > 0)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");
  }

  private renderSchematic(entities: VentilationEntities, showAirflow: boolean) {
    const outdoorTemp = this.entityDisplay("outdoor_temp", entities);
    const supplyTemp = this.entityDisplay("supply_temp", entities);
    const extractTemp = this.entityDisplay("extract_temp", entities);
    const exhaustTemp = this.entityDisplay("exhaust_temp", entities);
    const supplyFan = this.entityDisplay("supply_fan", entities);
    const extractFan = this.entityDisplay("extract_fan", entities);
    const heatExchanger = this.entityDisplay("heat_exchanger_speed", entities);
    const heater = this.entityDisplay("heater_output", entities);
    const supplyFanSpeed = this.entityNumericValue(entities.supply_fan);
    const extractFanSpeed = this.entityNumericValue(entities.extract_fan);
    const heaterOutput = this.entityNumericValue(entities.heater_output);
    const rotorSpeed = this.entityNumericValue(entities.heat_exchanger_speed);
    const supplyAirflowActive = showAirflow && supplyFanSpeed > 0;
    const extractAirflowActive = showAirflow && extractFanSpeed > 0;
    const supplyAirflowDuration = this.getAnimationDurationFromValue(supplyFanSpeed, 0.8, 4.8);
    const extractAirflowDuration = this.getAnimationDurationFromValue(extractFanSpeed, 0.8, 4.8);
    const supplyFanDuration = this.getAnimationDurationFromValue(supplyFanSpeed, 1.45, 4.2);
    const extractFanDuration = this.getAnimationDurationFromValue(extractFanSpeed, 1.45, 4.2);
    const rotorDuration = this.getAnimationDurationFromValue(rotorSpeed, 3.2, 14);

    return html`
      <svg
        viewBox="0 0 920 360"
        role="img"
        style="--supply-fan-duration: ${supplyFanDuration}; --extract-fan-duration: ${extractFanDuration}; --rotor-duration: ${rotorDuration}; --supply-airflow-duration: ${supplyAirflowDuration}; --extract-airflow-duration: ${extractAirflowDuration};"
      >
        <defs>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.14"></feDropShadow>
          </filter>
          <marker id="arrow-outdoor" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" class="arrow-head outdoor"></path>
          </marker>
          <marker id="arrow-supply" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" class="arrow-head supply"></path>
          </marker>
          <marker id="arrow-extract" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" class="arrow-head extract"></path>
          </marker>
          <marker id="arrow-exhaust" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" class="arrow-head exhaust"></path>
          </marker>
        </defs>

        <rect x="140" y="54" width="640" height="246" rx="12" class="unit-shell"></rect>
        <line x1="140" y1="180" x2="780" y2="180" class="unit-divider"></line>
        <line x1="460" y1="54" x2="460" y2="300" class="unit-divider muted"></line>

        <path d="M780 120 H900" class="duct-outline"></path>
        <path d="M140 120 H20" class="duct-outline"></path>
        <path d="M20 240 H140" class="duct-outline"></path>
        <path d="M780 240 H900" class="duct-outline"></path>
        <path d="M140 120 H780" class="internal-duct-outline"></path>
        <path d="M140 240 H780" class="internal-duct-outline"></path>

        <path d="M780 120 H900" class="duct-fill extract"></path>
        <path d="M886 120 H794" class="flow-line extract extract-air ${extractAirflowActive ? "flow" : ""}"></path>
        <path d="M140 120 H20" class="duct-fill exhaust"></path>
        <path d="M126 120 H34" class="flow-line exhaust extract-air ${extractAirflowActive ? "flow" : ""}"></path>
        <path d="M20 240 H140" class="duct-fill outdoor"></path>
        <path d="M34 240 H126" class="flow-line outdoor supply-air ${supplyAirflowActive ? "flow" : ""}"></path>
        <path d="M780 240 H900" class="duct-fill supply"></path>
        <path d="M794 240 H886" class="flow-line supply supply-air ${supplyAirflowActive ? "flow" : ""}"></path>

        <path d="M28 120 L40 113 L40 127 Z" class="outer-arrow exhaust"></path>
        <path d="M876 120 L888 113 L888 127 Z" class="outer-arrow extract"></path>
        <path d="M42 240 L30 233 L30 247 Z" class="outer-arrow outdoor"></path>
        <path d="M892 240 L880 233 L880 247 Z" class="outer-arrow supply"></path>

        <path d="M150 240 H194" class="internal-flow-line outdoor supply-air ${supplyAirflowActive ? "flow" : ""}"></path>
        <path d="M246 240 H388" class="internal-flow-line outdoor supply-air ${supplyAirflowActive ? "flow" : ""}"></path>
        <path d="M532 240 H624" class="internal-flow-line supply supply-air ${supplyAirflowActive ? "flow" : ""}"></path>
        <path d="M696 240 H712" class="internal-flow-line supply supply-air ${supplyAirflowActive ? "flow" : ""}"></path>
        <path d="M756 240 H770" class="internal-flow-line supply supply-air ${supplyAirflowActive ? "flow" : ""}"></path>
        <path d="M770 120 H728" class="internal-flow-line extract extract-air ${extractAirflowActive ? "flow" : ""}"></path>
        <path d="M676 120 H532" class="internal-flow-line extract extract-air ${extractAirflowActive ? "flow" : ""}"></path>
        <path d="M388 120 H294" class="internal-flow-line exhaust extract-air ${extractAirflowActive ? "flow" : ""}"></path>
        <path d="M226 120 H150" class="internal-flow-line exhaust extract-air ${extractAirflowActive ? "flow" : ""}"></path>

        ${this.renderFilter(220, 240)}
        ${this.renderFilter(702, 120)}
        ${this.renderHeatExchanger(460, 180, rotorSpeed, rotorDuration)}
        ${this.renderFan(260, 120, extractFanSpeed, extractFanDuration, "extract")}
        ${this.renderFan(660, 240, supplyFanSpeed, supplyFanDuration, "supply")}
        ${this.renderHeaterCoil(734, 240, heaterOutput)}

        <g class="badges">
          ${this.renderValueLabel(28, 64, exhaustTemp.label, exhaustTemp.value, "exhaust")}
          ${this.renderValueLabel(792, 64, extractTemp.label, extractTemp.value, "extract")}
          ${this.renderValueLabel(28, 258, outdoorTemp.label, outdoorTemp.value, "outdoor")}
          ${this.renderValueLabel(792, 258, supplyTemp.label, supplyTemp.value, "supply")}
          ${this.renderValueLabel(190, 38, extractFan.label, extractFan.value, "component")}
          ${this.renderValueLabel(610, 304, supplyFan.label, supplyFan.value, "component")}
          ${this.renderValueLabel(411, 274, heatExchanger.label, heatExchanger.value, "component")}
          ${this.renderValueLabel(714, 178, heater.label, heater.value, heaterOutput > 0 ? "heater-active" : "neutral")}
        </g>
      </svg>
    `;
  }

  private renderFan(x: number, y: number, speed: number, duration: string, tone: "supply" | "extract") {
    const active = speed > 0;

    return svg`
      <g class="fan-symbol ${tone}" transform="translate(${x} ${y})" style="--fan-duration: ${duration};">
        <circle class="fan-ring" r="30"></circle>
        <g class="fan-blades ${active ? "spin" : ""}">
          <path d="M0 -23 C11 -22 20 -15 20 -6 C20 -1 16 2 11 1 C5 0 2 -8 0 -23"></path>
          <path d="M23 0 C22 11 15 20 6 20 C1 20 -2 16 -1 11 C0 5 8 2 23 0"></path>
          <path d="M0 23 C-11 22 -20 15 -20 6 C-20 1 -16 -2 -11 -1 C-5 0 -2 8 0 23"></path>
          <path d="M-23 0 C-22 -11 -15 -20 -6 -20 C-1 -20 2 -16 1 -11 C0 -5 -8 -2 -23 0"></path>
          <circle class="fan-hub" r="7"></circle>
        </g>
      </g>
    `;
  }

  private renderHeatExchanger(x: number, y: number, speed: number, duration: string) {
    const active = speed > 0;

    return svg`
      <g class="heat-exchanger" transform="translate(${x} ${y})" style="--rotor-duration: ${duration};">
        <circle class="rotor-ring" r="72"></circle>
        <g class="rotor-motion ${active ? "spin" : ""}">
          <path class="rotor-arrow" d="M-47 -43 A64 64 0 0 1 47 -43"></path>
          <path class="rotor-arrow-head" d="M35 -48 L47 -43 L43 -55"></path>
          <path class="rotor-arrow" d="M47 43 A64 64 0 0 1 -47 43"></path>
          <path class="rotor-arrow-head" d="M-35 48 L-47 43 L-43 55"></path>
        </g>
        <g class="heat-waves">
          <path d="M-28 -48 C-14 -30 -42 -12 -28 8 C-14 28 -42 42 -28 54"></path>
          <path d="M0 -54 C15 -34 -15 -14 0 8 C15 30 -15 44 0 58"></path>
          <path d="M28 -48 C42 -30 14 -12 28 8 C42 28 14 42 28 54"></path>
        </g>
      </g>
    `;
  }

  private renderHeaterCoil(x: number, y: number, output: number) {
    return svg`
      <g class="heater-coil ${output > 0 ? "active" : ""}" transform="translate(${x} ${y})">
        <path class="heater-frame" d="M-18 -28 V28"></path>
        <path d="M-10 -20 H22"></path>
        <path d="M-10 -10 H22"></path>
        <path d="M-10 0 H22"></path>
        <path d="M-10 10 H22"></path>
        <path d="M-10 20 H22"></path>
        <path class="heater-bus" d="M22 -20 V20"></path>
      </g>
    `;
  }

  private renderFilter(x: number, y: number) {
    return svg`
      <g class="filter-symbol" transform="translate(${x} ${y})">
        <rect x="-18" y="-24" width="36" height="48" rx="4"></rect>
        <path d="M-11 -18 L11 18"></path>
        <path d="M-3 -18 L18 16"></path>
        <path d="M-18 -12 L3 22"></path>
      </g>
    `;
  }

  private renderDamper(x: number, y: number) {
    return svg`
      <g class="damper-symbol" transform="translate(${x} ${y})">
        <rect x="-19" y="-12" width="38" height="24" rx="3"></rect>
        <path d="M-13 8 L13 -8"></path>
        <circle r="2.5"></circle>
      </g>
    `;
  }

  private renderValueLabel(x: number, y: number, label: string, value: string, tone = "neutral") {
    return svg`
      <g class="svg-badge ${tone}" transform="translate(${x} ${y})">
        <rect width="98" height="34" rx="6"></rect>
        <text x="8" y="13" class="badge-label">${label}</text>
        <text x="8" y="27" class="badge-value">${value}</text>
      </g>
    `;
  }

  private renderStatusItem(key: keyof VentilationEntities, entities: VentilationEntities) {
    const display = this.entityDisplay(key, entities);

    return html`
      <div class="status-item ${display.tone ?? "normal"}">
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
      label: this.labelFor(key),
      value,
      tone,
    };
  }

  private labelFor(key: keyof VentilationEntities): string {
    return this.config?.labels?.[key] ?? ENTITY_LABELS[key];
  }

  private formatEntityValue(entity?: HassEntity): string {
    if (!entity || UNAVAILABLE_STATES.has(String(entity.state).toLowerCase())) {
      return "\u2014";
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

  private entityNumericValue(entityId?: string): number {
    const entity = entityId ? this.hass?.states[entityId] : undefined;
    if (!entity || UNAVAILABLE_STATES.has(String(entity.state).toLowerCase())) {
      return 0;
    }

    const numeric = Number.parseFloat(String(entity.state).replace(",", "."));
    if (Number.isFinite(numeric)) {
      return Math.max(0, numeric);
    }

    return ["on", "running", "active", "true"].includes(String(entity.state).toLowerCase()) ? 100 : 0;
  }

  private getAnimationDurationFromValue(value: number, minDuration: number, maxDuration: number): string {
    if (value <= 0) {
      return `${maxDuration.toFixed(1)}s`;
    }

    const clamped = Math.min(Math.max(value, 1), 100);
    const seconds = maxDuration - (clamped / 100) * (maxDuration - minDuration);
    return `${seconds.toFixed(1)}s`;
  }

  static styles = css`
    :host {
      display: block;
      --vc-air-outdoor: #63b489;
      --vc-air-supply: #d99a45;
      --vc-air-extract: #e5aa6f;
      --vc-air-exhaust: #456f9f;
      --vc-component-line: var(--primary-text-color, #1f2937);
      --vc-component-muted: var(--secondary-text-color, #6b7280);
      --vc-component-surface: var(--ha-card-background, var(--card-background-color, #ffffff));
    }

    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color, #111);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }

    .card {
      padding: 12px;
    }

    .header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
    }

    .schematic {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.24));
      border-radius: 10px;
      background: transparent;
      overflow: hidden;
    }

    svg {
      display: block;
      width: 100%;
      height: auto;
      max-height: 360px;
      color: var(--primary-text-color, #111);
    }

    .unit-shell {
      fill: var(--ha-card-background, var(--card-background-color, transparent));
      fill-opacity: 0.72;
      filter: url(#soft-shadow);
      stroke: var(--divider-color, rgba(127, 127, 127, 0.5));
      stroke-width: 1.5;
    }

    .unit-divider {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.45));
      stroke-width: 1;
    }

    .unit-divider.muted {
      stroke-dasharray: 5 6;
      stroke-opacity: 0.55;
    }

    .duct-outline {
      fill: none;
      stroke: var(--divider-color, rgba(127, 127, 127, 0.28));
      stroke-width: 25;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.5;
    }

    .duct-fill {
      fill: none;
      stroke-width: 22;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.14;
    }

    .internal-duct-outline {
      fill: none;
      stroke: var(--divider-color, rgba(127, 127, 127, 0.26));
      stroke-width: 23;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.36;
    }

    .flow-line,
    .internal-flow-line {
      fill: none;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-dasharray: 9 9;
      opacity: 0.92;
    }

    .internal-flow-line {
      stroke-width: 2.2;
      opacity: 0.78;
    }

    .duct-fill.outdoor,
    .flow-line.outdoor,
    .internal-flow-line.outdoor {
      stroke: var(--vc-air-outdoor);
    }

    .duct-fill.supply,
    .flow-line.supply,
    .internal-flow-line.supply {
      stroke: var(--vc-air-supply);
    }

    .duct-fill.extract,
    .flow-line.extract,
    .internal-flow-line.extract {
      stroke: var(--vc-air-extract);
    }

    .duct-fill.exhaust,
    .flow-line.exhaust,
    .internal-flow-line.exhaust {
      stroke: var(--vc-air-exhaust);
    }

    .flow {
      animation: airflow var(--airflow-duration, 2.8s) linear infinite;
    }

    .flow.supply-air {
      --airflow-duration: var(--supply-airflow-duration, 2.8s);
    }

    .flow.extract-air {
      --airflow-duration: var(--extract-airflow-duration, 2.8s);
    }

    .arrow-head {
      stroke: none;
    }

    .arrow-head.outdoor {
      fill: var(--vc-air-outdoor);
    }

    .arrow-head.supply {
      fill: var(--vc-air-supply);
    }

    .arrow-head.extract {
      fill: var(--vc-air-extract);
    }

    .arrow-head.exhaust {
      fill: var(--vc-air-exhaust);
    }

    .outer-arrow {
      stroke: none;
    }

    .outer-arrow.outdoor {
      fill: var(--vc-air-outdoor);
    }

    .outer-arrow.supply {
      fill: var(--vc-air-supply);
    }

    .outer-arrow.extract {
      fill: var(--vc-air-extract);
    }

    .outer-arrow.exhaust {
      fill: var(--vc-air-exhaust);
    }

    .fan-symbol,
    .heat-exchanger,
    .heater-coil,
    .filter-symbol,
    .damper-symbol {
      color: var(--vc-component-line);
      opacity: 1;
      pointer-events: none;
    }

    .fan-ring,
    .rotor-ring,
    .filter-symbol rect,
    .damper-symbol rect {
      fill: var(--vc-component-surface);
      fill-opacity: 0.88;
      stroke: var(--vc-component-line);
      stroke-opacity: 0.9;
      stroke-width: 2.6;
    }

    .fan-blades {
      transform-box: fill-box;
      transform-origin: center;
    }

    .fan-blades path {
      fill: var(--vc-component-line);
      opacity: 0.9;
    }

    .fan-hub {
      fill: var(--vc-component-surface);
      fill-opacity: 0.95;
      stroke: var(--vc-component-line);
      stroke-width: 2.2;
    }

    .spin {
      animation: symbol-spin var(--fan-duration, var(--rotor-duration, 4s)) linear infinite;
      transform-box: fill-box;
      transform-origin: center;
    }

    .fan-symbol.supply .spin {
      animation-duration: var(--supply-fan-duration, 4s);
    }

    .fan-symbol.extract .spin {
      animation-duration: var(--extract-fan-duration, 4s);
    }

    .heat-exchanger .spin {
      animation-duration: var(--rotor-duration, 8s);
    }

    .heat-exchanger {
      color: var(--vc-component-line);
    }

    .rotor-motion {
      transform-box: fill-box;
      transform-origin: center;
    }

    .rotor-arrow,
    .heat-waves path,
    .filter-symbol path,
    .damper-symbol path,
    .heater-coil path {
      fill: none;
      stroke: var(--vc-component-line);
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .rotor-arrow {
      stroke-width: 2.8;
      opacity: 0.9;
    }

    .rotor-arrow-head {
      fill: none;
      stroke: var(--vc-component-line);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2.6;
      opacity: 0.9;
    }

    .heat-waves path {
      stroke-width: 2.5;
      opacity: 0.88;
    }

    .filter-symbol path {
      stroke-width: 2;
      opacity: 0.82;
    }

    .damper-symbol path {
      stroke-width: 2.4;
      opacity: 0.86;
    }

    .damper-symbol circle {
      fill: var(--vc-component-line);
      opacity: 0.9;
    }

    .heater-coil {
      color: var(--vc-component-line);
      opacity: 0.9;
    }

    .heater-coil.active {
      color: var(--vc-air-supply);
      opacity: 0.95;
    }

    .heater-coil path {
      stroke: var(--vc-component-line);
      stroke-width: 3;
    }

    .heater-coil.active path {
      stroke: var(--vc-air-supply);
    }

    .heater-frame,
    .heater-bus {
      stroke-width: 3.8;
    }

    .svg-badge rect {
      fill: var(--vc-value-box-background-color, var(--ha-card-background, var(--card-background-color, #ffffff)));
      fill-opacity: 0.92;
      stroke: var(--vc-value-box-border-color, var(--divider-color, rgba(127, 127, 127, 0.56)));
      stroke-width: 1.35;
    }

    .svg-badge.outdoor rect {
      stroke: var(--vc-air-outdoor);
    }

    .svg-badge.supply rect {
      stroke: var(--vc-air-supply);
    }

    .svg-badge.extract rect {
      stroke: var(--vc-air-extract);
    }

    .svg-badge.exhaust rect {
      stroke: var(--vc-air-exhaust);
    }

    .svg-badge.heater-active rect {
      stroke: var(--vc-air-supply);
    }

    .svg-badge.component rect {
      fill-opacity: 0.96;
      stroke: var(--primary-text-color, #1f2937);
      stroke-opacity: 0.42;
      stroke-width: 1.6;
    }

    .svg-badge text {
      fill: var(--vc-value-box-text-color, var(--primary-text-color, #111));
      dominant-baseline: middle;
    }

    .svg-badge .badge-label {
      fill: var(--secondary-text-color, #727272);
      font-size: 9.5px;
      font-weight: 500;
    }

    .svg-badge .badge-value {
      font-size: 12px;
      font-weight: 600;
    }

    .status-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-top: 8px;
    }

    .status-item {
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 9px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 8px;
      background: transparent;
    }

    .status-item span,
    .status-item strong {
      overflow-wrap: anywhere;
    }

    .status-item span {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      line-height: 1.2;
    }

    .status-item strong {
      color: var(--primary-text-color, #111);
      font-size: 13px;
      font-weight: 600;
      line-height: 1.25;
      text-align: right;
    }

    .status-item.warning strong {
      color: var(--warning-color, #f6a623);
    }

    .status-item.danger strong {
      color: var(--error-color, #db4437);
    }

    @keyframes airflow {
      to {
        stroke-dashoffset: -18;
      }
    }

    @keyframes symbol-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 520px) {
      .card {
        padding: 10px;
      }

      h2 {
        font-size: 18px;
      }

      .status-strip {
        grid-template-columns: 1fr;
      }

      .svg-badge .badge-value {
        font-size: 11px;
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
