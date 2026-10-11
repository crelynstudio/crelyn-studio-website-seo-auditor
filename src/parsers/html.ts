import { load } from 'cheerio';
import type { CrawlPage, DiscoveredLink } from '../core/types.js';
import { normalizeUrl } from '../network/url.js';

export function parseHtml(body: string, page: CrawlPage): void {
  const $ = load(body);
  page.title = $('title').first().text().trim();
  page.description = $('meta').filter((_, e) => ($(e).attr('name') ?? '').toLowerCase() === 'description').first().attr('content')?.trim() ?? '';
  page.h1 = $('h1').length;
  page.canonicals = $('link').filter((_, e) => ($(e).attr('rel') ?? '').toLowerCase().split(/\s+/).includes('canonical')).map((_, e) => $(e).attr('href') ?? '').get();
  const robots = $('meta').filter((_, e) => ['robots', 'sitemercek'].includes(($(e).attr('name') ?? '').toLowerCase())).map((_, e) => $(e).attr('content') ?? '').get().join(',') + ',' + (page.headers['x-robots-tag'] ?? '');
  page.noindex = /\b(noindex|none)\b/i.test(robots);
  let base = page.finalUrl;
  try { base = normalizeUrl($('base[href]').first().attr('href') ?? '', base); } catch { /* Invalid base falls back to document URL. */ }
  page.baseUrl = base;
  page.discoveryLimited = $('a[href]').length > 10000;
  $('a[href]').slice(0, 10000).each((_, e) => {
    const raw = ($(e).attr('href') ?? '').trim();
    const link: DiscoveredLink = { sourceUrl: page.finalUrl, raw, kind: 'invalid' };
    if (raw.startsWith('#')) link.kind = 'fragment';
    else if (/^mailto:/i.test(raw)) link.kind = 'mailto';
    else if (/^tel:/i.test(raw)) link.kind = 'tel';
    else {
      try {
        link.targetUrl = normalizeUrl(raw, base);
        link.kind = new URL(link.targetUrl).origin === new URL(page.url).origin ? 'internal' : 'external';
      } catch { link.kind = /^[a-z][a-z\d+.-]*:/i.test(raw) ? 'unsupported' : 'invalid'; }
    }
    page.links.push(link);
  });
}
