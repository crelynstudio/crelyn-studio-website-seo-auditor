import type { CrawlPage, ScanConfig, ScanReport, SkippedCheck } from '../core/types.js';
import { VERSION } from '../core/types.js';
import { SafeHttp, NetworkError } from '../network/http.js';
import { normalizeUrl, type Resolver } from '../network/url.js';
import { parseRobots } from '../parsers/robots.js';
import { parseSitemap } from '../parsers/sitemap.js';
import { parseHtml } from '../parsers/html.js';
import { analyze, finding } from '../analyzers/index.js';
import { limitations } from '../i18n/index.js';

export async function scan(config: ScanConfig, signal = new AbortController().signal,
  progress?: (discovered: number, crawled: number, skipped: number) => void, resolver?: Resolver): Promise<ScanReport> {
  const startedAt = new Date().toISOString();
  const http = new SafeHttp(config, signal, resolver);
  const origin = new URL(config.url).origin;
  const pages: CrawlPage[] = [], skippedChecks: SkippedCheck[] = [];
  const extra = [] as ScanReport['findings'];
  let partial = false;
  const queue: { url: string; depth: number }[] = [];
  const seen = new Set<string>();
  const skip = (url: string, reason: string, checks = ['fetch', 'seo', 'links', 'health']) => {
    if (skippedChecks.length < 10000) skippedChecks.push({ url, reason, checks });
  };
  const enqueue = (raw: string, depth: number) => {
    let url: string;
    try { url = normalizeUrl(raw, origin); } catch { return; }
    if (new URL(url).origin !== origin || seen.has(url)) return;
    if (seen.size >= 10000) { partial = true; return; }
    seen.add(url);
    if (depth > config.maxDepth) { partial = true; skip(url, 'DEPTH_LIMIT'); return; }
    if (!http.allowed(url)) { partial = true; skip(url, 'ROBOTS_DENIED'); return; }
    queue.push({ url, depth });
  };
  try {
    const robots = await http.get(origin + '/robots.txt', true);
    if (robots.status >= 500 || robots.status === 429 || robots.status < 200 || (robots.status >= 300 && robots.status < 400)) throw new NetworkError('ROBOTS_UNREACHABLE');
    const policy = parseRobots(robots.status < 300 ? robots.body : '');
    if (policy.sitemapLimited) { partial = true; skip(origin + '/robots.txt', 'SITEMAP_LIMIT', ['sitemap']); }
    http.allowed = url => new URL(url).pathname === '/robots.txt' || policy.allowed(url);
    enqueue(config.url, 0);
    const sitemapQueue = [origin + '/sitemap.xml', ...policy.sitemaps];
    const sitemapSeen = new Set<string>();
    for (let i = 0; i < sitemapQueue.length && i < 16; i++) {
      let url: string;
      try { url = normalizeUrl(sitemapQueue[i]!, origin); } catch { continue; }
      if (new URL(url).origin !== origin || sitemapSeen.has(url)) continue;
      sitemapSeen.add(url);
      if (!http.allowed(url)) { skip(url, 'ROBOTS_DENIED', ['sitemap']); partial = true; continue; }
      try {
        const response = await http.get(url);
        if (response.status >= 400) {
          extra.push(finding('IDX_002', response.status === 404 ? 'info' : 'warning', url, response.status, config.lang));
          if (response.status !== 404) partial = true;
          continue;
        }
        const sitemap = parseSitemap(response.body);
        if (sitemap.index) sitemapQueue.push(...sitemap.urls.slice(0, 16));
        else for (const loc of sitemap.urls) enqueue(loc, 0);
      } catch (error) {
        extra.push(finding('IDX_002', 'warning', url, error instanceof NetworkError ? error.code : 'SITEMAP_INVALID', config.lang));
        partial = true;
      }
    }
    if (sitemapQueue.length > 16) { partial = true; skip(origin + '/sitemap.xml', 'SITEMAP_LIMIT', ['sitemap']); }
    let cursor = 0;
    const finalSeen = new Map<string, CrawlPage>();
    while (cursor < queue.length && pages.length < config.maxPages && !signal.aborted) {
      const batch = queue.slice(cursor, cursor + Math.min(config.concurrency, config.maxPages - pages.length));
      cursor += batch.length;
      const collected = await Promise.all(batch.map(async ({ url, depth }) => {
        const page: CrawlPage = { url, finalUrl: url, depth, redirects: [], headers: {}, html: false, links: [] };
        try {
          const response = await http.get(url);
          page.finalUrl = response.url; page.status = response.status;
          page.headers = response.headers; page.redirects = response.redirects;
          page.html = /^(text\/html|application\/xhtml\+xml)(;|$)/i.test(response.headers['content-type'] ?? '');
          if (page.html && response.status < 400 && !finalSeen.has(page.finalUrl)) {
            parseHtml(response.body, page); finalSeen.set(page.finalUrl, page);
          } else if (page.html && response.status < 400) {
            const prior = finalSeen.get(page.finalUrl)!;
            page.title = prior.title; page.description = prior.description; page.h1 = prior.h1;
            page.canonicals = prior.canonicals; page.noindex = prior.noindex;
            page.baseUrl = prior.baseUrl;
            skip(url, 'DUPLICATE_FINAL', ['link-discovery']);
          } else skip(url, page.html ? 'HTTP_ERROR' : 'NON_HTML', ['seo']);
        } catch (error) {
          page.error = error instanceof NetworkError ? error.code : 'PARSE_FAILED';
          page.redirects = error instanceof NetworkError ? error.redirects : [];
          skip(url, page.error); partial = true;
        }
        return page;
      }));
      pages.push(...collected);
      for (const page of collected) {
        if (page.discoveryLimited) { partial = true; skip(page.url, 'LINK_LIMIT', ['link-discovery']); }
        for (const link of page.links) if (link.kind === 'internal') enqueue(link.targetUrl!, page.depth + 1);
      }
      progress?.(seen.size, pages.length, skippedChecks.length);
    }
    if (cursor < queue.length) {
      partial = true;
      for (const pending of queue.slice(cursor)) skip(pending.url, signal.aborted ? 'ABORTED' : 'PAGE_LIMIT');
    }
  } catch (error) {
    partial = true;
    const code = error instanceof NetworkError ? error.code : error instanceof Error && error.message === 'ROBOTS_LIMIT' ? 'ROBOTS_LIMIT' : 'NETWORK_FAILED';
    extra.push(finding('NETWORK_001', 'error', origin + '/robots.txt', code, config.lang));
    skip(config.url, code);
  }
  if (!pages.length) partial = true;
  const findings = [...extra, ...analyze(pages, config.lang)].sort((a, b) => a.ruleId.localeCompare(b.ruleId, 'en') || a.url.localeCompare(b.url, 'en') || (a.targetUrl ?? '').localeCompare(b.targetUrl ?? '', 'en'));
  pages.sort((a, b) => a.url.localeCompare(b.url, 'en'));
  skippedChecks.sort((a, b) => a.url.localeCompare(b.url, 'en') || a.reason.localeCompare(b.reason, 'en'));
  return { schemaVersion: '1', version: VERSION, target: config.url, startedAt, finishedAt: new Date().toISOString(),
    status: signal.aborted ? 'aborted' : partial ? 'truncated' : 'complete', config,
    summary: { discovered: seen.size, crawled: pages.length, skipped: skippedChecks.length,
      errors: findings.filter(f => f.severity === 'error').length, warnings: findings.filter(f => f.severity === 'warning').length, info: findings.filter(f => f.severity === 'info').length },
    pages, findings, skippedChecks, limitations: limitations(config.lang) };
}
