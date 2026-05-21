import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/ventilation-card.ts",
      formats: ["es"],
      fileName: () => "ventilation-card.js",
    },
    rollupOptions: {
      output: {
        entryFileNames: "ventilation-card.js",
      },
    },
    minify: "esbuild",
    sourcemap: false,
  },
});
