import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: "http://localhost:4173", trace: "retain-on-failure" },
  webServer: { command: "node scripts/serve-examples.mjs", url: "http://localhost:4173/examples/", reuseExistingServer: !process.env.CI },
  projects: [
    { name: "390", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } },
    { name: "1280", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
  ],
});
