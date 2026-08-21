import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  ExchangerType,
  HomeAssistant,
  LovelaceCardConfig,
  ValueBoxKey,
  VentilationAhuSize,
  VentilationAnimationConfig,
  VentilationColors,
  VentilationComponentSettings,
  VentilationEntities,
  VentilationEfficiencyConfig,
  VentilationFormatConfig,
  VentilationLabels,
  VentilationPositionOffset,
  VentilationPositionOffsetValue,
  VentilationVisibility,
  VentilationValueBoxConfig,
  VentilationValueBoxOverride,
} from "./types";

type ComponentPanel = {
  key: ValueBoxKey;
  title: string;
  defaultLabel: string;
};

const COMPONENT_PANELS: ComponentPanel[] = [
  { key: "outdoor_temp", title: "Outdoor air temperature", defaultLabel: "Outdoor air temperature" },
  { key: "supply_temp", title: "Supply air temperature", defaultLabel: "Supply air temperature" },
  { key: "extract_temp", title: "Extract air temperature", defaultLabel: "Extract air temperature" },
  { key: "exhaust_temp", title: "Exhaust air temperature", defaultLabel: "Exhaust air temperature" },
  { key: "supply_fan", title: "Supply fan", defaultLabel: "Supply fan" },
  { key: "extract_fan", title: "Extract fan", defaultLabel: "Extract fan" },
  { key: "heat_exchanger_speed", title: "Heat exchanger", defaultLabel: "Heat exchanger" },
  { key: "heater_output", title: "Heater output", defaultLabel: "Heater output" },
  { key: "mode", title: "Mode", defaultLabel: "Mode" },
  { key: "filter_alarm", title: "Filter alarm", defaultLabel: "Filter alarm" },
  { key: "alarm", title: "Alarm", defaultLabel: "Alarm" },
];

const AIRFLOW_COLOR_FIELDS: Array<{
  key: keyof VentilationColors;
  label: string;
  fallback: string;
}> = [
  { key: "outdoor_air", label: "Outdoor air color", fallback: "#63b489" },
  { key: "supply_air", label: "Supply air color", fallback: "#d99a45" },
  { key: "extract_air", label: "Extract air color", fallback: "#e5aa6f" },
  { key: "exhaust_air", label: "Exhaust air color", fallback: "#456f9f" },
];

const EXCHANGER_OPTIONS: Array<{ value: ExchangerType; label: string }> = [
  { value: "rotary", label: "Rotary" },
  { value: "crossflow", label: "Crossflow" },
  { value: "none", label: "None" },
];

const AHU_SIZE_OPTIONS: Array<{ value: VentilationAhuSize; label: string }> = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const EFFICIENCY_SOURCE_OPTIONS: Array<{ value: "entity" | "calculated"; label: string }> = [
  { value: "entity", label: "Entity" },
  { value: "calculated", label: "Calculated" },
];

const FORMATTABLE_KEYS = new Set<ValueBoxKey>([
  "outdoor_temp",
  "supply_temp",
  "extract_temp",
  "exhaust_temp",
  "supply_fan",
  "extract_fan",
  "heat_exchanger_speed",
  "heater_output",
]);

const POSITIONABLE_KEYS = FORMATTABLE_KEYS;
const DEFAULT_COMPACT_LAYOUT_BREAKPOINT = 900;

@customElement("ventilation-card-editor")
export class VentilationCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config: LovelaceCardConfig = { type: "custom:ventilation-card" };

  public connectedCallback(): void {
    super.connectedCallback();
    void this.loadHomeAssistantElements();
  }

  public setConfig(config: LovelaceCardConfig): void {
    this.config = {
      ...config,
      type: config.type || "custom:ventilation-card",
      exchanger_type: config.exchanger_type ?? "rotary",
    };
  }

  protected render() {
    if (!this.hass) {
      return nothing;
    }

    return html`
      <div class="editor">
        ${this.renderGeneralSection()}
        ${this.renderComponentsSection()}
        ${this.renderAirflowColorsSection()}
      </div>
    `;
  }

  private async loadHomeAssistantElements(): Promise<void> {
    if (customElements.get("ha-entity-picker")) {
      return;
    }

    const entitiesCard = customElements.get("hui-entities-card") as
      | { getConfigElement?: () => Promise<unknown> }
      | undefined;

    try {
      await entitiesCard?.getConfigElement?.();
    } catch (error) {
      // Home Assistant loads this element in the real editor; local dev may not.
      console.warn("Unable to preload ha-entity-picker", error);
    }
  }

  private renderGeneralSection(): TemplateResult {
    return this.renderSection(
      "General",
      html`
        ${this.renderTextField("Name", this.config.name ?? "", (value) => this.updateRoot("name", value))}
        <ha-select
          name="exchanger_type"
          label="Exchanger type"
          .value=${this.config.exchanger_type ?? "rotary"}
          .options=${EXCHANGER_OPTIONS}
          @selected=${(event: CustomEvent<{ value?: string }>) => this.updateExchangerType(this.eventValue(event))}
          @change=${(event: Event) => this.updateExchangerType(this.eventValue(event))}
        >
          ${EXCHANGER_OPTIONS.map((option) => html`<mwc-list-item .value=${option.value}>${option.label}</mwc-list-item>`)}
        </ha-select>
        <ha-select
          name="ahu_size"
          label="AHU size"
          .value=${this.config.layout?.ahu_size ?? "medium"}
          .options=${AHU_SIZE_OPTIONS}
          @selected=${(event: CustomEvent<{ value?: string }>) => this.updateAhuSize(this.eventValue(event))}
          @change=${(event: Event) => this.updateAhuSize(this.eventValue(event))}
        >
          ${AHU_SIZE_OPTIONS.map((option) => html`<mwc-list-item .value=${option.value}>${option.label}</mwc-list-item>`)}
        </ha-select>
        ${this.renderNumberField(
          "Compact layout breakpoint",
          this.config.layout?.compact_breakpoint,
          (value) => this.updateCompactBreakpoint(value),
          {
            min: 500,
            max: 1200,
            step: 10,
            placeholder: String(DEFAULT_COMPACT_LAYOUT_BREAKPOINT),
            suffix: "px",
            helperText: "Switch to compact layout below this card width in px.",
          },
        )}
      `,
      true,
    );
  }

  private renderAirflowColorsSection(): TemplateResult {
    return this.renderSection(
      "Airflow colors",
      html`
        ${AIRFLOW_COLOR_FIELDS.map((field) =>
          this.renderColorField(field.label, this.config.colors?.[field.key] ?? "", field.fallback, (value) =>
            this.updateNestedString("colors", field.key, value),
          ),
        )}
      `,
    );
  }

  private renderComponentsSection(): TemplateResult {
    return this.renderSection(
      "Sensors and components",
      html`${COMPONENT_PANELS.map((panel) => this.renderComponentPanel(panel))}`,
    );
  }

  private renderComponentPanel(panel: ComponentPanel): TemplateResult {
    const valueBox = this.config.value_boxes?.[panel.key];

    return html`
      <details class="component-panel">
        <summary>
          <span>${panel.title}</span>
          <small>${this.config.entities?.[panel.key] || "No entity"}</small>
        </summary>
        <div class="panel-fields">
          ${this.renderSwitchField("Show", this.config.component_visibility?.[panel.key] !== false, (value) =>
            this.updateNestedBoolean("component_visibility", panel.key, value),
          )}
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this.config.entities?.[panel.key] ?? ""}
            .label=${"Entity"}
            allow-custom-entity
            ?allow-custom-entity=${true}
            @value-changed=${(event: CustomEvent<{ value?: string }>) => {
              event.stopPropagation();
              this.updateNestedString("entities", panel.key, event.detail.value ?? "");
            }}
          ></ha-entity-picker>
          ${panel.key === "heat_exchanger_speed" ? this.renderEfficiencyFields() : nothing}
          ${this.renderLabelField(panel.key, panel.defaultLabel)}
          ${this.renderColorField("Value box border color", valueBox?.border_color ?? "", "#9e9e9e", (value) =>
            this.updateValueBox(panel.key, "border_color", value),
          )}
          ${this.renderNumberField("Font size", valueBox?.font_size, (value) => this.updateValueBox(panel.key, "font_size", value))}
          ${POSITIONABLE_KEYS.has(panel.key) ? this.renderPositionOffsetFields(panel.key) : nothing}
          ${FORMATTABLE_KEYS.has(panel.key) ? this.renderFormatFields(panel.key) : nothing}
          ${this.renderComponentAnimationFields(panel.key)}
        </div>
      </details>
    `;
  }

  private renderComponentAnimationFields(key: ValueBoxKey): TemplateResult | typeof nothing {
    if (key !== "supply_fan" && key !== "extract_fan" && key !== "heat_exchanger_speed") {
      return nothing;
    }

    const settings = this.config.component_settings?.[key];
    const legacyEnabled = key === "heat_exchanger_speed" ? this.config.animations?.rotor_enabled !== false : this.config.animations?.fans_enabled !== false;
    const legacySpeed = key === "heat_exchanger_speed" ? this.config.animations?.rotor_max_speed : this.config.animations?.fan_max_speed;
    const animationMaxSpeed = settings?.animation_max_speed ?? settings?.animation_speed ?? legacySpeed ?? 100;

    return html`
      <div class="field-group">
        ${this.renderSwitchField("Enable animation", settings?.animation_enabled ?? legacyEnabled, (value) =>
          this.updateComponentSetting(key, "animation_enabled", value),
        )}
        ${this.renderAnimationSpeedField(key, this.clampNumber(animationMaxSpeed, 0, 100))}
      </div>
    `;
  }

  private renderEfficiencyFields(): TemplateResult {
    const efficiency = this.config.efficiency;
    const source = efficiency?.source === "entity" ? "entity" : "calculated";
    const visible = efficiency?.enabled !== false && (efficiency?.enabled === true || efficiency?.source != null);
    const hasBeforeHeaterSensor = efficiency?.has_supply_temp_before_heater === true;

    return html`
      <div class="feature-fields">
        <h4>Heat exchanger efficiency</h4>
        ${this.renderSwitchField("Show efficiency", visible, (value) =>
          this.updateEfficiency("enabled", value),
        )}
        <ha-select
          name="efficiency_source"
          label="Efficiency source"
          .value=${source}
          .options=${EFFICIENCY_SOURCE_OPTIONS}
          @selected=${(event: CustomEvent<{ value?: string }>) => this.updateEfficiencySource(this.eventValue(event))}
          @change=${(event: Event) => this.updateEfficiencySource(this.eventValue(event))}
        >
          ${EFFICIENCY_SOURCE_OPTIONS.map((option) => html`<mwc-list-item .value=${option.value}>${option.label}</mwc-list-item>`)}
        </ha-select>
        ${source === "entity"
          ? html`
              <ha-entity-picker
                .hass=${this.hass}
                .value=${this.config.entities?.heat_exchanger_efficiency ?? ""}
                .label=${"Efficiency entity"}
                allow-custom-entity
                ?allow-custom-entity=${true}
                @value-changed=${(event: CustomEvent<{ value?: string }>) => {
                  event.stopPropagation();
                  this.updateNestedString("entities", "heat_exchanger_efficiency", event.detail.value ?? "");
                }}
              ></ha-entity-picker>
            `
          : html`
              ${this.renderSwitchField("Has supply temperature before heater", hasBeforeHeaterSensor, (value) =>
                this.updateEfficiency("has_supply_temp_before_heater", value),
              )}
              ${hasBeforeHeaterSensor
                ? html`
                    <ha-entity-picker
                      .hass=${this.hass}
                      .value=${this.config.entities?.supply_temp_before_heater ?? ""}
                      .label=${"Supply temperature before heater"}
                      allow-custom-entity
                      ?allow-custom-entity=${true}
                      @value-changed=${(event: CustomEvent<{ value?: string }>) => {
                        event.stopPropagation();
                        this.updateNestedString("entities", "supply_temp_before_heater", event.detail.value ?? "");
                      }}
                    ></ha-entity-picker>
                  `
                : nothing}
            `}
        ${this.renderNumberField(
          "Efficiency decimals",
          efficiency?.decimals,
          (value) => this.updateEfficiency("decimals", value == null ? undefined : Math.round(value)),
          { min: 0, max: 4, placeholder: "0" },
        )}
        <small class="feature-help">Efficiency is shown in the heat exchanger value box when enabled.</small>
      </div>
    `;
  }

  private renderAnimationSpeedField(key: "supply_fan" | "extract_fan" | "heat_exchanger_speed", value: number): TemplateResult {
    const inputId = `animation-max-speed-${key}`;

    return html`
      <div class="animation-speed-field">
        <label for=${inputId}>Animation speed at 100%:</label>
        <div class="animation-speed-input-row">
          <input
            id=${inputId}
            type="number"
            min="0"
            max="100"
            step="1"
            .value=${String(value)}
            @input=${(event: Event) => this.updateAnimationMaxSpeed(key, (event.target as HTMLInputElement).value)}
            @change=${(event: Event) => this.updateAnimationMaxSpeed(key, (event.target as HTMLInputElement).value)}
          />
          <span aria-hidden="true">%</span>
        </div>
        <small>Percent of full animation speed.</small>
      </div>
    `;
  }

  private renderFormatFields(key: ValueBoxKey): TemplateResult {
    const format = this.config.format?.[key];

    return html`
      <div class="field-group">
        ${this.renderNumberField(
          "Decimals",
          format?.decimals,
          (value) => this.updateFormat(key, "decimals", value == null ? undefined : Math.round(value)),
          { min: 0, max: 4, placeholder: "Default" },
        )}
        ${this.renderSwitchField("Show unit", format?.show_unit !== false, (value) => this.updateFormat(key, "show_unit", value))}
      </div>
    `;
  }

  private renderPositionOffsetFields(key: ValueBoxKey): TemplateResult {
    const offsets = this.config.position_offsets?.[key];

    return html`
      <div class="field-group position-offset-fields">
        ${this.renderNumberField("Position X offset", this.positionOffsetValue(offsets?.x), (value) => this.updatePositionOffset(key, "x", value), {
          min: -200,
          max: 200,
          step: 1,
          placeholder: "0",
        })}
        ${this.renderNumberField("Position Y offset", this.positionOffsetValue(offsets?.y), (value) => this.updatePositionOffset(key, "y", value), {
          min: -200,
          max: 200,
          step: 1,
          placeholder: "0",
        })}
        <small class="position-offset-help">Fine-tunes this value box position relative to the default layout.</small>
      </div>
    `;
  }

  private renderSection(title: string, content: TemplateResult, open = false): TemplateResult {
    return html`
      <details class="section" ?open=${open}>
        <summary class="section-summary">${title}</summary>
        <div class="fields">${content}</div>
      </details>
    `;
  }

  private renderTextField(label: string, value: string, onChange: (value: string) => void, placeholder = ""): TemplateResult {
    return html`
      <ha-textfield
        .label=${label}
        .value=${value}
        .placeholder=${placeholder}
        @value-changed=${(event: CustomEvent<{ value?: string }>) => onChange(event.detail.value ?? "")}
        @input=${(event: Event) => onChange((event.target as HTMLInputElement).value)}
        @change=${(event: Event) => onChange((event.target as HTMLInputElement).value)}
      ></ha-textfield>
    `;
  }

  private renderLabelField(key: ValueBoxKey, defaultLabel: string): TemplateResult {
    const configuredLabel = this.config.labels?.[key] ?? "";

    return html`
      <div class="label-field">
        <label for=${`label-${key}`}>Label</label>
        <input
          id=${`label-${key}`}
          type="text"
          .value=${configuredLabel}
          placeholder=${defaultLabel}
          @input=${(event: Event) => this.updateLabel(key, (event.target as HTMLInputElement).value)}
          @change=${(event: Event) => this.updateLabel(key, (event.target as HTMLInputElement).value)}
        />
        <small>Default: ${defaultLabel}</small>
      </div>
    `;
  }

  private renderNumberField(
    label: string,
    value: number | undefined,
    onChange: (value?: number) => void,
    options: { min?: number; max?: number; step?: number; placeholder?: string; suffix?: string; helperText?: string } = {},
  ): TemplateResult {
    return html`
      <div class=${options.helperText ? "number-field has-helper" : "number-field"}>
        <ha-textfield
          .label=${label}
          .value=${value == null ? "" : String(value)}
          type="number"
          min=${String(options.min ?? 8)}
          max=${String(options.max ?? 24)}
          step=${String(options.step ?? 1)}
          .placeholder=${options.placeholder ?? "12"}
          .suffix=${options.suffix ?? ""}
          @input=${(event: Event) => {
            const raw = (event.target as HTMLInputElement).value.trim();
            onChange(raw ? Number(raw) : undefined);
          }}
          @change=${(event: Event) => {
            const raw = (event.target as HTMLInputElement).value.trim();
            onChange(raw ? Number(raw) : undefined);
          }}
        ></ha-textfield>
        ${options.helperText ? html`<small>${options.helperText}</small>` : nothing}
      </div>
    `;
  }

  private renderSwitchField(label: string, checked: boolean, onChange: (value: boolean) => void): TemplateResult {
    return html`
      <label class="switch-row">
        <span>${label}</span>
        <ha-switch
          .checked=${checked}
          @change=${(event: Event) => onChange((event.target as HTMLInputElement).checked)}
        ></ha-switch>
      </label>
    `;
  }

  private renderColorField(label: string, value: string, fallback: string, onChange: (value: string) => void): TemplateResult {
    return html`
      <div class="color-row">
        <label class="color-field">
          <span>${label}</span>
          <ha-textfield
            .value=${value}
            placeholder="Default"
            @input=${(event: Event) => onChange((event.target as HTMLInputElement).value)}
            @change=${(event: Event) => onChange((event.target as HTMLInputElement).value)}
          ></ha-textfield>
        </label>
        <input
          type="color"
          aria-label=${label}
          .value=${this.colorInputValue(value, fallback)}
          @input=${(event: Event) => onChange((event.target as HTMLInputElement).value)}
        />
        <ha-button appearance="plain" @click=${() => onChange("")}>Clear</ha-button>
      </div>
    `;
  }

  private colorInputValue(value: string, fallback: string): string {
    return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
  }

  private positionOffsetValue(value: VentilationPositionOffsetValue | undefined): number | undefined {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : undefined;
    }

    if (typeof value === "string" && value.trim().length > 0) {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : undefined;
    }

    return undefined;
  }

  private eventValue(event: Event | CustomEvent<{ value?: string }>): string {
    const customValue = (event as CustomEvent<{ value?: string }>).detail?.value;
    if (customValue != null) {
      return customValue;
    }

    return ((event.target as HTMLInputElement | HTMLSelectElement | null)?.value ?? "").trim();
  }

  private updateRoot(key: "name", value: string): void {
    const next = this.cloneConfig();
    const trimmed = value.trim();

    if (trimmed) {
      next[key] = value;
    } else {
      delete next[key];
    }

    this.updateConfig(next);
  }

  private updateExchangerType(value: string): void {
    if (!["rotary", "crossflow", "none"].includes(value)) {
      return;
    }

    this.updateConfig({ ...this.cloneConfig(), exchanger_type: value as ExchangerType });
  }

  private updateAhuSize(value: string): void {
    if (!["small", "medium", "large"].includes(value)) {
      return;
    }

    const next = this.cloneConfig();
    next.layout = {
      ...(next.layout ?? {}),
      ahu_size: value as VentilationAhuSize,
    };
    this.updateConfig(next);
  }

  private updateCompactBreakpoint(value?: number): void {
    const next = this.cloneConfig();
    const layout = { ...(next.layout ?? {}) };

    if (value == null || !Number.isFinite(value)) {
      delete layout.compact_breakpoint;
    } else {
      layout.compact_breakpoint = this.clampNumber(value, 500, 1200);
    }

    if (Object.keys(layout).length > 0) {
      next.layout = layout;
    } else {
      delete next.layout;
    }

    this.updateConfig(next);
  }

  private updateEfficiency(field: keyof VentilationEfficiencyConfig, value: boolean | number | undefined): void {
    const next = this.cloneConfig();
    const efficiency = { ...(next.efficiency ?? {}) };

    if (value == null || (typeof value === "number" && !Number.isFinite(value))) {
      delete efficiency[field];
    } else if ((field === "enabled" || field === "has_supply_temp_before_heater") && typeof value === "boolean") {
      efficiency[field] = value;
    } else if (field === "decimals" && typeof value === "number") {
      efficiency.decimals = this.clampNumber(value, 0, 4);
    }

    if (Object.keys(efficiency).length > 0) {
      next.efficiency = efficiency;
    } else {
      delete next.efficiency;
    }

    this.updateConfig(next);
  }

  private updateEfficiencySource(value: string): void {
    if (value !== "entity" && value !== "calculated") {
      return;
    }

    const next = this.cloneConfig();
    next.efficiency = {
      ...(next.efficiency ?? {}),
      source: value,
    };
    this.updateConfig(next);
  }

  private updateLabel(key: ValueBoxKey, value: string): void {
    const next = this.cloneConfig();
    const labels = { ...(next.labels ?? {}) };
    const trimmed = value.trim();

    if (!trimmed) {
      delete labels[key];
    } else {
      labels[key] = value;
    }

    if (Object.keys(labels).length > 0) {
      next.labels = labels;
    } else {
      delete next.labels;
    }

    this.updateConfig(next);
  }

  private updateNestedString(
    section: "entities" | "labels" | "colors" | "value_box",
    key: keyof VentilationEntities | keyof VentilationLabels | keyof VentilationColors | keyof VentilationValueBoxConfig,
    value: string,
  ): void {
    const next = this.cloneConfig();
    const current = { ...(next[section] ?? {}) } as Record<string, string>;
    const trimmed = value.trim();

    if (trimmed) {
      current[key as string] = value;
    } else {
      delete current[key as string];
    }

    if (Object.keys(current).length > 0) {
      next[section] = current;
    } else {
      delete next[section];
    }

    this.updateConfig(next);
  }

  private updateValueBox(key: ValueBoxKey, field: keyof VentilationValueBoxOverride, value: string | number | undefined): void {
    const next = this.cloneConfig();
    const boxes = { ...(next.value_boxes ?? {}) };
    const entry = { ...(boxes[key] ?? {}) };

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        this.setValueBoxField(entry, field, value);
      } else {
        delete entry[field];
      }
    } else if (value != null && Number.isFinite(value)) {
      this.setValueBoxField(entry, field, value);
    } else {
      delete entry[field];
    }

    if (Object.keys(entry).length > 0) {
      boxes[key] = entry;
    } else {
      delete boxes[key];
    }

    if (Object.keys(boxes).length > 0) {
      next.value_boxes = boxes;
    } else {
      delete next.value_boxes;
    }

    this.updateConfig(next);
  }

  private updatePositionOffset(key: ValueBoxKey, axis: keyof VentilationPositionOffset, value?: number): void {
    const next = this.cloneConfig();
    const allOffsets = { ...(next.position_offsets ?? {}) };
    const offsets = { ...(allOffsets[key] ?? {}) };

    if (value == null || !Number.isFinite(value)) {
      delete offsets[axis];
    } else {
      offsets[axis] = this.clampNumber(value, -200, 200);
    }

    if (Object.keys(offsets).length > 0) {
      allOffsets[key] = offsets;
    } else {
      delete allOffsets[key];
    }

    if (Object.keys(allOffsets).length > 0) {
      next.position_offsets = allOffsets;
    } else {
      delete next.position_offsets;
    }

    this.updateConfig(next);
  }

  private updateNestedBoolean(
    section: "component_visibility" | "animations",
    key: keyof VentilationVisibility | keyof VentilationAnimationConfig,
    value: boolean,
  ): void {
    const next = this.cloneConfig();
    const current = { ...(next[section] ?? {}) } as Record<string, boolean>;
    current[key as string] = value;
    if (section === "component_visibility") {
      next.component_visibility = current as VentilationVisibility;
    } else {
      next.animations = current as VentilationAnimationConfig;
    }
    this.updateConfig(next);
  }

  private updateNestedNumber(section: "animations", key: keyof VentilationAnimationConfig, value: number | undefined, min: number, max: number): void {
    const next = this.cloneConfig();
    const current = { ...(next[section] ?? {}) } as Record<string, number | boolean>;

    if (value == null || !Number.isFinite(value)) {
      delete current[key as string];
    } else {
      current[key as string] = this.clampNumber(value, min, max);
    }

    if (Object.keys(current).length > 0) {
      next[section] = current as VentilationAnimationConfig;
    } else {
      delete next[section];
    }

    this.updateConfig(next);
  }

  private updateFormat(key: ValueBoxKey, field: keyof VentilationFormatConfig, value: number | boolean | undefined): void {
    const next = this.cloneConfig();
    const formats = { ...(next.format ?? {}) };
    const entry = { ...(formats[key] ?? {}) };

    if (value == null || (typeof value === "number" && !Number.isFinite(value))) {
      delete entry[field];
    } else if (field === "decimals" && typeof value === "number") {
      entry.decimals = this.clampNumber(value, 0, 4);
    } else if (field === "show_unit" && typeof value === "boolean") {
      entry.show_unit = value;
    }

    if (Object.keys(entry).length > 0) {
      formats[key] = entry;
    } else {
      delete formats[key];
    }

    if (Object.keys(formats).length > 0) {
      next.format = formats;
    } else {
      delete next.format;
    }

    this.updateConfig(next);
  }

  private updateComponentSetting(key: "supply_fan" | "extract_fan" | "heat_exchanger_speed", field: keyof VentilationComponentSettings, value: boolean | number | undefined): void {
    const next = this.cloneConfig();
    const allSettings = { ...(next.component_settings ?? {}) };
    const settings = { ...(allSettings[key] ?? {}) };

    if (value == null || (typeof value === "number" && !Number.isFinite(value))) {
      delete settings[field];
    } else if (field === "animation_enabled" && typeof value === "boolean") {
      settings.animation_enabled = value;
    } else if (field === "animation_max_speed" && typeof value === "number") {
      settings.animation_max_speed = this.clampNumber(value, 0, 100);
      delete settings.animation_speed;
    } else if (field === "animation_speed" && typeof value === "number") {
      settings.animation_speed = this.clampNumber(value, 10, 150);
    }

    if (Object.keys(settings).length > 0) {
      allSettings[key] = settings;
    } else {
      delete allSettings[key];
    }

    if (Object.keys(allSettings).length > 0) {
      next.component_settings = allSettings;
    } else {
      delete next.component_settings;
    }

    this.updateConfig(next);
  }

  private updateAnimationMaxSpeed(key: "supply_fan" | "extract_fan" | "heat_exchanger_speed", rawValue: string): void {
    const value = rawValue.trim() === "" ? undefined : Number(rawValue);
    this.updateComponentSetting(key, "animation_max_speed", value);
  }

  private setValueBoxField(entry: VentilationValueBoxOverride, field: keyof VentilationValueBoxOverride, value: string | number): void {
    if (field === "border_color" && typeof value === "string") {
      entry.border_color = value;
    }

    if (field === "font_size" && typeof value === "number") {
      entry.font_size = value;
    }
  }

  private cloneConfig(): LovelaceCardConfig {
    const next: LovelaceCardConfig = {
      ...this.config,
    };

    if (this.config.entities) {
      next.entities = { ...this.config.entities };
    }

    if (this.config.labels) {
      next.labels = { ...this.config.labels };
    }

    if (this.config.colors) {
      next.colors = { ...this.config.colors };
    }

    if (this.config.value_box) {
      next.value_box = { ...this.config.value_box };
    }

    if (this.config.value_boxes) {
      next.value_boxes = Object.fromEntries(
        Object.entries(this.config.value_boxes ?? {}).map(([key, value]) => [key, { ...(value ?? {}) }]),
      ) as LovelaceCardConfig["value_boxes"];
    }

    if (this.config.position_offsets) {
      next.position_offsets = Object.fromEntries(
        Object.entries(this.config.position_offsets ?? {}).map(([key, value]) => [key, { ...(value ?? {}) }]),
      ) as LovelaceCardConfig["position_offsets"];
    }

    if (this.config.component_visibility) {
      next.component_visibility = { ...this.config.component_visibility };
    }

    if (this.config.animations) {
      next.animations = { ...this.config.animations };
    }

    if (this.config.component_settings) {
      next.component_settings = Object.fromEntries(
        Object.entries(this.config.component_settings ?? {}).map(([key, value]) => [key, { ...(value ?? {}) }]),
      ) as LovelaceCardConfig["component_settings"];
    }

    if (this.config.layout) {
      next.layout = { ...this.config.layout };
    }

    if (this.config.format) {
      next.format = Object.fromEntries(
        Object.entries(this.config.format ?? {}).map(([key, value]) => [key, { ...(value ?? {}) }]),
      ) as LovelaceCardConfig["format"];
    }

    if (this.config.efficiency) {
      next.efficiency = { ...this.config.efficiency };
    }

    return next;
  }

  private clampNumber(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) {
      return min;
    }

    return Math.min(Math.max(value, min), max);
  }

  private updateConfig(config: LovelaceCardConfig): void {
    this.config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  static styles = css`
    .editor {
      display: grid;
      gap: 16px;
    }

    .section {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 8px;
      background: var(--card-background-color, transparent);
      overflow: hidden;
    }

    .fields {
      display: grid;
      gap: 12px;
      padding: 12px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
    }

    .panel-fields {
      display: grid;
      gap: 12px;
    }

    ha-select,
    ha-textfield,
    ha-entity-picker,
    ha-switch {
      width: 100%;
    }

    .switch-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      justify-items: stretch;
      width: 100%;
      min-height: 40px;
      color: var(--primary-text-color);
      font-size: 14px;
      line-height: 1.25;
      text-align: left;
    }

    .switch-row span {
      justify-self: start;
      text-align: left;
    }

    .switch-row ha-switch {
      width: auto;
      justify-self: end;
    }

    .label-field {
      display: grid;
      gap: 4px;
    }

    .label-field label {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.25;
    }

    .label-field input {
      box-sizing: border-box;
      width: 100%;
      min-height: 40px;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 4px;
      background: var(--mdc-text-field-fill-color, var(--card-background-color, transparent));
      color: var(--primary-text-color);
      font: inherit;
    }

    .label-field input:focus {
      border-color: var(--primary-color);
      outline: none;
    }

    .label-field input::placeholder {
      color: var(--secondary-text-color);
      opacity: 0.85;
    }

    .label-field small {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.25;
    }

    .field-group {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
      align-items: center;
    }

    .position-offset-fields {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .position-offset-help {
      grid-column: 1 / -1;
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.25;
    }

    .feature-fields {
      display: grid;
      gap: 10px;
      padding: 10px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 8px;
    }

    .feature-fields h4 {
      margin: 0;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 600;
    }

    .feature-help {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.25;
    }

    .number-field {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .number-field ha-textfield {
      width: 100%;
    }

    .number-field small {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.25;
    }

    .animation-speed-field {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .animation-speed-field label {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.25;
    }

    .animation-speed-input-row {
      display: grid;
      grid-template-columns: minmax(72px, 120px) auto;
      gap: 8px;
      align-items: center;
      justify-content: start;
    }

    .animation-speed-input-row input {
      box-sizing: border-box;
      width: 100%;
      min-height: 40px;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 4px;
      background: var(--mdc-text-field-fill-color, var(--card-background-color, transparent));
      color: var(--primary-text-color);
      font: inherit;
    }

    .animation-speed-input-row input:focus {
      border-color: var(--primary-color);
      outline: none;
    }

    .animation-speed-input-row span,
    .animation-speed-field small {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.25;
    }

    .color-field {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .color-field span {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.25;
    }

    .component-panel {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 8px;
      padding: 0;
      overflow: hidden;
    }

    summary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      min-height: 40px;
      padding: 0 12px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-weight: 600;
      list-style-position: inside;
    }

    .section-summary {
      min-height: 44px;
      padding: 0 12px;
      font-size: 15px;
    }

    summary small {
      min-width: 0;
      max-width: 180px;
      overflow: hidden;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 400;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .panel-fields {
      padding: 8px 12px 12px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
    }

    .color-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 44px auto;
      gap: 8px;
      align-items: center;
    }

    input[type="color"] {
      width: 44px;
      height: 44px;
      padding: 2px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
    }

    ha-button {
      white-space: nowrap;
    }

    @media (max-width: 520px) {
      summary {
        grid-template-columns: minmax(0, 1fr);
        gap: 2px;
        padding-top: 8px;
        padding-bottom: 8px;
      }

      summary small {
        max-width: 100%;
      }

      .color-row {
        grid-template-columns: minmax(0, 1fr) 44px;
      }

      .field-group {
        grid-template-columns: minmax(0, 1fr);
      }

      .color-row ha-button {
        grid-column: 1 / -1;
        justify-self: start;
      }
    }
  `;
}
