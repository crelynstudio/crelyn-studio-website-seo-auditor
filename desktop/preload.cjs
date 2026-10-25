const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('siteMercek', {
  startAudit: request => ipcRenderer.invoke('audit:start', request),
  cancelAudit: () => ipcRenderer.invoke('audit:cancel'),
  saveReport: (format, language) => ipcRenderer.invoke('report:save', format, language),
  onProgress: callback => {
    const listener = (_event, progress) => callback(progress);
    ipcRenderer.on('audit:progress', listener);
    return () => ipcRenderer.removeListener('audit:progress', listener);
  }
});
