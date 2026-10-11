# Architecture / Mimari

## English

CLI → validated ScanConfig → SafeHttp → crawler/parsers → analyzers → common Finding → terminal/JSON/HTML.

- `src/cli`: argv, signals, stderr progress, exit codes; no raw stack traces.
- `src/config`: bounded defaults and strict argument validation.
- `src/core`: typed ScanConfig, CrawlPage, DiscoveredLink, CrawlSummary, Finding, ScanReport.
- `src/network`: standard URL normalization, IP classification, all-answer DNS validation, pinned direct HTTP(S), rate/concurrency/byte/redirect budgets. HTTP results and failures are memoized, including final redirect resources.
- `src/parsers`: HTML via Cheerio, bounded XML via fast-xml-parser, robots group merging and literal wildcard matching. No analyzer performs network requests.
- `src/crawler`: robots prerequisite, sitemap traversal, bounded breadth-first link queue, final-URL deduplication, explicit skipped/partial records.
- `src/analyzers`: independent checks gathered into one module to keep v0.1 small; per-page failures produce ANALYZER_001 rather than silently disappearing. Cross-page titles and links run after crawl.
- `src/i18n`: EN/TR catalogs; technical IDs remain language-independent.
- `src/reports`: deterministic sort, terminal sanitization, UTF-8 JSON, escaped single-file HTML with CSP disabling scripts, exclusive output creation.

Findings have `ruleId`, `severity`, `result`, `confidence`, `url`, optional source/target, `observed`, `expected`, `messageKey`, `params`, localized text/recommendation and a local rule reference. v0.1 emits failed findings only; skips live in `skippedChecks`, and absence is never a universal pass. Reports include schemaVersion `1`, version, timestamps, status, full effective configuration, coverage and limitations. Timing/filename randomness naturally varies; content ordering is deterministic.

Add a rule by extending RuleId and both catalogs, implementing evidence-based logic in the analyzer without I/O, documenting it in rules.md, and adding local tests. Prefer a skipped/uncertain result to an unsupported claim. Do not change severity casually because CI exit semantics depend on it.

Technical decisions: Node standard-library networking is used instead of fetch so DNS can be pinned without a proxy path. Three production dependencies provide HTML parsing, XML validation/parsing and IP ranges. No runtime cloud services. XML DTD/entity declarations are rejected before parsing; built-in XML escapes are decoded. Preview version is intentionally not 1.0.0. Proposed repository name: `crelyn-studio-sitemercek`; the Git root is this `repo/` directory, not its parent.

## Türkçe

Veri akışı: CLI → doğrulanmış yapılandırma → SafeHttp → tarayıcı/ayrıştırıcılar → analiz → ortak bulgu → rapor.

Komut, yapılandırma, tipler, ağ, ayrıştırma, tarama, analiz, dil ve raporlama sorumlulukları ayrı dizinlerdedir. İlk sürümde kurallar tek analiz modülünde tutulur; sırf dosya sayısı için ayrı sınıf açılmaz. Analizörler ağ isteği yapamaz. Sayfa başına kural hatası ANALYZER_001 olur. Başlık ve bağlantı karşılaştırmaları tarama sonunda yapılır.

Bulgu; kararlı kimlik, önem, sonuç, kesinlik, URL, gerektiğinde kaynak/hedef, gözlenen/beklenen kanıt, mesaj anahtarı, parametre, çevrilmiş açıklama/öneri ve yerel kural bağlantısı taşır. Bu sürüm yalnızca başarısız bulgu üretir; atlamalar `skippedChecks` içindedir. Bulgu yokluğu genel başarı değildir. Raporda şema `1`, sürüm, tarihler, durum, etkin ayarlar, kapsam ve sınırlar bulunur. İçerik sıralıdır; süre ve dosya adı doğal olarak değişir.

Yeni kural için RuleId ve iki dil kataloğunu genişletin, ağ erişimi olmadan analiz mantığı ekleyin, kural belgesini ve yerel testleri güncelleyin. Kanıtsız sonuç yerine belirsizliği belirtin; önem derecesi değişiklikleri CI çıkışını etkiler.

DNS sabitlemek için Node'un doğrudan HTTP(S) katmanı seçildi. Üç çalışma bağımlılığı HTML, XML ve IP ayrıştırmayı sağlar. Bulut servisi yoktur. XML DTD/entity bildirimleri reddedilir, standart XML kaçışları çözülür. Sürüm bilerek önizlemedir. Önerilen GitHub depo adı `crelyn-studio-sitemercek`; depo kökü üst çalışma alanı değil `repo/` içeriğidir.
