import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./ventilation-card-editor";
import type { EntityDisplay, HassEntity, HomeAssistant, LovelaceCardConfig, ValueBoxKey, VentilationEntities } from "./types";

const UNAVAILABLE_STATES = new Set(["unknown", "unavailable", "none", ""]);
const SVG_VIEWBOX_WIDTH = 920;
const SVG_VIEWBOX_HEIGHT = 360;
const COMPACT_VIEWBOX_HEIGHT = 650;
const DEFAULT_COMPACT_LAYOUT_BREAKPOINT = 900;
const DEFAULT_EFFICIENCY_DECIMALS = 0;
const DEFAULT_EFFICIENCY_CLAMP_MIN = 0;
const DEFAULT_EFFICIENCY_CLAMP_MAX = 100;
const MINIMUM_EFFICIENCY_DENOMINATOR = 0.001;
const BADGE_EDGE_MARGIN = 8;
const DEFAULT_TEXT_FONT_SIZE = 14;
const AHU_SCALES = {
  small: 0.75,
  medium: 1,
  large: 1.25,
} as const;

type SchematicValueKey =
  | "outdoor_temp"
  | "supply_temp"
  | "extract_temp"
  | "exhaust_temp"
  | "supply_fan"
  | "extract_fan"
  | "heat_exchanger_speed"
  | "heater_output";

type AnchorPoint = { x: number; y: number };
type BadgePlacement = {
  offset: AnchorPoint;
  align: "left" | "center" | "right";
};

const SCHEMATIC_ANCHORS: Record<SchematicValueKey, AnchorPoint> = {
  exhaust_temp: { x: 20, y: 120 },
  extract_temp: { x: 900, y: 120 },
  outdoor_temp: { x: 20, y: 240 },
  supply_temp: { x: 900, y: 240 },
  extract_fan: { x: 260, y: 120 },
  supply_fan: { x: 660, y: 240 },
  heat_exchanger_speed: { x: 460, y: 180 },
  heater_output: { x: 734, y: 240 },
};

const WIDE_BADGE_PLACEMENTS: Record<SchematicValueKey, BadgePlacement> = {
  exhaust_temp: { offset: { x: 8, y: -64 }, align: "left" },
  extract_temp: { offset: { x: -8, y: -64 }, align: "right" },
  outdoor_temp: { offset: { x: 8, y: 18 }, align: "left" },
  supply_temp: { offset: { x: -8, y: 18 }, align: "right" },
  extract_fan: { offset: { x: 0, y: -78 }, align: "center" },
  supply_fan: { offset: { x: 0, y: 34 }, align: "center" },
  heat_exchanger_speed: { offset: { x: 0, y: 92 }, align: "center" },
  heater_output: { offset: { x: -22, y: -68 }, align: "right" },
};

const COMPACT_BADGE_PLACEMENTS: Record<SchematicValueKey, BadgePlacement> = {
  exhaust_temp: { offset: { x: 12, y: -280 }, align: "left" },
  extract_temp: { offset: { x: -12, y: -280 }, align: "right" },
  outdoor_temp: { offset: { x: 12, y: 190 }, align: "left" },
  supply_temp: { offset: { x: -12, y: 190 }, align: "right" },
  extract_fan: { offset: { x: 0, y: -195 }, align: "center" },
  supply_fan: { offset: { x: 0, y: 25 }, align: "center" },
  heat_exchanger_speed: { offset: { x: 0, y: 155 }, align: "center" },
  heater_output: { offset: { x: -26, y: -315 }, align: "right" },
};

const DEFAULT_WIDE_POSITION_OFFSETS: Partial<Record<SchematicValueKey, AnchorPoint>> = {
  heat_exchanger_speed: { x: -3, y: 0 },
  heater_output: { x: 65, y: -13 },
  supply_fan: { x: -10, y: 3 },
  extract_fan: { x: 10, y: -5 },
  supply_temp: { x: 18, y: 0 },
  extract_temp: { x: 18, y: 0 },
};

const DEFAULT_COMPACT_POSITION_OFFSETS: Partial<Record<SchematicValueKey, AnchorPoint>> = {
  heat_exchanger_speed: { x: -50, y: -80 },
  heater_output: { x: 65, y: 80 },
  supply_fan: { x: -10, y: 3 },
  extract_fan: { x: 10, y: 80 },
  exhaust_temp: { x: 0, y: 55 },
  supply_temp: { x: 18, y: -55 },
  extract_temp: { x: 18, y: 55 },
  outdoor_temp: { x: 0, y: -180 },
};

const ENGLISH_LABELS: Record<keyof VentilationEntities, string> = {
  outdoor_temp: "Outdoor air temperature",
  supply_temp: "Supply air temperature",
  extract_temp: "Extract air temperature",
  exhaust_temp: "Exhaust air temperature",
  supply_fan: "Supply fan",
  extract_fan: "Extract fan",
  heat_exchanger_speed: "Heat exchanger",
  heat_exchanger_efficiency: "Heat exchanger efficiency",
  heater_output: "Heater output",
  supply_temp_before_heater: "Supply temperature before heater",
  filter_alarm: "Filter alarm",
  alarm: "Alarm",
  mode: "Mode",
};

@customElement("ventilation-card")
export class VentilationCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: LovelaceCardConfig;
  @state() private narrowLayout = false;

  private resizeObserver?: ResizeObserver;

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

  public connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated) {
      this.requestUpdate();
    }
  }

  protected updated(): void {
    if (!this.resizeObserver) {
      this.observeCardWidth();
      return;
    }

    const card = this.renderRoot.querySelector(".card");
    if (card instanceof HTMLElement) {
      this.updateResponsiveLayout(card.getBoundingClientRect().width);
    }
  }

  public disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    super.disconnectedCallback();
  }

  protected render() {
    const config = this.config;

    if (!config) {
      return nothing;
    }

    const statusItems = (["mode", "filter_alarm", "alarm"] as Array<keyof VentilationEntities>).filter((key) => this.isVisible(key));
    return html`
      <ha-card>
        <div class="card ${this.narrowLayout ? "layout-narrow" : "layout-wide"}">
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

  private observeCardWidth(): void {
    const card = this.renderRoot.querySelector(".card");
    if (!(card instanceof HTMLElement) || typeof ResizeObserver === "undefined") {
      return;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      this.updateResponsiveLayout(entry.contentRect.width);
    });
    this.resizeObserver.observe(card);
    this.updateResponsiveLayout(card.getBoundingClientRect().width);
  }

  private updateResponsiveLayout(width: number): void {
    const narrowLayout = width < this.compactLayoutBreakpoint();
    if (this.narrowLayout !== narrowLayout) {
      this.narrowLayout = narrowLayout;
    }
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
    const efficiency = this.isEfficiencyVisible() ? this.heatExchangerEfficiencyValue() : undefined;
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
        viewBox=${`0 0 ${SVG_VIEWBOX_WIDTH} ${this.schematicViewBoxHeight()}`}
        role="img"
        style="--supply-fan-duration: ${supplyFanDuration}; --extract-fan-duration: ${extractFanDuration}; --rotor-duration: ${rotorDuration}; --supply-airflow-duration: ${supplyAirflowDuration}; --extract-airflow-duration: ${extractAirflowDuration};"
      >
        <defs>
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

        <g class="ahu-graphic" transform=${this.ahuTransform()}>
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
        ${this.isVisible("heat_exchanger_speed")
          ? this.renderHeatExchanger(
              SCHEMATIC_ANCHORS.heat_exchanger_speed.x,
              SCHEMATIC_ANCHORS.heat_exchanger_speed.y,
              rotorActive,
              rotorDuration,
              this.config?.exchanger_type ?? "rotary",
            )
          : nothing}
        ${this.isVisible("extract_fan")
          ? this.renderFan(SCHEMATIC_ANCHORS.extract_fan.x, SCHEMATIC_ANCHORS.extract_fan.y, extractFanActive, extractFanDuration, "extract")
          : nothing}
        ${this.isVisible("supply_fan")
          ? this.renderFan(SCHEMATIC_ANCHORS.supply_fan.x, SCHEMATIC_ANCHORS.supply_fan.y, supplyFanActive, supplyFanDuration, "supply")
          : nothing}
        ${this.isVisible("heater_output")
          ? this.renderHeaterCoil(SCHEMATIC_ANCHORS.heater_output.x, SCHEMATIC_ANCHORS.heater_output.y, heaterOutput)
          : nothing}
        </g>
      </svg>
      <div class="badge-overlay">
          ${this.isVisible("exhaust_temp") ? this.renderValueLabel("exhaust_temp", exhaustTemp.label, exhaustTemp.value, "exhaust") : nothing}
          ${this.isVisible("extract_temp") ? this.renderValueLabel("extract_temp", extractTemp.label, extractTemp.value, "extract") : nothing}
          ${this.isVisible("outdoor_temp") ? this.renderValueLabel("outdoor_temp", outdoorTemp.label, outdoorTemp.value, "outdoor") : nothing}
          ${this.isVisible("supply_temp") ? this.renderValueLabel("supply_temp", supplyTemp.label, supplyTemp.value, "supply") : nothing}
          ${this.isVisible("extract_fan") ? this.renderValueLabel("extract_fan", extractFan.label, extractFan.value, "component") : nothing}
          ${this.isVisible("supply_fan") ? this.renderValueLabel("supply_fan", supplyFan.label, supplyFan.value, "component") : nothing}
          ${this.isVisible("heat_exchanger_speed")
            ? this.renderHeatExchangerValueLabel(heatExchanger.label, heatExchanger.value, efficiency)
            : nothing}
          ${this.isVisible("heater_output") ? this.renderValueLabel("heater_output", heater.label, heater.value, heaterOutput > 0 ? "heater-active" : "neutral") : nothing}
      </div>
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

  private renderValueLabel(key: SchematicValueKey, label: string, value: string, tone = "neutral") {
    const override = this.config?.value_boxes?.[key];
    const entityId = this.getEntityId(key);
    const position = this.badgePosition(key);
    const valueFontSize = this.clampNumber(override?.font_size ?? DEFAULT_TEXT_FONT_SIZE, 8, 24);
    const style = [
      `left: ${(position.x / SVG_VIEWBOX_WIDTH) * 100}%;`,
      `top: ${(position.y / this.schematicViewBoxHeight()) * 100}%;`,
      override?.border_color ? `--vc-badge-border-color: ${override.border_color};` : "",
      `--vc-badge-font-size: ${valueFontSize}px;`,
    ].join(" ");
    return html`
      <div
        class="value-badge badge-${key} ${tone} align-${position.align} ${entityId ? "interactive" : ""}"
        style=${style}
        role=${entityId ? "button" : nothing}
        tabindex=${entityId ? "0" : nothing}
        aria-label=${entityId ? `${label}: ${value}. Open details.` : nothing}
        @click=${entityId ? () => this.openMoreInfo(key) : nothing}
        @keydown=${entityId ? (event: KeyboardEvent) => this.handleMoreInfoKeydown(event, key) : nothing}
      >
        <span class="badge-label">${label}</span>
        <strong class="badge-value">${value}</strong>
      </div>
    `;
  }

  private renderHeatExchangerValueLabel(label: string, speed: string, efficiency?: string) {
    const key = "heat_exchanger_speed";
    const override = this.config?.value_boxes?.[key];
    const entityId = this.getEntityId(key);
    const position = this.badgePosition(key);
    const valueFontSize = this.clampNumber(override?.font_size ?? DEFAULT_TEXT_FONT_SIZE, 8, 24);
    const details = efficiency == null ? `Speed: ${speed}` : `Speed: ${speed}. Efficiency: ${efficiency}`;
    const style = [
      `left: ${(position.x / SVG_VIEWBOX_WIDTH) * 100}%;`,
      `top: ${(position.y / this.schematicViewBoxHeight()) * 100}%;`,
      override?.border_color ? `--vc-badge-border-color: ${override.border_color};` : "",
      `--vc-badge-font-size: ${valueFontSize}px;`,
    ].join(" ");

    return html`
      <div
        class="value-badge badge-${key} component align-${position.align} ${entityId ? "interactive" : ""}"
        style=${style}
        role=${entityId ? "button" : nothing}
        tabindex=${entityId ? "0" : nothing}
        aria-label=${entityId ? `${label}. ${details}. Open details.` : nothing}
        @click=${entityId ? () => this.openMoreInfo(key) : nothing}
        @keydown=${entityId ? (event: KeyboardEvent) => this.handleMoreInfoKeydown(event, key) : nothing}
      >
        <span class="badge-label">${label}</span>
        <span class="badge-metric"><span>Speed:</span><strong>${speed}</strong></span>
        ${efficiency == null ? nothing : html`<span class="badge-metric"><span>Efficiency:</span><strong>${efficiency}</strong></span>`}
      </div>
    `;
  }

  private renderStatusItem(key: keyof VentilationEntities) {
    const display = this.entityDisplay(key);
    const override = this.config?.value_boxes?.[key];
    const entityId = this.getEntityId(key);
    const style = [
      override?.border_color ? `--vc-status-border-color: ${override.border_color};` : "",
      override?.font_size ? `--vc-status-font-size: ${override.font_size}px;` : "",
    ].join(" ");

    if (key === "mode" && this.modeOptions().length > 0) {
      return html`
        <div class="status-item mode-select ${display.tone ?? "normal"}" style=${style}>
          <span>${display.label}</span>
          <select
            aria-label=${display.label}
            .value=${this.getEntityState("mode")?.state ?? ""}
            @change=${(event: Event) => this.selectMode((event.target as HTMLSelectElement).value)}
          >
            ${this.modeOptions().map((option) => html`<option .value=${option}>${option}</option>`)}
          </select>
        </div>
      `;
    }

    return html`
      <div
        class="status-item ${display.tone ?? "normal"} ${entityId ? "interactive" : ""}"
        style=${style}
        role=${entityId ? "button" : nothing}
        tabindex=${entityId ? "0" : nothing}
        @click=${entityId ? () => this.openMoreInfo(key) : nothing}
        @keydown=${entityId ? (event: KeyboardEvent) => this.handleMoreInfoKeydown(event, key) : nothing}
      >
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

  private openMoreInfo(key: keyof VentilationEntities): void {
    const entityId = this.getEntityId(key);
    if (!entityId) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleMoreInfoKeydown(event: KeyboardEvent, key: keyof VentilationEntities): void {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    this.openMoreInfo(key);
  }

  private modeOptions(): string[] {
    const entityId = this.getEntityId("mode");
    const options = this.getEntityState("mode")?.attributes.options;
    if (!entityId?.startsWith("input_select.") || !Array.isArray(options)) {
      return [];
    }

    return options.filter((option): option is string => typeof option === "string");
  }

  private selectMode(option: string): void {
    const entityId = this.getEntityId("mode");
    if (!entityId?.startsWith("input_select.") || !this.modeOptions().includes(option)) {
      return;
    }

    void this.hass?.callService?.("input_select", "select_option", {
      entity_id: entityId,
      option,
    });
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
    const unit = entity.attributes.unit_of_measurement;
    const decimals = format?.decimals ?? (unit === "%" ? 0 : undefined);
    const value =
      decimals != null && Number.isFinite(numeric)
        ? numeric.toFixed(Math.round(this.clampNumber(decimals, 0, 4)))
        : entity.state;
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

  private numericEntityState(key: keyof VentilationEntities): number | undefined {
    const entity = this.getEntityState(key);
    if (!entity || UNAVAILABLE_STATES.has(String(entity.state).trim().toLowerCase())) {
      return undefined;
    }

    const numeric = Number.parseFloat(String(entity.state).trim().replace(",", "."));
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  private heatExchangerEfficiencyValue(): string {
    if (this.efficiencySource() === "entity") {
      return this.formatEfficiencyEntityValue();
    }

    const efficiency = this.heatExchangerEfficiency();
    if (efficiency == null) {
      return "\u2014";
    }

    const configuredDecimals = this.config?.efficiency?.decimals ?? this.config?.format?.heat_exchanger_speed?.decimals;
    const decimals = Math.round(this.clampNumber(configuredDecimals ?? DEFAULT_EFFICIENCY_DECIMALS, 0, 4));
    return `${efficiency.toFixed(decimals)} %`;
  }

  private formatEfficiencyEntityValue(): string {
    const entity = this.getEntityState("heat_exchanger_efficiency");
    if (!entity || UNAVAILABLE_STATES.has(String(entity.state).trim().toLowerCase())) {
      return "\u2014";
    }

    const numeric = Number.parseFloat(String(entity.state).trim().replace(",", "."));
    if (!Number.isFinite(numeric)) {
      return "\u2014";
    }

    const unit = entity.attributes.unit_of_measurement;
    const configuredDecimals = this.config?.efficiency?.decimals ?? this.config?.format?.heat_exchanger_efficiency?.decimals;
    const decimals = Math.round(this.clampNumber(configuredDecimals ?? (unit === "%" ? 0 : DEFAULT_EFFICIENCY_DECIMALS), 0, 4));
    const value = numeric.toFixed(decimals);
    return unit && this.config?.format?.heat_exchanger_efficiency?.show_unit !== false ? `${value} ${unit}` : value;
  }

  private isEfficiencyVisible(): boolean {
    const efficiency = this.config?.efficiency;
    if (!efficiency || efficiency.enabled === false) {
      return false;
    }

    return efficiency.enabled === true || efficiency.source === "entity" || efficiency.source === "calculated";
  }

  private efficiencySource(): "entity" | "calculated" {
    return this.config?.efficiency?.source === "entity" ? "entity" : "calculated";
  }

  private heatExchangerEfficiency(): number | undefined {
    const outdoorTemp = this.numericEntityState("outdoor_temp");
    const extractTemp = this.numericEntityState("extract_temp");
    if (outdoorTemp == null || extractTemp == null) {
      return undefined;
    }

    const denominator = extractTemp - outdoorTemp;
    if (Math.abs(denominator) < MINIMUM_EFFICIENCY_DENOMINATOR) {
      return undefined;
    }

    let numerator: number | undefined;
    if (this.config?.efficiency?.has_supply_temp_before_heater === true) {
      const beforeHeaterTemp = this.numericEntityState("supply_temp_before_heater");
      if (beforeHeaterTemp != null) {
        numerator = beforeHeaterTemp - outdoorTemp;
      }
    }

    if (numerator == null) {
      const heaterOutput = this.numericEntityState("heater_output");
      if (heaterOutput == null) {
        return undefined;
      }

      if (heaterOutput < 1) {
        const supplyTemp = this.numericEntityState("supply_temp");
        if (supplyTemp == null) {
          return undefined;
        }
        numerator = supplyTemp - outdoorTemp;
      } else {
        const exhaustTemp = this.numericEntityState("exhaust_temp");
        if (exhaustTemp == null) {
          return undefined;
        }
        numerator = extractTemp - exhaustTemp;
      }
    }

    const result = (numerator / denominator) * 100;
    if (!Number.isFinite(result)) {
      return undefined;
    }

    const configuredMin = this.config?.efficiency?.clamp_min;
    const configuredMax = this.config?.efficiency?.clamp_max;
    const min = Number.isFinite(configuredMin) ? configuredMin as number : DEFAULT_EFFICIENCY_CLAMP_MIN;
    const max = Number.isFinite(configuredMax) ? configuredMax as number : DEFAULT_EFFICIENCY_CLAMP_MAX;
    return this.clampNumber(result, Math.min(min, max), Math.max(min, max));
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
    return this.config?.component_visibility?.[key] !== false;
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

  private ahuTransform(): string {
    const scale = this.ahuScale();
    return `translate(0 ${this.schematicYOffset()}) translate(460 180) scale(${scale}) translate(-460 -180)`;
  }

  private badgePosition(key: SchematicValueKey): AnchorPoint & { align: BadgePlacement["align"] } {
    const anchor = this.scaledAnchor(SCHEMATIC_ANCHORS[key]);
    const placement = (this.narrowLayout ? COMPACT_BADGE_PLACEMENTS : WIDE_BADGE_PLACEMENTS)[key];
    const defaultOffset = (this.narrowLayout ? DEFAULT_COMPACT_POSITION_OFFSETS : DEFAULT_WIDE_POSITION_OFFSETS)[key];
    const customOffset = this.config?.position_offsets?.[key];
    return {
      x: this.clampNumber(
        anchor.x + placement.offset.x + (defaultOffset?.x ?? 0) + this.positionOffsetValue(customOffset?.x),
        BADGE_EDGE_MARGIN,
        SVG_VIEWBOX_WIDTH - BADGE_EDGE_MARGIN,
      ),
      y: Math.max(BADGE_EDGE_MARGIN, anchor.y + placement.offset.y + (defaultOffset?.y ?? 0) + this.positionOffsetValue(customOffset?.y)),
      align: placement.align,
    };
  }

  private scaledAnchor(anchor: AnchorPoint): AnchorPoint {
    const scale = this.ahuScale();
    return {
      x: 460 + (anchor.x - 460) * scale,
      y: this.schematicYOffset() + 180 + (anchor.y - 180) * scale,
    };
  }

  private schematicViewBoxHeight(): number {
    return this.narrowLayout ? COMPACT_VIEWBOX_HEIGHT : SVG_VIEWBOX_HEIGHT;
  }

  private schematicYOffset(): number {
    return this.narrowLayout ? 170 : 0;
  }

  private ahuScale(): number {
    const configuredSize = this.config?.layout?.ahu_size;
    const size = configuredSize === "small" || configuredSize === "large" ? configuredSize : "medium";
    return AHU_SCALES[size];
  }

  private compactLayoutBreakpoint(): number {
    return this.clampNumber(this.config?.layout?.compact_breakpoint ?? DEFAULT_COMPACT_LAYOUT_BREAKPOINT, 500, 1200);
  }

  private positionOffsetValue(value: unknown): number {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === "string" && value.trim().length > 0) {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : 0;
    }

    return 0;
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
      font-family: var(--paper-font-body1_-_font-family, var(--ha-font-family, inherit));
      --vc-card-title-size: 20px;
      --vc-svg-max-height: 360px;
      --vc-default-text-size: 14px;
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
      position: relative;
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

    .layout-narrow svg {
      max-height: none;
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
      stroke-width: 7.5;
      stroke-linecap: round;
      stroke-dasharray: 15 12;
      opacity: 0.92;
    }

    .internal-flow-line {
      stroke-width: 6.6;
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

    .badge-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .value-badge {
      position: absolute;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 50px;
      max-width: calc(100% - 16px);
      padding: 5px 9px 6px;
      border: 1.35px solid var(--vc-badge-border-color, var(--vc-badge-tone-border-color, var(--vc-value-box-border-color, var(--divider-color, rgba(127, 127, 127, 0.56)))));
      border-radius: 6px;
      background: var(--vc-value-box-background-color, var(--ha-card-background, var(--card-background-color, #ffffff)));
      color: var(--primary-text-color, #111);
      line-height: 1.15;
      white-space: nowrap;
    }

    .value-badge.align-center {
      transform: translateX(-50%);
    }

    .value-badge.align-right {
      transform: translateX(-100%);
    }

    .value-badge.outdoor {
      --vc-badge-tone-border-color: var(--vc-air-outdoor);
    }

    .value-badge.supply {
      --vc-badge-tone-border-color: var(--vc-air-supply);
    }

    .value-badge.extract {
      --vc-badge-tone-border-color: var(--vc-air-extract);
    }

    .value-badge.exhaust {
      --vc-badge-tone-border-color: var(--vc-air-exhaust);
    }

    .value-badge.heater-active {
      --vc-badge-tone-border-color: var(--vc-air-supply);
    }

    .value-badge.component {
      border-color: var(--vc-badge-border-color, var(--vc-component-badge-border, var(--vc-value-box-border-color, var(--divider-color, rgba(127, 127, 127, 0.56)))));
    }

    .value-badge.badge-extract_fan,
    .value-badge.badge-supply_fan,
    .value-badge.badge-heat_exchanger_speed {
      --vc-component-badge-border: var(--secondary-text-color, #607080);
    }

    .value-badge .badge-label,
    .value-badge .badge-value,
    .value-badge .badge-metric {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .value-badge .badge-label {
      color: var(--secondary-text-color, #727272);
      font-size: var(--vc-default-text-size);
      font-weight: 500;
    }

    .value-badge .badge-value {
      color: var(--primary-text-color, #111);
      font-size: var(--vc-badge-font-size, var(--vc-default-text-size));
      font-weight: 600;
    }

    .value-badge .badge-metric {
      display: grid;
      grid-template-columns: auto auto;
      justify-content: space-between;
      gap: 12px;
      color: var(--primary-text-color, #111);
      font-size: var(--vc-badge-font-size, var(--vc-default-text-size));
      font-weight: 500;
    }

    .value-badge .badge-metric strong {
      font-size: inherit;
      font-weight: 600;
    }

    .value-badge.interactive {
      pointer-events: auto;
      cursor: pointer;
    }

    .value-badge.interactive:focus {
      border-color: var(--primary-color, #03a9f4);
      border-width: 2px;
      outline: none;
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

    .status-item.interactive {
      cursor: pointer;
    }

    .status-item.interactive:focus {
      border-color: var(--primary-color, #03a9f4);
      outline: none;
    }

    .status-item span,
    .status-item strong {
      overflow-wrap: anywhere;
    }

    .status-item span {
      color: var(--secondary-text-color, #727272);
      font-size: var(--vc-default-text-size);
      line-height: 1.2;
    }

    .status-item strong {
      color: var(--primary-text-color, #111);
      font-size: var(--vc-status-font-size, var(--vc-default-text-size));
      font-weight: 600;
      line-height: 1.25;
      text-align: right;
    }

    .status-item select {
      min-width: 0;
      max-width: 60%;
      padding: 4px 6px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 5px;
      background: var(--ha-card-background, var(--card-background-color, transparent));
      color: var(--primary-text-color, #111);
      font: inherit;
      font-size: var(--vc-status-font-size, var(--vc-default-text-size));
      font-weight: 600;
      cursor: pointer;
    }

    .layout-narrow .status-strip {
      grid-template-columns: 1fr;
    }

    .status-item.warning strong {
      color: var(--warning-color, #f6a623);
    }

    .status-item.danger strong {
      color: var(--error-color, #db4437);
    }

    @keyframes airflow {
      to {
        stroke-dashoffset: -27;
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

    }
  `;
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ventilation-card",
  name: "Ventilation Card",
  description: "Residential ventilation/AHU visualization card.",
});
