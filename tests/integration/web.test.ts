import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { createWebServer } from '../../src/web/server.js';
import { parseConfig } from '../../src/config/index.js';

test('local web app validates host, origin, token and inputs; audits only with explicit network permission', async () => {
  const web = createWebServer();
  const target = http.createServer((req, res) => {
    if (req.url === '/robots.txt') res.end('User-agent: *\nAllow: /');
    else if (req.url === '/sitemap.xml') { res.writeHead(404); res.end(); }
    else { res.setHeader('Content-Type', 'text/html'); res.end('<title>Fixture</title><h1>Fixture</h1>'); }
  });
  web.listen(0, '127.0.0.1'); target.listen(0, '127.0.0.1');
  await Promise.all([once(web, 'listening'), once(target, 'listening')]);
  const origin = `http://127.0.0.1:${(web.address() as import('node:net').AddressInfo).port}`;
  const url = `http://127.0.0.1:${(target.address() as import('node:net').AddressInfo).port}`;
  try {
    const page = await (await fetch(origin)).text();
    const token = /"token":"([a-f0-9]{64})"/.exec(page)![1]!;
    const script = /<script>([\s\S]*)<\/script>/.exec(page)![1]!;
    assert.ok(page.includes(`sha256-${createHash('sha256').update(script).digest('base64')}`));
    assert.ok(!script.includes('\r'));
    const headers = { 'Content-Type': 'application/json', Origin: origin, 'X-Audit-Token': token };
    const input = { url, maxPages: 5, lang: 'en_US', allowPrivateNetwork: true };
    const post = (body: unknown, extra = {}) => fetch(origin + '/api/audit', { method: 'POST', headers: { ...headers, ...extra }, body: JSON.stringify(body) });
    const deniedHost = await new Promise<number | undefined>((resolve, reject) => {
      http.get(origin, { headers: { Host: 'attacker.test' } }, response => { response.resume(); resolve(response.statusCode); }).on('error', reject);
    });
    assert.equal(deniedHost, 403);
    assert.equal((await post(input, { Origin: 'https://attacker.test' })).status, 403);
    assert.equal((await post(input, { 'X-Audit-Token': 'bad' })).status, 403);
    assert.equal((await post({ ...input, url: 'file:///private' })).status, 400);
    assert.equal((await post({ ...input, maxPages: 101 })).status, 400);
    assert.equal((await post({ ...input, lang: 'unknown' })).status, 400);
    assert.equal((await post(input, { 'Content-Type': 'text/plain' })).status, 400);
    assert.equal((await post({ ...input, extra: 'x'.repeat(17000) })).status, 413);
    const blocked = await (await post({ ...input, allowPrivateNetwork: false })).json() as { status: string; pages: unknown[] };
    assert.equal(blocked.status, 'truncated'); assert.equal(blocked.pages.length, 0);
    const active = post(input);
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal((await post(input)).status, 409);
    const response = await active;
    assert.equal(response.status, 200);
    const report = await response.json() as { status: string; pages: unknown[]; config: { lang: string } };
    assert.equal(report.status, 'complete'); assert.equal(report.pages.length, 1); assert.equal(report.config.lang, 'en');
    assert.equal(parseConfig([url, '--lang', 'en_US']).lang, 'en');
  } finally {
    for (const server of [web, target]) { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
  }
});
