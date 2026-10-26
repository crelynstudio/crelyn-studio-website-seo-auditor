import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import { once } from 'node:events';
import { pathToFileURL } from 'node:url';

const npm = process.env.npm_execpath;
assert.ok(npm, 'Run through npm run test:package');
const version = JSON.parse(await readFile('package.json', 'utf8')).version;
const directory = await mkdtemp(resolve('tests/.tmp-pack-'));
function run(args, options = {}) {
  const result = spawnSync(process.execPath, args, { encoding: 'utf8', ...options });
  assert.equal(result.status, 0, result.stderr || result.stdout || String(result.error));
  return result.stdout;
}
try {
  const [packed] = JSON.parse(run([npm, 'pack', '--ignore-scripts', '--json', '--pack-destination', directory]));
  assert.ok(packed.files.some(f => f.path === 'dist/src/cli/index.js'));
  assert.ok(packed.files.some(f => f.path === 'dist/src/web/server.js'));
  assert.ok(packed.files.some(f => f.path === 'web/index.html'));
  assert.ok(packed.files.every(f => !/^(?:desktop\/|src\/|tests\/|\.verification\/)/.test(f.path)));
  const install = join(directory, 'installed');
  run([npm, 'install', '--prefix', install, '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', join(directory, packed.filename)]);
  const root = join(install, 'node_modules/@crelynstudio/website-seo-auditor');
  const entry = join(root, 'dist/src/cli/index.js');
  assert.ok((await readFile(entry, 'utf8')).startsWith('#!/usr/bin/env node'));
  assert.equal(run([entry, '--version']).trim(), version);
  const { startWebServer } = await import(pathToFileURL(join(root, 'dist/src/web/server.js')).href);
  const web = await startWebServer();
  try {
    const page = await fetch(web.url);
    assert.equal(page.status, 200);
    assert.ok((await page.text()).includes('Website SEO Auditor'));
    assert.equal((await fetch(`${web.url}/app.js`)).status, 200);
  } finally { web.server.closeAllConnections(); await new Promise(resolve => web.server.close(resolve)); }
  assert.ok(run([entry, '--help']).includes('site-audit'));
  assert.equal(run([npm, 'exec', '--prefix', install, '--offline', '--', 'site-audit', '--version']).trim(), version);
  const result = JSON.parse(run([entry, 'diff', 'tests/fixtures/diff/before.json', 'tests/fixtures/diff/after.json', '--format', 'json']));
  assert.equal(result.NEW.length, 1); assert.equal(result.RESOLVED.length, 1); assert.equal(result.UNCHANGED.length, 1);
  const server = http.createServer((req, res) => {
    if (req.url !== '/') { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', 'text/html');
    res.end('<title>Package fixture</title><meta name="description" content="Local fixture"><h1>Fixture</h1><img src="/missing.png">');
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  try {
    const output = join(directory, 'reports');
    const child = spawn(process.execPath, [entry, 'audit', `http://127.0.0.1:${server.address().port}`, '--allow-private-network', '--check-resources', '--lang', 'tr', '--format', 'html,json', '--output', output], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = ''; child.stderr.on('data', data => { stderr += data; }); child.stdout.resume();
    const [code] = await once(child, 'close'); assert.equal(code, 0, stderr);
    const files = await readdir(output); assert.equal(files.length, 2);
    const report = JSON.parse(await readFile(join(output, files.find(f => f.endsWith('.json'))), 'utf8'));
    assert.equal(report.schemaVersion, '2'); assert.equal(report.status, 'complete');
    assert.ok(report.findings.some(f => f.ruleId === 'RESOURCE_001'));
    const html = await readFile(join(output, files.find(f => f.endsWith('.html'))), 'utf8');
    assert.ok(html.includes("connect-src 'none'")); assert.ok(html.includes('Website SEO Auditor'));
    assert.ok(!/<form\b|fetch\(/.test(html));
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  console.log(`Package verified: ${packed.filename}; ${packed.files.length} files; clean production install, CLI, diff and local audit HTML/JSON passed.`);
} finally {
  assert.ok(directory.startsWith(resolve('tests') + sep + '.tmp-pack-'));
  await rm(directory, { recursive: true, force: true });
}
