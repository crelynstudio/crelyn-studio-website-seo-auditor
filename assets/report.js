(() => {
  'use strict';
  const ui = {
  "en": {
    "skipLink": "Skip to workspace",
    "local": "Runs on your device",
    "language": "Language",
    "workspace": "Report",
    "audit": "Website audit",
    "findings": "Findings",
    "scope": "Scope & limits",
    "privacyTitle": "Your audits stay yours.",
    "privacyText": "No accounts, API keys, or uploads to Crelyn Studio.",
    "heading": "Find what broke. Fix what matters.",
    "intro": "Find broken links and technical SEO issues. Get the evidence and a practical next step.",
    "preview": "Preview",
    "search": "Search findings",
    "severity": "Severity",
    "all": "All severities",
    "error": "Errors",
    "warning": "Warnings",
    "info": "Information",
    "noResults": "No findings match these filters.",
    "coverage": "Coverage",
    "developer": "Developed by Crelyn Studio",
    "about": "About the developer",
    "developerText": "This open-source tool is developed by Crelyn Studio.",
    "contact": "Contact",
    "footer": "Evidence over scores. Local by design.",
    "complete": "Complete",
    "truncated": "Partial coverage",
    "aborted": "Aborted",
    "pages": "Pages checked",
    "skipped": "Checks skipped",
    "evidence": "Evidence",
    "fix": "Suggested fix",
    "noSkipped": "No checks were skipped.",
    "website": "Website",
    "docs": "Rule documentation"
  },
  "tr": {
    "skipLink": "Çalışma alanına geç",
    "local": "Cihazınızda çalışır",
    "language": "Dil",
    "workspace": "Rapor",
    "audit": "Site denetimi",
    "findings": "Bulgular",
    "scope": "Kapsam ve sınırlar",
    "privacyTitle": "Denetimleriniz size ait.",
    "privacyText": "Hesap, API anahtarı veya Crelyn Studio’ya veri yükleme yok.",
    "heading": "Bozulanı bul. Önemli olanı düzelt.",
    "intro": "Bozuk bağlantıları ve teknik SEO sorunlarını bulun. Kanıtları görün, sonraki adımı belirleyin.",
    "preview": "Önizleme",
    "search": "Bulgularda ara",
    "severity": "Önem derecesi",
    "all": "Tüm seviyeler",
    "error": "Hatalar",
    "warning": "Uyarılar",
    "info": "Bilgi",
    "noResults": "Bu filtrelerle eşleşen bulgu yok.",
    "coverage": "Tarama kapsamı",
    "developer": "Crelyn Studio tarafından geliştirildi",
    "about": "Geliştirici hakkında",
    "developerText": "Bu açık kaynak araç Crelyn Studio tarafından geliştirilmiştir.",
    "contact": "İletişim",
    "footer": "Puan yerine kanıt. Veriler yerelde.",
    "complete": "Tamamlandı",
    "truncated": "Kısmi kapsam",
    "aborted": "Durduruldu",
    "pages": "Kontrol edilen sayfa",
    "skipped": "Atlanan kontrol",
    "evidence": "Kanıt",
    "fix": "Düzeltme önerisi",
    "noSkipped": "Atlanan kontrol yok.",
    "website": "Web sitesi",
    "docs": "Kural belgesi"
  }
};
  const $ = id => document.getElementById(id);
  const report = bootstrap.report;
  let lang = report?.config.lang === 'tr' ? 'tr' : 'en';
  try { const saved = localStorage.getItem('website-seo-auditor-language'); if (['tr', 'en_US'].includes(saved)) lang = saved === 'tr' ? 'tr' : 'en'; } catch { /* Storage can be disabled for local files. */ }
  const text = key => ui[lang][key] ?? bootstrap.catalog[lang][key] ?? key;
  function element(tag, content, className) {
    const node = document.createElement(tag);
    if (content !== undefined) node.textContent = String(content);
    if (className) node.className = className;
    return node;
  }
  function render() {
    document.documentElement.lang = lang === 'tr' ? 'tr' : 'en-US';
    $('language').value = lang === 'tr' ? 'tr' : 'en_US';
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = text(node.dataset.i18n); });
    document.querySelectorAll('[data-placeholder]').forEach(node => { node.placeholder = text(node.dataset.placeholder); });
    document.querySelector('.developer-content nav a').textContent = text('website');
    $('limitations').replaceChildren(...bootstrap.limitations[lang].map(item => element('li', item)));
    $('report-target').textContent = report.target;
    $('report-scope').textContent = JSON.stringify({ schemaVersion: report.schemaVersion, rulesVersion: report.rulesVersion, status: report.status, scope: report.scope, resourcesChecked: (report.resources ?? []).length }, null, 2);
    const date = new Date(report.startedAt).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US');
    $('report-meta').textContent = `${text(report.status)} · ${date} · v${report.version}`;
    const stats = [['crawled', 'pages'], ['errors', 'error'], ['warnings', 'warning'], ['info', 'info']];
    $('summary').replaceChildren(...stats.map(([key, label]) => {
      const item = element('div', undefined, 'summary-item');
      item.append(element('strong', report.summary[key]), element('span', text(label))); return item;
    }));
    const needle = $('search').value.trim().toLocaleLowerCase();
    const severity = $('severity').value;
    const sorted = [...report.findings].sort((a, b) => ['error', 'warning', 'info'].indexOf(a.severity) - ['error', 'warning', 'info'].indexOf(b.severity));
    const filtered = sorted.filter(f => {
      const translated = bootstrap.catalog[lang][f.ruleId] ?? [f.message, f.recommendation];
      return (severity === 'all' || f.severity === severity) && [f.ruleId, f.url, f.targetUrl ?? '', ...translated].join(' ').toLocaleLowerCase().includes(needle);
    });
    $('finding-count').textContent = `${filtered.length} / ${report.findings.length}`;
    $('finding-list').replaceChildren(...filtered.map(f => {
      const [message, recommendation] = bootstrap.catalog[lang][f.ruleId] ?? [f.message, f.recommendation];
      const article = element('article', undefined, 'finding');
      article.dataset.severity = f.severity;
      const header = element('header');
      header.append(element('span', text(f.severity), `badge ${f.severity}`), element('code', f.ruleId));
      article.append(header, element('h3', message), element('p', f.url, 'url'));
      if (f.targetUrl) article.append(element('p', f.targetUrl, 'url'));
      const details = element('details');
      details.append(element('summary', text('evidence')), element('pre', JSON.stringify({ observed: f.observed, expected: f.expected, confidence: f.confidence }, null, 2)));
      const fix = element('p', undefined, 'recommendation');
      fix.append(element('strong', text('fix')), document.createTextNode(recommendation));
      const docs = element('a', text('docs'));
      docs.href = 'https://github.com/crelynstudio/crelyn-studio-website-seo-auditor/blob/main/docs/rules.md#' + encodeURIComponent(f.ruleId.toLowerCase());
      article.append(details, fix, docs); return article;
    }));
    $('finding-list').hidden = !filtered.length;
    $('no-results').hidden = Boolean(filtered.length);
    $('skipped-list').replaceChildren(...report.skippedChecks.map(item => {
      const row = element('div', undefined, 'coverage-row'); row.append(element('span', item.url), element('code', item.reason)); return row;
    }));
    if (!report.skippedChecks.length) $('skipped-list').append(element('p', text('noSkipped')));
  }
  $('language').addEventListener('change', () => {
    lang = $('language').value === 'tr' ? 'tr' : 'en';
    try { localStorage.setItem('website-seo-auditor-language', lang === 'tr' ? 'tr' : 'en_US'); } catch { /* Optional persistence. */ }
    render();
  });
  $('search').addEventListener('input', render);
  $('severity').addEventListener('change', render);
  render();
})();
