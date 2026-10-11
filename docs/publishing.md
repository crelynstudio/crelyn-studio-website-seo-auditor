# Publication draft / Yayın taslağı

## English

Not published. Review the preview with the user before a public release. Suggested repository: **crelyn-studio-sitemercek**. Description: **Evidence-based website health and technical SEO CLI with safe crawling, local reports, and English/Turkish support.** Topics: `cli`, `seo`, `crawler`, `typescript`, `website-audit`, `technical-seo`. Website field: leave empty until a dedicated product page exists.

The `main` branch is the source branch; upload **the contents of `repo/`**, not the parent workspace or a wrapper named repo. Include `.github/`, `.gitignore`, assets, docs, examples, src, tests, package.json, package-lock.json, tsconfig.json, eslint.config.js, LICENSE, READMEs and the community documents. Exclude `.git/`, node_modules, dist, reports, .verification, temporary tests and tarballs. `.gitignore` does not filter files manually selected in the web browser.

Create a blank repository using New repository, choose the owner/name, and avoid automatically adding another README/license. Use Add file → Upload files, keeping the root structure and dotfiles. GitHub browser upload currently allows up to 100 files per upload and 25 MiB per file. Check hidden `.github/` and `.gitignore` explicitly. If the browser cannot preserve them, use GitHub Desktop to add this existing local Git repository and review selected files before publishing; the assistant has not logged in or published anything.

No executable ZIP or release directory is needed for this Node CLI preview. A later GitHub release could use tag **v0.1.0-preview.1**, title **SiteMercek v0.1.0 Preview**, and be marked a pre-release, with this draft body:

> Local preview of SiteMercek: same-origin crawling with DNS/IP policy, robots and sitemap discovery; evidence-based SEO/link/passive health findings; EN/TR terminal, JSON and single-file HTML reports. Install Node 24, run npm ci and npm run build, then node dist/src/cli/index.js --help. No JS rendering or full security/accessibility audit. See implementation-status.md for tested platforms and remaining checks. The npm package is not published.

GitHub's generated source archives contain source; they are not standalone executables or a fully installed Node package. Any future npm publication requires verifying ownership/name availability and a separate publication decision. Do not publish a stable v1.0.0 for this preview.

## Türkçe

Henüz yayımlanmadı. Kullanıcı önizlemeyi incelemeden herkese açık son sürüm olarak yayımlamayın. Önerilen depo **crelyn-studio-sitemercek**; üstteki İngilizce açıklama ve konu etiketleri EN+TR ürünün ana depo bilgisi için öneridir. Türkçe açıklama: **Güvenli tarama, yerel raporlar ve İngilizce/Türkçe desteğiyle kanıta dayalı site sağlığı ve teknik SEO terminal aracı.** Ürüne özel sayfa yoksa Website alanını boş bırakın.

`main`, kaynakların tutulduğu daldır. **Yalnızca `repo/` içeriği** depo köküne gider. Üst çalışma alanı, AGENTS.md ve LOGO klasörü yüklenmez. `.github/`, `.gitignore`, assets, docs, examples, src, tests, paket ve yapılandırma dosyaları, lisans, README ve topluluk belgelerini dahil edin. `.git/`, node_modules, dist, reports, .verification, geçici test klasörleri ve tgz dosyaları dahil edilmez. `.gitignore`, webde elle seçtiğiniz dosyaları otomatik elemez.

GitHub'da New repository ile boş depo açın; ikinci README/lisans üretmeyin. Add file → Upload files ile dosyaları kök düzenini koruyarak seçin. Güncel web sınırı yükleme başına 100 dosya, dosya başına 25 MiB'dir. Gizli `.github/` ve `.gitignore` öğelerini kontrol edin. Web arayüzü koruyamazsa GitHub Desktop ile bu yerel Git deposunu ekleyip yayınlanacak dosyaları gözden geçirin. Asistan hesap girişi veya yayın yapmadı.

Node CLI önizlemesi için çalıştırılabilir ZIP veya release klasörü gerekmiyor. Sonraki yayın önerisi: **v0.1.0-preview.1**, **SiteMercek v0.1.0 Preview**, pre-release işaretli. Türkçe yayın metni:

> SiteMercek yerel önizlemesi: DNS/IP denetimli aynı köken taraması, robots ve site haritası keşfi; kanıtlı SEO/bağlantı/pasif sağlık bulguları; EN/TR terminal, JSON ve tek dosyalı HTML raporları. Node 24 ile npm ci ve npm run build çalıştırın; node dist/src/cli/index.js --help komutunu kullanın. JS DOM veya tam güvenlik/erişilebilirlik denetimi yoktur. Doğrulanan platformlar ve kalan kontroller implementation-status.md dosyasındadır. npm paketi yayımlanmadı.

GitHub'ın otomatik kaynak arşivi çalıştırılabilir uygulama veya bağımlılıkları kurulu paket değildir. npm yayını için sahiplik/kullanılabilirlik ve ayrı yayın kararı gerekir. Önizlemeyi kararlı v1.0.0 diye etiketlemeyin.

Official references checked / Kontrol edilen resmî kaynaklar: [Create repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository), [Upload files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository), [Manage releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository).
