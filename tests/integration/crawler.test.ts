import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { gzipSync } from 'node:zlib';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { scan } from '../../src/crawler/index.js';
import { parseConfig } from '../../src/config/index.js';
import { SafeHttp } from '../../src/network/http.js';
import { Ajv } from 'ajv';

type Handler = (req: http.IncomingMessage, res: http.ServerResponse) => void;
async function site(handler: Handler) {
  const hits: { path: string; time: number }[] = [];
  const server = http.createServer((req, res) => { hits.push({ path: req.url!, time: Date.now() }); handler(req, res); });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const origin = `http://127.0.0.1:${(server.address() as import('node:net').AddressInfo).port}`;
  return { origin, hits, close: () => new Promise<void>(resolve => { server.closeAllConnections(); server.close(() => resolve()); }) };
}
function config(url: string, ...args: string[]) { return parseConfig([url, '--allow-private-network', ...args]); }
function defaults(req: http.IncomingMessage, res: http.ServerResponse): boolean {
  if (req.url === '/robots.txt' || req.url === '/sitemap.xml') { res.writeHead(404); res.end(); return true; }
  return false;
}
function document(res: http.ServerResponse, body = '<title>Example</title><meta name="description" content="Example page"><h1>Example</h1>') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(body); }

test('end-to-end crawl, robots, sitemap index, deduplication, broken links and non-HTML', async () => {
  const s = await site((req, res) => {
    if (req.url === '/robots.txt') { res.end('User-agent: WebsiteSEOAuditor\nDisallow: /private\nAllow: /private/open'); return; }
    if (req.url === '/sitemap.xml') { res.end('<sitemapindex><sitemap><loc>/map.xml</loc></sitemap></sitemapindex>'); return; }
    if (req.url === '/map.xml') { res.end('<urlset><url><loc>/about</loc></url></urlset>'); return; }
    if (req.url === '/') { document(res, '<title>Türkçe</title><a href="/about#x">A</a><a href="/about#y">B</a><a href="/missing">C</a><a href="/private">D</a><a href="/file">File</a><a href="https://example.com">External</a>'); return; }
    if (req.url === '/about') { document(res, '<title>Türkçe</title><meta name="robots" content="noindex">'); return; }
    if (req.url === '/file') { res.setHeader('Content-Type', 'application/pdf'); res.end('not a real PDF'); return; }
    res.writeHead(404); res.end();
  });
  try {
    const r = await scan(config(s.origin, '--lang', 'tr'));
    assert.equal(r.schemaVersion, '2'); assert.equal(r.status, 'truncated');
    assert.equal(r.pages.length, 4); assert.equal(s.hits.filter(h => h.path === '/about').length, 1);
    assert.ok(!s.hits.some(h => h.path === '/private'));
    assert.ok(r.findings.some(f => f.ruleId === 'LINK_001' && f.sourceUrl === s.origin + '/' && f.targetUrl === s.origin + '/missing'));
    assert.equal(r.findings.filter(f => f.ruleId === 'SEO_002').length, 2);
    assert.ok(r.skippedChecks.some(s => s.reason === 'NON_HTML'));
    assert.ok(r.findings.some(f => f.ruleId === 'IDX_001'));
    for (let i = 1; i < s.hits.length; i++) assert.ok(s.hits[i]!.time - s.hits[i - 1]!.time >= 450);
  } finally { await s.close(); }
});
test('robots 503 and network errors fail closed, 404 permits scan', async () => {
  const blocked = await site((_req, res) => { res.writeHead(503, { 'Retry-After': '30' }); res.end(); });
  try {
    const r = await scan(config(blocked.origin));
    assert.equal(r.status, 'truncated'); assert.equal(r.pages.length, 0);
    assert.deepEqual(blocked.hits.map(h => h.path), ['/robots.txt']);
  } finally { await blocked.close(); }
  const s = await site((req, res) => { if (!defaults(req, res)) document(res); });
  try { assert.equal((await scan(config(s.origin))).status, 'complete'); }
  finally { await s.close(); }
  const unavailable = await scan(config(s.origin, '--timeout', '100'));
  assert.equal(unavailable.status, 'truncated'); assert.equal(unavailable.pages.length, 0);
});
test('redirect chains, loops, hop limit, external origin and robots redirect barrier', async () => {
  const s = await site((req, res) => {
    if (req.url === '/robots.txt') { res.end('User-agent: *\nDisallow: /denied'); return; }
    const routes: Record<string, string> = { '/a': '/b', '/b': '/end', '/loop': '/loop', '/escape': 'http://localhost:9/', '/blocked': '/denied' };
    const number = /^\/hop(\d+)$/.exec(req.url!);
    if (number || routes[req.url!]) { res.writeHead(req.url === '/a' ? 301 : 302, { Location: number ? `/hop${Number(number[1]) + 1}` : routes[req.url!]! }); res.end(); return; }
    document(res);
  });
  try {
    const n = new SafeHttp(config(s.origin), new AbortController().signal);
    n.allowed = url => new URL(url).pathname !== '/denied';
    const result = await n.get(s.origin + '/a'); assert.equal(result.redirects.length, 2);
    await n.get(s.origin + '/end'); assert.equal(s.hits.filter(h => h.path === '/end').length, 1);
    for (const [path, code] of [['/loop', 'REDIRECT_LOOP'], ['/escape', 'REDIRECT_ORIGIN'], ['/blocked', 'ROBOTS_DENIED'], ['/hop0', 'REDIRECT_LIMIT']]) await assert.rejects(n.get(s.origin + path), new RegExp(code!));
    assert.ok(!s.hits.some(h => h.path === '/denied'));
  } finally { await s.close(); }
});
test('limits, timeout, oversized and compressed responses, bounded retry', async () => {
  let retries = 0, active = 0, maxActive = 0;
  const s = await site((req, res) => {
    if (defaults(req, res)) return;
    if (req.url === '/slow') { setTimeout(() => res.end('late'), 300); return; }
    if (req.url === '/huge') { res.end('x'.repeat(2 * 1024 * 1024 + 1)); return; }
    if (req.url === '/zip') { res.setHeader('Content-Encoding', 'gzip'); res.end(gzipSync('x'.repeat(3 * 1024 * 1024))); return; }
    if (req.url === '/retry' && retries++ === 0) { res.writeHead(429, { 'Retry-After': '0' }); res.end(); return; }
    active++; maxActive = Math.max(active, maxActive);
    setTimeout(() => { active--; document(res, '<title>T</title><a href="/one">1</a><a href="/two">2</a><a href="/three">3</a>'); }, 600);
  });
  try {
    const n = new SafeHttp(config(s.origin, '--timeout', '100'), new AbortController().signal);
    await assert.rejects(n.get(s.origin + '/slow'), /TIMEOUT/);
    for (const path of ['/huge', '/zip']) await assert.rejects(n.get(s.origin + path), /BODY_TOO_LARGE/);
    assert.equal((await new SafeHttp(config(s.origin), new AbortController().signal).get(s.origin + '/retry')).status, 200);
    assert.equal(retries, 2);
    const r = await scan(config(s.origin, '--max-pages', '2'));
    assert.equal(r.pages.length, 2); assert.equal(r.status, 'truncated');
    const depth = await scan(config(s.origin, '--max-depth', '0'));
    assert.equal(depth.pages.length, 1); assert.ok(depth.skippedChecks.some(s => s.reason === 'DEPTH_LIMIT'));
    const concurrent = await scan(config(s.origin, '--max-pages', '4'));
    assert.equal(concurrent.pages.length, 4);
    assert.equal(maxActive, 2);
  } finally { await s.close(); }
});
test('DNS pinning uses injected resolution once and mixed DNS answers are denied', async () => {
  const s = await site((_req, res) => document(res));
  try {
    const port = new URL(s.origin).port;
    let calls = 0;
    const n = new SafeHttp(config(`http://virtual.test:${port}`), new AbortController().signal, async () => { calls++; return [{ address: '127.0.0.1', family: 4 }]; });
    assert.equal((await n.get(`http://virtual.test:${port}`)).status, 200); assert.equal(calls, 1);
    const denied = new SafeHttp(parseConfig(['http://virtual.test']), new AbortController().signal, async () => [{ address: '8.8.8.8', family: 4 }, { address: '127.0.0.1', family: 4 }]);
    await assert.rejects(denied.get('http://virtual.test'), /NETWORK_PRIVATE/);
  } finally { await s.close(); }
});
test('abort produces a partial report', async () => {
  const s = await site((req, res) => { if (!defaults(req, res)) setTimeout(() => document(res), 1000); });
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 1100);
    const r = await scan(config(s.origin), controller.signal);
    assert.equal(r.status, 'aborted');
  } finally { await s.close(); }
});
test('request rate remains bounded when DNS answers arrive out of order', async () => {
  const s = await site((_req, res) => document(res));
  try {
    const origin = `http://virtual.test:${new URL(s.origin).port}`;
    let calls = 0;
    const n = new SafeHttp(config(origin), new AbortController().signal, async () => {
      if (calls++ === 0) await new Promise(resolve => setTimeout(resolve, 300));
      return [{ address: '127.0.0.1', family: 4 }];
    });
    await Promise.all([n.get(origin + '/a'), n.get(origin + '/b')]);
    assert.equal(s.hits.length, 2);
    assert.ok(s.hits[1]!.time - s.hits[0]!.time >= 450);
  } finally { await s.close(); }
});
async function cli(args: string[]) {
  const child = spawn(process.execPath, [resolve('dist/src/cli/index.js'), ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '', stderr = '';
  child.stdout.on('data', chunk => { stdout += chunk; }); child.stderr.on('data', chunk => { stderr += chunk; });
  const [code] = await once(child, 'close'); return { code, stdout, stderr };
}

test('optional assets share cache, robots and separate budgets; report headers and secrets are filtered', async () => {
  const s = await site((req, res) => {
    if (req.url === '/robots.txt') { res.end('User-agent: WebsiteSEOAuditor\nDisallow: /blocked.png'); return; }
    if (req.url === '/sitemap.xml') { res.writeHead(404); res.end(); return; }
    if (req.url === '/') {
      res.setHeader('Set-Cookie', 'secret-cookie'); res.setHeader('Authorization', 'Bearer header-secret'); res.setHeader('X-Trace-Secret', 'header-secret');
      document(res, '<title>Bearer title-secret</title><h1>Test</h1><a href="/shared.css">shared</a><img src="/missing.png?token=query-secret"><img src="/missing.png?token=query-secret"><script src="/shared.css"></script><link rel="stylesheet" href="/shared.css"><img src="/blocked.png"><img src="https://external.invalid/a.png">'); return;
    }
    if (req.url === '/shared.css') { res.setHeader('Content-Type', 'text/css'); res.end('body{}'); return; }
    res.writeHead(404); res.end();
  });
  try {
    const disabled = await scan(config(s.origin));
    assert.deepEqual(disabled.resources, []);
    assert.ok(!s.hits.some(h => h.path.includes('missing.png')));
    s.hits.length = 0;
    const report = await scan(config(s.origin, '--check-resources'));
    assert.equal(report.pages.length, 2); assert.equal(report.resources!.length, 2);
    assert.equal(s.hits.filter(h => h.path === '/shared.css').length, 1);
    assert.equal(s.hits.filter(h => h.path.includes('/missing.png')).length, 1);
    assert.ok(!s.hits.some(h => h.path === '/blocked.png'));
    assert.ok(report.findings.some(f => f.ruleId === 'RESOURCE_001' && f.targetUrl?.includes('[REDACTED]')));
    const serialized = JSON.stringify(report);
    for (const secret of ['secret-cookie', 'header-secret', 'query-secret', 'title-secret']) assert.ok(!serialized.includes(secret));
    assert.equal(report.status, 'truncated');
    const limited = await scan(config(s.origin, '--check-resources', '--max-resources', '1'));
    assert.equal(limited.pages.length, 2); assert.equal(limited.resources!.length, 1);
    assert.ok(limited.skippedChecks.some(s => s.reason === 'RESOURCE_LIMIT'));
  } finally { await s.close(); }
});

test('CLI diff JSON is clean, thresholds work, and removed web command exits without a listener', async () => {
  const args = ['diff', 'tests/fixtures/diff/after.json', 'tests/fixtures/diff/before.json'];
  const json = await cli([...args, '--format', 'json', '--fail-on-new', 'warning']);
  assert.equal(json.code, 2, json.stderr); assert.equal(json.stderr, '');
  assert.equal(JSON.parse(json.stdout).NEW[0].ruleId, 'SEO_001');
  assert.equal((await cli(['web'])).code, 1);
  assert.equal((await cli(['diff', 'missing', 'missing'])).code, 1);
  assert.equal((await cli([...args, '--format', 'html'])).code, 1);
  const reportSource = await readFile('src/reports/html.ts', 'utf8');
  const script = await readFile('assets/report.js', 'utf8');
  assert.ok(!/<form\b|scan-form|api\/audit/.test(reportSource));
  assert.ok(!/fetch\(|XMLHttpRequest|api\/audit|bootstrap\.token/.test(script));
});
test('built CLI help/version/about, local JSON/HTML output and exit codes 0/1/2', async () => {
  const s = await site((req, res) => { if (!defaults(req, res)) document(res, '<title> </title><h1>Türkçe içerik</h1>'); });
  const directory = await mkdtemp(join(resolve('tests'), '.tmp-'));
  try {
    assert.ok((await cli(['--help', '--lang', 'tr'])).stdout.includes('Kullanım'));
    assert.ok((await cli(['--version'])).stdout.includes('0.4.0-beta.1'));
    assert.ok((await cli(['--about'])).stdout.includes('Crelyn Studio'));
    assert.equal((await cli(['file:///bad'])).code, 1);
    assert.equal((await cli([s.origin])).code, 1);
    const result = await cli(['audit', s.origin, '--allow-private-network', '--format', 'html,json', '--output', directory, '--lang', 'tr', '--fail-on', 'warning']);
    assert.equal(result.code, 2, result.stderr);
    const files = await readdir(directory); assert.equal(files.length, 2);
    const report = JSON.parse(await readFile(join(directory, files.find(f => f.endsWith('.json'))!), 'utf8'));
    assert.equal(report.schemaVersion, '2'); assert.equal(report.status, 'complete'); assert.equal(report.config.lang, 'tr');
    const validate = new Ajv().compile(JSON.parse(await readFile('docs/report.schema.json', 'utf8')));
    assert.equal(validate(report), true, JSON.stringify(validate.errors));
    assert.equal(validate({ ...report, schemaVersion: 'invalid' }), false);
    const jsonOnly = await cli([s.origin, '--allow-private-network', '--format', 'json']);
    assert.equal(jsonOnly.code, 0); assert.equal(JSON.parse(jsonOnly.stdout).schemaVersion, '2');
    assert.ok(!jsonOnly.stdout.includes('Scanning:'));
  } finally {
    await s.close();
    await rm(directory, { recursive: true, force: true });
  }
});
