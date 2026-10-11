# SiteMercek — Türkçe kullanım

**Website Quality & Technical SEO CLI** · **Crelyn Studio tarafından geliştirildi**
**Find what broke. Fix what matters.**

SiteMercek terminalden statik HTML, teknik SEO ve dahili bağlantıları inceler. Yerel JSON ve bağımsız HTML raporu üretir. Web uygulaması veya localhost analiz servisi başlatmaz.

**Sürüm: 0.3.0-preview.1 — geliştirme önizlemesi. npm üzerinde yayımlanmadı.** [English README](README.md)

## Kaynaktan çalıştırma

Node.js 22.18+ veya 24.x ve npm gerekir.

```sh
npm ci
npm run build
node dist/src/cli/index.js --help --lang tr
node dist/src/cli/index.js audit https://example.com --lang tr --format html,json
```

Yerel paket kurulumundan sonra ana komut `sitemercek` olur:

```sh
npm pack
npm install --global ./crelynstudio-sitemercek-0.3.0-preview.1.tgz
sitemercek audit https://example.com --lang tr
sitemercek audit https://example.com --check-resources --max-resources 100
```

Eski `site-audit` geçiş alias'ı korunur. Gelecekte npm yayını yapılmadan `npx @crelynstudio/sitemercek` kullanılabilir kabul edilmemelidir.

## Yerel deneme

Bir terminalde `node examples/demo-server.mjs` çalıştırın. İkinci terminalde:

```sh
node dist/src/cli/index.js audit http://127.0.0.1:4765 --allow-private-network --lang tr --format terminal,html,json
```

HTTP sunucusu yalnızca açıkça başlatılan yapay test sitesidir. Audit komutu sunucu başlatmaz. Örnek siteyi Ctrl+C ile durdurun. HTML raporunu dosya olarak açın; filtreler, arama ve dil değiştirme internetsiz çalışır.

## Snapshot ve Diff

```sh
sitemercek audit https://example.com --format json > before.json
sitemercek audit https://example.com --format json > after.json
sitemercek diff before.json after.json --lang tr
sitemercek diff before.json after.json --format json --fail-on-new error
```

NEW yeni, RESOLVED çözülen, UNCHANGED devam eden, UNVERIFIED doğrulanamayan bulgulardır. Şema v2, kural sürümü ve kapsam kayıtlıdır. Farklı kapsam/kural sürümleri reddedilir. Eksik tarama veya değişen URL kapsamı yeni/çözülen sonucu üretmez; karşılaştırılamayan bulgular UNVERIFIED olur. Çalıştırılmamış SEO kontrolleri çözülmüş sayılmaz. Maskelenmiş URL kimliği ve eski şema v1 için yeniden tarama gerekir.

Çıkış kodları: **0** tam sonuç ve eşik aşılmadı; **1** geçersiz/uyumsuz/eksik sonuç veya çalışma hatası; **2** tam sonuçta belirlenen hata/uyarı eşiği aşıldı. `--fail-on warning` ve `--fail-on-new warning` hataları da kapsar. Varsayılan eşik `none`. JSON tek biçim ve çıktı klasörü yoksa stdout'a; ilerleme stderr'e yazılır.

## Güvenlik ve sınırlar

DNS/IP doğrulaması, bağlantı sabitleme, özel IP engeli, aynı kökenli yönlendirmeler, robots, TLS, hız/eşzamanlılık, süre/boyut ve yeniden deneme sınırları korunur. Kaynak denetimi isteğe bağlıdır; görsel/betik/stil için sayfalardan ayrı bütçe kullanır. Harici kaynaklar ve JavaScript sonrası DOM taranmaz.

Yanıt başlıkları izin listesine göre alınır. Yaygın hassas sorgu, kimlik bilgisi ve token biçimleri maskelenir. Bilinmeyen sır biçimleri, yol parçaları veya serbest sayfa metni sızabilir; raporu paylaşmadan inceleyin. Telemetri, hesap veya Crelyn Studio'ya otomatik veri gönderimi yoktur.

Statik HTML'de eksik etiket JavaScript sonrası bulunabilir. SEO önerileri Google sıralama garantisi değildir. Kurulum npm erişimi, tarama hedefe ağ erişimi gerektirir. [Kurallar](docs/rules.md), [güvenlik modeli](docs/security-model.md), [katkı](CONTRIBUTING.md).

## Doğrulama

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:package
```

GitHub Actions Node 22/24 ile Windows/Linux/macOS matrisini çalıştırır. Ana README ve belgelerde güncel kullanım bulunur. Kaynak kod MIT lisanslıdır; marka ve logoların hakları ayrıca korunur.

[Crelyn Studio](https://crelynstudio.com) · [İletişim](mailto:info@crelynstudio.com)
