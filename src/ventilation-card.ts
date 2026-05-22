import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./ventilation-card-editor";
import type { EntityDisplay, HassEntity, HomeAssistant, LovelaceCardConfig, ValueBoxKey, VentilationEntities } from "./types";

const UNAVAILABLE_STATES = new Set(["unknown", "unavailable", "none", ""]);
const SVG_VIEWBOX_WIDTH = 920;
const BADGE_MIN_WIDTH = 50;
const BADGE_HORIZONTAL_PADDING = 9;
const BADGE_EDGE_MARGIN = 8;
const BADGE_LABEL_FONT_SIZE = 10;
const BADGE_DEFAULT_VALUE_FONT_SIZE = 12;

const ENGLISH_LABELS: Record<keyof VentilationEntities, string> = {
  outdoor_temp: "Outdoor air temperature",
  supply_temp: "Supply air temperature",
  extract_temp: "Extract air temperature",
  exhaust_temp: "Exhaust air temperature",
  supply_fan: "Supply fan",
  extract_fan: "Extract fan",
  heat_exchanger_speed: "Heat exchanger",
  heater_output: "Heater output",
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

    const statusItems = (["mode", "filter_alarm", "alarm"] as Array<keyof VentilationEntities>).filter((key) => this.isVisible(key));
    const layoutSize = this.layoutSize();

    return html`
      <ha-card>
        <div class="card size-${layoutSize}">
          <header class="header">
            <h2>${config.name ?? "Ventilation"}</h2>
          </header>

          <div class="schematic" style=${this.schematicStyle()} aria-label="Ventilation unit schematic">
            ${this.renderSchematic()}
          </div>

          ${statusItems.length > 0 ? html`<footer class="status-strip">${statusItems.map((key) => this.renderStatusItem(key))}</footer>` : nothing}
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
    ];

    return styleValues
      .filter(([, value]) => value && value.trim().length > 0)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");
  }

  private renderSchematic() {
    const outdoorTemp = this.entityDisplay("outdoor_temp");
    const supplyTemp = this.entityDisplay("supply_temp");
    const extractTemp = this.entityDisplay("extract_temp");
    const exhaustTemp = this.entityDisplay("exhaust_temp");
    const supplyFan = this.entityDisplay("supply_fan");
    const extractFan = this.entityDisplay("extract_fan");
    const heatExchanger = this.entityDisplay("heat_exchanger_speed");
    const heater = this.entityDisplay("heater_output");
    const supplyFanSpeed = this.entityNumericValue("supply_fan");
    const extractFanSpeed = this.entityNumericValue("extract_fan");
    const heaterOutput = this.entityNumericValue("heater_output");
    const rotorSpeed = this.entityNumericValue("heat_exchanger_speed");
    const airflowAnimationEnabled = this.config?.show_airflow !== false && this.animationEnabled("enabled") && this.animationEnabled("airflow_enabled");
    const stopWhenZero = this.config?.animations?.stop_when_zero !== false;
    const supplyFanMaxSpeed = this.componentAnimationSpeed("supply_fan", "fan_max_speed");
    const extractFanMaxSpeed = this.componentAnimationSpeed("extract_fan", "fan_max_speed");
    const rotorMaxSpeed = this.componentAnimationSpeed("heat_exchanger_speed", "rotor_max_speed");
    const supplyAirflowActive = airflowAnimationEnabled && (supplyFanSpeed > 0 || !stopWhenZero);
    const extractAirflowActive = airflowAnimationEnabled && (extractFanSpeed > 0 || !stopWhenZero);
    const supplyFanActive = this.animationEnabled("enabled") && this.componentAnimationEnabled("supply_fan", "fans_enabled") && supplyFanMaxSpeed > 0 && (supplyFanSpeed > 0 || !stopWhenZero);
    const extractFanActive = this.animationEnabled("enabled") && this.componentAnimationEnabled("extract_fan", "fans_enabled") && extractFanMaxSpeed > 0 && (extractFanSpeed > 0 || !stopWhenZero);
    const rotorActive = this.animationEnabled("enabled") && this.componentAnimationEnabled("heat_exchanger_speed", "rotor_enabled") && rotorMaxSpeed > 0 && (rotorSpeed > 0 || !stopWhenZero);
    const supplyAirflowDuration = this.getAnimationDurationFromValue(supplyFanSpeed, 0.8, 4.8, this.animationMaxSpeed("airflow_max_speed"));
    const extractAirflowDuration = this.getAnimationDurationFromValue(extractFanSpeed, 0.8, 4.8, this.animationMaxSpeed("airflow_max_speed"));
    const supplyFanDuration = this.getAnimationDurationFromValue(supplyFanSpeed, 1.45, 4.2, supplyFanMaxSpeed);
    const extractFanDuration = this.getAnimationDurationFromValue(extractFanSpeed, 1.45, 4.2, extractFanMaxSpeed);
    const rotorDuration = this.getAnimationDurationFromValue(rotorSpeed, 3.2, 14, rotorMaxSpeed);

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
        ${this.isVisible("heat_exchanger_speed") ? this.renderHeatExchanger(460, 180, rotorActive, rotorDuration, this.config?.exchanger_type ?? "rotary") : nothing}
        ${this.isVisible("extract_fan") ? this.renderFan(260, 120, extractFanActive, extractFanDuration, "extract") : nothing}
        ${this.isVisible("supply_fan") ? this.renderFan(660, 240, supplyFanActive, supplyFanDuration, "supply") : nothing}
        ${this.isVisible("heater_output") ? this.renderHeaterCoil(734, 240, heaterOutput) : nothing}

        <g class="badges">
          ${this.isVisible("exhaust_temp") ? this.renderValueLabel(28, 64, exhaustTemp.label, exhaustTemp.value, "exhaust", "exhaust_temp") : nothing}
          ${this.isVisible("extract_temp") ? this.renderValueLabel(792, 64, extractTemp.label, extractTemp.value, "extract", "extract_temp") : nothing}
          ${this.isVisible("outdoor_temp") ? this.renderValueLabel(28, 258, outdoorTemp.label, outdoorTemp.value, "outdoor", "outdoor_temp") : nothing}
          ${this.isVisible("supply_temp") ? this.renderValueLabel(792, 258, supplyTemp.label, supplyTemp.value, "supply", "supply_temp") : nothing}
          ${this.isVisible("extract_fan") ? this.renderValueLabel(190, 38, extractFan.label, extractFan.value, "component", "extract_fan") : nothing}
          ${this.isVisible("supply_fan") ? this.renderValueLabel(610, 304, supplyFan.label, supplyFan.value, "component", "supply_fan") : nothing}
          ${this.isVisible("heat_exchanger_speed")
            ? this.renderValueLabel(411, 274, heatExchanger.label, heatExchanger.value, "component", "heat_exchanger_speed")
            : nothing}
          ${this.isVisible("heater_output") ? this.renderValueLabel(714, 178, heater.label, heater.value, heaterOutput > 0 ? "heater-active" : "neutral", "heater_output") : nothing}
        </g>
      </svg>
    `;
  }

  private renderFan(x: number, y: number, active: boolean, duration: string, tone: "supply" | "extract") {
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

  private renderHeatExchanger(x: number, y: number, active: boolean, duration: string, exchangerType: string) {
    if (exchangerType === "none") {
      return nothing;
    }
    if (exchangerType === "crossflow") {
      return svg`<g class="heat-exchanger crossflow" transform="translate(${x} ${y})" style="--rotor-duration: ${duration};">
        <rect class="crossflow-box" x="-54" y="-54" width="108" height="108" rx="8"></rect>
        <path d="M-44 -42 L42 44"></path>
        <path d="M-42 44 L44 -42"></path>
      </g>`;
    }

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

  private renderValueLabel(x: number, y: number, label: string, value: string, tone = "neutral", key?: ValueBoxKey) {
    const override = key ? this.config?.value_boxes?.[key] : undefined;
    const valueFontSize = this.clampNumber(override?.font_size ?? BADGE_DEFAULT_VALUE_FONT_SIZE, 8, 24);
    const width = this.valueBadgeWidth(label, value, valueFontSize);
    const height = Math.max(34, valueFontSize + BADGE_LABEL_FONT_SIZE + 14);
    const adjustedX = this.clampNumber(x, BADGE_EDGE_MARGIN, SVG_VIEWBOX_WIDTH - width - BADGE_EDGE_MARGIN);
    const labelX = BADGE_HORIZONTAL_PADDING;
    const labelY = 13;
    const valueY = Math.max(27, labelY + valueFontSize + 4);
    const style = [
      override?.border_color ? `--vc-badge-border-color: ${override.border_color};` : "",
      override?.font_size ? `--vc-badge-font-size: ${override.font_size}px;` : "",
    ].join(" ");
    return svg`
      <g class="svg-badge ${tone}" transform="translate(${adjustedX} ${y})" style=${style}>
        <rect width=${width} height=${height} rx="6"></rect>
        <text x=${labelX} y=${labelY} class="badge-label">${label}</text>
        <text x=${labelX} y=${valueY} class="badge-value">${value}</text>
      </g>
    `;
  }

  private valueBadgeWidth(label: string, value: string, valueFontSize: number): number {
    const labelWidth = this.estimateSvgTextWidth(label, BADGE_LABEL_FONT_SIZE);
    const valueWidth = this.estimateSvgTextWidth(value, valueFontSize);
    const maxWidth = SVG_VIEWBOX_WIDTH - BADGE_EDGE_MARGIN * 2;
    return Math.min(maxWidth, Math.ceil(Math.max(BADGE_MIN_WIDTH, labelWidth, valueWidth) + BADGE_HORIZONTAL_PADDING * 2));
  }

  private estimateSvgTextWidth(text: string, fontSize: number): number {
    return Array.from(text).reduce((width, character) => {
      if (character === " ") {
        return width + fontSize * 0.32;
      }
      if ("il.,:;|'![]()".includes(character)) {
        return width + fontSize * 0.32;
      }
      if ("MW@#%&".includes(character)) {
        return width + fontSize * 0.85;
      }
      if (character >= "0" && character <= "9") {
        return width + fontSize * 0.58;
      }
      return width + fontSize * 0.56;
    }, 0);
  }

  private renderStatusItem(key: keyof VentilationEntities) {
    const display = this.entityDisplay(key);
    const override = this.config?.value_boxes?.[key];
    const style = [
      override?.border_color ? `--vc-status-border-color: ${override.border_color};` : "",
      override?.font_size ? `--vc-status-font-size: ${override.font_size}px;` : "",
    ].join(" ");

    return html`
      <div class="status-item ${display.tone ?? "normal"}" style=${style}>
        <span>${display.label}</span>
        <strong>${display.value}</strong>
      </div>
    `;
  }

  private entityDisplay(key: keyof VentilationEntities): EntityDisplay {
    const stateObj = this.getEntityState(key);
    const value = this.getEntityValue(key);
    const tone = this.entityTone(stateObj);

    return {
      label: this.getLabel(key),
      value,
      tone,
    };
  }

  private getEntityId(key: keyof VentilationEntities): string | undefined {
    const configuredEntity = this.config?.entities?.[key] as unknown;
    const entityId =
      typeof configuredEntity === "string"
        ? configuredEntity
        : typeof configuredEntity === "object" && configuredEntity !== null && "entity" in configuredEntity
          ? (configuredEntity as { entity?: unknown }).entity
          : undefined;

    if (typeof entityId !== "string") {
      return undefined;
    }

    const trimmed = entityId.trim();
    return trimmed || undefined;
  }

  private getEntityState(key: keyof VentilationEntities): HassEntity | undefined {
    const entityId = this.getEntityId(key);

    if (!entityId || !this.hass?.states) {
      return undefined;
    }

    return this.hass.states[entityId];
  }

  private getEntityValue(key: keyof VentilationEntities): string {
    return this.formatEntityValue(key, this.getEntityState(key));
  }

  private getLabel(key: keyof VentilationEntities): string {
    return this.config?.labels?.[key] ?? ENGLISH_LABELS[key];
  }

  private formatEntityValue(key: keyof VentilationEntities, entity?: HassEntity): string {
    if (!entity || UNAVAILABLE_STATES.has(String(entity.state).toLowerCase())) {
      return "\u2014";
    }

    const format = this.config?.format?.[key];
    const numeric = Number.parseFloat(String(entity.state).replace(",", "."));
    const value =
      format?.decimals != null && Number.isFinite(numeric)
        ? numeric.toFixed(Math.round(this.clampNumber(format.decimals, 0, 4)))
        : entity.state;
    const unit = entity.attributes.unit_of_measurement;
    return unit && format?.show_unit !== false ? `${value} ${unit}` : String(value);
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

  private entityNumericValue(key: keyof VentilationEntities): number {
    const entity = this.getEntityState(key);
    if (!entity || UNAVAILABLE_STATES.has(String(entity.state).toLowerCase())) {
      return 0;
    }

    const numeric = Number.parseFloat(String(entity.state).replace(",", "."));
    if (Number.isFinite(numeric)) {
      return Math.max(0, numeric);
    }

    return ["on", "running", "active", "true"].includes(String(entity.state).toLowerCase()) ? 100 : 0;
  }

  private getAnimationDurationFromValue(value: number, minDuration: number, maxDuration: number, maxSpeedPercent = 100): string {
    if (value <= 0) {
      return `${maxDuration.toFixed(1)}s`;
    }

    const clamped = this.clampNumber(value, 1, 100);
    const speedScale = this.clampNumber(maxSpeedPercent, 0, 100) / 100;
    if (speedScale <= 0) {
      return `${maxDuration.toFixed(1)}s`;
    }

    const seconds = maxDuration - ((clamped * speedScale) / 100) * (maxDuration - minDuration);
    return `${Math.max(0.2, seconds).toFixed(1)}s`;
  }

  private isVisible(key: keyof VentilationEntities): boolean {
    return this.config?.visibility?.[key] !== false;
  }

  private animationEnabled(key: "enabled" | "airflow_enabled" | "fans_enabled" | "rotor_enabled"): boolean {
    return this.config?.animations?.[key] !== false;
  }

  private animationMaxSpeed(key: "airflow_max_speed" | "fan_max_speed" | "rotor_max_speed"): number {
    return this.clampNumber(this.config?.animations?.[key] ?? 100, 10, 150);
  }

  private componentAnimationEnabled(key: "supply_fan" | "extract_fan" | "heat_exchanger_speed", legacyKey: "fans_enabled" | "rotor_enabled"): boolean {
    return this.config?.component_settings?.[key]?.animation_enabled ?? this.animationEnabled(legacyKey);
  }

  private componentAnimationSpeed(key: "supply_fan" | "extract_fan" | "heat_exchanger_speed", legacyKey: "fan_max_speed" | "rotor_max_speed"): number {
    const settings = this.config?.component_settings?.[key];
    return this.clampNumber(settings?.animation_max_speed ?? settings?.animation_speed ?? this.animationMaxSpeed(legacyKey), 0, 100);
  }

  private layoutSize(): "compact" | "normal" | "large" {
    const size = this.config?.layout?.size;
    return size === "compact" || size === "large" ? size : "normal";
  }

  private clampNumber(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) {
      return min;
    }

    return Math.min(Math.max(value, min), max);
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
      --vc-card-title-size: 20px;
      --vc-svg-max-height: 360px;
      --vc-status-label-size: 12px;
      --vc-status-default-value-size: 13px;
    }

    .card.size-compact {
      padding: 10px;
      --vc-card-title-size: 18px;
      --vc-svg-max-height: 320px;
      --vc-status-label-size: 11px;
      --vc-status-default-value-size: 12px;
    }

    .card.size-large {
      padding: 14px;
      --vc-card-title-size: 22px;
      --vc-svg-max-height: 420px;
      --vc-status-label-size: 13px;
      --vc-status-default-value-size: 14px;
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
      font-size: var(--vc-card-title-size);
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
      max-height: var(--vc-svg-max-height);
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
    .heat-exchanger.crossflow path {
      stroke-width: 6;
      opacity: 0.8;
    }

    .heat-exchanger.crossflow .crossflow-box {
      fill: var(--vc-component-surface);
      fill-opacity: 0.88;
      stroke: var(--vc-component-line);
      stroke-width: 2.6;
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
      stroke: var(--vc-badge-border-color, var(--vc-badge-tone-border-color, var(--vc-value-box-border-color, var(--divider-color, rgba(127, 127, 127, 0.56)))));
      stroke-width: 1.35;
    }

    .svg-badge.outdoor {
      --vc-badge-tone-border-color: var(--vc-air-outdoor);
    }

    .svg-badge.supply {
      --vc-badge-tone-border-color: var(--vc-air-supply);
    }

    .svg-badge.extract {
      --vc-badge-tone-border-color: var(--vc-air-extract);
    }

    .svg-badge.exhaust {
      --vc-badge-tone-border-color: var(--vc-air-exhaust);
    }

    .svg-badge.heater-active {
      --vc-badge-tone-border-color: var(--vc-air-supply);
    }

    .svg-badge.component rect {
      fill-opacity: 0.96;
      stroke: var(--vc-badge-border-color, var(--vc-value-box-border-color, var(--primary-text-color, #1f2937)));
      stroke-opacity: 0.42;
      stroke-width: 1.6;
    }

    .svg-badge text {
      fill: var(--primary-text-color, #111);
      dominant-baseline: middle;
    }

    .svg-badge .badge-label {
      fill: var(--secondary-text-color, #727272);
      font-size: 9.5px;
      font-weight: 500;
    }

    .svg-badge .badge-value {
      font-size: var(--vc-badge-font-size, 12px);
      font-weight: 600;
    }

    .status-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
      border: 1px solid var(--vc-status-border-color, var(--vc-value-box-border-color, var(--divider-color, rgba(127, 127, 127, 0.2))));
      border-radius: 8px;
      background: transparent;
    }

    .status-item span,
    .status-item strong {
      overflow-wrap: anywhere;
    }

    .status-item span {
      color: var(--secondary-text-color, #727272);
      font-size: var(--vc-status-label-size);
      line-height: 1.2;
    }

    .status-item strong {
      color: var(--primary-text-color, #111);
      font-size: var(--vc-status-font-size, var(--vc-status-default-value-size));
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
        font-size: var(--vc-badge-font-size, 11px);
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
