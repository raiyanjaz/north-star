import { defineConfig } from "vite";
// Keep the existing Python static routes and launchers; committed output runs without npm.
export default defineConfig({
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "web",
    emptyOutDir: false,
    lib: {
      entry: "frontend/main.tsx",
      formats: ["es"],
      fileName: () => "app.js",
      cssFileName: "style",
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
