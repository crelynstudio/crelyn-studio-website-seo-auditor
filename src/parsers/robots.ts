interface Rule { allow: boolean; path: string }
interface Group { agents: string[]; rules: Rule[] }
function octets(value: string): string {
  return value.replace(/%[\da-f]{2}|[^\x00-\x7f]/gi, part => {
    if (!part.startsWith('%')) return encodeURIComponent(part);
    const char = String.fromCharCode(parseInt(part.slice(1), 16));
    return /[a-z\d._~-]/i.test(char) ? char : part.toUpperCase();
  });
}
// Linear wildcard matching avoids attacker-controlled regular expressions.
function matches(pattern: string, path: string): boolean {
  const anchored = pattern.endsWith('$');
  const p = anchored ? pattern.slice(0, -1) : pattern + '*';
  let i = 0, j = 0, star = -1, mark = 0;
  while (j < path.length) {
    if (p[i] === path[j]) { i++; j++; }
    else if (p[i] === '*') { star = i++; mark = j; }
    else if (star !== -1) { i = star + 1; j = ++mark; }
    else return false;
  }
  while (p[i] === '*') i++;
  return i === p.length;
}
export function parseRobots(text: string) {
  const groups: Group[] = [];
  const sitemaps: string[] = [];
  let current: Group | undefined;
  let hasRules = false;
  let count = 0;
  let sitemapLimited = false;
  for (const raw of text.replace(/^\uFEFF/, '').split(/\r?\n|\r/)) {
    const line = raw.split('#')[0]!.trim();
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase(), value = line.slice(colon + 1).trim();
    if (key === 'sitemap') { if (sitemaps.length < 16) sitemaps.push(value); else sitemapLimited = true; continue; }
    if (key === 'user-agent') {
      if (!current || hasRules) { current = { agents: [], rules: [] }; groups.push(current); hasRules = false; }
      current.agents.push(value.toLowerCase());
    } else if (current && ['allow', 'disallow'].includes(key)) {
      hasRules = true;
      if (value.startsWith('/')) {
        if (value.length > 4096 || ++count > 10000) throw new Error('ROBOTS_LIMIT');
        current.rules.push({ allow: key === 'allow', path: octets(value) });
      }
    }
  }
  const specific = groups.filter(g => g.agents.includes('websiteseoauditor'));
  const rules = (specific.length ? specific : groups.filter(g => g.agents.includes('*'))).flatMap(g => g.rules);
  return { sitemaps, sitemapLimited, allowed(raw: string) {
    const url = new URL(raw), path = octets(url.pathname + url.search);
    let best = -1, allow = true;
    for (const rule of rules) {
      const length = Buffer.byteLength(rule.path.replace(/\*/g, '').replace(/\$$/, ''));
      if (matches(rule.path, path) && (length > best || (length === best && rule.allow))) { best = length; allow = rule.allow; }
    }
    return allow;
  } };
}
