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
- Visual Lovelace UI editor for card configuration
- Optional YAML label overrides
- Optional airflow color overrides
- Optional value box border/background/text colors
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
name: Test Flexit L6
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
  outdoor_temp: Inntak
  supply_temp: Tilluft
  extract_temp: Avtrekk
  exhaust_temp: Avkast
  supply_fan: Tilluftsvifte
  extract_fan: Avtrekksvifte
  heat_exchanger_speed: Gjenvinner
  heater_output: Varme
  mode: Modus
  filter_alarm: Filteralarm
  alarm: Alarm
colors:
  outdoor_air: "#5fcf9b"
  supply_air: "#f2a93b"
  extract_air: "#f6b66b"
  exhaust_air: "#4f86b8"
value_box:
  border_color: ""
  background_color: ""
  text_color: ""
```

Existing configurations without `labels:`, `colors:`, or `value_box:` continue to work.


You can configure the card through YAML or through the built-in Lovelace visual editor.

All fields are optional except `type`. Missing entity mappings render as `—` in the card while preserving layout.
## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | `Ventilation` | Card title. |
| `exchanger_type` | string | `rotary` | Heat exchanger style. The current visual implementation targets rotary heat exchangers. |
| `show_airflow` | boolean | `true` | Enables animated airflow. |
| `entities` | object | `{}` | Home Assistant entity IDs used by the card. |
| `labels` | object | built-in labels | Optional visible label overrides. |
| `colors` | object | built-in airflow colors | Optional airflow path colors. |
| `value_box` | object | theme defaults | Optional value frame border/background/text colors. |

## Supported Entities

All entities are optional. If an entity is missing, `unknown`, or `unavailable`, the card displays `—` and keeps the layout stable.

| Entity key | Default label | Description |
| --- | --- | --- |
| `outdoor_temp` | Outdoor | Outdoor/intake air temperature. |
| `supply_temp` | Supply | Supply air temperature. |
| `extract_temp` | Extract | Extract air temperature. |
| `exhaust_temp` | Exhaust | Exhaust/avkast air temperature. |
| `supply_fan` | Supply fan | Supply fan speed or signal. |
| `extract_fan` | Extract fan | Extract fan speed or signal. |
| `heat_exchanger_speed` | Heat exchanger | Rotary heat exchanger speed or signal. |
| `heater_output` | Heater | Heater output. |
| `mode` | Mode | Current ventilation mode. |
| `filter_alarm` | Filter alarm | Filter alarm entity. |
| `alarm` | Alarm | General alarm entity. |

## Optional Labels

Use the optional top-level `labels:` section to override visible text. Defaults use title case and are used whenever a label is not configured. Custom labels are shown exactly as provided.

## Development

```bash
npm install
npm run build
```

The built card is generated at `dist/ventilation-card.js`.

## Notes

- This is a frontend-only Lovelace card.
- The card reads Home Assistant entity states only.
- BACnet, Modbus, Flexit integration, and other device communication must be handled by Home Assistant integrations or external systems.
