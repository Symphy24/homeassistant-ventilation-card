# homeassistant-ventilation-card

A modern Home Assistant Lovelace custom card for visualizing ventilation/AHU systems, inspired by modern industrial SD/BMS and building automation process graphics.

The card is generic and reads configurable Home Assistant entities. Flexit Nordic L6 is an example use case, but the card is intended to support other residential ventilation and AHU systems as well. The card is frontend-only and does not communicate directly with BACnet, Flexit devices, or any ventilation unit.

## Features

- Home Assistant Lovelace custom card: `custom:ventilation-card`
- SVG-based ventilation/AHU schematic
- Outdoor, supply, extract, and exhaust air paths
- Rotary heat exchanger, supply fan, extract fan, filters, and heater coil symbols
- Airflow animation with separate supply and extract speed groups
- Compact status row for mode, filter alarm, and alarm
- Collapsible visual Lovelace UI editor for card configuration, entities, labels, colors, visibility, animations, and formatting
- English default labels with optional per-component label overrides
- Optional airflow color overrides
- Optional per-sensor/component visibility
- Optional airflow and per-component animation controls
- Optional numeric value formatting
- Optional per-sensor value box border colors and font sizes
- Theme-aware styling using Home Assistant CSS variables
- Safe handling of missing, `unknown`, or `unavailable` entities

## Installation

### HACS Custom Repository

This repository is prepared for HACS as a Lovelace plugin/custom card repository.

1. Add this repository to HACS as a custom repository.
2. Select the Lovelace category.
3. Install the card.
4. Add the resource if HACS does not add it automatically:

```yaml
url: /hacsfiles/homeassistant-ventilation-card/ventilation-card.js
type: module
```

### Manual Installation

1. Download or build `dist/ventilation-card.js`.
2. Copy it to `www/community/homeassistant-ventilation-card/ventilation-card.js`.
3. Add this Lovelace resource:

```yaml
url: /local/community/homeassistant-ventilation-card/ventilation-card.js
type: module
```

## Lovelace Configuration

```yaml
type: custom:ventilation-card
name: Flexit L6
exchanger_type: rotary
entities:
  outdoor_temp: sensor.flexit_outdoor_temperature
  supply_temp: sensor.flexit_supply_temperature
  extract_temp: sensor.flexit_extract_temperature
  exhaust_temp: sensor.flexit_exhaust_temperature
  supply_fan: sensor.flexit_supply_fan
  extract_fan: sensor.flexit_extract_fan
  heat_exchanger_speed: sensor.flexit_heat_exchanger_speed
  heater_output: sensor.flexit_heater_output
  filter_alarm: binary_sensor.flexit_filter_alarm
  alarm: binary_sensor.flexit_alarm
  mode: sensor.flexit_mode
labels:
  supply_temp: Tilluft
colors:
  outdoor_air: "#5fcf9b"
  supply_air: "#f2a93b"
  extract_air: "#f6b66b"
  exhaust_air: "#4f86b8"
visibility:
  heater_output: true
animations:
  enabled: true
  airflow_enabled: true
  airflow_max_speed: 100
  stop_when_zero: true
component_settings:
  supply_fan:
    animation_enabled: true
    animation_max_speed: 75
  extract_fan:
    animation_enabled: true
    animation_max_speed: 75
  heat_exchanger_speed:
    animation_enabled: true
    animation_max_speed: 75
value_boxes:
  supply_temp:
    border_color: "#f2a93b"
    font_size: 12
format:
  supply_temp:
    decimals: 1
    show_unit: true
```

Existing configurations without `labels:`, `colors:`, `visibility:`, `animations:`, `component_settings:`, `format:`, or `value_boxes:` continue to work.

Existing configurations that still contain `language:` are accepted, but the setting is ignored.
Existing configurations that contain `layout:` are accepted, but layout size is no longer exposed in the visual editor.
Existing configurations that contain legacy `value_box:` are accepted as fallback styling, but global value box defaults are no longer exposed in the visual editor.


You can configure the card through YAML or through the built-in Lovelace visual editor.

All fields are optional except `type`. Missing entity mappings render as `—` in the card while preserving layout.
## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | `Ventilation` | Card title. |
| `exchanger_type` | string | `rotary` | Heat exchanger style: `rotary`, `crossflow`, or `none`. |
| `show_airflow` | boolean | `true` | Enables animated airflow. |
| `entities` | object | `{}` | Home Assistant entity IDs used by the card. |
| `labels` | object | built-in labels | Optional visible label overrides. |
| `colors` | object | built-in airflow colors | Optional airflow path colors. |
| `visibility` | object | visible | Optional per-key show/hide settings. |
| `animations` | object | current animation behavior | Optional global/airflow animation fallback settings. |
| `component_settings` | object | animation fallback settings | Optional per-component animation settings. |
| `format` | object | current HA state formatting | Optional per-key decimals and unit display. |
| `value_boxes` | object | `{}` | Preferred per-entity value frame overrides. |

## Supported Entities

All entities are optional. If an entity is missing, `unknown`, or `unavailable`, the card displays `—` and keeps the layout stable.

| Entity key | Default label | Description |
| --- | --- | --- |
| `outdoor_temp` | Outdoor air temperature | Outdoor/intake air temperature. |
| `supply_temp` | Supply air temperature | Supply air temperature. |
| `extract_temp` | Extract air temperature | Extract air temperature. |
| `exhaust_temp` | Exhaust air temperature | Exhaust/avkast air temperature. |
| `supply_fan` | Supply fan | Supply fan speed or signal. |
| `extract_fan` | Extract fan | Extract fan speed or signal. |
| `heat_exchanger_speed` | Heat exchanger | Rotary heat exchanger speed or signal. |
| `heater_output` | Heater output | Heater output. |
| `mode` | Mode | Current ventilation mode. |
| `filter_alarm` | Filter alarm | Filter alarm entity. |
| `alarm` | Alarm | General alarm entity. |

## Optional Labels

The card uses English default labels when `labels:` does not define a key.

Defaults are Outdoor air temperature, Supply air temperature, Extract air temperature, Exhaust air temperature, Supply fan, Extract fan, Heat exchanger, Heater output, Mode, Filter alarm, and Alarm.

Use the optional top-level `labels:` section to override visible text. Custom labels are shown exactly as provided and always override defaults. The visual editor exposes a label text field inside each collapsible sensor/component panel.

## Optional Visibility

Use `visibility:` to hide individual value boxes or components. Missing keys are visible by default. If a key is visible but its entity is missing, the card still displays `—`.

```yaml
visibility:
  outdoor_temp: true
  heater_output: false
  alarm: true
```

For component keys such as `supply_fan`, `extract_fan`, `heat_exchanger_speed`, and `heater_output`, hiding the key also hides that visual component and its value box. For `mode`, `filter_alarm`, and `alarm`, hiding the key removes the status strip item.

## Optional Airflow Colors

Use `colors:` to override the four airflow paths:

```yaml
colors:
  outdoor_air: "#5fcf9b"
  supply_air: "#f2a93b"
  extract_air: "#f6b66b"
  exhaust_air: "#4f86b8"
```

The visual editor labels these as Outdoor air color, Supply air color, Extract air color, and Exhaust air color.

## Optional Animations

Animation controls are shown in the visual editor near the component they affect. Fan and heat-exchanger animation controls are inside the relevant component panels.

Use `animations:` for airflow and backward-compatible global animation settings. If this section is missing, the card keeps its existing animation behavior.

```yaml
animations:
  enabled: true
  airflow_enabled: true
  airflow_max_speed: 100
  stop_when_zero: true
```

Use `component_settings:` for per-component animation controls:

```yaml
component_settings:
  supply_fan:
    animation_enabled: true
    animation_max_speed: 75
  extract_fan:
    animation_enabled: true
    animation_max_speed: 75
  heat_exchanger_speed:
    animation_enabled: true
    animation_max_speed: 75
```

`animation_max_speed` is a percentage from 0 to 100 and controls how fast the component animates when its entity value is 100%. Use `50` for half speed and `0` to stop that component animation. `stop_when_zero` stops animations when the source value is zero or unavailable. Existing `component_settings.*.animation_speed`, `animations.fans_enabled`, `animations.rotor_enabled`, `animations.fan_max_speed`, and `animations.rotor_max_speed` are still supported as fallbacks.

## Optional Formatting

Use `format:` to round numeric states or hide Home Assistant units per key. Missing formatting keeps the current behavior.

```yaml
format:
  outdoor_temp:
    decimals: 1
    show_unit: true
  supply_fan:
    decimals: 0
    show_unit: true
```

`decimals` applies only to numeric states. Non-numeric states are displayed as-is. `show_unit: false` hides `unit_of_measurement`.

## Optional Value Boxes

Use `value_boxes:` for per-sensor and per-component value frame styling. Text color remains theme-aware.

```yaml
value_boxes:
  outdoor_temp:
    border_color: "#5fcf9b"
    font_size: 12
  heat_exchanger_speed:
    border_color: "#f2a93b"
```

The legacy `value_box:` section is still supported as a fallback for shared `border_color` and `background_color`, but the visual editor now focuses on per-sensor `value_boxes`. Per-item `value_boxes.<key>.border_color` overrides `value_box.border_color`.

## Development

```bash
npm install
npm run build
```

The built card is generated at `dist/ventilation-card.js`.

## Notes

- This is a frontend-only Lovelace card.
- The card reads Home Assistant entity states only.
- Missing or unavailable entities render as `—`.
- BACnet, Modbus, Flexit integration, and other device communication must be handled by Home Assistant integrations or external systems.
