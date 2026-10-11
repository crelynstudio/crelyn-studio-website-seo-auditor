# Security model / Güvenlik modeli

## English

This preview is a bounded passive crawler, not a penetration test. Audit only sites you are authorized to access. The host machine can still reach its network; a process with filesystem/network access is not a sandbox.

Trust boundaries: CLI input → standard URL API; DNS answers → IP allow policy; redirect Location → origin/URL/DNS validation again; response bytes → compressed/decompressed limits; HTML/XML → bounded parsers; page-controlled data → escaped terminal/HTML output. Unknown failures make coverage incomplete.

HTTP(S) only, no URL credentials. Fragments are removed; query ordering, path case and trailing slash remain intact. Default private/reserved/loopback/link-local/multicast/IPv4-mapped-private addresses are denied. Every DNS answer must pass; one address is pinned into Node's lookup callback. Each new redirect resource resolves and validates anew. Direct sockets ignore environment proxy settings; no proxy assurance is silently assumed. HTTPS keeps normal certificate validation and original hostname/SNI. There is no cookie jar or auth credential forwarding.

`--allow-private-network` permits otherwise blocked IPs only; it retains origin, robots, TLS and resource policies. Only use with trusted sites. Strict same-origin includes scheme and port; even robots redirects to another authority are rejected. This intentionally prioritizes scope restriction over RFC 9309's cross-authority redirect recommendation. 404/other 4xx robots responses except 429 permit access; network/5xx/429 deny access. Matched SiteMercek groups merge, wildcard groups apply when none match, most specific path wins and allow wins ties. UTF-8/percent-encoding, literal wildcard and end anchor are handled. Robots rules are crawl guidance, not authentication. Oversized control files fail closed instead of truncating silently.

Budgets: 100 page candidates default, 1000 maximum, depth 4 default/10 maximum, two requests maximum, 500 ms request-start interval, ten-second attempt deadline default, five redirects, 2 MiB wire and expanded body, 16 sitemap documents, XML depth 32, 10,000 discovered URLs, 10,000 links per HTML document, and `12 * (maxPages + enabledResourceBudget) + 32` total network attempts. Sitemap-seeded pages start at depth zero. HTML/non-HTML/error candidates consume page budget so URL patterns cannot evade it. Robots-only and sitemap requests consume network budget. Only 429/503 can retry, once, with 0–5 second Retry-After (numeric seconds or HTTP date; default one second). Long/invalid Retry-After is not retried. SIGINT/SIGTERM stop scheduling and produce partial output when possible.

DTD and entity declarations are rejected before XML parsing to prevent XXE and custom entity expansion; standard entities are decoded. HTML reports serialize page-controlled data into escaped JSON and render it through textContent, never HTML insertion. They do not turn target URLs into active links. The embedded local application script is allowed by an exact SHA-256 CSP hash; saved reports deny network connections. The standalone report contains no scan API, session token or outbound request code. It does include explicit developer hyperlinks; they contact external services only if clicked. Reports retain reviewed, masked target data and allowlisted response headers; inspect them before sharing. No telemetry, automatic uploads or TLS bypass. Output filenames are exclusively created, not overwritten; filesystem failure exits 1.

Unsupported: proxies, sessions/login, user-supplied headers, JS rendering, external origins, vulnerabilities, port discovery, HSTS/CSP effectiveness, legacy charset conversion, unbounded sitemap collections. This is not a claim of complete RFC coverage or absolute SSRF safety. Corporate DNS routing/firewalls can still change the actual network topology behind an allowed public address; use a restricted network for hostile targets.

References checked during implementation: [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html), [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html), [Node HTTP](https://nodejs.org/api/http.html), [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use).

## Türkçe

Bu önizleme sınırlı pasif tarayıcıdır, sızma testi değildir. Yalnızca erişim yetkiniz olan siteleri denetleyin. İşlem işletim sisteminden yalıtılmış bir ağ ortamı değildir.

Güven sınırları: komut girdisi → standart URL; DNS → IP politikası; yönlendirme → yeniden köken/URL/DNS kontrolü; yanıt → sıkıştırılmış/açılmış boyut; HTML/XML → sınırlı ayrıştırma; sayfa verisi → kaçışlanmış terminal/HTML. Bilinmeyen hatalar kapsamı eksik yapar.

HTTP(S) ve kimlik bilgisiz adresler kabul edilir. Fragment kaldırılır; sorgu sırası, yolun harf duyarlılığı ve son eğik çizgi korunur. Özel/rezerve/loopback/link-local/multicast ve özel IPv4'e eşlenen IPv6 varsayılan engellidir. DNS'in bütün adresleri denetlenir; bağlantı bir onaylı IP'ye sabitlenir. Yeni yönlendirme kaynağında tekrar çözümleme yapılır. Ortam proxy ayarları kullanılmaz; TLS sertifikası ve orijinal sunucu adı doğrulanır. Çerez deposu veya kimlik bilgisi iletimi yoktur.

`--allow-private-network` yalnızca IP istisnasıdır; köken, robots, TLS ve bütçeler sürer. Aynı köken şema ve portu içerir. Robots yönlendirmeleri de kökende kalır; RFC'nin farklı sunucu önerisinden bilinçli olarak daha kısıtlıdır. 429 hariç 4xx robots erişime izin verir; 429/5xx/ağ hatası engeller. SiteMercek grupları birleşir; eşleşme yoksa yıldız grubu kullanılır. En özgül yol kazanır; eşitlikte Allow seçilir. UTF-8/yüzde kodlama, yıldız ve bitiş işareti ele alınır. Robots kimlik doğrulama değildir. Büyük kontrol dosyası sessizce kesilmek yerine reddedilir.

Sınırlar: varsayılan 100/en fazla 1000 sayfa adayı; derinlik 4/en fazla 10; iki eşzamanlı istek; başlangıçlar arasında 500 ms; deneme başına varsayılan 10 saniye; beş yönlendirme; ham/açılmış 2 MiB; 16 site haritası; XML derinliği 32; 10.000 adres; HTML başına 10.000 bağlantı; toplam `12 * (maxPages + enabledResourceBudget) + 32` ağ denemesi. Site haritası adresleri derinlik sıfırdan başlar. Hatalı/HTML olmayan adaylar da sayfa bütçesini tüketir. 429/503 yalnızca bir kez ve 0–5 saniye Retry-After ile denenir; geçersiz/uzun bekleme tekrarlanmaz. Ctrl+C/SIGTERM mümkünse kısmi rapor üretir.

XML DTD/entity bildirimleri ayrıştırmadan önce reddedilir; standart kaçışlar çözülür. HTML raporu güvenilmeyen veriyi kaçışlanmış JSON ve textContent ile işler; hedef URL'ler aktif bağlantı değildir. Yerel script yalnızca tam SHA-256 CSP özetiyle çalışır; kayıtlı raporda ağ bağlantısı kapalıdır. Web sunucusu 127.0.0.1 üzerinde Host/Origin ve oturum anahtarı doğrular; gövde 16 KiB ile sınırlıdır, aynı anda tek tarama çalışır. Dışa aktarılan HTML oturum anahtarını içermez. Geliştirici bağlantıları yalnızca tıklanınca dış hizmetlere gider. Rapor adres/sorgu/metin/başlık içerebilir; hassas denetimleri paylaşmayın. Telemetri, otomatik yükleme veya TLS atlama yoktur. Dosyalar üzerine yazılmadan oluşturulur; yazma hatası kod 1 üretir.

Proxy, oturum, özel başlık, JS DOM, dış köken, zafiyet/port keşfi, etkin HSTS/CSP analizi ve eski karakter kodlamaları desteklenmez. Tam RFC uyumu veya mutlak SSRF güvenliği iddia edilmez. DNS yönlendirmesi/ağ topolojisi genel IP arkasındaki erişimi etkileyebilir; kötü niyetli hedefler için kısıtlı ağ kullanın. Başvuru kaynakları üstte bağlantılıdır.

## v0.3 CLI and report boundary

No loopback application/API exists. The only HTTP listeners in this repository are explicitly invoked test/example fixtures. The CLI makes outbound audit requests only.

Asset checks have a separate 1–1000 candidate budget (default 100 when enabled), a maximum 10,000 distinct asset references across the scan and a shared cache. Same-origin, robots, DNS pinning, body limits, timeout, rate and redirects apply identically. Denial/budget/discovery limits make coverage partial; fetched HTTP 4xx/5xx produce findings, not invented success.

Headers are allowlisted as documented in SECURITY.md. Sensitive report values are masked after analysis; this is best effort, not a guarantee for unknown secrets in arbitrary text. Snapshot comparison rejects masked URL identities. A partial scan, changed coverage or skipped SEO checks cannot silently resolve prior findings; invalid scope/rule versions fail. Ajv validates schema v2 and file reads are bounded to 20 MiB.

Türkçe: Yerel uygulama/API kaldırıldı. Örnek/test sunucuları yalnızca açıkça çalıştırılan fixture'lardır. Kaynak bütçesi sayfalardan ayrıdır; tüm ağ korumaları ortaktır. Rapor maskelemesi mutlak sır bulma garantisi değildir. Eksik karşılaştırma çözüldü sonucu üretmez.
