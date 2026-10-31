import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts", elements: "src/elements/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    clean: false,
    sourcemap: false,
    target: "es2020",
    outDir: "dist",
  },
  {
    // Default export only, so require() returns the preset object itself.
    entry: { tailwind: "src/tailwind.ts" },
    format: ["esm", "cjs"],
    dts: true,
    clean: false,
    target: "es2020",
    outDir: "dist",
    cjsInterop: true,
    splitting: true,
  },
  {
    entry: { react: "react/index.tsx" },
    format: ["esm", "cjs"],
    dts: true,
    clean: false,
    target: "es2020",
    outDir: "dist",
    external: ["react", "react-dom"],
    banner: { js: '"use client";' },
  },
  {
    // Vendored file for repos that cannot install from GitHub (GitLab family).
    entry: { "kultura-house-kit": "src/elements/index.ts" },
    format: ["iife"],
    globalName: "KulturaHouseKit",
    minify: true,
    clean: false,
    target: "es2020",
    outDir: "dist",
    outExtension: () => ({ js: ".js" }),
  },
]);
