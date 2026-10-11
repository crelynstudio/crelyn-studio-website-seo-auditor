# Distribution preparation

Product: **SiteMercek**. Existing repository: **crelynstudio/crelyn-studio-website-seo-auditor**; keep this URL unchanged.

Description: **Website Quality & Technical SEO CLI. Find what broke. Fix what matters.**

Suggested topics: website-audit, technical-seo, broken-link-checker, crawler, typescript, cli, snapshot-diff. These describe the project without promising search rankings.

Target npm package: `@crelynstudio/sitemercek`, version `0.3.0-preview.1`. Primary binary `sitemercek`; transitional alias `site-audit`. A registry not-found response does not guarantee ownership or future name availability. No npm publication or GitHub Release is part of this update.

Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm pack --dry-run` and `npm run test:package`. The package test installs a local tarball in a unique temporary directory with production dependencies, checks the shebang/binaries/help/version and diff JSON, then removes only its own directory. CI repeats it on the supported OS/Node matrix.

Git contains sources, tests/fixtures, static viewer assets, docs/examples, package manifest/lockfile, license and CI. It excludes generated dist/node_modules/reports and .verification. Local ignored verification copies from earlier work are not publication content. Only repo/ contents belong at the existing repository root.

Türkçe: Aynı GitHub adresi korunur. Bu görevde npm yayını veya Release oluşturulmaz. Yerel paketleme ve temiz kurulum test edilir; önizleme kararlı sürüm olarak tanıtılmaz.
