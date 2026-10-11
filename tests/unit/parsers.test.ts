import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRobots } from '../../src/parsers/robots.js';
import { parseSitemap } from '../../src/parsers/sitemap.js';
import { parseHtml } from '../../src/parsers/html.js';
import { analyze, finding } from '../../src/analyzers/index.js';
import { catalog } from '../../src/i18n/index.js';
import { escapeHtml, html, exitCode } from '../../src/reports/index.js';
import type { CrawlPage, ScanReport } from '../../src/core/types.js';
import { parseConfig } from '../../src/config/index.js';

test('robots specific groups merge, allow wins tie, longest path and wildcards', () => {
  const r = parseRobots('User-agent: *\nDisallow: /\nUser-agent: SiteMercek\nDisallow: /secret\nAllow: /secret/open\nDisallow: /*.pdf$\nUser-agent: sitemercek\nAllow: /tie\nDisallow: /tie');
  for (const path of ['/secret', '/secret/deep', '/a.pdf']) assert.equal(r.allowed('https://x.test' + path), false);
  for (const path of ['/', '/secret/open', '/tie', '/a.pdf?q=1']) assert.equal(r.allowed('https://x.test' + path), true);
  assert.equal(parseRobots('User-agent: *\nDisallow: /').allowed('https://x.test/'), false);
});
test('robots UTF-8 and percent encoding, case sensitive paths, empty directives', () => {
  const r = parseRobots('User-agent: SiteMercek\nDisallow: /café\nDisallow: /%62\nDisallow: /a%2fb\nDisallow: /Case\nDisallow:\nAllow:');
  for (const path of ['/caf%C3%A9', '/b', '/a%2Fb', '/Case']) assert.equal(r.allowed('https://x.test' + path), false, path);
  for (const path of ['/a/b', '/case', '/']) assert.equal(r.allowed('https://x.test' + path), true, path);
});
test('robots excessive rules fail closed instead of silently dropping restrictions', () => {
  assert.throws(() => parseRobots('User-agent: *\nDisallow: /' + 'a'.repeat(4096)), /ROBOTS_LIMIT/);
  assert.throws(() => parseRobots('User-agent: *\n' + 'Disallow: /x\n'.repeat(10001)), /ROBOTS_LIMIT/);
});
test('sitemap accepts indexes/entities and rejects DTD, malformed and deep XML', () => {
  assert.deepEqual(parseSitemap('<urlset><url><loc>https://x.test/?a=1&amp;b=2</loc></url></urlset>').urls, ['https://x.test/?a=1&b=2']);
  assert.equal(parseSitemap('<sitemapindex><sitemap><loc>https://x.test/map.xml</loc></sitemap></sitemapindex>').index, true);
  for (const xml of ['<!DOCTYPE a [<!ENTITY x SYSTEM "file:///etc/passwd">]><urlset/>', '<urlset><url>', '<html/>', '<a>'.repeat(40) + '</a>'.repeat(40)]) assert.throws(() => parseSitemap(xml));
});
const page = (url = 'https://x.test/'): CrawlPage => ({ url, finalUrl: url, depth: 0, status: 200, redirects: [], headers: {}, html: true, links: [] });
test('HTML base, Turkish text, noindex, canonical and link classification', () => {
  const p = page();
  parseHtml('<base href="/dir/"><title>Türkçe &amp; İçecek</title><meta name="ROBOTS" content="noindex"><link rel="canonical" href="javascript:x"><link rel="canonical" href="/a"><link rel="canonical" href="/b"><a href="next#hash">next</a><a href="#x">x</a><a href="mailto:a@b.test">mail</a><a href="tel:123">tel</a><a href="https://other.test">external</a>', p);
  assert.equal(p.title, 'Türkçe & İçecek'); assert.equal(p.noindex, true);
  assert.equal(p.links[0]!.targetUrl, 'https://x.test/dir/next');
  assert.equal(p.baseUrl, 'https://x.test/dir/');
  assert.deepEqual(p.links.map(l => l.kind), ['internal', 'fragment', 'mailto', 'tel', 'external']);
  const ids = analyze([p], 'tr').map(f => f.ruleId);
  for (const id of ['SEO_003', 'SEO_004', 'SEO_005', 'SEO_006', 'IDX_001', 'HEALTH_001']) assert.ok(ids.includes(id));
});
test('all rules, duplicate nonempty titles, status failures, source-target evidence', () => {
  const a = page(), b = page('https://x.test/b'), c = page('https://x.test/missing'), d = page('https://x.test/empty');
  parseHtml('<title>Same</title><a href="/missing">broken</a>', a); parseHtml('<title>Same</title>', b);
  c.status = 404; d.title = '';
  b.redirects = ['https://x.test/old', 'https://x.test/older'];
  const findings = analyze([a, b, c, d], 'en');
  assert.equal(findings.filter(f => f.ruleId === 'SEO_002').length, 2);
  assert.equal(findings.filter(f => f.ruleId === 'SEO_001').length, 1);
  assert.equal(findings.find(f => f.ruleId === 'LINK_001')!.targetUrl, c.url);
  assert.ok(findings.some(f => f.ruleId === 'HTTP_001')); assert.ok(findings.some(f => f.ruleId === 'HTTP_002'));
  assert.ok(!analyze([{ ...d, html: false }], 'en').some(f => f.ruleId.startsWith('SEO_')));
});
test('EN/TR catalogs have identical keys and translated rule messages', () => {
  assert.deepEqual(Object.keys(catalog.en), Object.keys(catalog.tr));
  for (const [key, value] of Object.entries(catalog.en)) {
    assert.ok(value.length); assert.ok(catalog.tr[key as keyof typeof catalog.tr].length);
  }
});
test('report escapes malicious site text, has no active scripts and correct exit semantics', async () => {
  const config = parseConfig(['https://x.test', '--lang', 'tr', '--fail-on', 'warning']);
  const report: ScanReport = { schemaVersion: '1', version: 'test', target: config.url, config, status: 'complete', startedAt: '2026-10-11T00:00:00.000Z', finishedAt: '2026-10-11T00:00:01.000Z', pages: [], findings: [finding('SEO_002', 'warning', config.url, '<script>alert(1)</script>', 'tr')], summary: { crawled: 1, discovered: 1, skipped: 0, errors: 0, warnings: 1, info: 0 }, skippedChecks: [], limitations: [] };
  const output = await html(report);
  assert.ok(output.includes('&lt;script&gt;alert(1)&lt;/script&gt;')); assert.ok(!output.includes('<script'));
  assert.ok(output.includes('script-src \'none\'')); assert.ok(output.includes('lang="tr"'));
  assert.equal(escapeHtml('"\'&<>'), '&quot;&#39;&amp;&lt;&gt;');
  assert.equal(exitCode(report), 2); report.config.failOn = 'none'; assert.equal(exitCode(report), 0);
  report.status = 'truncated'; assert.equal(exitCode(report), 1);
});
