import { open, readFile } from 'node:fs/promises';
import { Ajv } from 'ajv';
import type { Finding, Lang, ScanReport } from '../core/types.js';
import { normalizeUrl } from '../network/url.js';
import { redact } from './privacy.js';
import { messages } from '../i18n/index.js';

const schema = JSON.parse(await readFile(new URL('../../../docs/report.schema.json', import.meta.url), 'utf8'));
const validate = new Ajv({ strict: true }).compile(schema);
export interface AuditDiff {
  schemaVersion: '1'; status: 'complete' | 'incomplete'; target: string;
  NEW: Finding[]; RESOLVED: Finding[]; UNCHANGED: Finding[]; UNVERIFIED: Finding[];
}
export function validateSnapshot(value: unknown): asserts value is ScanReport {
  if (!validate(value)) throw new Error('SNAPSHOT_INVALID_OR_LEGACY');
  const r = value as ScanReport;
  if (r.scope!.startUrl !== r.target || r.config.url !== r.target || r.scope!.origin !== new URL(r.target).origin) throw new Error('SNAPSHOT_SCOPE_INVALID');
  for (const key of ['maxPages', 'maxDepth', 'checkResources', 'maxResources', 'allowPrivateNetwork'] as const) {
    if (r.scope![key] !== r.config[key]) throw new Error('SNAPSHOT_SCOPE_INVALID');
  }
  const urls = [r.target, ...r.pages.flatMap(p => [p.url, p.finalUrl]), ...r.resources!.flatMap(p => [p.url, p.finalUrl ?? p.url]), ...r.findings.flatMap(f => [f.url, f.sourceUrl ?? f.url, f.targetUrl ?? f.url])];
  if (urls.some(url => url.includes('[REDACTED]'))) throw new Error('SNAPSHOT_REDACTED_URL');
  if (r.findings.some(f => f.ruleId === 'SEO_005' && JSON.stringify(f.observed).includes('[REDACTED]'))) throw new Error('SNAPSHOT_REDACTED_URL');
  for (const url of urls) normalizeUrl(url);
  if (r.status === 'complete' && (!r.pages.length || r.pages.some(p => p.error || !p.status) || r.resources!.some(p => p.error || !p.status))) throw new Error('SNAPSHOT_COMPLETION_INVALID');
  if (new Set(r.pages.map(p => p.url)).size !== r.pages.length || new Set(r.resources!.map(p => p.url)).size !== r.resources!.length) throw new Error('SNAPSHOT_DUPLICATE_URL');
}
export async function readSnapshot(path: string): Promise<ScanReport> {
  const file = await open(path, 'r');
  try {
    if (!(await file.stat()).isFile()) throw new Error('SNAPSHOT_NOT_FILE');
    // Bound reads even if the file grows after stat().
    const buffer = Buffer.alloc(20 * 1024 * 1024 + 1);
    let length = 0;
    while (length < buffer.length) {
      const { bytesRead } = await file.read(buffer, length, buffer.length - length, null);
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length === buffer.length) throw new Error('SNAPSHOT_TOO_LARGE');
    const value: unknown = JSON.parse(buffer.subarray(0, length).toString('utf8'));
    validateSnapshot(value); return value;
  } finally { await file.close(); }
}
const stableUrl = (url: string | undefined) => url ? normalizeUrl(url) : '';
const identity = (f: Finding) => JSON.stringify([f.ruleId, f.severity, stableUrl(f.url), stableUrl(f.sourceUrl), stableUrl(f.targetUrl), f.ruleId === 'SEO_005' ? f.observed : null]);
const scopeKey = (r: ScanReport) => JSON.stringify(Object.entries(r.scope!).sort(([a], [b]) => a.localeCompare(b, 'en')));
const coverage = (r: ScanReport) => JSON.stringify([r.pages.map(p => [p.url, p.finalUrl]).sort(), r.resources!.map(p => [p.url, p.finalUrl]).sort()]);
function checked(report: ScanReport, f: Finding): boolean {
  if (f.ruleId === 'RESOURCE_001') return report.resources!.some(r => r.url === f.targetUrl && !r.error && r.status);
  if (!/^(SEO_|IDX_001|HEALTH_)/.test(f.ruleId)) return true;
  const usable = (url: string) => report.pages.some(p => (p.url === url || p.finalUrl === url) && p.html && !p.error && p.status && p.status < 400);
  if (['SEO_002', 'SEO_008'].includes(f.ruleId)) {
    const urls = f.observed && typeof f.observed === 'object' && 'urls' in f.observed ? f.observed.urls : undefined;
    return Array.isArray(urls) && urls.length > 0 && urls.every(url => typeof url === 'string' && usable(url));
  }
  return usable(f.url);
}

export function diff(before: ScanReport, after: ScanReport): AuditDiff {
  validateSnapshot(before); validateSnapshot(after);
  if (before.rulesVersion !== after.rulesVersion || scopeKey(before) !== scopeKey(after)) throw new Error('SNAPSHOT_SCOPE_MISMATCH');
  const comparable = before.status === 'complete' && after.status === 'complete' && coverage(before) === coverage(after);
  const result: AuditDiff = { schemaVersion: '1', status: comparable ? 'complete' : 'incomplete', target: after.target, NEW: [], RESOLVED: [], UNCHANGED: [], UNVERIFIED: [] };
  const old = new Map(before.findings.filter(f => f.result === 'failed').map(f => [identity(f), f]));
  const current = new Map(after.findings.filter(f => f.result === 'failed').map(f => [identity(f), f]));
  for (const [key, f] of current) result[old.has(key) ? 'UNCHANGED' : comparable && checked(before, f) ? 'NEW' : 'UNVERIFIED'].push(f);
  for (const [key, f] of old) if (!current.has(key)) result[comparable && checked(after, f) ? 'RESOLVED' : 'UNVERIFIED'].push(f);
  if (result.UNVERIFIED.length) result.status = 'incomplete';
  for (const items of [result.NEW, result.RESOLVED, result.UNCHANGED, result.UNVERIFIED]) items.sort((a, b) => identity(a).localeCompare(identity(b), 'en'));
  return redact(result);
}
export function diffExitCode(result: AuditDiff, failOn: 'none' | 'error' | 'warning'): number {
  if (result.status !== 'complete') return 1;
  return result.NEW.some(f => failOn !== 'none' && (f.severity === 'error' || failOn === 'warning' && f.severity === 'warning')) ? 2 : 0;
}
export function diffTerminal(result: AuditDiff, lang: Lang): string {
  const names = lang === 'tr' ? ['Yeni', 'Çözülen', 'Devam eden', 'Doğrulanamayan'] : ['New', 'Resolved', 'Unchanged', 'Unverified'];
  const m = messages(lang);
  const plain = (text: string) => text.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ');
  const lines = [`Website SEO Auditor diff | ${result.status === 'complete' ? m.complete : m.truncated}`, plain(result.target)];
  (['NEW', 'RESOLVED', 'UNCHANGED', 'UNVERIFIED'] as const).forEach((key, index) => {
    lines.push(`${key} (${names[index]}): ${result[key].length}`, ...result[key].map(f => `  [${m[f.severity]}] ${f.ruleId} ${plain(f.url)}${f.targetUrl ? ' -> ' + plain(f.targetUrl) : ''}`));
  });
  return lines.join('\n').replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, '');
}
