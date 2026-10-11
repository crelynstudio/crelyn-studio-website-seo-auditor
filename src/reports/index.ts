import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { ScanReport } from '../core/types.js';
import { PRODUCT } from '../core/types.js';
import { messages } from '../i18n/index.js';
import { renderHtml as html } from '../web/page.js';
export { html };
export const escapeHtml = (value: unknown): string => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const plain = (value: string): string => value.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ');
export function terminal(report: ScanReport): string {
  const m = messages(report.config.lang), s = report.summary;
  return [
    `${PRODUCT} ${report.version} | ${m.summary}`, plain(report.target),
    `${m[report.status]} | ${m.pages}: ${s.crawled} | ${m.skipped}: ${s.skipped}`,
    `${m.error}: ${s.errors} | ${m.warning}: ${s.warnings} | ${m.info}: ${s.info}`,
    `${m.duration}: ${((Date.parse(report.finishedAt) - Date.parse(report.startedAt)) / 1000).toFixed(1)} s`,
    ...report.findings.slice(0, 12).map(f => `[${m[f.severity]}] ${f.ruleId} ${plain(f.message)}\n  ${plain(f.url)}${f.targetUrl ? '\n  ' + plain(f.targetUrl) : ''}`),
    ...report.limitations.map(plain)
  ].join('\n');
}
export function exitCode(report: ScanReport): number {
  if (report.status !== 'complete' || report.findings.some(f => f.ruleId === 'ANALYZER_001')) return 1;
  if (report.config.failOn !== 'none' && (report.summary.errors || (report.config.failOn === 'warning' && report.summary.warnings))) return 2;
  return 0;
}
export async function writeReports(report: ScanReport): Promise<string[]> {
  const written: string[] = [], formats = report.config.formats;
  if (formats.includes('terminal')) process.stdout.write(terminal(report) + '\n');
  if (formats.length === 1 && formats[0] === 'json' && !report.config.output) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n'); return written;
  }
  const fileFormats = formats.filter(f => f !== 'terminal');
  if (!fileFormats.length) return written;
  const dir = resolve(report.config.output ?? './reports');
  await mkdir(dir, { recursive: true });
  const stem = `website-seo-audit-${report.startedAt.replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;
  for (const format of fileFormats) {
    const path = join(dir, `${stem}.${format}`);
    await writeFile(path, format === 'json' ? JSON.stringify(report, null, 2) + '\n' : await html(report), { encoding: 'utf8', flag: 'wx' });
    written.push(path);
  }
  return written;
}
