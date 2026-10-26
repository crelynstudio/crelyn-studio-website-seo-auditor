# Website SEO Auditor

<img src="assets/website-seo-auditor-logo.svg" width="56" height="56" alt="Website SEO Auditor logosu">

**Teknik SEO denetimleri için bilgisayarında çalışan web uygulaması.** Crelyn Studio tarafından geliştirildi. [English guide](README.md).

Site adresini gir, tarama sonuçlarını incele ve aynı tür bulguları etkilenen sayfa, teknik kanıt ve düzeltme önerisiyle birlikte gör. Arayüz tarayıcıda açılır; tarayıcı motoru bilgisayarında çalışır. Hesap, API anahtarı, bulut sunucusu veya Electron gerekmez.

**Durum:** `0.5.0-beta.1` yerel inceleme adayıdır; henüz yayımlanmadı. [Önceki Windows betası](https://github.com/crelynstudio/crelyn-studio-website-seo-auditor/releases/tag/v0.4.0-beta.1) yayımdadır.

![Yapay yerel sitede gerçek taramanın İngilizce genel bakış ekranı](docs/screenshots/web-overview-en.png)

![Kanıt ve düzeltme önerisi gösteren İngilizce bulgular ekranı](docs/screenshots/web-findings-en.png)

![Dil ve tarama sınırları için İngilizce ayarlar ekranı](docs/screenshots/web-settings-en.png)

Görüntüler çalışan uygulamadan ve yapay bir yerel test sitesinden alındı; bulgular örnek veridir. GitHub sayfasında Türkçe arayüz ekran görüntüsü kullanılmıyor.

## İşlevler

- `robots.txt` kurallarına uyarak aynı sitedeki bağlantı ve site haritası sayfalarını tarar.
- HTTP hatalarını, bozuk iç bağlantıları, yönlendirmeleri, başlıkları, açıklamaları, H1/canonical/indexleme bildirimlerini inceler.
- İsteğe bağlı olarak aynı sitedeki görselleri, betikleri ve stil dosyalarını kontrol eder.
- Gerçek tarama verilerinden kapsam ve sorun dağılımı gösterir; HTML ve JSON raporları indirir.

**Ayarlar** bölümünde dil, sayfa ve derinlik sınırı, dosya kontrolü ve özel ağ izni bu tarayıcıda saklanır. Tarama durdurulabilir; kısmi sonuçlar açıkça işaretlenir. [Kural ayrıntıları](docs/rules.md).

## Kaynak koddan çalıştırma

Windows'ta Node.js 24 ve npm kur, ardından:

```powershell
npm ci
npm run app
```

Uygulama varsayılan tarayıcıda rastgele bir `127.0.0.1` adresiyle açılır. Kullanırken komut çalışmaya devam etmeli; durdurmak için Ctrl+C kullan. Bu inceleme adayında henüz tek tıklamalı Windows paketi yok. Geliştiriciler [komut satırı aracını](docs/cli.md) da kullanabilir.

Kontroller:

```powershell
npm run typecheck
npm run lint
npm test
npm run test:package
```

İlk bağımlılık kurulumu npm kaynağına erişim ister. Sonrasında arayüz ve indirilmiş rapor harici servis olmadan açılır. Gerçek siteyi taramak için o siteye ağ bağlantısı gerekir.

## Gizlilik ve sınırlar

Yerel servis yalnızca `127.0.0.1` adresini dinler; farklı köken ve ana makine isteklerini reddeder. Raporlar servis kapanana kadar yerel bellekte tutulur; saklamak için HTML veya JSON indir. Ayarlar tarayıcının yerel depolamasındadır. Telemetri veya Crelyn Studio'ya veri yükleme yoktur. Yaygın gizli değerler dışa aktarmada maskelenir; rastgele metin veya URL yolu yine özel bilgi içerebilir. **Paylaşmadan önce raporu incele.** [Güvenlik modeli](docs/security-model.md) · [Güvenlik bildirimi](SECURITY.md).

Tarayıcı motoru statik HTML okur. Oturum açamaz, JavaScript ile sonradan oluşturulan içeriği inceleyemez; Google sıralaması ölçmez veya sonuç garantisi vermez. Varsayılan sınır 100 sayfa ve 4 bağlantı seviyesidir. Bu adayda yerel tarayıcı akışı denetlendi; barındırılan sürüm veya otomatik güncelleme yoktur.

## Geliştirici ve lisans

**Crelyn Studio tarafından geliştirildi** · [Web sitesi](https://crelynstudio.com) · [İletişim](mailto:info@crelynstudio.com) · [GitHub](https://github.com/crelynstudio)

Kaynak kod [MIT lisanslıdır](LICENSE). Crelyn Studio adı ve logolarının marka hakları ayrıdır; MIT marka kullanım hakkı vermez. Özgün Website SEO Auditor işareti bu proje için dahildir. Satın alınan UI8 kaynak simgeleri depoda bulunmaz.

Windows taşınabilir önizlemesi Node.js 24.19.0 içerir; [ayrı lisansı](third_party/Node.js-LICENSE.txt) taşınabilir klasörde de bulunur. Üretim bağımlılıklarının kendi lisans dosyaları korunur.
