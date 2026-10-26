export const VERSION = '0.5.0-beta.2';
export const PRODUCT = 'Website SEO Auditor';
export const RULES_VERSION = '2';
export type Lang = 'en' | 'tr';
export type Severity = 'error' | 'warning' | 'info';
export interface ScanConfig {
  url: string; lang: Lang; maxPages: number; maxDepth: number; concurrency: number;
  timeout: number; formats: ('terminal' | 'html' | 'json')[]; output?: string;
  failOn: 'error' | 'warning' | 'none'; allowPrivateNetwork: boolean;
  checkResources: boolean; maxResources: number;
}
export interface DiscoveredLink {
  sourceUrl: string; raw: string; targetUrl?: string;
  kind: 'internal' | 'external' | 'fragment' | 'mailto' | 'tel' | 'invalid' | 'unsupported';
}
export interface CrawlPage {
  url: string; finalUrl: string; depth: number; status?: number;
  redirects: string[]; headers: Record<string, string>; html: boolean;
  title?: string; description?: string; h1?: number; canonicals?: string[]; noindex?: boolean;
  links: DiscoveredLink[]; error?: string;
  baseUrl?: string; discoveryLimited?: boolean;
  headings?: number[]; resources?: ResourceReference[]; resourceDiscoveryLimited?: boolean;
}
export interface ResourceReference { url: string; kind: 'image' | 'script' | 'stylesheet' }
export interface ResourceResult { url: string; finalUrl?: string; status?: number; error?: string }
export interface Finding {
  ruleId: string; severity: Severity; result: 'failed' | 'passed' | 'skipped';
  confidence: 'certain' | 'heuristic'; url: string; sourceUrl?: string; targetUrl?: string;
  observed: unknown; expected: string; messageKey: string; params: Record<string, string>;
  message: string; recommendation: string; docsUrl: string;
}
export interface SkippedCheck { url: string; reason: string; checks: string[] }
export interface CrawlSummary {
  discovered: number; crawled: number; skipped: number; errors: number; warnings: number; info: number;
}
export interface ScanReport {
  schemaVersion: '1' | '2'; version: string; target: string; startedAt: string; finishedAt: string;
  rulesVersion?: string; scope?: { origin: string; startUrl: string; maxPages: number; maxDepth: number; checkResources: boolean; maxResources: number; allowPrivateNetwork: boolean };
  resources?: ResourceResult[];
  status: 'complete' | 'truncated' | 'aborted'; config: ScanConfig; summary: CrawlSummary;
  pages: CrawlPage[]; findings: Finding[]; skippedChecks: SkippedCheck[];
  limitations: string[];
}
