import { parseConfig } from '../config/index.js';
import type { Lang, ScanConfig } from '../core/types.js';

export interface DesktopRequest {
  url: string;
  lang: Lang;
  checkResources: boolean;
  allowPrivateNetwork: boolean;
}

export function desktopConfig(value: unknown): ScanConfig {
  if (!value || typeof value !== 'object') throw new Error('CONFIG_INVALID');
  const request = value as Record<string, unknown>;
  if (typeof request.url !== 'string' || !request.url.trim() || request.url.length > 2048 ||
      !['en', 'tr'].includes(String(request.lang)) ||
      typeof request.checkResources !== 'boolean' || typeof request.allowPrivateNetwork !== 'boolean') {
    throw new Error('CONFIG_INVALID');
  }
  return parseConfig([
    'audit', request.url.trim(), '--lang', request.lang as Lang, '--format', 'json',
    ...(request.checkResources ? ['--check-resources'] : []),
    ...(request.allowPrivateNetwork ? ['--allow-private-network'] : [])
  ]);
}
