import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    logOverride: { "duplicate-case": "silent" },
  },
});
