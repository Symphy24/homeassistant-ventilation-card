# Repository Guidance

This is a Home Assistant Lovelace custom card project.

- Use TypeScript, Lit, and Vite.
- Keep the card frontend-only.
- Do not add backend services.
- Do not implement BACnet or device communication in the card.
- Do not hardcode user-specific entity IDs.
- Prefer configurable Home Assistant entities.
- Keep Flexit-specific mappings as examples or presets, not required core logic.
- Keep the first implementation simple and maintainable.
- Always run `npm install` if needed, then `npm run build` before finishing.
- Keep README examples updated when configuration changes.
- Do not copy code from Frickeldave/homeassistant-airflow or any other inspiration project.
