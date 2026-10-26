import { app, BrowserWindow, dialog, ipcMain, Menu, screen, session, shell } from 'electron';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scan } from '../crawler/index.js';
import { catalog, limitations } from '../i18n/index.js';
import { renderHtml } from '../reports/html.js';
import { desktopConfig } from './config.js';
import type { ScanReport } from '../core/types.js';

const htmlPath = fileURLToPath(new URL('../../../desktop/index.html', import.meta.url));
const preloadPath = fileURLToPath(new URL('../../../desktop/preload.cjs', import.meta.url));
const iconPath = fileURLToPath(new URL('../../../assets/website-seo-auditor-logo.png', import.meta.url));
const externalLinks = new Set([
  'https://crelynstudio.com', 'mailto:info@crelynstudio.com',
  'https://github.com/crelynstudio', 'https://www.behance.net/crelynstudio',
  'https://www.instagram.com/crelynstudio/', 'https://x.com/crelynstudio',
  'https://www.threads.com/@crelynstudio'
]);
let window: BrowserWindow | null = null;
let activeRun: AbortController | null = null;
let lastReport: ScanReport | null = null;
let restoreBounds: Electron.Rectangle | null = null;

function trustedSender(sender: Electron.WebContents): boolean {
  return sender === window?.webContents && !sender.isDestroyed();
}

function createWindow(): void {
  const area = screen.getPrimaryDisplay().workArea;
  const width = Math.min(1152, area.width, Math.floor(area.height * 16 / 9));
  const height = Math.round(width * 9 / 16);
  window = new BrowserWindow({
    width, height, minWidth: 640, minHeight: 360, frame: false, maximizable: false, fullscreenable: false,
    show: !app.commandLine.hasSwitch('capture-hidden'),
    backgroundColor: '#F2F3F7', icon: iconPath, title: 'Website SEO Auditor',
    webPreferences: { preload: preloadPath, nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true,
      offscreen: app.commandLine.hasSwitch('capture-hidden') }
  });
  window.setAspectRatio(16 / 9);
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (externalLinks.has(url) || /^https:\/\/github\.com\/crelynstudio\/crelyn-studio-website-seo-auditor\/blob\/main\/docs\/rules\.md#[a-z0-9_]+$/.test(url)) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', event => event.preventDefault());
  window.on('closed', () => { activeRun?.abort(); window = null; restoreBounds = null; });
  void window.loadFile(htmlPath);
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  ipcMain.handle('window:control', (event, action: unknown) => {
    if (!trustedSender(event.sender) || !window) return { ok: false };
    if (action === 'minimize') { window.minimize(); return { ok: true }; }
    if (action === 'close') { window.close(); return { ok: true }; }
    if (action === 'toggle-size') {
      if (restoreBounds) {
        window.setBounds(restoreBounds);
        restoreBounds = null;
      } else {
        const current = window.getBounds();
        const area = screen.getDisplayMatching(current).workArea;
        const width = Math.min(area.width, Math.floor(area.height * 16 / 9));
        const height = Math.round(width * 9 / 16);
        restoreBounds = current;
        window.setBounds({ x: area.x + Math.floor((area.width - width) / 2), y: area.y + Math.floor((area.height - height) / 2), width, height });
      }
      return { ok: true, enlarged: Boolean(restoreBounds) };
    }
    return { ok: false };
  });
  ipcMain.handle('audit:start', async (event, request: unknown) => {
    if (!trustedSender(event.sender)) return { ok: false, code: 'UNTRUSTED_WINDOW' };
    if (activeRun) return { ok: false, code: 'SCAN_RUNNING' };
    try {
      const config = desktopConfig(request);
      const controller = new AbortController();
      activeRun = controller;
      lastReport = null;
      try {
        const report = await scan(config, controller.signal, (discovered, crawled, skipped) => {
          if (trustedSender(event.sender)) event.sender.send('audit:progress', { discovered, crawled, skipped });
        });
        lastReport = report;
        return { ok: true, report, catalog, limitations: { en: limitations('en'), tr: limitations('tr') } };
      } finally { activeRun = null; }
    } catch (error) {
      return { ok: false, code: error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'SCAN_FAILED' };
    }
  });
  ipcMain.handle('audit:cancel', event => {
    if (!trustedSender(event.sender)) return false;
    activeRun?.abort();
    return Boolean(activeRun);
  });
  ipcMain.handle('report:save', async (event, format: unknown, language: unknown) => {
    if (!trustedSender(event.sender) || !lastReport || !['html', 'json'].includes(String(format)) || !['en', 'tr'].includes(String(language))) return { ok: false, code: 'REPORT_UNAVAILABLE' };
    const selected = format as 'html' | 'json';
    const host = new URL(lastReport.target).hostname.replace(/[^a-z0-9.-]/gi, '-');
    const localDate = new Date(lastReport.startedAt).toLocaleDateString('sv-SE');
    const defaultPath = join(app.getPath('documents'), `Website-SEO-Auditor-${host}-${localDate}.${selected}`);
    const choice = await dialog.showSaveDialog(window!, {
      title: language === 'tr' ? 'Raporu kaydet' : 'Save report', defaultPath,
      filters: [{ name: language === 'tr' ? 'Rapor' : 'Report', extensions: [selected] }]
    });
    if (choice.canceled || !choice.filePath) return { ok: false, cancelled: true };
    try {
      await writeFile(choice.filePath, selected === 'html' ? await renderHtml(lastReport) : JSON.stringify(lastReport, null, 2) + '\n', 'utf8');
      return { ok: true, path: choice.filePath };
    } catch { return { ok: false, code: 'SAVE_FAILED' }; }
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => app.quit());
