import { XMLParser, XMLValidator } from 'fast-xml-parser';
export function parseSitemap(xml: string): { index: boolean; urls: string[] } {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml) || Buffer.byteLength(xml) > 2 * 1024 * 1024) throw new Error('SITEMAP_UNSAFE');
  let depth = 0;
  for (const match of xml.matchAll(/<\/?([a-z_][\w:.-]*)\b[^>]*>/gi)) {
    if (match[0].startsWith('</')) depth--;
    else if (!match[0].endsWith('/>')) depth++;
    if (depth > 32) throw new Error('SITEMAP_DEPTH');
  }
  if (XMLValidator.validate(xml) !== true) throw new Error('SITEMAP_INVALID');
  const parsed = new XMLParser({ ignoreAttributes: true, processEntities: true, parseTagValue: false, removeNSPrefix: true }).parse(xml) as Record<string, Record<string, unknown>>;
  const index = Boolean(parsed.sitemapindex);
  const entries = index ? parsed.sitemapindex?.sitemap : parsed.urlset?.url;
  if (!parsed.sitemapindex && !parsed.urlset) throw new Error('SITEMAP_INVALID');
  const list: unknown[] = entries ? Array.isArray(entries) ? entries : [entries] : [];
  if (list.length > 10000) throw new Error('SITEMAP_LIMIT');
  const urls = list.map(entry => typeof entry === 'object' && entry !== null && 'loc' in entry ? entry.loc : undefined).filter((loc): loc is string => typeof loc === 'string');
  return { index, urls };
}
