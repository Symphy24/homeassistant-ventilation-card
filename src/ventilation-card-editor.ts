import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardConfig, VentilationColors, VentilationEntities, VentilationLabels, VentilationValueBoxConfig } from "./types";

const ENTITY_FIELDS: Array<{ key: keyof VentilationEntities; label: string }> = [
  { key: "outdoor_temp", label: "Outdoor temperature" },
  { key: "supply_temp", label: "Supply temperature" },
  { key: "extract_temp", label: "Extract temperature" },
  { key: "exhaust_temp", label: "Exhaust temperature" },
  { key: "supply_fan", label: "Supply fan" },
  { key: "extract_fan", label: "Extract fan" },
  { key: "heat_exchanger_speed", label: "Heat exchanger speed" },
  { key: "heater_output", label: "Heater output" },
  { key: "filter_alarm", label: "Filter alarm" },
  { key: "alarm", label: "Alarm" },
  { key: "mode", label: "Mode" },
];

const LABEL_FIELDS: Array<{ key: keyof VentilationLabels; label: string }> = [
  { key: "outdoor_temp", label: "Outdoor label" },
  { key: "supply_temp", label: "Supply label" },
  { key: "extract_temp", label: "Extract label" },
  { key: "exhaust_temp", label: "Exhaust label" },
  { key: "supply_fan", label: "Supply fan label" },
  { key: "extract_fan", label: "Extract fan label" },
  { key: "heat_exchanger_speed", label: "Heat exchanger label" },
  { key: "heater_output", label: "Heater label" },
  { key: "mode", label: "Mode label" },
  { key: "filter_alarm", label: "Filter alarm label" },
  { key: "alarm", label: "Alarm label" },
];

@customElement("ventilation-card-editor")
export class VentilationCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config: LovelaceCardConfig = { type: "custom:ventilation-card" };

  public setConfig(config: LovelaceCardConfig): void {
    this.config = { ...config, type: config.type || "custom:ventilation-card" };
  }

  protected render() {
    if (!this.hass) {
      return nothing;
    }

    return html`
      <div class="editor">
        ${this.renderSection("General", html`
          ${this.renderTextField("Name", this.config.name ?? "", (value) => this.updateRoot("name", value))}
          <ha-select
            label="Exchanger type"
            .value=${this.config.exchanger_type ?? "rotary"}
            @selected=${(event: Event) => {
              const value = (event.target as HTMLSelectElement).value;
              this.updateRoot("exchanger_type", value);
            }}
            @change=${(event: Event) => {
              const value = (event.target as HTMLSelectElement).value;
              this.updateRoot("exchanger_type", value);
            }}
          >
            <mwc-list-item value="rotary">Rotary</mwc-list-item>
            <mwc-list-item value="crossflow">Crossflow</mwc-list-item>
            <mwc-list-item value="counterflow">Counterflow</mwc-list-item>
            <mwc-list-item value="none">None</mwc-list-item>
          </ha-select>
        `)}

        ${this.renderSection("Entities", html`
          ${ENTITY_FIELDS.map(
            ({ key, label }) => html`
              <ha-entity-picker
                .hass=${this.hass}
                .value=${this.config.entities?.[key] ?? ""}
                .label=${label}
                allow-custom-entity
                @value-changed=${(event: CustomEvent<{ value?: string }>) =>
                  this.updateNested("entities", key, event.detail.value ?? "")}
              ></ha-entity-picker>
            `,
          )}
        `)}

        ${this.renderSection("Labels", html`
          ${LABEL_FIELDS.map(({ key, label }) =>
            this.renderTextField(label, this.config.labels?.[key] ?? "", (value) => this.updateNested("labels", key, value)),
          )}
        `)}

        ${this.renderSection("Airflow colors", html`
          ${this.renderColorField("Outdoor/intake color", this.config.colors?.outdoor_air ?? "", (value) =>
            this.updateNested("colors", "outdoor_air", value),
          )}
          ${this.renderColorField("Supply air color", this.config.colors?.supply_air ?? "", (value) =>
            this.updateNested("colors", "supply_air", value),
          )}
          ${this.renderColorField("Extract air color", this.config.colors?.extract_air ?? "", (value) =>
            this.updateNested("colors", "extract_air", value),
          )}
          ${this.renderColorField("Exhaust air color", this.config.colors?.exhaust_air ?? "", (value) =>
            this.updateNested("colors", "exhaust_air", value),
          )}
        `)}

        ${this.renderSection("Value box styling", html`
          ${this.renderColorField("Value box border color", this.config.value_box?.border_color ?? "", (value) =>
            this.updateNested("value_box", "border_color", value),
          )}
          ${this.renderColorField("Value box background color", this.config.value_box?.background_color ?? "", (value) =>
            this.updateNested("value_box", "background_color", value),
          )}
          ${this.renderColorField("Value box text color", this.config.value_box?.text_color ?? "", (value) =>
            this.updateNested("value_box", "text_color", value),
          )}
        `)}
      </div>
    `;
  }

  private renderSection(title: string, content: unknown) {
    return html`<div class="section"><h3>${title}</h3><div class="fields">${content}</div></div>`;
  }

  private renderTextField(label: string, value: string, onChange: (value: string) => void) {
    return html`<ha-textfield .label=${label} .value=${value} @input=${(event: Event) => onChange((event.target as HTMLInputElement).value)}></ha-textfield>`;
  }

  private renderColorField(label: string, value: string, onChange: (value: string) => void) {
    return html`
      <div class="color-row">
        <ha-textfield .label=${label} .value=${value} placeholder="Default" @input=${(event: Event) => onChange((event.target as HTMLInputElement).value)}></ha-textfield>
        <input type="color" .value=${this.toColorValue(value)} @input=${(event: Event) => onChange((event.target as HTMLInputElement).value)} />
        <button type="button" @click=${() => onChange("")}>Clear</button>
      </div>
    `;
  }

  private toColorValue(value: string): string {
    return /^#[0-9A-F]{6}$/i.test(value) ? value : "#5fcf9b";
  }

  private updateRoot(key: "name" | "exchanger_type", value: string): void {
    const next: LovelaceCardConfig = { ...this.config };
    if (!value.trim()) {
      delete next[key];
    } else {
      next[key] = value;
    }
    this.updateConfig(next);
  }

  private updateNested(
    section: "entities" | "labels" | "colors" | "value_box",
    key: keyof VentilationEntities | keyof VentilationLabels | keyof VentilationColors | keyof VentilationValueBoxConfig,
    value: string,
  ): void {
    const next: LovelaceCardConfig = { ...this.config };
    const current = { ...(next[section] ?? {}) } as Record<string, string>;

    if (!value.trim()) {
      delete current[key as string];
    } else {
      current[key as string] = value;
    }

    if (Object.keys(current).length === 0) {
      delete next[section];
    } else {
      next[section] = current;
    }

    this.updateConfig(next);
  }

  private updateConfig(config: LovelaceCardConfig): void {
    this.config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
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
      border-radius: 12px;
      padding: 12px;
    }
    h3 {
      margin: 0 0 12px;
      font-size: 15px;
    }
    .fields {
      display: grid;
      gap: 10px;
    }
    .color-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 8px;
      align-items: center;
    }
  `;
}
