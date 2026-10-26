import {
  createServer as createHttpServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseConfig } from "../config/index.js";
import { scan } from "../crawler/index.js";
import { catalog, limitations } from "../i18n/index.js";
import { redact } from "../reports/privacy.js";
import { renderHtml } from "../reports/html.js";
import type { Lang, ScanConfig, ScanReport } from "../core/types.js";

type Progress = { discovered: number; crawled: number; skipped: number };
const webRoot = new URL("../../../web/", import.meta.url);
const assetsRoot = new URL("../../../assets/", import.meta.url);
const staticFiles = new Map<string, readonly [URL, string]>([
  ["/", [new URL("index.html", webRoot), "text/html; charset=utf-8"]],
  ["/app.css", [new URL("app.css", webRoot), "text/css; charset=utf-8"]],
  ["/app.js", [new URL("app.js", webRoot), "text/javascript; charset=utf-8"]],
  [
    "/logo.svg",
    [new URL("website-seo-auditor-logo.svg", assetsRoot), "image/svg+xml"],
  ],
  ["/crelyn-logo.png", [new URL("CRELYN-DARK.png", assetsRoot), "image/png"]],
]);

function webConfig(value: unknown): ScanConfig {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("CONFIG_INVALID");
  const input = value as Record<string, unknown>;
  if (
    typeof input.url !== "string" ||
    input.url.length > 2048 ||
    !["en", "tr"].includes(String(input.lang)) ||
    typeof input.checkResources !== "boolean" ||
    typeof input.allowPrivateNetwork !== "boolean" ||
    !Number.isInteger(input.maxPages) ||
    !Number.isInteger(input.maxDepth)
  )
    throw new Error("CONFIG_INVALID");
  return parseConfig([
    "audit",
    input.url,
    "--lang",
    input.lang as Lang,
    "--format",
    "json",
    "--max-pages",
    String(input.maxPages),
    "--max-depth",
    String(input.maxDepth),
    ...(input.checkResources ? ["--check-resources"] : []),
    ...(input.allowPrivateNetwork ? ["--allow-private-network"] : []),
  ]);
}

async function body(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += bytes.length;
    if (size > 8192) throw new Error("REQUEST_TOO_LARGE");
    chunks.push(bytes);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("CONFIG_INVALID");
  }
}

function json(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}

export async function startWebServer(
  port = 0,
): Promise<{ server: Server; url: string }> {
  let active = false;
  let controller: AbortController | null = null;
  let report: ScanReport | null = null;
  let progress: Progress = { discovered: 0, crawled: 0, skipped: 0 };
  let error = "";
  let base = "";
  const server = createHttpServer((req, res) => {
    void (async () => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Referrer-Policy", "no-referrer");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'none'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      );
      if (req.headers.host !== new URL(base).host)
        return json(res, 403, { code: "BAD_HOST" });
      const path = new URL(req.url ?? "/", base).pathname;
      if (req.method === "GET" && staticFiles.has(path)) {
        const [file, type] = staticFiles.get(path)!;
        res.writeHead(200, {
          "Content-Type": type,
          "Cache-Control": "no-store",
        });
        return res.end(await readFile(file));
      }
      if (
        path.startsWith("/api/") &&
        req.method === "POST" &&
        req.headers.origin !== base
      )
        return json(res, 403, { code: "BAD_ORIGIN" });
      if (path === "/api/meta" && req.method === "GET")
        return json(res, 200, {
          catalog,
          limitations: { en: limitations("en"), tr: limitations("tr") },
        });
      if (path === "/api/state" && req.method === "GET")
        return json(res, 200, {
          active,
          progress,
          ready: Boolean(report),
          error,
        });
      if (path === "/api/scan" && req.method === "POST") {
        if (active) return json(res, 409, { code: "SCAN_RUNNING" });
        const config = webConfig(await body(req));
        active = true;
        report = null;
        error = "";
        progress = { discovered: 0, crawled: 0, skipped: 0 };
        controller = new AbortController();
        const signal = controller.signal;
        void scan(config, signal, (discovered, crawled, skipped) => {
          progress = { discovered, crawled, skipped };
        })
          .then((value) => {
            report = redact(value);
          })
          .catch((cause) => {
            error =
              cause instanceof Error && /^[A-Z_]+$/.test(cause.message)
                ? cause.message
                : "SCAN_FAILED";
          })
          .finally(() => {
            active = false;
            controller = null;
          });
        return json(res, 202, { ok: true });
      }
      if (path === "/api/cancel" && req.method === "POST") {
        controller?.abort();
        return json(res, 200, { ok: Boolean(controller) });
      }
      if (path === "/api/quit" && req.method === "POST") {
        if (active) return json(res, 409, { code: "SCAN_RUNNING" });
        json(res, 200, { ok: true });
        setTimeout(() => {
          server.closeAllConnections();
          server.close();
        }, 100);
        return;
      }
      if (path === "/api/report" && req.method === "GET")
        return report
          ? json(res, 200, report)
          : json(res, 404, { code: "REPORT_UNAVAILABLE" });
      if (path === "/api/report.html" && req.method === "GET") {
        if (!report) return json(res, 404, { code: "REPORT_UNAVAILABLE" });
        const html = await renderHtml(report);
        const host = new URL(report.target).hostname.replace(/[^a-z0-9.-]/gi, "-").slice(0, 100);
        const fileName = `Website-SEO-Auditor-${host}-${report.startedAt.slice(0, 10)}.html`;
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Cache-Control": "no-store",
        });
        return res.end(html);
      }
      json(res, 404, { code: "NOT_FOUND" });
    })().catch((cause) => {
      const code = cause instanceof Error ? cause.message : "";
      if (code === "REQUEST_TOO_LARGE") return json(res, 413, { code });
      if (/^(CONFIG|URL)_[A-Z_]+$/.test(code)) return json(res, 400, { code });
      json(res, 500, { code: "SERVER_ERROR" });
    });
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("SERVER_ADDRESS");
  base = `http://127.0.0.1:${address.port}`;
  return { server, url: base };
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  const { url } = await startWebServer();
  process.stdout.write(`Website SEO Auditor: ${url}\n`);
  if (process.platform === "win32" && !process.argv.includes("--no-open") && process.env.AUDITOR_NO_OPEN !== "1") {
    const child = spawn("rundll32.exe", ["url.dll,FileProtocolHandler", url], {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    child.unref();
  }
}
