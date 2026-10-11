(() => {
  'use strict';
  const ui = {
    en: {
      skipLink: 'Skip to workspace', local: 'Runs on your device', language: 'Language', workspace: 'Workspace', audit: 'Website audit', findings: 'Findings', scope: 'Scope & limits', privacyTitle: 'Your audits stay yours.', privacyText: 'No accounts, API keys, or uploads to Crelyn Studio.', heading: 'A clearer view of your website.', intro: 'Find broken links and technical SEO issues. Get the evidence and a practical next step.', preview: 'Preview', target: 'Website URL', run: 'Run audit', cancel: 'Cancel', pageLimit: 'Page limit', private: 'Allow trusted local/private network', scanHint: 'Same-origin only. Respects robots.txt. Up to two requests per second.', emptyTitle: 'Start with a URL. Leave with a plan.', emptyText: 'Your findings will appear here with the affected page, evidence, and a suggested fix.', exportJson: 'Export JSON', exportHtml: 'Export HTML', search: 'Search findings', severity: 'Severity', all: 'All severities', error: 'Errors', warning: 'Warnings', info: 'Information', noResults: 'No findings match these filters.', coverage: 'Coverage', developer: 'Developed by Crelyn Studio', about: 'About the developer', developerText: 'This open-source tool is developed by Crelyn Studio.', contact: 'Contact', footer: 'Evidence over scores. Local by design.', running: 'Auditing your site. Larger audits may take a few minutes…', cancelled: 'Audit canceled. You can start again.', failed: 'The audit could not run. Check the URL and server, then try again.', complete: 'Complete', truncated: 'Partial coverage', aborted: 'Aborted', pages: 'Pages checked', skipped: 'Checks skipped', evidence: 'Evidence', fix: 'Suggested fix', noSkipped: 'No checks were skipped.', busy: 'Another audit is running. Try again after it finishes.', invalid: 'Enter a valid HTTP(S) URL and a page limit from 1 to 100.', readOnly: 'Saved report. Start the local web app to run a new audit.', copied: 'Report downloaded.', downloadFailed: 'Download failed. Try JSON export or use the CLI HTML format.', website: 'Website', result: 'Audit finished. Review the coverage status and findings below.'
    },
    tr: {
      skipLink: 'Çalışma alanına geç', local: 'Cihazınızda çalışır', language: 'Dil', workspace: 'Çalışma alanı', audit: 'Site denetimi', findings: 'Bulgular', scope: 'Kapsam ve sınırlar', privacyTitle: 'Denetimleriniz size ait.', privacyText: 'Hesap, API anahtarı veya Crelyn Studio’ya veri yükleme yok.', heading: 'Web sitenize daha net bir bakış.', intro: 'Bozuk bağlantıları ve teknik SEO sorunlarını bulun. Kanıtları görün, sonraki adımı belirleyin.', preview: 'Önizleme', target: 'Web sitesi adresi', run: 'Denetimi başlat', cancel: 'İptal et', pageLimit: 'Sayfa sınırı', private: 'Güvenilen yerel/özel ağa izin ver', scanHint: 'Yalnızca aynı köken. robots.txt kurallarına uyar. Saniyede en fazla iki istek.', emptyTitle: 'Bir adresle başlayın. Bir planla ayrılın.', emptyText: 'Bulgular; ilgili sayfa, kanıt ve düzeltme önerisiyle burada görünecek.', exportJson: 'JSON indir', exportHtml: 'HTML indir', search: 'Bulgularda ara', severity: 'Önem derecesi', all: 'Tüm seviyeler', error: 'Hatalar', warning: 'Uyarılar', info: 'Bilgi', noResults: 'Bu filtrelerle eşleşen bulgu yok.', coverage: 'Tarama kapsamı', developer: 'Crelyn Studio tarafından geliştirildi', about: 'Geliştirici hakkında', developerText: 'Bu açık kaynak araç Crelyn Studio tarafından geliştirilmiştir.', contact: 'İletişim', footer: 'Puan yerine kanıt. Veriler yerelde.', running: 'Siteniz denetleniyor. Büyük taramalar birkaç dakika sürebilir…', cancelled: 'Denetim iptal edildi. Yeniden başlatabilirsiniz.', failed: 'Denetim çalıştırılamadı. Adresi ve sunucuyu kontrol edip yeniden deneyin.', complete: 'Tamamlandı', truncated: 'Kısmi kapsam', aborted: 'Durduruldu', pages: 'Kontrol edilen sayfa', skipped: 'Atlanan kontrol', evidence: 'Kanıt', fix: 'Düzeltme önerisi', noSkipped: 'Atlanan kontrol yok.', busy: 'Başka bir denetim çalışıyor. Bitince yeniden deneyin.', invalid: 'Geçerli HTTP(S) adresi ve 1–100 arasında sayfa sınırı girin.', readOnly: 'Kayıtlı rapor. Yeni denetim için yerel web uygulamasını başlatın.', copied: 'Rapor indirildi.', downloadFailed: 'İndirme başarısız. JSON indirmeyi veya CLI HTML biçimini deneyin.', website: 'Web sitesi', result: 'Denetim bitti. Aşağıdaki kapsam durumunu ve bulguları inceleyin.'
    }
  };
  const $ = id => document.getElementById(id);
  let report = bootstrap.report;
  let lang = report?.config.lang === 'tr' ? 'tr' : 'en';
  try { const saved = localStorage.getItem('crelyn-auditor-language'); if (['tr', 'en_US'].includes(saved)) lang = saved === 'tr' ? 'tr' : 'en'; } catch { /* Storage can be disabled for local files. */ }
  let controller = null;
  let notice = null;
  const text = key => ui[lang][key] ?? bootstrap.catalog[lang][key] ?? key;
  function element(tag, content, className) {
    const node = document.createElement(tag);
    if (content !== undefined) node.textContent = String(content);
    if (className) node.className = className;
    return node;
  }
  function notify(key, problem = false, code = '') {
    notice = { key, problem, code };
    $('notification').textContent = text(key) + (code ? ` [${code}]` : '');
    $('notification').className = problem ? 'problem' : '';
  }
  function render() {
    document.documentElement.lang = lang === 'tr' ? 'tr' : 'en-US';
    $('language').value = lang === 'tr' ? 'tr' : 'en_US';
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = text(node.dataset.i18n); });
    document.querySelectorAll('[data-placeholder]').forEach(node => { node.placeholder = text(node.dataset.placeholder); });
    document.querySelector('.developer-content nav a').textContent = text('website');
    $('scan-panel').hidden = !bootstrap.token;
    $('empty').hidden = Boolean(report);
    $('report').hidden = !report;
    $('limitations').replaceChildren(...bootstrap.limitations[lang].map(item => element('li', item)));
    if (controller) notify('running');
    else if (!bootstrap.token) notify('readOnly');
    else if (notice) notify(notice.key, notice.problem, notice.code);
    if (!report) return;
    $('report-target').textContent = report.target;
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
      article.append(details, fix); return article;
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
    try { localStorage.setItem('crelyn-auditor-language', lang === 'tr' ? 'tr' : 'en_US'); } catch { /* Optional persistence. */ }
    render();
  });
  $('search').addEventListener('input', render);
  $('severity').addEventListener('change', render);
  $('cancel').addEventListener('click', () => controller?.abort());
  $('scan-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (controller || !bootstrap.token) return;
    controller = new AbortController();
    $('scan-button').disabled = true; $('cancel').hidden = false;
    notify('running');
    try {
      const response = await fetch('/api/audit', {
        method: 'POST', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'X-Audit-Token': bootstrap.token },
        body: JSON.stringify({ url: $('target').value, maxPages: Number($('max-pages').value), lang: lang === 'tr' ? 'tr' : 'en_US', allowPrivateNetwork: $('allow-private').checked })
      });
      const data = await response.json();
      if (!response.ok) { notify(response.status === 409 ? 'busy' : response.status === 400 ? 'invalid' : 'failed', true, data.error); return; }
      report = data; render(); notify('result');
    } catch (error) { notify(error.name === 'AbortError' ? 'cancelled' : 'failed', error.name !== 'AbortError'); }
    finally { controller = null; $('scan-button').disabled = false; $('cancel').hidden = true; }
  });
  function download(content, type, extension) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = element('a'); link.href = url; link.download = `website-seo-audit.${extension}`;
    link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); notify('copied');
  }
  $('export-json').addEventListener('click', () => { if (report) download(JSON.stringify(report, null, 2), 'application/json', 'json'); });
  $('export-html').addEventListener('click', async () => {
    if (!report) return;
    try {
      const clone = document.documentElement.cloneNode(true);
      const script = clone.querySelector('script');
      const body = script.textContent.slice(script.textContent.indexOf('\n') + 1);
      script.textContent = `const bootstrap=${JSON.stringify({ ...bootstrap, report, token: null }).replace(/</g, '\\u003c')};\n${body}`;
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(script.textContent));
      const hash = btoa(String.fromCharCode(...new Uint8Array(digest)));
      clone.querySelector('meta[http-equiv="Content-Security-Policy"]').content = `default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'sha256-${hash}'; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'`;
      download('<!doctype html>' + clone.outerHTML, 'text/html;charset=utf-8', 'html');
    } catch { notify('downloadFailed', true); }
  });
  render();
})();
