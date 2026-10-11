const sensitive = /^(?:.*token.*|.*secret.*|.*password.*|.*signature.*|.*credential.*|passwd|auth|authorization|cookie|set-cookie|api[-_]?key|key|session(?:[-_]?id)?|sig|email|phone|code)$/i;

export function redactText(text: string): string {
  return text.replace(/([?&#;\s]|^)([\w%.-]+)=([^&#\s"'<>]*)/g, (match, prefix: string, key: string) => {
    let decoded = key;
    try { decoded = decodeURIComponent(key); } catch { /* Keep malformed keys. */ }
    return sensitive.test(decoded) ? `${prefix}${key}=[REDACTED]` : match;
  }).replace(/(https?:\/\/)[^/\s@]+@/gi, '$1[REDACTED]@')
    .replace(/\b(Bearer|Basic)\s+[\w.+\/~=-]+/gi, '$1 [REDACTED]')
    .replace(/\b(mailto|tel):[^\s"'<>]+/gi, '$1:[REDACTED]')
    .replace(/\beyJ[\w-]+\.[\w-]+\.[\w-]+\b/g, '[REDACTED]');
}

// Redact only after analysis; request URLs and the HTTP cache keep their original identity.
export function redact<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (key, item: unknown) => sensitive.test(key) ? '[REDACTED]' : typeof item === 'string' ? redactText(item) : item)) as T;
}
