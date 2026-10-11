import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, open, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { diff, diffExitCode, diffTerminal, readSnapshot, validateSnapshot } from '../../src/reports/diff.js';
import { redact, redactText } from '../../src/reports/privacy.js';
import { parseConfig } from '../../src/config/index.js';
import { parseHtml } from '../../src/parsers/html.js';
import { analyze } from '../../src/analyzers/index.js';
import type { ScanReport, CrawlPage } from '../../src/core/types.js';

async function fixtures(): Promise<[ScanReport, ScanReport]> {
  const before = JSON.parse(await readFile('tests/fixtures/diff/before.json', 'utf8')) as ScanReport;
  const after = JSON.parse(await readFile('tests/fixtures/diff/after.json', 'utf8')) as ScanReport;
  return [before, after];
}
test('diff fixtures: new, resolved, unchanged, deduplication and localized output', async () => {
  const [before, after] = await fixtures();
  after.findings.push(after.findings[0]!);
  const result = diff(before, after);
  assert.deepEqual(result.NEW.map(f => f.ruleId), ['SEO_004']);
  assert.deepEqual(result.RESOLVED.map(f => f.ruleId), ['SEO_001']);
  assert.deepEqual(result.UNCHANGED.map(f => f.ruleId), ['SEO_003']);
  assert.equal(diffExitCode(result, 'warning'), 0);
  result.NEW[0]!.severity = 'error'; assert.equal(diffExitCode(result, 'error'), 2);
  assert.equal(diffExitCode(result, 'none'), 0);
  assert.ok(diffTerminal(result, 'tr').includes('Çözülen'));
  assert.equal((await readSnapshot('tests/fixtures/diff/before.json')).schemaVersion, '2');
});
test('partial, abort and changed coverage never claim resolved or new', async () => {
  for (const mode of ['truncated', 'aborted', 'coverage'] as const) {
    const [before, after] = await fixtures();
    if (mode === 'coverage') after.pages[0]!.finalUrl += 'changed'; else after.status = mode;
    const result = diff(before, after);
    assert.equal(result.NEW.length, 0); assert.equal(result.RESOLVED.length, 0);
    assert.equal(result.UNVERIFIED.length, 2); assert.equal(diffExitCode(result, 'none'), 1);
  }
});
test('scope, rule versions, legacy, malformed and redacted snapshots fail explicitly', async () => {
  const [before, after] = await fixtures();
  after.scope!.maxPages = after.config.maxPages = 20;
  assert.throws(() => diff(before, after), /SCOPE_MISMATCH/);
  after.scope = before.scope; after.config = before.config; after.rulesVersion = 'next';
  assert.throws(() => diff(before, after), /SCOPE_MISMATCH/);
  assert.throws(() => validateSnapshot({ ...before, schemaVersion: '1' }), /INVALID_OR_LEGACY/);
  assert.throws(() => validateSnapshot({}), /INVALID_OR_LEGACY/);
  before.pages[0]!.url += '?token=[REDACTED]';
  assert.throws(() => validateSnapshot(before), /REDACTED_URL/);
});
test('unexecuted SEO checks cannot resolve after an HTTP failure', async () => {
  const [before, after] = await fixtures();
  after.findings = []; after.pages[0]!.status = 404;
  const result = diff(before, after);
  assert.equal(result.RESOLVED.length, 0); assert.equal(result.UNVERIFIED.length, 2);
});
test('duplicate metadata can resolve with unrelated non-HTML pages, but not unchecked related pages', async () => {
  const [before, after] = await fixtures();
  for (const report of [before, after]) report.pages.push({ ...report.pages[0]!, url: 'https://fixture.test/missing', finalUrl: 'https://fixture.test/missing', html: false, status: 404 });
  before.findings[0]!.ruleId = 'SEO_002'; before.findings[0]!.observed = { urls: [before.target] };
  assert.ok(diff(before, after).RESOLVED.some(f => f.ruleId === 'SEO_002'));
  after.pages[0]!.html = false;
  assert.equal(diff(before, after).RESOLVED.length, 0);
});
test('snapshot file reads enforce the byte limit', async () => {
  const directory = await mkdtemp(resolve('tests/.tmp-snapshot-'));
  try {
    const path = join(directory, 'oversized.json'); const file = await open(path, 'w');
    try { await file.truncate(20 * 1024 * 1024 + 1); } finally { await file.close(); }
    await assert.rejects(readSnapshot(path), /SNAPSHOT_TOO_LARGE/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
test('privacy masks encoded parameters, credentials, bearer and JWT values', () => {
  const data = { url: 'https://x.test/?%74oken=private&sessionId=session&view=public', authorization: 'private', cookie: 'private', title: 'Bearer abc.def.ghi', raw: 'https://user:password@x.test/', nested: ['password=private', 'eyJabc.def.ghi'] };
  const output = JSON.stringify(redact(data));
  for (const secret of ['private', 'session&', 'user:password', 'abc.def.ghi', 'eyJabc']) assert.ok(!output.includes(secret), secret);
  assert.ok(output.includes('view=public'));
  assert.equal(redactText('?api_key=secret'), '?api_key=[REDACTED]');
  assert.equal(redactText('?session_id=private#X-Amz-Credential=private'), '?session_id=[REDACTED]#X-Amz-Credential=[REDACTED]');
});
test('heading structure, duplicate descriptions and asset extraction respect base URLs', () => {
  const page: CrawlPage = { url: 'https://x.test/', finalUrl: 'https://x.test/', depth: 0, status: 200, headers: {}, redirects: [], html: true, links: [] };
  parseHtml('<base href="/assets/"><title>T</title><meta name="description" content="Same"><h1>A</h1><h3>B</h3><img src="a.png"><script src="b.js"></script><link rel="stylesheet" href="c.css">', page);
  const other = { ...page, url: 'https://x.test/other', finalUrl: 'https://x.test/other' };
  assert.equal(analyze([page, other], 'en').filter(f => f.ruleId === 'SEO_008').length, 2);
  assert.ok(analyze([page], 'en').some(f => f.ruleId === 'SEO_007'));
  assert.deepEqual(page.resources?.map(r => r.url), ['https://x.test/assets/a.png', 'https://x.test/assets/b.js', 'https://x.test/assets/c.css']);
  assert.equal(parseConfig(['https://x.test', '--check-resources', '--max-resources', '2']).maxResources, 2);
  assert.throws(() => parseConfig(['https://x.test', '--max-resources', '0']));
});
