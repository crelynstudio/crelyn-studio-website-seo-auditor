import assert from "node:assert/strict";
import { createServer, request as httpRequest } from "node:http";
import { after, test } from "node:test";
import { once } from "node:events";
import { startWebServer } from "../../src/web/server.js";

const site = createServer((req, res) => {
  if (req.url === "/robots.txt") return res.end("User-agent: *\nAllow: /");
  if (req.url === "/sitemap.xml") {
    res.writeHead(404);
    return res.end();
  }
  if (req.url === "/missing") {
    res.writeHead(404);
    return res.end("missing");
  }
  res.setHeader("Content-Type", "text/html");
  res.end(
    '<title>Test site</title><meta name="description" content="Test description"><h1>Test site</h1><a href="/missing">Broken</a>',
  );
});
site.listen(0, "127.0.0.1");
await once(site, "listening");
const siteAddress = site.address();
assert.ok(siteAddress && typeof siteAddress !== "string");
const target = `http://127.0.0.1:${siteAddress.port}/`;
const { server, url } = await startWebServer();
after(async () => {
  server.closeAllConnections();
  site.closeAllConnections();
  await Promise.all([
    new Promise<void>((resolve) => server.close(() => resolve())),
    new Promise<void>((resolve) => site.close(() => resolve())),
  ]);
});

test("local web app serves UI, enforces host/origin and exports a real audit", async () => {
  const home = await fetch(url);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /Website SEO Auditor/);
  const badHost = await new Promise<number>((resolve, reject) => {
    const req = httpRequest(
      url,
      { headers: { Host: "attacker.example" } },
      (res) => {
        res.resume();
        resolve(res.statusCode ?? 0);
      },
    );
    req.on("error", reject);
    req.end();
  });
  assert.equal(badHost, 403);
  const request = {
    url: target,
    lang: "en",
    maxPages: 10,
    maxDepth: 2,
    checkResources: false,
    allowPrivateNetwork: true,
  };
  const foreign = await fetch(`${url}/api/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://example.com",
    },
    body: JSON.stringify(request),
  });
  assert.equal(foreign.status, 403);
  const invalid = await fetch(`${url}/api/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: url },
    body: JSON.stringify({ ...request, maxPages: 1001 }),
  });
  assert.equal(invalid.status, 400);
  const start = await fetch(`${url}/api/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: url },
    body: JSON.stringify(request),
  });
  assert.equal(start.status, 202);
  let state: { active: boolean; ready: boolean; error: string } = {
    active: true,
    ready: false,
    error: "",
  };
  for (let i = 0; i < 100; i++) {
    state = (await (await fetch(`${url}/api/state`)).json()) as typeof state;
    if (!state.active) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(state.error, "");
  assert.equal(state.ready, true);
  const report = (await (await fetch(`${url}/api/report`)).json()) as {
    target: string;
    findings: { ruleId: string }[];
  };
  assert.equal(report.target, target);
  assert.ok(report.findings.some((f) => f.ruleId === "LINK_001"));
  const htmlResponse = await fetch(`${url}/api/report.html`);
  assert.equal(htmlResponse.status, 200);
  assert.match(
    htmlResponse.headers.get("content-disposition") ?? "",
    /Website-SEO-Auditor-127\.0\.0\.1-\d{4}-\d{2}-\d{2}\.html/,
  );
  assert.match(await htmlResponse.text(), /Website SEO Auditor/);
});

test("closing the local app requires same-origin POST and stops its listener", async () => {
  const local = await startWebServer();
  const denied = await fetch(`${local.url}/api/quit`, {
    method: "POST",
    headers: { Origin: "https://example.com" },
  });
  assert.equal(denied.status, 403);
  const closed = once(local.server, "close");
  const accepted = await fetch(`${local.url}/api/quit`, {
    method: "POST",
    headers: { Origin: local.url },
  });
  assert.equal(accepted.status, 200);
  await closed;
});
