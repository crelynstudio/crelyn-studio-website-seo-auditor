# Implementation status / Geliştirme durumu

**2026-10-11 — v0.1.0-preview.1 — development preview / geliştirme önizlemesi.** User review and publication decision remain pending; no GitHub/npm publication, login, release upload or final ZIP.

## Delivered / Geliştirilenler

- TypeScript/Node CLI, strict configuration, EN/TR help, about, findings and reports.
- Same-origin crawler: DNS/IP pinning, private-network default denial, redirect and resource limits, robots, sitemap indexes, HTML/base/link discovery, URL deduplication, abort and bounded retries.
- All twelve requested HTTP/LINK/SEO/IDX/HEALTH checks, plus explicit network/analyzer failures; evidence and contextual fixes.
- Terminal, schema-versioned JSON with [JSON Schema](report.schema.json), offline standalone escaped HTML; developer logo/contact information.
- Real locally generated [HTML](examples/demo-tr.html), [JSON](examples/demo-tr.json), [terminal transcript](examples/terminal-tr.txt), desktop/mobile screenshots. The example content is synthetic; the outputs are produced by the real CLI.
- English/Turkish documentation, MIT code license with separate trademark note, contribution/security/conduct documents, architecture/rules/security/roadmap, pinned read-only GitHub Actions matrix for Node 22/24 on Windows/Linux/macOS.

Türkçe: CLI, güvenli ağ/tarama, istenen 12 kural, EN/TR terminal/JSON/HTML raporları, gerçek yerel örnekler ve belgeler geliştirildi. Ürün önizlemedir; kullanıcı denemesi ve yayın kararı henüz alınmadı.

## Verification / Doğrulama

Actual environment: Windows PowerShell, Node **24.19.0**, npm **11.17.0**. Tests do not crawl third-party sites. All commands below were run; no skipped tests. A clean source copy was installed with `npm ci --ignore-scripts` inside the workspace and tested separately. Production package was unpacked into another directory, installed with production dependencies only, and used to generate HTML/JSON with its own copied logo.

| Check / Kontrol | Result / Sonuç |
| --- | --- |
| `npm ci --ignore-scripts` in clean source | Passed / Geçti |
| `npm run typecheck` | Passed / Geçti |
| `npm run lint` | Passed / Geçti |
| `npm test` | 20 passed; 0 failed/skipped / 20 geçti; 0 hata/atlama |
| `npm run build` | Passed / Geçti |
| `npm pack --dry-run` | Passed / Geçti |
| Actual internal `npm pack`, unpack, production install | Passed; CLI version and local HTML/JSON work / Geçti |
| `npm audit` | 0 reported vulnerabilities at check time / Denetim anında 0 bildirilen açık |
| CLI JSON schema + negative schema test | Passed / Geçti |
| CLI exits 0/1/2, EN/TR help, about, version | Passed / Geçti |
| Generated HTML file in offline Chrome | Passed; 0 external requests, 0 page errors / Geçti |
| Desktop 1365×900 and mobile 390×844 | Real screenshots, no mobile horizontal overflow / Gerçek görüntüler, yatay taşma yok |
| Keyboard evidence disclosure, logo load | Passed / Geçti |
| Source scope, secret-pattern and whitespace review | No matched token/TLS-bypass/skip patterns or whitespace errors / Eşleşme ve boşluk hatası yok |

Coverage includes URL normalization, private/reserved/mapped IPs, all-answer DNS checks, changing DNS answers, pinned local socket lookup, out-of-order DNS rate limiting, robots group/percent/wildcard rules and excessive-rule denial, missing/unreachable robots, nested sitemap/unsafe XML, redirect chains/loops/limits/origin escape/robots barriers, duplicate fetch prevention, status/source-target findings, page/depth/concurrency/rate budgets, timeout, 429 Retry-After, compressed/expanded byte limits, abort, Turkish characters, canonical/noindex, HTML escaping, translations and built CLI file output. This is a test inventory, not a claim of exhaustive coverage.

Türkçe: Kontroller gerçekten çalıştırıldı. Windows/Node 24 üzerinde 20 test atlamasız geçti. Temiz kaynak kopyası ve ayrı açılmış npm paketi denendi. Çevrimdışı Chrome'da rapor, klavye kanıt alanı, logo ve mobil taşma kontrol edildi. Test kapsamı tüm olası saldırı/standart girdilerini tüketmez.

## Remaining checks and limits / Kalan kontroller ve sınırlar

- User has not yet tried the preview. No final product/release approval is assumed.
- Linux/macOS and Node 22 are configured in CI but have not actually run here. Remote GitHub Actions has not run.
- No real public website crawl, independent penetration test, hostile-network appliance test, proxy support or live DNS-rebinding attack test. Controlled resolver fixtures are used instead.
- AbortSignal and built CLI exit semantics are tested. A physical Ctrl+C in an interactive Windows terminal remains a manual check.
- Real report screenshots exist; an actual terminal-window screenshot was not captured because native screen access is unavailable. The real command transcript is retained instead.
- Legacy non-UTF-8 HTML, JavaScript DOM, sessions/auth, external origins and full security/accessibility audits are out of scope. Scoped X-Robots-Tag interpretation remains conservative observation.
- Robots redirects stay same-origin rather than following cross-authority redirects. Robots exclusions/depth/page limits conservatively produce partial scans and exit 1.
- Report files may contain target query strings/text/headers; do not treat them as automatically safe to publish. No target data are uploaded to Crelyn Studio.
- The package name is a proposal, not verified npm ownership. No stable 1.0.0 claim. A transitive whatwg-encoding deprecation notice remains; audit reports no known vulnerability at check time.

Türkçe: Kullanıcı denemesi, gerçek Linux/macOS/Node 22 çalıştırması, uzak CI, bağımsız güvenlik denetimi, canlı genel site taraması ve fiziksel Windows Ctrl+C doğrulanmadı. Terminal ekran görüntüsü yerine gerçek çıktı var. Eski karakter kodlamaları ve JS/oturum/dış köken kapsam dışı. Özel raporları yayımlamayın. npm adı ve sahipliği doğrulanmadı; sürüm kararlı değildir.

## Review when back / Döndüğünüzde deneme

1. Open `docs/examples/demo-tr.html` locally, inspect the six findings and expand Evidence / Kanıt with the keyboard.
2. Start `node examples/demo-server.mjs`, then run the README local commands in a second terminal. Expected example: three pages, two errors, two warnings, two information findings.
3. Compare `--lang en` and `--lang tr`, check JSON is machine-readable and HTML opens without internet.
4. Test a site you control with a small page budget, confirm partial coverage is clearly reported, and try Ctrl+C.
5. Review the [publication draft](publishing.md) before any later release decision.

Türkçe: Önce kayıtlı HTML raporunu açın. Ardından README'deki örnek sunucu/CLI komutlarını deneyin; 3 sayfa ve 2 hata/2 uyarı/2 bilgi beklenir. İki dili, JSON'u, çevrimdışı raporu ve kendi sitenizde dar bütçe/Ctrl+C davranışını inceleyin. Yayın taslağı karar verilmesi için hazırlanmıştır; yayın yapılmadı.

Working dependencies and `dist/` remain locally for convenient preview use and are ignored by Git. Temporary verification copies/tarballs are removed after checks. Before manual publication, follow the explicit include/exclude list in publishing.md; do not drag the entire local working folder into GitHub.

Yerel önizlemeyi kolay çalıştırmak için node_modules ve dist tutulur; Git bunları dışlar. Geçici doğrulama kopyaları/arşivleri temizlenir. Elle yayında publishing.md listesini kullanın; yerel klasörün tamamını sürüklemeyin.
