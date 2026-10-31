#!/usr/bin/env node
// Lighthouse mobile check for public pages (mobile preset, simulated 4G throttling).
// Fails under 85 performance, LCP over 2.5 s or TBT over 200 ms (TBT stands in for INP in a lab run).
// Writes a markdown summary to $GITHUB_STEP_SUMMARY when present, and always to stdout.
//
// Usage:
//   node scripts/lighthouse-mobile.mjs --base https://preview.example.vercel.app --paths "/,/en"
//   node scripts/lighthouse-mobile.mjs https://kultura.co.id/ https://kultura.co.id/en
// Env: LH_BASE_URL, LH_PATHS (comma or newline separated), LH_EXTRA_HEADERS (JSON), CHROME_PATH,
//      LH_MIN_PERFORMANCE, LH_MAX_LCP_MS, LH_MAX_TBT_MS, LH_RUNS (median of n runs, default 1).
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const BUDGET = { performance: 85, lcpMs: 2500, tbtMs: 200 };

export function parseArgs(argv, env = process.env) {
  const out = { base: env.LH_BASE_URL ?? "", paths: splitList(env.LH_PATHS ?? ""), urls: [], headers: undefined, runs: Number(env.LH_RUNS ?? 1) || 1 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--base") out.base = argv[++i] ?? "";
    else if (a === "--paths") out.paths = splitList(argv[++i] ?? "");
    else if (a === "--runs") out.runs = Number(argv[++i]) || 1;
    else if (a && !a.startsWith("--")) out.urls.push(a);
  }
  if (env.LH_EXTRA_HEADERS) out.headers = JSON.parse(env.LH_EXTRA_HEADERS);
  return out;
}

export function splitList(s) {
  return s.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
}

export function resolveUrls({ base, paths, urls }) {
  const list = [...urls];
  for (const p of paths) {
    if (/^https?:\/\//.test(p)) list.push(p);
    else if (base) list.push(new URL(p, base.endsWith("/") ? base : base + "/").toString());
    else throw new Error(`Path ${p} needs --base or LH_BASE_URL`);
  }
  if (!list.length) throw new Error("No URLs to check. Pass URLs, or --base with --paths.");
  return [...new Set(list)];
}

export function budgetFromEnv(env = process.env) {
  return {
    performance: Number(env.LH_MIN_PERFORMANCE ?? BUDGET.performance),
    lcpMs: Number(env.LH_MAX_LCP_MS ?? BUDGET.lcpMs),
    tbtMs: Number(env.LH_MAX_TBT_MS ?? BUDGET.tbtMs),
  };
}

/** Pulls the three numbers we gate on out of a Lighthouse result. */
export function metricsFromLhr(lhr) {
  return {
    performance: Math.round((lhr.categories?.performance?.score ?? 0) * 100),
    lcpMs: Math.round(lhr.audits?.["largest-contentful-paint"]?.numericValue ?? Infinity),
    tbtMs: Math.round(lhr.audits?.["total-blocking-time"]?.numericValue ?? Infinity),
    cls: lhr.audits?.["cumulative-layout-shift"]?.numericValue ?? null,
    error: lhr.runtimeError?.message ?? null,
  };
}

export function evaluate(m, budget = BUDGET) {
  const failures = [];
  if (m.error) failures.push(`runtime error: ${m.error}`);
  if (m.performance < budget.performance) failures.push(`performance ${m.performance} < ${budget.performance}`);
  if (m.lcpMs > budget.lcpMs) failures.push(`LCP ${fmtMs(m.lcpMs)} > ${fmtMs(budget.lcpMs)}`);
  if (m.tbtMs > budget.tbtMs) failures.push(`TBT ${m.tbtMs} ms > ${budget.tbtMs} ms`);
  return { pass: failures.length === 0, failures };
}

export function median(values) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const fmtMs = (ms) => (Number.isFinite(ms) ? `${(ms / 1000).toFixed(2)} s` : "n/a");

export function summaryMarkdown(rows, budget = BUDGET) {
  const ok = rows.every((r) => r.result.pass);
  const lines = [
    `### Lighthouse mobile: ${ok ? "pass" : "fail"}`,
    "",
    `Budget: performance at least ${budget.performance}, LCP at most ${fmtMs(budget.lcpMs)}, TBT at most ${budget.tbtMs} ms (mobile preset, simulated 4G).`,
    "",
    "| Page | Performance | LCP | TBT | CLS | Result |",
    "|---|---|---|---|---|---|",
    ...rows.map(({ url, metrics: m, result }) =>
      `| ${url} | ${m.performance} | ${fmtMs(m.lcpMs)} | ${Number.isFinite(m.tbtMs) ? `${m.tbtMs} ms` : "n/a"} | ${m.cls === null ? "n/a" : m.cls.toFixed(3)} | ${result.pass ? "pass" : "fail: " + result.failures.join("; ")} |`),
  ];
  return lines.join("\n") + "\n";
}

async function runOne(url, { headers, chromePath }) {
  const [{ default: lighthouse }, chromeLauncher] = await Promise.all([import("lighthouse"), import("chrome-launcher")]);
  const chrome = await chromeLauncher.launch({
    chromePath: chromePath || undefined,
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  try {
    const runner = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance"],
      formFactor: "mobile",
      throttlingMethod: "simulate",
      extraHeaders: headers,
    });
    return runner.lhr;
  } finally {
    await chrome.kill();
  }
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv, env);
  const urls = resolveUrls(args);
  const budget = budgetFromEnv(env);
  const rows = [];
  mkdirSync(".lighthouse", { recursive: true });
  for (const url of urls) {
    const runs = [];
    for (let i = 0; i < args.runs; i++) {
      const lhr = await runOne(url, { headers: args.headers, chromePath: env.CHROME_PATH });
      runs.push(metricsFromLhr(lhr));
      writeFileSync(`.lighthouse/${encodeURIComponent(url)}-${i + 1}.json`, JSON.stringify(lhr));
    }
    const metrics = {
      performance: median(runs.map((r) => r.performance)),
      lcpMs: median(runs.map((r) => r.lcpMs)),
      tbtMs: median(runs.map((r) => r.tbtMs)),
      cls: runs[0].cls,
      error: runs.find((r) => r.error)?.error ?? null,
    };
    rows.push({ url, metrics, result: evaluate(metrics, budget) });
  }
  const md = summaryMarkdown(rows, budget);
  process.stdout.write(md);
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, md);
  return rows.every((r) => r.result.pass) ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().then((code) => process.exit(code), (err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(2);
  });
}
