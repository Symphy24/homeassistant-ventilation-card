import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  ExchangerType,
  HomeAssistant,
  LovelaceCardConfig,
  ValueBoxKey,
  VentilationColors,
  VentilationEntities,
  VentilationLabels,
  VentilationValueBoxConfig,
  VentilationValueBoxOverride,
} from "./types";

type PanelDef = { key: ValueBoxKey; title: string };

const PANELS: PanelDef[] = [
  { key: "outdoor_temp", title: "Outdoor air / Inntak" },
  { key: "supply_temp", title: "Supply air / Tilluft" },
  { key: "extract_temp", title: "Extract air / Avtrekk" },
  { key: "exhaust_temp", title: "Exhaust air / Avkast" },
  { key: "supply_fan", title: "Supply fan" },
  { key: "extract_fan", title: "Extract fan" },
  { key: "heat_exchanger_speed", title: "Heat exchanger" },
  { key: "heater_output", title: "Heater" },
  { key: "mode", title: "Mode" },
  { key: "filter_alarm", title: "Filter alarm" },
  { key: "alarm", title: "Alarm" },
];

@customElement("ventilation-card-editor")
export class VentilationCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: LovelaceCardConfig = { type: "custom:ventilation-card" };

  public setConfig(config: LovelaceCardConfig): void {
    this.config = { ...config, type: config.type || "custom:ventilation-card" };
  }

  protected render() {
    if (!this.hass) return nothing;

    return html`<div class="editor">
      ${this.renderSection("General", html`
        ${this.renderTextField("Name", this.config.name ?? "", (value) => this.updateRoot("name", value))}
        <ha-select
          .label=${"Exchanger type"}
          .value=${this.config.exchanger_type ?? "rotary"}
          @selected=${(e: Event) => this.updateRoot("exchanger_type", (e.target as HTMLSelectElement).value as ExchangerType)}
        >
          <mwc-list-item value="rotary">Rotary</mwc-list-item>
          <mwc-list-item value="crossflow">Crossflow</mwc-list-item>
          <mwc-list-item value="none">None</mwc-list-item>
        </ha-select>
      `)}

      ${this.renderSection("Airflow colors", html`
        ${this.renderColorField("Outdoor air / Inntak color", this.config.colors?.outdoor_air ?? "", (value) => this.updateNested("colors", "outdoor_air", value))}
        ${this.renderColorField("Supply air / Tilluft color", this.config.colors?.supply_air ?? "", (value) => this.updateNested("colors", "supply_air", value))}
        ${this.renderColorField("Extract air / Avtrekk color", this.config.colors?.extract_air ?? "", (value) => this.updateNested("colors", "extract_air", value))}
        ${this.renderColorField("Exhaust air / Avkast color", this.config.colors?.exhaust_air ?? "", (value) => this.updateNested("colors", "exhaust_air", value))}
      `)}

      ${this.renderSection("Value box defaults", html`
        ${this.renderColorField("Default value box border color", this.config.value_box?.border_color ?? "", (value) => this.updateNested("value_box", "border_color", value))}
        ${this.renderColorField("Default value box background color", this.config.value_box?.background_color ?? "", (value) => this.updateNested("value_box", "background_color", value))}
      `)}

      ${this.renderSection(
        "Sensors and components",
        PANELS.map((panel) => this.renderPanel(panel)),
      )}
    </div>`;
  }

  private renderPanel(panel: PanelDef) {
    const key = panel.key;
    return html`<details>
      <summary>${panel.title}</summary>
      <div class="fields">
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this.config.entities?.[key] ?? ""}
          .label=${"Entity"}
          allow-custom-entity
          @value-changed=${(event: CustomEvent<{ value?: string }>) => this.updateNested("entities", key, event.detail.value ?? "")}
        ></ha-entity-picker>
        ${this.renderTextField("Label override", this.config.labels?.[key] ?? "", (value) => this.updateNested("labels", key, value))}
        ${this.renderNumberField("Font size", this.config.value_boxes?.[key]?.font_size, (value) => this.updateValueBoxOverride(key, "font_size", value))}
        ${this.renderColorField("Value box border color", this.config.value_boxes?.[key]?.border_color ?? "", (value) =>
          this.updateValueBoxOverride(key, "border_color", value))}
      </div>
    </details>`;
  }

  private renderSection(title: string, content: unknown) {
    return html`<section class="section"><h3>${title}</h3><div class="fields">${content}</div></section>`;
  }

  private renderTextField(label: string, value: string, onChange: (value: string) => void) {
    return html`<ha-textfield .label=${label} .value=${value} @input=${(event: Event) => onChange((event.target as HTMLInputElement).value)}></ha-textfield>`;
  }

  private renderNumberField(label: string, value: number | undefined, onChange: (value?: number) => void) {
    return html`<ha-textfield .label=${label} .value=${value != null ? String(value) : ""} type="number" @input=${(event: Event) => {
      const raw = (event.target as HTMLInputElement).value.trim();
      onChange(raw ? Number(raw) : undefined);
    }}></ha-textfield>`;
  }

  private renderColorField(label: string, value: string, onChange: (value: string) => void) {
    return html`<div class="color-row">
      <ha-textfield .label=${label} .value=${value} placeholder="Default" @input=${(event: Event) => onChange((event.target as HTMLInputElement).value)}></ha-textfield>
      <input aria-label=${label} type="color" .value=${this.toColorValue(value)} @input=${(event: Event) => onChange((event.target as HTMLInputElement).value)} />
      <button type="button" @click=${() => onChange("")}>Clear</button>
    </div>`;
  }

  private toColorValue(value: string): string {
    return /^#[0-9A-F]{6}$/i.test(value) ? value : "#5fcf9b";
  }

  private updateRoot(key: "name" | "exchanger_type", value: string): void {
    const next: LovelaceCardConfig = { ...this.config };
    if (!value.trim()) delete next[key]; else next[key] = value;
    this.updateConfig(next);
  }

  private updateNested(
    section: "entities" | "labels" | "colors" | "value_box",
    key: keyof VentilationEntities | keyof VentilationLabels | keyof VentilationColors | keyof VentilationValueBoxConfig,
    value: string,
  ): void {
    const next: LovelaceCardConfig = { ...this.config };
    const current = { ...(next[section] ?? {}) } as Record<string, string>;
    if (!value.trim()) delete current[key as string]; else current[key as string] = value;
    if (Object.keys(current).length === 0) delete next[section]; else next[section] = current;
    this.updateConfig(next);
  }

  private updateValueBoxOverride(key: ValueBoxKey, field: keyof VentilationValueBoxOverride, value: string | number | undefined): void {
    const next: LovelaceCardConfig = { ...this.config };
    const boxes = { ...(next.value_boxes ?? {}) };
    const entry = { ...(boxes[key] ?? {}) };
    const empty = typeof value === "string" ? !value.trim() : value == null || Number.isNaN(value);
    if (empty) {
      delete entry[field];
    } else {
      (entry as Record<string, string | number>)[field] = value as string | number;
    }
    if (Object.keys(entry).length === 0) delete boxes[key]; else boxes[key] = entry;
    if (Object.keys(boxes).length === 0) delete next.value_boxes; else next.value_boxes = boxes;
    this.updateConfig(next);
  }

  private updateConfig(config: LovelaceCardConfig): void {
    this.config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config }, bubbles: true, composed: true }));
  }

  static styles = css`
    .editor { display: grid; gap: 16px; }
    .section { border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2)); border-radius: 12px; padding: 12px; }
    h3 { margin: 0 0 12px; font-size: 15px; }
    .fields { display: grid; gap: 10px; }
    details { border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2)); border-radius: 10px; padding: 8px; }
    summary { cursor: pointer; font-weight: 600; }
    details .fields { margin-top: 10px; }
    .color-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 8px; align-items: center; }
  `;
}
