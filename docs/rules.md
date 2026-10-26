# Rules / Kurallar

All findings are observations within the crawled scope; no search ranking or security guarantee. Every rule has unit/integration coverage. `info` is a finding severity, not a failure of the site. Local rule references use the headings below.

Tüm bulgular taranan kapsamla sınırlıdır; arama sıralaması veya güvenlik garantisi değildir. Her kural birim/entegrasyon testlerinde değerlendirilir. `info` seviyesi sitenin başarısız olduğu anlamına gelmez.

## HTTP_001
**error, certain.** HTTP 4xx/5xx on a fetched resource. Evidence: status. Restore target or update URL. A 404 may be intentional; not every path needs to exist.

İstenen kaynakta HTTP 4xx/5xx; kanıt durum kodudur. Hedefi veya adresi düzeltin. 404 bilinçli olabilir.

## HTTP_002
**warning for multiple redirects; error for loop/limit/unsafe redirect, certain.** Evidence: chain/error code. Link directly to final origin/path. Two or more redirects are advisory; migration redirects can be intentional.

Birden fazla yönlendirme uyarı; döngü/sınır/güvensiz yönlendirme hatadır. Zincir kanıt olarak verilir. Son adrese doğrudan bağlantı önerilir; taşıma yönlendirmeleri bilinçli olabilir.

## LINK_001
**error, certain.** Source internal link reaches a fetched 4xx/5xx or failed network target. Evidence: source, target, status/error. Fix destination or link. Unfetched, out-of-budget and robots-denied targets are not labeled broken.

Kaynak dahili bağlantı, taranmış hatalı kaynağa gider. Kaynak/hedef ve hata kanıtlanır. Taranmamış, bütçe dışında veya robots engelli hedef bozuk diye işaretlenmez.

## SEO_001
**warning, certain.** Empty/missing title on successful HTML. Add a descriptive title. Applies to static source only, not the rendered JS DOM.

Başarılı HTML'de boş/eksik title. Açıklayıcı başlık ekleyin. Yalnızca statik kaynak değerlendirilir.

## SEO_002
**warning, heuristic.** Same trimmed nonempty title across distinct final successful HTML URLs. Evidence lists related URLs. Adapt titles to content; pagination/localization may legitimately share titles. Comparison is case sensitive and whitespace inside text is preserved.

Farklı son HTML adreslerinde aynı boş olmayan başlık. İlgili adresler listelenir. Sayfalama/yerelleştirme nedeniyle bilinçli olabilir; karşılaştırma büyük/küçük harfe duyarlıdır, iç boşluklar korunur.

## SEO_003
**info, heuristic.** Empty/missing meta description. Consider a concise summary. Search engines may choose another snippet; no ranking claim.

Eksik/boş meta açıklaması. Kısa özet önerilir. Arama motoru başka özet seçebilir; sıralama iddiası yoktur.

## SEO_004
**info, heuristic.** No H1 in static HTML. Consider a descriptive main heading. Multiple H1 elements do not trigger a finding.

Statik HTML'de H1 yok. Açıklayıcı ana başlık düşünün. Birden fazla H1 bulgu üretmez.

## SEO_005
**warning, certain.** Declared canonical cannot resolve to credential-free HTTP(S), including empty href. Relative canonicals use the document base URL. No canonical is acceptable; target status is not fetched.

Bildirilmiş canonical, kimlik bilgisi içermeyen HTTP(S) adresine çözülemez veya boştur. Göreli canonical belge taban adresine göre çözülür. Canonical olmaması bulgu değildir; hedef durum kodu denetlenmez.

## SEO_006
**warning, certain.** Multiple distinct resolved canonical URLs. Keep one consistent destination. Identical duplicate declarations do not trigger this rule; no automatic penalty claim.

Birden fazla farklı canonical hedefi. Tek tutarlı hedef kullanın. Aynı hedefi tekrarlamak bu kuralı tetiklemez; otomatik ceza iddiası yoktur.

## IDX_001
**info, certain.** `noindex` or `none` found in robots/Website SEO Auditor meta or X-Robots-Tag. Confirm intent. Agent-scoped X-Robots-Tag values are not fully modeled; treat them as observations, not proof of what every crawler will do.

Robots/Website SEO Auditor meta veya X-Robots-Tag içinde noindex/none. Amacınızı doğrulayın. X-Robots-Tag içindeki tüm bot kapsamları modellenmez; her botun davranışı için kanıt değildir.

## IDX_002
**info for 404; warning otherwise.** Missing sitemap differs from unreadable/invalid XML. Check status/XML. Missing sitemap alone is not critical. Unreadable discovery can make coverage partial.

404 bilgi; diğer erişim/ayrıştırma sorunları uyarıdır. Eksik harita tek başına kritik değildir; okunamayan keşif kapsamı kısmi yapabilir.

## HEALTH_001
**info, heuristic.** On successful HTTPS HTML, observe absent CSP, HSTS and X-Content-Type-Options. Contextual advice only; header values, effective policies, TLS strength and vulnerabilities are not audited.

Başarılı HTTPS HTML'de eksik CSP, HSTS ve X-Content-Type-Options gözlemi. Başlık değerleri, etkin politikalar, TLS gücü veya zafiyet denetlenmez.

## NETWORK_001
**error, certain.** Resource/robots could not be fetched safely. Evidence is stable reason code, not a raw exception/stack. Review DNS/IP/origin policy, timeout and server availability. Partial coverage exits 1.

Kaynak/robots güvenli biçimde alınamadı. Kanıt ham yığın izi yerine kararlı hata kodudur. Ağ politikası, zaman aşımı ve sunucuyu inceleyin. Kısmi kapsam kod 1 üretir.

## ANALYZER_001
**error, certain.** Unexpected analyzer error. Report a minimal local reproduction. Never interpret this as a passed check; exit 1.

Beklenmeyen analiz hatası. Küçük yerel tekrar örneği bildirin. Geçen kontrol sayılmaz; çıkış 1 olur.

## SEO_007

**info, heuristic.** Static heading levels jump by more than one between adjacent headings (for example H1 → H3). Review the outline in context. This does not prove an accessibility failure or describe JavaScript-rendered content.

Statik başlık sırası birden fazla seviye atlar (H1 → H3). Bağlama göre inceleyin; erişilebilirlik hatası veya JavaScript sonrası yapı için kesin kanıt değildir.

## SEO_008

**info, heuristic.** Identical trimmed nonempty descriptions across distinct successful final HTML URLs. Evidence lists affected pages. Shared descriptions can be intentional; no ranking penalty is claimed.

Farklı başarılı son HTML adreslerinde aynı boş olmayan açıklama. Bilinçli olabilir; sıralama cezası iddiası yoktur.

## RESOURCE_001

**error, certain.** An opted-in, same-origin image/script/stylesheet returned HTTP 4xx/5xx or a recorded request error. Evidence includes source, target and status/error. External origins and robots/budget exclusions are not labeled broken. It does not prove the rendered page's visual behavior.

İsteğe bağlı aynı kökenli görsel/betik/stil kontrolünde HTTP hatası veya istek hatası. Harici/robots/bütçe dışı kaynak bozuk diye işaretlenmez. İşlenmiş sayfanın görünümünü kanıtlamaz.
