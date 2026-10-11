import type { CrawlPage, Finding, ResourceResult, ScanConfig, SkippedCheck } from '../core/types.js';
import { finding } from '../analyzers/index.js';
import { SafeHttp, NetworkError } from '../network/http.js';

export async function checkResources(pages: CrawlPage[], config: ScanConfig, http: SafeHttp, signal: AbortSignal) {
  const results: ResourceResult[] = [], findings: Finding[] = [], skipped: SkippedCheck[] = [];
  let partial = false;
  const references = new Map<string, CrawlPage[]>();
  for (const page of pages) {
    if (page.resourceDiscoveryLimited) partial = true;
    for (const resource of page.resources ?? []) {
      if (new URL(resource.url).origin !== new URL(config.url).origin) continue;
      if (references.size >= 10000 && !references.has(resource.url)) { partial = true; continue; }
      const sources = references.get(resource.url) ?? [];
      if (!sources.includes(page)) sources.push(page);
      references.set(resource.url, sources);
    }
  }
  for (const [url, sources] of references) {
    if (signal.aborted || results.length >= config.maxResources || !http.allowed(url)) {
      partial = true;
      skipped.push({ url, reason: signal.aborted ? 'ABORTED' : !http.allowed(url) ? 'ROBOTS_DENIED' : 'RESOURCE_LIMIT', checks: ['resources'] });
      continue;
    }
    const result: ResourceResult = { url };
    try {
      const response = await http.get(url);
      result.status = response.status; result.finalUrl = response.url;
    } catch (error) {
      result.error = error instanceof NetworkError ? error.code : 'RESOURCE_FAILED'; partial = true;
    }
    results.push(result);
    if (result.error || (result.status ?? 0) >= 400) for (const page of sources) {
      const item = finding('RESOURCE_001', 'error', page.url, result, config.lang);
      item.sourceUrl = page.finalUrl; item.targetUrl = url; findings.push(item);
    }
  }
  return { results, findings, skipped, partial };
}
