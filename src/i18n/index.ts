import type { Lang } from '../core/types.js';
export const catalog = {
  en: {
    HTTP_001: ['HTTP request failed.', 'Restore the resource or update links to a working URL.'],
    HTTP_002: ['Redirect chain needs attention.', 'Link directly to the final URL and remove redirect loops.'],
    LINK_001: ['An internal link leads to a failed resource.', 'Fix the target resource or update the source link.'],
    SEO_001: ['Page title is empty or missing.', 'Add a descriptive, page-specific title.'],
    SEO_002: ['Multiple pages share a title.', 'Use page-specific titles where the content differs.'],
    SEO_003: ['Meta description is empty or missing.', 'Consider a useful summary for search snippets; this is not a ranking guarantee.'],
    SEO_004: ['No H1 heading found.', 'Consider a clear main heading that describes the page.'],
    SEO_005: ['Canonical URL cannot be resolved safely.', 'Use a valid HTTP(S) canonical URL without embedded credentials.'],
    SEO_006: ['Canonical declarations conflict.', 'Keep a consistent canonical destination.'],
    IDX_001: ['The page declares noindex.', 'Confirm this matches your indexing intent.'],
    IDX_002: ['Sitemap is missing or unreadable.', 'Check the sitemap response and XML; a sitemap is optional.'],
    HEALTH_001: ['Some passive HTTPS security headers are absent.', 'Review CSP, HSTS and nosniff in context. Missing headers are not proof of a vulnerability.'],
    NETWORK_001: ['A resource could not be checked.', 'Review the recorded error code and network/robots policy.'],
    ANALYZER_001: ['A check could not run.', 'Review the input and report this analyzer failure.'],
    summary: 'Scan summary', complete: 'Complete', truncated: 'Partial', aborted: 'Aborted',
    error: 'Error', warning: 'Warning', info: 'Information', evidence: 'Evidence', fix: 'Suggested fix',
    pages: 'Pages', skipped: 'Skipped', findings: 'Findings', limitations: 'Scope and limitations',
    developer: 'Developed by Crelyn Studio', about: 'About the developer',
    running: 'Scanning', discovered: 'Discovered', duration: 'Duration', all: 'All severities',
    invalid: 'Invalid command or URL. Run --help for options.', fatal: 'The scan could not finish. Check the error code and target.',
    help: 'Usage: sitemercek [audit] <url> [options]\nAudit website health and technical SEO. Static HTTP only.\n\n--lang en|tr                 Report language (default en)\n--max-pages 1..1000          Request/page budget (default 100)\n--max-depth 0..10            Link depth (default 4)\n--concurrency 1..2           Maximum simultaneous requests (default 2)\n--timeout 100..60000         Per-request deadline in milliseconds (default 10000)\n--format terminal,html,json  Comma-separated outputs (default terminal)\n--output <directory>        Save HTML/JSON here (default ./reports); never overwrite\n--fail-on error|warning|none CI threshold (default none); partial scans exit 1\n--allow-private-network     Explicitly permit local/private targets\n--help, --version, --about\n\nJSON alone without --output writes JSON to stdout. Progress uses stderr.\nExit: 0 complete, 1 invalid/partial/runtime failure, 2 complete with threshold exceeded.'
  },
  tr: {
    HTTP_001: ['HTTP isteği başarısız.', 'Kaynağı düzeltin veya bağlantıyı çalışan bir adrese yöneltin.'],
    HTTP_002: ['Yönlendirme zinciri incelenmeli.', 'Son adrese doğrudan bağlantı verin ve yönlendirme döngülerini kaldırın.'],
    LINK_001: ['Dahili bağlantı başarısız bir kaynağa gidiyor.', 'Hedef kaynağı düzeltin veya kaynak sayfadaki bağlantıyı güncelleyin.'],
    SEO_001: ['Sayfa başlığı boş veya eksik.', 'Sayfayı açıklayan, sayfaya özgü bir başlık ekleyin.'],
    SEO_002: ['Birden fazla sayfa aynı başlığı kullanıyor.', 'İçerikleri farklı olan sayfalara özgü başlıklar kullanın.'],
    SEO_003: ['Meta açıklaması boş veya eksik.', 'Arama özeti için yararlı bir açıklama düşünün; bu bir sıralama garantisi değildir.'],
    SEO_004: ['H1 başlığı bulunamadı.', 'Sayfayı tanımlayan açık bir ana başlık eklemeyi değerlendirin.'],
    SEO_005: ['Canonical adresi güvenli biçimde çözümlenemedi.', 'Kimlik bilgisi içermeyen, geçerli bir HTTP(S) canonical adresi kullanın.'],
    SEO_006: ['Canonical bildirimleri çelişiyor.', 'Tutarlı bir canonical hedefi kullanın.'],
    IDX_001: ['Sayfa noindex bildiriyor.', 'Bu tercihin indeksleme amacınızla uyumlu olduğunu doğrulayın.'],
    IDX_002: ['Site haritası bulunamadı veya okunamadı.', 'Yanıtı ve XML içeriğini kontrol edin; site haritası isteğe bağlıdır.'],
    HEALTH_001: ['Bazı pasif HTTPS güvenlik başlıkları eksik.', 'CSP, HSTS ve nosniff başlıklarını bağlama göre inceleyin. Eksiklik güvenlik açığı kanıtı değildir.'],
    NETWORK_001: ['Bir kaynak kontrol edilemedi.', 'Kaydedilen hata kodunu ve ağ/robots politikasını inceleyin.'],
    ANALYZER_001: ['Bir kontrol çalıştırılamadı.', 'Girdiyi inceleyin ve analiz hatasını bildirin.'],
    summary: 'Tarama özeti', complete: 'Tamamlandı', truncated: 'Kısmi', aborted: 'Durduruldu',
    error: 'Hata', warning: 'Uyarı', info: 'Bilgi', evidence: 'Kanıt', fix: 'Düzeltme önerisi',
    pages: 'Sayfalar', skipped: 'Atlanan', findings: 'Bulgular', limitations: 'Kapsam ve sınırlamalar',
    developer: 'Crelyn Studio tarafından geliştirildi', about: 'Geliştirici hakkında',
    running: 'Taranıyor', discovered: 'Keşfedilen', duration: 'Süre', all: 'Tüm seviyeler',
    invalid: 'Komut veya adres geçersiz. Seçenekler için --help kullanın.', fatal: 'Tarama bitirilemedi. Hata kodunu ve hedefi kontrol edin.',
    help: 'Kullanım: sitemercek [audit] <adres> [seçenekler]\nSite sağlığı ve teknik SEO denetimi. Yalnızca statik HTTP.\n\n--lang en|tr                 Rapor dili (varsayılan en)\n--max-pages 1..1000          İstek/sayfa bütçesi (varsayılan 100)\n--max-depth 0..10            Bağlantı derinliği (varsayılan 4)\n--concurrency 1..2           Eşzamanlı istek sınırı (varsayılan 2)\n--timeout 100..60000         İstek süresi, milisaniye (varsayılan 10000)\n--format terminal,html,json  Virgülle ayrılan çıktılar (varsayılan terminal)\n--output <klasör>           HTML/JSON kayıt yeri (varsayılan ./reports); üzerine yazılmaz\n--fail-on error|warning|none Kalite eşiği (varsayılan none); kısmi taramada kod 1\n--allow-private-network     Yerel/özel ağ hedeflerine açıkça izin ver\n--help, --version, --about\n\nTek JSON biçimi, --output yoksa standart çıktıya yazılır. İlerleme stderr kullanır.\nÇıkış: 0 tamamlandı, 1 geçersiz/kısmi/çalıştırma hatası, 2 tamamlandı ve eşik aşıldı.'
  }
} as const;
export function messages(lang: Lang) { return catalog[lang]; }
export const limitations = (lang: Lang): string[] => lang === 'tr' ? [
  'Yalnızca statik HTTP; JavaScript sonrası DOM, oturum ve erişilebilirlik denetlenmez.',
  'Harici kökenler, formlar ve kimlik doğrulama izlenmez. Genel sağlık puanı verilmez.',
  'Robots tarafından engellenen adresler ve bütçe sınırları raporda belirtilir. Bulgular taranan kapsamla sınırlıdır.'
] : [
  'Static HTTP only; no JavaScript DOM, sessions or accessibility audit.',
  'External origins, forms and authentication are not followed. No overall health score.',
  'Robots exclusions and budget limits are recorded. Findings apply only to the scanned scope.'
];
