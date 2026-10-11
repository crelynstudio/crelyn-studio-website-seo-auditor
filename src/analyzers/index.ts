import type { CrawlPage, Finding, Lang, Severity } from '../core/types.js';
import { catalog } from '../i18n/index.js';
import { normalizeUrl } from '../network/url.js';
export type RuleId = 'HTTP_001' | 'HTTP_002' | 'LINK_001' | 'SEO_001' | 'SEO_002' | 'SEO_003' | 'SEO_004' | 'SEO_005' | 'SEO_006' | 'IDX_001' | 'IDX_002' | 'HEALTH_001' | 'NETWORK_001' | 'ANALYZER_001';
const expectations: Record<Lang, Record<RuleId, string>> = {
  en: {
    HTTP_001: 'HTTP status below 400', HTTP_002: 'At most one safe redirect', LINK_001: 'Reachable successful target',
    SEO_001: 'Nonempty title', SEO_002: 'Page-specific titles', SEO_003: 'Useful meta description where appropriate',
    SEO_004: 'Descriptive main heading where appropriate', SEO_005: 'Resolvable HTTP(S) canonical URL', SEO_006: 'One consistent canonical target',
    IDX_001: 'Indexing directives match site intent', IDX_002: 'Optional readable sitemap', HEALTH_001: 'Context-appropriate HTTPS headers',
    NETWORK_001: 'Safe reachable resource', ANALYZER_001: 'Analyzer completes normally'
  },
  tr: {
    HTTP_001: '400 altı HTTP durum kodu', HTTP_002: 'En fazla bir güvenli yönlendirme', LINK_001: 'Erişilebilir başarılı hedef',
    SEO_001: 'Boş olmayan başlık', SEO_002: 'Sayfaya özgü başlıklar', SEO_003: 'Uygun olduğunda yararlı meta açıklaması',
    SEO_004: 'Uygun olduğunda açıklayıcı ana başlık', SEO_005: 'Çözülebilir HTTP(S) canonical adresi', SEO_006: 'Tek tutarlı canonical hedefi',
    IDX_001: 'İndeksleme bildirimi site amacına uygun', IDX_002: 'İsteğe bağlı okunabilir site haritası', HEALTH_001: 'Bağlama uygun HTTPS başlıkları',
    NETWORK_001: 'Güvenli erişilebilir kaynak', ANALYZER_001: 'Analiz normal tamamlanır'
  }
};
export function finding(id: RuleId, severity: Severity, url: string, observed: unknown, lang: Lang): Finding {
  const [message, recommendation] = catalog[lang][id];
  return { ruleId: id, severity, result: 'failed', confidence: ['SEO_002', 'SEO_003', 'SEO_004', 'HEALTH_001'].includes(id) ? 'heuristic' : 'certain', url,
    observed, expected: expectations[lang][id], messageKey: id, params: {}, message, recommendation, docsUrl: `docs/rules.md#${id.toLowerCase()}` };
}
export function analyze(pages: CrawlPage[], lang: Lang): Finding[] {
  const output: Finding[] = [];
  const add = (id: RuleId, level: Severity, page: CrawlPage, evidence: unknown) => output.push(finding(id, level, page.url, evidence, lang));
  for (const page of pages) {
    try {
      if (page.error) add('NETWORK_001', 'error', page, page.error);
      if (page.status && page.status >= 400) add('HTTP_001', 'error', page, page.status);
      if (page.redirects.length > 1 || page.error?.startsWith('REDIRECT_')) add('HTTP_002', page.error ? 'error' : 'warning', page, { chain: [...page.redirects, page.finalUrl], error: page.error });
      if (!page.html || page.error || (page.status ?? 0) >= 400) continue;
      if (!page.title) add('SEO_001', 'warning', page, page.title ?? '');
      if (!page.description) add('SEO_003', 'info', page, page.description ?? '');
      if (!page.h1) add('SEO_004', 'info', page, page.h1 ?? 0);
      const canonical = new Set<string>();
      for (const raw of page.canonicals ?? []) {
        try {
          if (!raw.trim()) throw new Error('empty');
          canonical.add(normalizeUrl(raw, page.baseUrl ?? page.finalUrl));
        } catch { add('SEO_005', 'warning', page, raw); }
      }
      if (canonical.size > 1) add('SEO_006', 'warning', page, [...canonical]);
      if (page.noindex) add('IDX_001', 'info', page, { noindex: true });
      if (page.finalUrl.startsWith('https:')) {
        const missing = ['content-security-policy', 'strict-transport-security', 'x-content-type-options'].filter(header => !page.headers[header]);
        if (missing.length) add('HEALTH_001', 'info', page, missing);
      }
    } catch { add('ANALYZER_001', 'error', page, 'ANALYZER_FAILED'); }
  }
  const titles = new Map<string, CrawlPage[]>();
  for (const page of pages.filter(p => p.html && !p.error && (p.status ?? 500) < 400 && p.title)) {
    const group = titles.get(page.title!) ?? [];
    if (!group.some(p => p.finalUrl === page.finalUrl)) group.push(page);
    titles.set(page.title!, group);
  }
  for (const group of titles.values()) if (group.length > 1) for (const page of group) add('SEO_002', 'warning', page, { title: page.title, urls: group.map(p => p.finalUrl) });
  const targets = new Map(pages.map(p => [p.url, p]));
  for (const page of pages) for (const link of page.links.filter(l => l.kind === 'internal' && l.targetUrl)) {
    const target = targets.get(link.targetUrl!);
    if (target && ((target.status ?? 0) >= 400 || (target.error && target.error !== 'ROBOTS_DENIED'))) {
      const item = finding('LINK_001', 'error', page.url, { status: target.status, error: target.error }, lang);
      item.sourceUrl = page.finalUrl; item.targetUrl = link.targetUrl;
      output.push(item);
    }
  }
  return output;
}
