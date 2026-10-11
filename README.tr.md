# SiteMercek

Neyin bozulduğunu bulun, nedenini anlayın ve neyi düzelteceğinizi görün.

**v0.1.0-preview.1 — yerel geliştirme önizlemesi; npm'de yayımlanmadı.** Site sağlığı ve teknik SEO için terminal aracı. Varsayılan İngilizce; `--lang tr` ile Türkçe. Her bulguda kanıt, önem derecesi, kararlı kural kimliği ve düzeltme önerisi bulunur. Puan, hesap, API anahtarı veya telemetri yoktur.

[English](README.md) · [Kurallar / Rules](docs/rules.md) · [Güvenlik modeli / Security model](docs/security-model.md) · [Geliştirme durumu / Implementation status](docs/implementation-status.md)

## Kurulum ve ilk deneme

Node.js 24 önerilir; alt sınır 22.18. Terminali **bu deponun içinde** açın:

```sh
npm ci
npm run build
node dist/src/cli/index.js --help --lang tr
node dist/src/cli/index.js --version
```

Tekrarlanabilir örnek için bir terminalde yerel örnek sunucuyu başlatın:

```sh
node examples/demo-server.mjs
```

Aynı klasörde ikinci terminal açın:

```sh
npm run dev -- http://127.0.0.1:4765 --max-pages 20 --lang tr --allow-private-network
node dist/src/cli/index.js audit http://127.0.0.1:4765 --allow-private-network --format html,json --output ./reports --lang tr
node dist/src/cli/index.js audit http://127.0.0.1:4765 --allow-private-network --fail-on error --format json --lang tr
```

Örnek site bilerek bozuk bağlantı ve yinelenen başlık içerir. Son komutun çıkış kodu **2** olur. Bunlar gerçek müşteri verileri değildir. Sunucuyu Ctrl+C ile kapatın. Kendi herkese açık siteniz için adresi değiştirin ve `--allow-private-network` kullanmayın. HTTPS/HTTP ve `www` farkları köken sınırını değiştirir; son kökeni doğrudan hedefleyin.

`npx @crelynstudio/sitemercek <adres>` yalnızca **gelecekte yayımlandıktan sonraki** kullanım hedefidir. Paket/kuruluş kullanılabilirliği doğrulanmadı; dış servislere yayın yapılmadı.

## Seçenekler ve raporlar

| Seçenek | Varsayılan / aralık |
| --- | --- |
| `--lang` | `en`, `tr` |
| `--max-pages` | 100; 1–1000; hata ve HTML olmayan adaylar bütçeye dahildir |
| `--max-depth` | 4; 0–10; başlangıç/site haritası adresleri derinlik 0 |
| `--concurrency` | 2; 1–2; istek başlangıçları arasında en az 500 ms |
| `--timeout` | 10000 ms; 100–60000; her denemede DNS ve yanıt okuma dahil |
| `--format` | `terminal`; virgülle ayrılan `terminal,html,json` |
| `--output` | Dosya çıktıları için `./reports` |
| `--fail-on` | `none`; `error`, `warning`, `none` |
| `--allow-private-network` | Kapalı; güvenilen yerel/özel ağ için açık istisna |

`sitemercek <adres>` ile `sitemercek audit <adres>` eşdeğerdir. Paket kurulmadan önce komut yerine `node dist/src/cli/index.js` kullanın. `--about` geliştirici ve iletişim bilgilerini gösterir.

Terminal raporu stdout'a gider. **Tek JSON biçimi, `--output` yoksa stdout'a yazılır**; ilerleme stderr'dedir. Diğer kombinasyonlarda JSON/HTML, belirtilen klasöre veya `./reports` içine kaydedilir. Zaman ve rastgele ek içeren dosyalar mevcut raporların üzerine yazılmaz. HTML tek dosyalı, UTF-8 ve gömülü logoludur; script, CDN, dış font veya otomatik üçüncü taraf isteği içermez. Dosyaya çift tıklayarak açın; kanıt alanlarını klavyeyle genişletebilirsiniz. Makine hata/neden kodları iki dilde de kararlı İngilizce tanımlayıcılardır.

Çıkış **0**: tarama tamamlandı ve eşik aşılmadı. **1**: geçersiz girdi, çalıştırma/ağ hatası, kısmi veya durdurulmuş tarama. **2**: tam taramada eşik aşıldı; `warning` hataları da içerir. `none`, kısmi taramayı başarılı saymaz. Normal HTTP 404/500 bulguları kod 2 üretebilir; erişilemeyen kaynak kapsamı eksik bıraktığından kod 1 üretir.

## Raporu yorumlama

Önce `status` ve `skippedChecks`, sonra önem, URL, `observed`, `expected` ve öneriye bakın. Bulgu bulunmaması tüm olası kontrollerin geçtiği anlamına gelmez. `noindex` bilgilendiricidir; eksik açıklama/H1 kritik hata değildir. Güvenlik başlıkları pasif gözlemdir. Yinelenen başlıklar yalnızca taranan farklı son HTML adresleri arasında değerlendirilir. Canonical adresleri sözdizimsel olarak doğrulanır; hedefleri istenmez.

Gerçek CLI ile işlenen yapay örneklerin raporları ve terminal çıktısı [docs/examples](docs/examples) altındadır.

![Üretilen Türkçe HTML raporu, masaüstü](docs/screenshots/report-tr-desktop.png)

[Mobil ekran görüntüsü](docs/screenshots/report-tr-mobile.png) · [HTML örneği](docs/examples/demo-tr.html) · [JSON örneği](docs/examples/demo-tr.json) · [Gerçek terminal çıktısı](docs/examples/terminal-tr.txt)

## Güvenlik, gizlilik ve sınırlar

- Yalnızca GET, HTTP(S) ve başlangıç kökeni. Giriş, çerez deposu, form gönderimi veya dış köken taraması yok.
- DNS yanıtlarının tamamı doğrulanır; bağlantı denetlenmiş IP'ye sabitlenir. TLS doğrulaması açıktır; ortam proxy ayarları kullanılmaz.
- İçerikten önce robots.txt okunur. 429 dışındaki 4xx erişime izin verir; 5xx, 429 ve ağ hatasında tarama engellenir. Robots yönlendirmesi de aynı kökende kalır; RFC'nin farklı sunucu yönlendirmesinden bilinçli olarak daha sıkıdır.
- En fazla beş yönlendirme, 2 MiB sıkıştırılmış ve açılmış yanıt, 16 site haritası, XML derinliği 32, 10.000 keşfedilen adres ve belge başına bağlantı. Keşif/istek bütçesi dolunca sonuç kısmi olur.
- En fazla iki eşzamanlı istek ve 500 ms başlangıç aralığı. 429/503 için Retry-After 0–5 saniye ise yalnızca bir tekrar.
- JavaScript DOM, Core Web Vitals, tam erişilebilirlik, zafiyet taraması, oturum, fark karşılaştırması veya eklenti yok. UTF-8 dışı eski karakter kodlamaları dönüştürülmez.
- Robots engelleri ve sayfa/derinlik sınırları ihtiyatlı biçimde kısmi tarama sayılır.
- Raporlar adresleri, sorgu dizelerini, sayfa metnini ve yanıt başlıklarını içerebilir; hassas raporları paylaşmayın. Set-Cookie ve WWW-Authenticate tutulmaz. Veriler hedef köken dışında Crelyn Studio'ya gönderilmez.

Kurulum npm internet erişimi ister. Tarama hedef sunucuya erişim gerektirir; çevrimdışı web tarayıcısı değildir. Kurulumdan sonra yerel örnek ve oluşmuş raporlar internetsiz kullanılabilir. Ayrıntı: [güvenlik modeli](docs/security-model.md).

## Geliştirme ve kontroller

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm pack --dry-run
npm audit
```

Testler yerel HTTP sunucuları ve kontrollü DNS kullanır; üçüncü taraf siteleri taramaz. Derlenmiş CLI, rapor dosyaları ve çıkış kodları sınanır. Linux/Windows/macOS Node 22/24 CI yapılandırılmıştır; uzak CI sonucu henüz doğrulanmadı. [Katkı](CONTRIBUTING.md), [güvenlik bildirimi](SECURITY.md), [mimari](docs/architecture.md), [yol haritası](docs/roadmap.md).

## Geliştirici ve lisans

![Crelyn Studio](assets/CRELYN-DARK.png)

**Crelyn Studio tarafından geliştirildi.** [Web sitesi](https://crelynstudio.com) · [E-posta](mailto:info@crelynstudio.com) · [GitHub](https://github.com/crelynstudio) · [Behance](https://www.behance.net/crelynstudio) · [Instagram](https://www.instagram.com/crelynstudio/) · [X](https://x.com/crelynstudio) · [Threads](https://www.threads.com/@crelynstudio).

Kaynak kod [MIT lisanslıdır](LICENSE). Yazılım lisansı Crelyn Studio adı, marka işaretleri ve logoları için sınırsız marka kullanım hakkı vermez. Üçüncü taraf bağımlılıkların lisansları kendilerine aittir. Platform ortaklığı veya onayı iddia edilmez.
