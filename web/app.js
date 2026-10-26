(() => {
  "use strict";
  const words = {
    en: {
      skip: "Skip to content",
      workspace: "Workspace",
      overview: "Overview",
      findings: "Findings",
      pages: "Pages",
      reports: "Reports",
      settings: "Settings",
      about: "About",
      localNote: "Runs on this computer. No account required.",
      local: "Local workspace",
      overviewLabel: "Website intelligence",
      overviewTitle: "A clear view of your website.",
      overviewIntro:
        "Run a local audit and turn technical signals into a focused action list.",
      scanTitle: "Start a new audit",
      scanIntro:
        "Enter a website address. Only pages within that site are checked.",
      siteUrl: "Website URL",
      runAudit: "Run audit",
      scanHint: "Uses your saved scan settings",
      editSettings: "Edit settings",
      scanning: "Scanning website",
      stopScan: "Stop scan",
      emptyTitle: "Your first audit starts here",
      emptyIntro:
        "Run a scan to see page coverage, issue distribution and practical fixes. Download a report to keep it after the local app closes.",
      latestAudit: "Latest audit",
      pagesChecked: "Pages checked",
      errors: "Errors",
      warnings: "Warnings",
      information: "Information",
      distribution: "Issue distribution",
      distributionIntro: "Findings in scanned pages",
      coverage: "Page coverage",
      coverageIntro: "Crawled versus discovered",
      viewCoverage: "View scan scope",
      priorityFindings: "Priority findings",
      priorityIntro: "Grouped by issue so you can fix the cause once",
      viewAll: "View all",
      auditResults: "Audit results",
      findingsIntro:
        "Review the evidence, affected pages and a suggested next step.",
      noAudit: "No audit yet",
      runFirst: "Run an audit from Overview to fill this page.",
      goOverview: "Go to Overview",
      searchFindings: "Search issues or URLs",
      allFindings: "All findings",
      pagesIntro: "See which pages were checked and where issues occur.",
      pageIssueCounts: "Issues by page",
      pageIssueIntro: "Bars show finding counts on each crawled page",
      page: "Page",
      httpStatus: "HTTP status",
      issues: "Issues",
      reportsIntro:
        "Download the current audit and check what the scan covered.",
      readableReport: "Readable report",
      readableIntro:
        "An HTML file with findings, evidence and scope. Opens without this app.",
      downloadHtml: "Download HTML",
      dataReport: "Structured data",
      dataIntro: "A JSON file for your own analysis or records.",
      downloadJson: "Download JSON",
      scanScope: "Scan scope and limits",
      preferences: "Preferences",
      settingsIntro:
        "Choose how this browser runs future audits. Changes are saved on this device.",
      interface: "Interface",
      interfaceIntro: "Choose your language for the application.",
      language: "Language",
      scanDefaults: "Scan defaults",
      scanDefaultsIntro:
        "These limits apply to the next scan. Increasing them takes longer.",
      maxPages: "Maximum pages",
      maxPagesHint: "1–1000 pages",
      maxDepth: "Link depth",
      maxDepthHint: "0–10 levels",
      resources: "Check images, scripts and stylesheets",
      resourcesHint: "Adds same-site asset checks to the audit.",
      privateNetwork: "Allow private network sites",
      privateHint: "Only enable this for sites you control.",
      saveSettings: "Save settings",
      product: "Product",
      aboutIntro: "A focused, local tool for website health and technical SEO.",
      developed: "Developed by Crelyn Studio",
      aboutBody:
        "This open-source tool is developed by Crelyn Studio. Audits contact the target website; reports stay on this computer unless you export them.",
      website: "Website",
      contact: "Contact",
      complete: "Complete",
      truncated: "Partial",
      aborted: "Stopped",
      discovered: "Discovered",
      crawled: "Crawled",
      skipped: "Skipped",
      affected: "Affected pages",
      nextStep: "Suggested fix",
      evidence: "Technical evidence",
      ruleDetails: "Rule details",
      noFindings: "No issues found on the pages checked.",
      noMatching: "No findings match your search or filter.",
      saved: "Settings saved.",
      invalidUrl: "Enter a full website address, such as https://example.com.",
      invalidSettings: "Check the page and depth limits.",
      scanFailed:
        "The scan could not complete. Check the address and try again.",
      scanRunning: "A scan is already running.",
      serverError: "The local service is unavailable. Restart the application.",
      scanStopped: "Scan stopped. Partial results may be available.",
      partialWarning:
        "This scan did not cover every page. Review the scope before acting on it.",
      staticOnly:
        "Static HTML only. Sign-in pages and JavaScript-rendered content are not checked.",
      remaining: (n) => `${n} more affected pages`,
      moreSkipped: (n) => `${n} more skipped checks`,
      instances: (n) => `${n} ${n === 1 ? "instance" : "instances"}`,
      progress: (c, d) => `${c} checked / ${d} discovered`,
      count: (n) => `${n} findings`,
      scopePages: "Page limit",
      scopeDepth: "Depth limit",
      scopeResources: "Resource checks",
      enabled: "Enabled",
      disabled: "Disabled",
      scanStatus: "Scan status",
      limitations: "Limitations",
      skippedChecks: "Skipped checks",
      noneSkipped: "No checks were skipped.",
      noIssuesPage: "No issues on this page.",
      closeTitle: "Close local app",
      closeIntro:
        "Stops the local service. Download the current report first if you want to keep it.",
      closeApp: "Close app",
      appClosed: "Local app closed. Start it again to run another audit.",
      mainNavigation: "Main navigation",
      workspaceNavigation: "Workspace navigation",
      severityFilter: "Filter findings by severity",
      privateBlocked:
        "Private network access is blocked. Enable it in Settings only for a site you control.",
    },
    tr: {
      skip: "İçeriğe geç",
      workspace: "Çalışma alanı",
      overview: "Genel bakış",
      findings: "Bulgular",
      pages: "Sayfalar",
      reports: "Raporlar",
      settings: "Ayarlar",
      about: "Hakkında",
      localNote: "Bu bilgisayarda çalışır. Hesap gerekmez.",
      local: "Yerel çalışma alanı",
      overviewLabel: "Web sitesi analizi",
      overviewTitle: "Siteni net biçimde gör.",
      overviewIntro:
        "Yerel bir denetim başlat, teknik sonuçları odaklı bir iş listesine dönüştür.",
      scanTitle: "Yeni denetim başlat",
      scanIntro:
        "Web sitesi adresini gir. Yalnızca bu sitedeki sayfalar kontrol edilir.",
      siteUrl: "Web sitesi adresi",
      runAudit: "Taramayı başlat",
      scanHint: "Kayıtlı tarama ayarların kullanılır",
      editSettings: "Ayarları düzenle",
      scanning: "Site taranıyor",
      stopScan: "Taramayı durdur",
      emptyTitle: "İlk denetimine buradan başla",
      emptyIntro:
        "Sayfa kapsamını, sorun dağılımını ve çözüm önerilerini görmek için tarama yap. Yerel uygulamayı kapattıktan sonra saklamak istediğin raporu indir.",
      latestAudit: "Son denetim",
      pagesChecked: "Kontrol edilen sayfa",
      errors: "Hatalar",
      warnings: "Uyarılar",
      information: "Bilgi",
      distribution: "Sorun dağılımı",
      distributionIntro: "Taranan sayfalardaki bulgular",
      coverage: "Sayfa kapsamı",
      coverageIntro: "Kontrol edilen / keşfedilen",
      viewCoverage: "Tarama kapsamını gör",
      priorityFindings: "Öncelikli bulgular",
      priorityIntro:
        "Aynı sorunlar, nedeni tek seferde düzeltebilmen için gruplanır",
      viewAll: "Tümünü gör",
      auditResults: "Denetim sonuçları",
      findingsIntro: "Kanıtı, etkilenen sayfaları ve önerilen adımı incele.",
      noAudit: "Henüz denetim yok",
      runFirst: "Bu alanı doldurmak için Genel bakıştan tarama başlat.",
      goOverview: "Genel bakışa git",
      searchFindings: "Sorun veya URL ara",
      allFindings: "Tüm bulgular",
      pagesIntro: "Kontrol edilen sayfaları ve sorunların nerede olduğunu gör.",
      pageIssueCounts: "Sayfalara göre sorunlar",
      pageIssueIntro: "Çubuklar her sayfadaki bulgu sayısını gösterir",
      page: "Sayfa",
      httpStatus: "HTTP durumu",
      issues: "Sorunlar",
      reportsIntro: "Geçerli denetimi indir ve taramanın kapsamını incele.",
      readableReport: "Okunabilir rapor",
      readableIntro:
        "Bulguları, kanıtları ve kapsamı içeren HTML dosyası. Uygulama olmadan açılır.",
      downloadHtml: "HTML indir",
      dataReport: "Yapılandırılmış veri",
      dataIntro: "Kendi analizlerin veya arşivin için JSON dosyası.",
      downloadJson: "JSON indir",
      scanScope: "Tarama kapsamı ve sınırlar",
      preferences: "Tercihler",
      settingsIntro:
        "Gelecek denetimlerin nasıl çalışacağını seç. Değişiklikler bu cihazda saklanır.",
      interface: "Arayüz",
      interfaceIntro: "Uygulama dilini seç.",
      language: "Dil",
      scanDefaults: "Tarama varsayılanları",
      scanDefaultsIntro:
        "Bu sınırlar bir sonraki taramaya uygulanır. Artırmak taramayı uzatır.",
      maxPages: "En fazla sayfa",
      maxPagesHint: "1–1000 sayfa",
      maxDepth: "Bağlantı derinliği",
      maxDepthHint: "0–10 seviye",
      resources: "Görsel, betik ve stil dosyalarını kontrol et",
      resourcesHint: "Aynı sitedeki dosyaları da taramaya ekler.",
      privateNetwork: "Özel ağ sitelerine izin ver",
      privateHint: "Yalnızca kontrol ettiğin siteler için aç.",
      saveSettings: "Ayarları kaydet",
      product: "Ürün",
      aboutIntro: "Site sağlığı ve teknik SEO için yerel bir araç.",
      developed: "Crelyn Studio tarafından geliştirildi",
      aboutBody:
        "Bu açık kaynak araç Crelyn Studio tarafından geliştirilmiştir. Denetim hedef siteye bağlanır; dışa aktarmadıkça raporlar bu bilgisayarda kalır.",
      website: "Web sitesi",
      contact: "İletişim",
      complete: "Tamamlandı",
      truncated: "Kısmi",
      aborted: "Durduruldu",
      discovered: "Keşfedilen",
      crawled: "Kontrol edilen",
      skipped: "Atlanan",
      affected: "Etkilenen sayfalar",
      nextStep: "Düzeltme önerisi",
      evidence: "Teknik kanıt",
      ruleDetails: "Kural ayrıntısı",
      noFindings: "Kontrol edilen sayfalarda sorun bulunmadı.",
      noMatching: "Arama veya filtreyle eşleşen bulgu yok.",
      saved: "Ayarlar kaydedildi.",
      invalidUrl: "https://example.com gibi tam bir web sitesi adresi gir.",
      invalidSettings: "Sayfa ve derinlik sınırlarını kontrol et.",
      scanFailed: "Tarama tamamlanamadı. Adresi kontrol edip yeniden dene.",
      scanRunning: "Bir tarama zaten çalışıyor.",
      serverError: "Yerel servis kullanılamıyor. Uygulamayı yeniden başlat.",
      scanStopped: "Tarama durduruldu. Kısmi sonuçlar bulunabilir.",
      partialWarning:
        "Bu tarama her sayfayı kapsamadı. Sonuçları kullanmadan önce kapsamı incele.",
      staticOnly:
        "Yalnızca statik HTML incelenir. Giriş gerektiren ve JavaScript ile oluşturulan içerik kontrol edilmez.",
      remaining: (n) => `${n} etkilenen sayfa daha`,
      moreSkipped: (n) => `${n} atlanan kontrol daha`,
      instances: (n) => `${n} örnek`,
      progress: (c, d) => `${c} kontrol edildi / ${d} keşfedildi`,
      count: (n) => `${n} bulgu`,
      scopePages: "Sayfa sınırı",
      scopeDepth: "Derinlik sınırı",
      scopeResources: "Dosya kontrolleri",
      enabled: "Açık",
      disabled: "Kapalı",
      scanStatus: "Tarama durumu",
      limitations: "Sınırlamalar",
      skippedChecks: "Atlanan kontroller",
      noneSkipped: "Atlanan kontrol yok.",
      noIssuesPage: "Bu sayfada sorun yok.",
      closeTitle: "Yerel uygulamayı kapat",
      closeIntro:
        "Yerel servisi durdurur. Saklamak istediğin geçerli raporu önce indir.",
      closeApp: "Uygulamayı kapat",
      appClosed: "Yerel uygulama kapandı. Yeni tarama için yeniden başlat.",
      mainNavigation: "Ana gezinme",
      workspaceNavigation: "Çalışma alanı gezinmesi",
      severityFilter: "Bulguları önem derecesine göre filtrele",
      privateBlocked:
        "Özel ağ erişimi engellendi. Yalnızca kontrol ettiğin bir site için Ayarlardan aç.",
    },
  };
  const $ = (id) => document.getElementById(id);
  const el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = String(text);
    if (cls) n.className = cls;
    return n;
  };
  const defaults = {
    lang: "en",
    maxPages: 100,
    maxDepth: 4,
    checkResources: false,
    allowPrivateNetwork: false,
  };
  let settings = defaults;
  try {
    const saved = JSON.parse(
      localStorage.getItem("website-seo-auditor-settings") || "null",
    );
    if (saved && typeof saved === "object")
      settings = { ...defaults, ...saved };
  } catch {
    /* Browser storage is optional. */
  }
  if (!["en", "tr"].includes(settings.lang)) settings.lang = "en";
  if (
    !Number.isInteger(settings.maxPages) ||
    settings.maxPages < 1 ||
    settings.maxPages > 1000
  )
    settings.maxPages = 100;
  if (
    !Number.isInteger(settings.maxDepth) ||
    settings.maxDepth < 0 ||
    settings.maxDepth > 10
  )
    settings.maxDepth = 4;
  settings.checkResources = settings.checkResources === true;
  settings.allowPrivateNetwork = settings.allowPrivateNetwork === true;
  let report = null,
    meta = null,
    busy = false;
  const t = (key) => words[settings.lang][key] ?? key;
  function show(page) {
    document
      .querySelectorAll("[data-page]")
      .forEach((v) => v.classList.toggle("active", v.dataset.page === page));
    document.querySelectorAll(".nav-item").forEach((v) => {
      v.classList.toggle("active", v.dataset.pageTarget === page);
      if (v.dataset.pageTarget)
        v.setAttribute(
          "aria-current",
          v.dataset.pageTarget === page ? "page" : "false",
        );
    });
    $("breadcrumb").textContent = t(page);
    window.scrollTo(0, 0);
  }
  function notice(message, success = false) {
    $("notice").textContent = message;
    $("notice").classList.toggle("success", success);
    $("notice").hidden = !message;
  }
  function issueGroups() {
    if (!report) return [];
    const map = new Map();
    for (const finding of report.findings.filter(
      (f) => f.result === "failed",
    )) {
      const key = `${finding.severity}:${finding.ruleId}`;
      if (!map.has(key))
        map.set(key, {
          severity: finding.severity,
          ruleId: finding.ruleId,
          findings: [],
        });
      map.get(key).findings.push(finding);
    }
    const order = { error: 0, warning: 1, info: 2 };
    return [...map.values()].sort(
      (a, b) =>
        order[a.severity] - order[b.severity] ||
        b.findings.length - a.findings.length ||
        a.ruleId.localeCompare(b.ruleId),
    );
  }
  function findingText(group) {
    return (
      meta?.catalog?.[settings.lang]?.[group.ruleId] ?? [
        group.findings[0].message,
        group.findings[0].recommendation,
      ]
    );
  }
  function translate() {
    document.documentElement.lang = settings.lang;
    document.querySelectorAll("[data-t]").forEach((n) => {
      n.textContent = t(n.dataset.t);
    });
    document.querySelectorAll("[data-placeholder]").forEach((n) => {
      n.placeholder = t(n.dataset.placeholder);
    });
    document
      .querySelector(".sidebar")
      .setAttribute("aria-label", t("mainNavigation"));
    document
      .querySelector(".main-nav")
      .setAttribute("aria-label", t("workspaceNavigation"));
    $("finding-search").setAttribute("aria-label", t("searchFindings"));
    $("severity-filter").setAttribute("aria-label", t("severityFilter"));
    $("setting-language").value = settings.lang;
    $("breadcrumb").textContent = t(
      document.querySelector(".view.active")?.dataset.page || "overview",
    );
    render();
  }
  function renderOverview(groups) {
    $("empty-overview").hidden = Boolean(report);
    $("dashboard").hidden = !report;
    if (!report) return;
    $("audited-site").textContent = new URL(report.target).hostname;
    $("audit-meta").textContent =
      `${new Date(report.finishedAt).toLocaleString(settings.lang === "tr" ? "tr-TR" : "en-US")}  ·  ${report.target}`;
    $("audit-status").textContent = t(report.status);
    $("audit-status").classList.toggle("partial", report.status !== "complete");
    $("metric-pages").textContent = report.summary.crawled;
    $("metric-errors").textContent = report.summary.errors;
    $("metric-warnings").textContent = report.summary.warnings;
    $("metric-info").textContent = report.summary.info;
    $("nav-finding-count").textContent = groups.length;
    $("nav-finding-count").hidden = !groups.length;
    const counts = ["error", "warning", "info"].map((severity) => ({
      severity,
      count: groups
        .filter((g) => g.severity === severity)
        .reduce((n, g) => n + g.findings.length, 0),
    }));
    const total = counts.reduce((n, v) => n + v.count, 0);
    $("total-findings").textContent = total;
    $("distribution-chart").replaceChildren(
      ...counts
        .filter((v) => v.count)
        .map((v) => {
          const bar = el("span", undefined, v.severity);
          bar.style.width = `${(v.count / total) * 100}%`;
          return bar;
        }),
    );
    $("distribution-legend").replaceChildren(
      ...counts.map((v) => {
        const item = el("span");
        item.append(
          el("i", undefined, v.severity),
          `${t(v.severity === "error" ? "errors" : v.severity === "warning" ? "warnings" : "information")} ${v.count}`,
        );
        return item;
      }),
    );
    const pct = report.summary.discovered
      ? Math.round((report.summary.crawled / report.summary.discovered) * 100)
      : 0;
    $("coverage-percent").textContent = `${pct}%`;
    $("coverage-fill").style.width = `${Math.min(100, pct)}%`;
    $("coverage-labels").replaceChildren(
      el("span", `${t("crawled")} ${report.summary.crawled}`),
      el("span", `${t("discovered")} ${report.summary.discovered}`),
    );
    const priority = groups.slice(0, 4).map((group) => {
      const row = el("div", undefined, "priority-row");
      row.append(el("span", undefined, `dot ${group.severity}`));
      const title = el("div");
      title.append(
        el("strong", findingText(group)[0]),
        el("small", group.ruleId),
      );
      row.append(title, el("span", t("instances")(group.findings.length)));
      return row;
    });
    $("priority-list").replaceChildren(
      ...(priority.length
        ? priority
        : [el("p", t("noFindings"), "empty-inline")]),
    );
  }
  function renderFindings(groups) {
    $("findings-empty").hidden = Boolean(report);
    $("findings-content").hidden = !report;
    if (!report) return;
    const query = $("finding-search").value.toLocaleLowerCase(settings.lang);
    const severity = $("severity-filter").value;
    const filtered = groups.filter(
      (g) =>
        (severity === "all" || g.severity === severity) &&
        (!query ||
          `${g.ruleId} ${findingText(g)[0]} ${g.findings.map((f) => f.url).join(" ")}`
            .toLocaleLowerCase(settings.lang)
            .includes(query)),
    );
    const cards = filtered.map((group) => {
      const [message, fix] = findingText(group);
      const details = el("details", undefined, "finding");
      const summary = el("summary");
      const heading = el("span", message, "finding-title");
      heading.append(el("small", group.ruleId));
      summary.append(
        el("span", undefined, `severity-dot ${group.severity}`),
        heading,
        el("span", t("instances")(group.findings.length), "finding-count"),
      );
      const body = el("div", undefined, "finding-body");
      body.append(
        el("h3", t("nextStep")),
        el("p", fix),
        el("h3", t("affected")),
      );
      const urls = el("ul");
      for (const finding of group.findings.slice(0, 50)) {
        const li = el("li", finding.sourceUrl || finding.url);
        if (finding.targetUrl) li.append(el("span", ` → ${finding.targetUrl}`));
        urls.append(li);
      }
      if (group.findings.length > 50)
        urls.append(el("li", t("remaining")(group.findings.length - 50)));
      body.append(urls);
      const evidence = el("details");
      evidence.append(
        el("summary", t("evidence")),
        el(
          "pre",
          JSON.stringify(
            group.findings.slice(0, 50).map((f) => ({
              url: f.url,
              observed: f.observed,
              expected: f.expected,
            })),
            null,
            2,
          ),
        ),
      );
      body.append(evidence);
      if (/^[A-Z0-9_]+$/.test(group.ruleId)) {
        const link = el("a", t("ruleDetails"));
        link.href = `https://github.com/crelynstudio/crelyn-studio-website-seo-auditor/blob/main/docs/rules.md#${group.ruleId.toLowerCase()}`;
        link.target = "_blank";
        link.rel = "noopener";
        body.append(link);
      }
      details.append(summary, body);
      return details;
    });
    $("finding-list").replaceChildren(...cards);
    $("finding-none").textContent = groups.length
      ? t("noMatching")
      : t("noFindings");
    $("finding-none").hidden = cards.length > 0;
  }
  function renderPages() {
    $("pages-empty").hidden = Boolean(report);
    $("pages-content").hidden = !report;
    if (!report) return;
    const pages = report.pages.map((page) => ({
      page,
      count: report.findings.filter(
        (f) =>
          f.result === "failed" &&
          (f.url === page.url || f.sourceUrl === page.url),
      ).length,
    }));
    const max = Math.max(1, ...pages.map((p) => p.count));
    const chart = pages
      .toSorted((a, b) => b.count - a.count)
      .slice(0, 8)
      .map(({ page, count }) => {
        const row = el("div", undefined, "page-bar-row");
        const track = el("div", undefined, "page-bar");
        const bar = el("span");
        bar.style.width = `${(count / max) * 100}%`;
        track.append(bar);
        row.append(
          el("span", new URL(page.url).pathname || "/"),
          track,
          el("strong", count),
        );
        row.title = page.url;
        return row;
      });
    $("page-chart").replaceChildren(...chart);
    $("page-rows").replaceChildren(
      ...pages.map(({ page, count }) => {
        const row = el("tr");
        const url = el("td", page.url);
        const status = el("td", page.status ?? page.error ?? "—");
        const issues = el("td");
        issues.append(el("span", count, "count-pill"));
        row.append(url, status, issues);
        return row;
      }),
    );
  }
  function renderReports() {
    $("reports-empty").hidden = Boolean(report);
    $("reports-content").hidden = !report;
    if (!report) return;
    const scope = report.scope || report.config;
    const grid = el("div", undefined, "scope-grid");
    for (const [key, value] of [
      ["scopePages", scope.maxPages],
      ["scopeDepth", scope.maxDepth],
      ["scopeResources", t(scope.checkResources ? "enabled" : "disabled")],
    ]) {
      const cell = el("div");
      cell.append(el("strong", value), el("span", t(key)));
      grid.append(cell);
    }
    const details = $("scope-details");
    details.replaceChildren(
      grid,
      el("h3", t("scanStatus")),
      el("p", t(report.status)),
      el("p", t("staticOnly")),
    );
    if (report.status !== "complete")
      details.append(el("p", t("partialWarning")));
    details.append(el("h3", t("skippedChecks")));
    const skipped = el("ul");
    for (const item of report.skippedChecks.slice(0, 30))
      skipped.append(el("li", `${item.reason} · ${item.url}`));
    if (report.skippedChecks.length > 30)
      skipped.append(
        el("li", t("moreSkipped")(report.skippedChecks.length - 30)),
      );
    if (!report.skippedChecks.length)
      skipped.append(el("li", t("noneSkipped")));
    details.append(skipped);
    if (meta?.limitations?.[settings.lang]) {
      const limits = el("ul");
      for (const text of meta.limitations[settings.lang])
        limits.append(el("li", text));
      details.append(el("h3", t("limitations")), limits);
    }
  }
  function render() {
    const groups = issueGroups();
    renderOverview(groups);
    renderFindings(groups);
    renderPages();
    renderReports();
  }
  function fillSettings() {
    $("setting-language").value = settings.lang;
    $("setting-pages").value = settings.maxPages;
    $("setting-depth").value = settings.maxDepth;
    $("setting-resources").checked = settings.checkResources;
    $("setting-private").checked = settings.allowPrivateNetwork;
  }
  async function api(path, options) {
    const response = await fetch(path, options);
    const value = await response.json();
    if (!response.ok) throw new Error(value.code || "SERVER_ERROR");
    return value;
  }
  function reportFileName(extension) {
    const host = new URL(report.target).hostname.replace(/[^a-z0-9.-]/gi, "-").slice(0, 100);
    return `Website-SEO-Auditor-${host}-${report.startedAt.slice(0, 10)}.${extension}`;
  }
  async function poll() {
    while (busy) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      let state;
      try {
        state = await api("/api/state");
      } catch {
        notice(t("serverError"));
        break;
      }
      $("progress-count").textContent = t("progress")(
        state.progress.crawled,
        state.progress.discovered,
      );
      if (!state.active) {
        if (state.ready) {
          try {
            report = await api("/api/report");
            render();
            show("overview");
            if (
              report.summary.crawled === 0 &&
              report.skippedChecks.some((v) => v.reason === "NETWORK_PRIVATE")
            )
              notice(t("privateBlocked"));
          } catch {
            notice(t("scanFailed"));
          }
        } else notice(state.error ? t("scanFailed") : t("scanStopped"));
        break;
      }
    }
    busy = false;
    $("progress").hidden = true;
    $("scan-button").disabled = false;
  }
  document
    .querySelectorAll("[data-page-target]")
    .forEach((button) =>
      button.addEventListener("click", () => show(button.dataset.pageTarget)),
    );
  $("scan-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;
    const url = $("site-url").value.trim();
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      notice(t("invalidUrl"));
      $("site-url").focus();
      return;
    }
    notice("");
    report = null;
    render();
    busy = true;
    $("progress").hidden = false;
    $("scan-button").disabled = true;
    $("progress-count").textContent = t("progress")(0, 0);
    try {
      await api("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, ...settings }),
      });
      void poll();
    } catch (error) {
      busy = false;
      $("progress").hidden = true;
      $("scan-button").disabled = false;
      notice(
        error.message === "SCAN_RUNNING"
          ? t("scanRunning")
          : error.message.startsWith("CONFIG_") ||
              error.message.startsWith("URL_")
            ? t("invalidUrl")
            : t("serverError"),
      );
    }
  });
  $("cancel").addEventListener("click", async () => {
    try {
      await api("/api/cancel", { method: "POST" });
    } catch {
      notice(t("serverError"));
    }
  });
  $("severity-filter").addEventListener("change", render);
  $("finding-search").addEventListener("input", render);
  $("settings-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const maxPages = Number($("setting-pages").value),
      maxDepth = Number($("setting-depth").value);
    if (
      !Number.isInteger(maxPages) ||
      maxPages < 1 ||
      maxPages > 1000 ||
      !Number.isInteger(maxDepth) ||
      maxDepth < 0 ||
      maxDepth > 10
    ) {
      $("settings-saved").textContent = t("invalidSettings");
      return;
    }
    settings = {
      lang: $("setting-language").value === "tr" ? "tr" : "en",
      maxPages,
      maxDepth,
      checkResources: $("setting-resources").checked,
      allowPrivateNetwork: $("setting-private").checked,
    };
    try {
      localStorage.setItem(
        "website-seo-auditor-settings",
        JSON.stringify(settings),
      );
    } catch {
      /* Browser storage is optional. */
    }
    translate();
    $("settings-saved").textContent = t("saved");
  });
  $("download-html").addEventListener("click", () => {
    if (!report) return;
    const link = document.createElement("a");
    link.href = "/api/report.html";
    link.download = reportFileName("html");
    document.body.append(link);
    link.click();
    link.remove();
  });
  $("download-json").addEventListener("click", () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2) + "\n"], {
      type: "application/json",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = reportFileName("json");
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  });
  $("close-app").addEventListener("click", async () => {
    try {
      await api("/api/quit", { method: "POST" });
      $("close-message").textContent = t("appClosed");
      $("close-app").disabled = true;
      $("scan-button").disabled = true;
    } catch (error) {
      $("close-message").textContent =
        error.message === "SCAN_RUNNING" ? t("scanRunning") : t("serverError");
    }
  });
  fillSettings();
  translate();
  void (async () => {
    try {
      meta = await api("/api/meta");
      $("app-version").textContent = `${meta.product} · v${meta.version}`;
      const state = await api("/api/state");
      if (state.ready) report = await api("/api/report");
      if (state.active) {
        busy = true;
        $("progress").hidden = false;
        $("scan-button").disabled = true;
        void poll();
      }
      render();
    } catch {
      notice(t("serverError"));
    }
  })();
})();
