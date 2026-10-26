import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const buildRoot = join(root, ".build");
const output = join(buildRoot, "portable", "Website SEO Auditor");
if (!output.startsWith(buildRoot + sep)) throw new Error("Unsafe build path");
if (
  process.platform !== "win32" ||
  process.arch !== "x64" ||
  process.version !== "v24.19.0"
) {
  throw new Error(
    "Portable preview requires the verified Windows x64 Node.js 24.19.0 runtime.",
  );
}
const binary = await readFile(process.execPath);
const sha256 = createHash("sha256").update(binary).digest("hex");
if (
  sha256 !== "3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237"
) {
  throw new Error(
    "Node.js binary differs from the official 24.19.0 Windows x64 release.",
  );
}
await rm(output, { recursive: true, force: true });
const app = join(output, "app");
await mkdir(join(app, "dist"), { recursive: true });
await mkdir(join(app, "docs"), { recursive: true });
await writeFile(join(output, "node.exe"), binary);
await cp(
  join(root, "third_party", "Node.js-LICENSE.txt"),
  join(output, "Node.js-LICENSE.txt"),
);
for (const name of ["package.json", "package-lock.json", "LICENSE"])
  await cp(join(root, name), join(app, name));
await cp(join(root, "dist", "src"), join(app, "dist", "src"), {
  recursive: true,
});
await cp(join(root, "web"), join(app, "web"), { recursive: true });
await cp(join(root, "assets"), join(app, "assets"), { recursive: true });
await cp(
  join(root, "docs", "report.schema.json"),
  join(app, "docs", "report.schema.json"),
);
const npm = process.env.npm_execpath;
if (!npm) throw new Error("Run through npm run dist:portable");
const install = spawnSync(
  process.execPath,
  [npm, "ci", "--omit=dev", "--ignore-scripts", "--no-audit", "--no-fund"],
  { cwd: app, stdio: "inherit" },
);
if (install.status !== 0)
  throw new Error("Production dependency installation failed.");
await writeFile(
  join(output, "Start Website SEO Auditor.vbs"),
  `Option Explicit\r\nDim files, shell, base, runtime, entry\r\nSet files = CreateObject("Scripting.FileSystemObject")\r\nSet shell = CreateObject("WScript.Shell")\r\nbase = files.GetParentFolderName(WScript.ScriptFullName)\r\nruntime = files.BuildPath(base, "node.exe")\r\nentry = files.BuildPath(base, "app\\dist\\src\\web\\server.js")\r\nIf Not files.FileExists(runtime) Or Not files.FileExists(entry) Then\r\n  MsgBox "Website SEO Auditor files are incomplete. / Uygulama dosyalari eksik.", vbCritical\r\n  WScript.Quit 1\r\nEnd If\r\nshell.Run Chr(34) & runtime & Chr(34) & " " & Chr(34) & entry & Chr(34), 0, False\r\n`,
);
await writeFile(
  join(output, "START-HERE.txt"),
  `Website SEO Auditor — Windows x64 portable preview\r\n\r\nDouble-click "Start Website SEO Auditor.vbs". The app opens in your default browser. Use Settings > Close app when finished. The app contacts only websites you choose to scan. Reports are in memory until you download them.\r\n\r\n"Start Website SEO Auditor.vbs" dosyasina cift tiklayin. Uygulama varsayilan tarayicida acilir. Bitirince Ayarlar > Uygulamayi kapat secenegini kullanin. Raporu saklamak icin indirin.\r\n\r\nNode.js runtime license: Node.js-LICENSE.txt. App source license: app\\LICENSE.\r\n`,
);
process.stdout.write(
  `Portable preview: ${output}\nNode.js SHA-256: ${sha256}\n`,
);
