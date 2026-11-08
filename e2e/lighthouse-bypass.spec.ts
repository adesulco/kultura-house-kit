// The bypass priming against a stand-in for a protected Vercel preview: the secret sets a
// host cookie through Vercel's bypass link, and is never sent as a request header.
import { chromium, expect, test } from "@playwright/test";
import * as chromeLauncher from "chrome-launcher";
import { createServer, type IncomingMessage, type Server } from "node:http";
import type { AddressInfo } from "node:net";
// @ts-expect-error plain ESM script without types
import { primeBypass } from "../scripts/lighthouse-mobile.mjs";

// Playwright needs the fixtures argument even when no fixture is used.
// eslint-disable-next-line no-empty-pattern
test("bypass sets a host cookie, never a header, and redacts the secret on failure", async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "1280", "browser-independent; runs once");
  const secret = "s3cret-value";
  const seen: IncomingMessage[] = [];
  const signInPortRef = { value: 0 };
  const server = createServer((req, res) => {
    seen.push(req);
    const u = new URL(req.url ?? "/", "http://stand-in");
    // Like Vercel: the bypass link answers with a redirect that sets the cookie.
    if (u.searchParams.get("x-vercel-protection-bypass") === secret && u.searchParams.get("x-vercel-set-bypass-cookie") === "true") {
      res.writeHead(307, { "set-cookie": "bypass=ok; Path=/; HttpOnly; SameSite=Lax", location: u.pathname });
      res.end();
      return;
    }
    if ((req.headers.cookie ?? "").includes("bypass=ok")) {
      res.writeHead(200, { "content-type": "text/html" });
      res.end("<!doctype html><title>page</title><h1>page</h1>");
      return;
    }
    // Like Vercel's sign-in redirect, which can set a nonce cookie on the preview host first.
    res.writeHead(302, { "set-cookie": "nonce=1; Path=/", location: `http://127.0.0.1:${signInPortRef.value}/login` });
    res.end();
  });
  // The sign-in host, a different origin: a wrong secret ends here after a nonce cookie.
  const signIn = createServer((_req, res) => { res.writeHead(200, { "content-type": "text/plain" }); res.end("sign in"); });
  const listen = (s: Server) => new Promise<number>((r) => s.listen(0, "127.0.0.1", () => r((s.address() as AddressInfo).port)));
  signInPortRef.value = await listen(signIn);
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const page = `http://127.0.0.1:${(server.address() as AddressInfo).port}/en`;
  const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new", "--no-sandbox"] });
  try {
    // A wrong secret fails clearly, and the message does not carry it.
    const err = await primeBypass(chrome.port, page, "wrong-secret", { timeoutMs: 10000 }).then(() => null, (e: Error) => e);
    expect(err?.message).toMatch(/redirected to http:\/\/127\.0\.0\.1:\d+: check VERCEL_AUTOMATION_BYPASS_SECRET/);
    expect(err?.message).not.toContain("wrong-secret");

    await primeBypass(chrome.port, page, secret, { timeoutMs: 10000 });
    expect(seen.some((r) => r.headers["x-vercel-protection-bypass"])).toBe(false);
    expect(seen.some((r) => (r.url ?? "").startsWith("/robots.txt?"))).toBe(true);
  } finally {
    await chrome.kill();
    server.close();
    signIn.close();
  }
});
