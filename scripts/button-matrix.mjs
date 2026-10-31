#!/usr/bin/env node
// Screenshots generated from examples/: the button matrix for the README, and the page at 390 and 1280.
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const port = 4174;
const server = spawn(process.execPath, ["scripts/serve-examples.mjs"], { env: { ...process.env, PORT: String(port) }, stdio: "ignore" });
const url = `http://localhost:${port}/examples/`;
mkdirSync("docs", { recursive: true });

try {
  await new Promise((r) => setTimeout(r, 400));
  const browser = await chromium.launch();
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (width === 1280) await page.locator("#buttons").screenshot({ path: "docs/button-matrix.png" });
    await page.screenshot({ path: `docs/examples-${width}.png`, fullPage: true });
    await page.close();
  }
  await browser.close();
  console.log("docs/button-matrix.png, docs/examples-1280.png, docs/examples-390.png");
} finally {
  server.kill();
}
