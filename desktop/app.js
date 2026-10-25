(() => {
  'use strict';
  const words = {
    en: {
      skip: 'Skip to main content', local: 'Reports stay on this device', language: 'Language', eyebrow: 'Website audit',
      heading: 'See what needs attention.', intro: 'Check your site, understand the issues, and decide what to fix first.',
      urlLabel: 'Website address', start: 'Scan website', urlHint: 'Only pages on this site are checked. No account or API key is needed.',
      options: 'Scan options', resources: 'Check images, scripts and stylesheets', privateNetwork: 'Allow local or private network addresses',
      privateHint: 'Use private network access only for sites you control.', scanning: 'Scanning your website', cancel: 'Stop scan',
      resultsEyebrow: 'Your results', resultsTitle: 'Site overview', saveHtml: 'Save readable report', saveJson: 'Save data',
      pages: 'Pages checked', errors: 'Errors', warnings: 'Warnings', info: 'Information', issuesTitle: 'What to fix first',
      issuesIntro: 'Similar issues are grouped so you can work through them once.', severity: 'Filter by severity', all: 'All issues',
      scanDetails: 'Scan coverage and limitations', aboutEyebrow: 'About', aboutTitle: 'Developed by Crelyn Studio',
      aboutBody: 'SiteMercek keeps reports on your device. Your website is contacted only to run the scan you start.',
      website: 'Website', contact: 'Contact', progress: (c, d) => `${c} pages checked · ${d} discovered`,
      complete: 'Scan complete. Review the issues below, starting with errors.',
      partial: 'This scan did not cover every page or check. Review its limits before acting on the results.',
      aborted: 'Scan stopped. These are partial results.',
      noIssues: 'No issues found in the pages checked.', noFiltered: 'No issues match this filter.',
      instances: n => `${n} ${n === 1 ? 'instance' : 'instances'}`, affected: 'Affected pages', fix: 'Suggested fix',
      evidence: 'Technical evidence', rule: 'Read rule details', limits: 'Scan limits', skipped: 'Skipped checks',
      noSkipped: 'No checks were skipped.', moreSkipped: n => `${n} more skipped checks`, depth: 'levels',
      saved: path => `Report saved: ${path}`, saveFailed: 'The report could not be saved. Choose another location and try again.',
      invalid: 'Enter a full website address, such as https://example.com.', running: 'A scan is already running.',
      failed: 'The scan could not start. Check the address and try again.', unavailable: 'Run a scan before saving a report.',
      canceled: 'Scan stopped.', dataNote: 'Static HTML only; JavaScript-rendered content and sign-in pages are not checked.'
    },
    tr: {
      skip: 'Ana içeriğe geç', local: 'Raporlar bu cihazda kalır', language: 'Dil', eyebrow: 'Web sitesi denetimi',
      heading: 'Neye odaklanacağını gör.', intro: 'Siteni tara, sorunları anla ve önce neyi düzelteceğine karar ver.',
      urlLabel: 'Web sitesi adresi', start: 'Siteyi tara', urlHint: 'Yalnızca bu sitedeki sayfalar incelenir. Hesap veya API anahtarı gerekmez.',
      options: 'Tarama seçenekleri', resources: 'Görsel, betik ve stil dosyalarını kontrol et', privateNetwork: 'Yerel veya özel ağ adreslerine izin ver',
      privateHint: 'Özel ağ erişimini yalnızca kontrol ettiğin sitelerde kullan.', scanning: 'Site taranıyor', cancel: 'Taramayı durdur',
      resultsEyebrow: 'Sonuçların', resultsTitle: 'Site özeti', saveHtml: 'Okunabilir raporu kaydet', saveJson: 'Veriyi kaydet',
      pages: 'Kontrol edilen sayfa', errors: 'Hatalar', warnings: 'Uyarılar', info: 'Bilgi', issuesTitle: 'Önce bunları düzelt',
      issuesIntro: 'Aynı tür sorunlar birlikte gösterilir; tek tek uzun liste okumazsın.', severity: 'Önem derecesine göre filtrele', all: 'Tüm sorunlar',
      scanDetails: 'Tarama kapsamı ve sınırlar', aboutEyebrow: 'Hakkında', aboutTitle: 'Crelyn Studio tarafından geliştirildi',
      aboutBody: 'SiteMercek raporları cihazında tutar. Sitenle yalnızca başlattığın tarama sırasında bağlantı kurar.',
      website: 'Web sitesi', contact: 'İletişim', progress: (c, d) => `${c} sayfa kontrol edildi · ${d} sayfa keşfedildi`,
      complete: 'Tarama tamamlandı. Aşağıdaki sorunları hatalardan başlayarak incele.',
      partial: 'Bu tarama her sayfayı veya kontrolü kapsamadı. Sonuçları kullanmadan önce sınırları incele.',
      aborted: 'Tarama durduruldu. Bunlar kısmi sonuçlardır.',
      noIssues: 'Kontrol edilen sayfalarda sorun bulunmadı.', noFiltered: 'Bu filtreye uyan sorun yok.',
      instances: n => `${n} örnek`, affected: 'Etkilenen sayfalar', fix: 'Düzeltme önerisi',
      evidence: 'Teknik kanıt', rule: 'Kural ayrıntısı', limits: 'Tarama sınırları', skipped: 'Atlanan kontroller',
      noSkipped: 'Atlanan kontrol yok.', moreSkipped: n => `${n} atlanan kontrol daha`, depth: 'seviye',
      saved: path => `Rapor kaydedildi: ${path}`, saveFailed: 'Rapor kaydedilemedi. Başka bir konum seçip yeniden dene.',
      invalid: 'https://example.com gibi tam bir site adresi gir.', running: 'Bir tarama zaten sürüyor.',
      failed: 'Tarama başlatılamadı. Adresi kontrol edip yeniden dene.', unavailable: 'Rapor kaydetmeden önce tarama yap.',
      canceled: 'Tarama durduruldu.', dataNote: 'Yalnızca statik HTML incelenir; JavaScript sonrası içerik ve giriş gerektiren sayfalar kontrol edilmez.'
    }
  };
  const $ = id => document.getElementById(id);
  const node = (tag, value, className) => {
    const result = document.createElement(tag);
    if (value !== undefined) result.textContent = String(value);
    if (className) result.className = className;
    return result;
  };
  let lang = 'en';
  try { if (localStorage.getItem('sitemercek-language') === 'tr') lang = 'tr'; } catch { /* Local storage is optional. */ }
  let report = null;
  let catalog = null;
  let limitations = null;
  let busy = false;
  const t = key => words[lang][key] ?? key;

  function translate() {
    document.documentElement.lang = lang;
    $('language').value = lang;
    document.querySelectorAll('[data-i18n]').forEach(item => { item.textContent = t(item.dataset.i18n); });
    $('url').placeholder = 'https://example.com';
    renderResults();
  }

  function notice(message, success = false) {
    $('notice').textContent = message;
    $('notice').classList.toggle('success', success);
    $('notice').hidden = !message;
  }

  function translatedFinding(finding) {
    return catalog?.[lang]?.[finding.ruleId] ?? [finding.message, finding.recommendation];
  }

  function issueGroups() {
    const grouped = new Map();
    for (const finding of report.findings) {
      const key = `${finding.severity}:${finding.ruleId}`;
      if (!grouped.has(key)) grouped.set(key, { severity: finding.severity, ruleId: finding.ruleId, findings: [] });
      grouped.get(key).findings.push(finding);
    }
    const priority = { error: 0, warning: 1, info: 2 };
    return [...grouped.values()].sort((a, b) => priority[a.severity] - priority[b.severity] || b.findings.length - a.findings.length || a.ruleId.localeCompare(b.ruleId));
  }

  function renderIssues() {
    const severity = $('severity').value;
    const groups = issueGroups().filter(group => severity === 'all' || group.severity === severity);
    const items = groups.map(group => {
      const [message, recommendation] = translatedFinding(group.findings[0]);
      const details = node('details', undefined, 'issue');
      details.dataset.severity = group.severity;
      const summary = node('summary');
      const title = node('span', undefined, 'issue-title');
      title.append(node('strong', message), node('small', group.ruleId));
      summary.append(node('span', undefined, 'issue-mark'), title, node('span', t('instances')(group.findings.length), 'issue-count'), node('span', '⌄', 'chevron'));
      const body = node('div', undefined, 'issue-body');
      body.append(node('h3', t('fix')), node('p', recommendation), node('h3', t('affected')));
      const urls = node('ul', undefined, 'affected');
      for (const finding of group.findings) {
        const item = node('li', finding.sourceUrl ?? finding.url);
        if (finding.targetUrl) item.append(node('span', finding.targetUrl));
        urls.append(item);
      }
      body.append(urls);
      const evidence = node('details');
      evidence.append(node('summary', t('evidence')), node('pre', JSON.stringify(group.findings.map(f => ({ url: f.url, observed: f.observed, expected: f.expected })), null, 2)));
      body.append(evidence);
      if (/^[A-Z0-9_]+$/.test(group.ruleId)) {
        const rule = node('a', t('rule'));
        rule.href = `https://github.com/crelynstudio/crelyn-studio-website-seo-auditor/blob/main/docs/rules.md#${group.ruleId.toLowerCase()}`;
        rule.target = '_blank'; rule.rel = 'noopener';
        body.append(rule);
      }
      details.append(summary, body);
      return details;
    });
    $('issue-list').replaceChildren(...items);
    $('issue-list').hidden = !items.length;
    $('empty-issues').textContent = report.findings.length ? t('noFiltered') : t('noIssues');
    $('empty-issues').hidden = Boolean(items.length);
  }

  function renderCoverage() {
    const content = $('scan-details-content');
    content.replaceChildren();
    const scope = report.scope;
    content.append(node('p', `${t('pages')}: ${report.summary.crawled} / ${report.summary.discovered}`));
    if (scope) content.append(node('p', `${t('limits')}: ${scope.maxPages} ${t('pages').toLowerCase()}, ${scope.maxDepth} ${t('depth')}`));
    content.append(node('p', t('dataNote')));
    const skipped = node('ul');
    for (const item of report.skippedChecks.slice(0, 30)) skipped.append(node('li', `${item.reason} · ${item.url}`));
    if (report.skippedChecks.length > 30) skipped.append(node('li', t('moreSkipped')(report.skippedChecks.length - 30)));
    if (!report.skippedChecks.length) skipped.append(node('li', t('noSkipped')));
    content.append(node('h3', t('skipped')), skipped);
    if (limitations) {
      const list = node('ul');
      for (const text of limitations[lang]) list.append(node('li', text));
      content.append(list);
    }
  }

  function renderResults() {
    if (!report) return;
    $('results').hidden = false;
    $('result-site').textContent = report.target;
    $('metric-pages').textContent = report.summary.crawled;
    $('metric-errors').textContent = report.summary.errors;
    $('metric-warnings').textContent = report.summary.warnings;
    $('metric-info').textContent = report.summary.info;
    $('coverage-note').textContent = t(report.status);
    $('coverage-note').classList.toggle('partial', report.status !== 'complete');
    renderIssues();
    renderCoverage();
  }

  $('language').addEventListener('change', () => {
    lang = $('language').value === 'tr' ? 'tr' : 'en';
    try { localStorage.setItem('sitemercek-language', lang); } catch { /* Optional. */ }
    translate();
  });
  $('severity').addEventListener('change', renderResults);
  window.siteMercek.onProgress(progress => {
    $('progress-count').textContent = t('progress')(progress.crawled, progress.discovered);
  });
  $('scan-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    notice('');
    if (!$('url').value.trim()) { notice(t('invalid')); $('url').focus(); return; }
    busy = true;
    report = null;
    $('results').hidden = true;
    $('start').disabled = true;
    $('progress').hidden = false;
    $('progress-count').textContent = t('progress')(0, 0);
    try {
      const response = await window.siteMercek.startAudit({ url: $('url').value, lang, checkResources: $('resources').checked, allowPrivateNetwork: $('private-network').checked });
      if (!response.ok) {
        notice(response.code?.startsWith('URL_') || response.code?.startsWith('CONFIG_') ? t('invalid') : response.code === 'SCAN_RUNNING' ? t('running') : t('failed'));
        return;
      }
      report = response.report;
      catalog = response.catalog;
      limitations = response.limitations;
      renderResults();
      $('results').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } catch { notice(t('failed')); }
    finally { busy = false; $('start').disabled = false; $('progress').hidden = true; }
  });
  $('cancel').addEventListener('click', async () => { if (await window.siteMercek.cancelAudit()) notice(t('canceled')); });
  for (const [id, format] of [['save-html', 'html'], ['save-json', 'json']]) {
    $(id).addEventListener('click', async () => {
      const result = await window.siteMercek.saveReport(format, lang);
      if (result.ok) notice(t('saved')(result.path), true);
      else if (!result.cancelled) notice(result.code === 'REPORT_UNAVAILABLE' ? t('unavailable') : t('saveFailed'));
    });
  }
  translate();
})();
