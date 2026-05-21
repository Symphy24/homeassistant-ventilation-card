# homeassistant-ventilation-card

A Home Assistant Lovelace custom card for visualizing residential ventilation/AHU units in a Norwegian SD/BMS-style layout.

The first target use case is a Flexit Nordic L6 ventilation unit, but the card is intentionally generic and reads configurable Home Assistant entities. It does not communicate with BACnet or any ventilation unit directly.

## Features

- Home Assistant Lovelace custom card: `custom:ventilation-card`
- SVG-based AHU schematic with outdoor, supply, extract, and exhaust air paths
- Rotary heat exchanger, supply fan, and extract fan symbols
- Optional animated airflow arrows
- Dark mode friendly styling using Home Assistant CSS variables
- Safe handling of missing or unavailable entities

## Installation

### HACS custom repository

This repository is prepared for HACS as a Lovelace plugin/custom card repository.

1. Build the card with `npm run build`.
2. Add this repository to HACS as a custom repository.
3. Select the Lovelace category.
4. Install the card.
5. Add the resource if HACS does not add it automatically:

```yaml
url: /hacsfiles/homeassistant-ventilation-card/ventilation-card.js
type: module
```

### Manual installation

1. Build the card with `npm run build`.
2. Copy `dist/ventilation-card.js` to `www/community/homeassistant-ventilation-card/ventilation-card.js`.
3. Add this Lovelace resource:

```yaml
url: /local/community/homeassistant-ventilation-card/ventilation-card.js
type: module
```

## Lovelace configuration

```yaml
type: custom:ventilation-card
name: Flexit L6
exchanger_type: rotary
show_airflow: true
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
```

## Development

```bash
npm install
npm run build
```

The built card is generated at `dist/ventilation-card.js`.

## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | `Ventilation` | Card title. |
| `exchanger_type` | string | `rotary` | Heat exchanger style. MVP supports `rotary`. |
| `show_airflow` | boolean | `true` | Enables animated airflow arrows. |
| `entities` | object | `{}` | Entity IDs used by the card. |

Supported entity keys:

- `outdoor_temp`
- `supply_temp`
- `extract_temp`
- `exhaust_temp`
- `supply_fan`
- `extract_fan`
- `heat_exchanger_speed`
- `heater_output`
- `filter_alarm`
- `alarm`
- `mode`

Missing, `unknown`, or `unavailable` entities are displayed as `—`.
