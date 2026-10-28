import { contextBridge, ipcRenderer, webUtils } from 'electron';
const on = (channel: string, fn: (...args: any[]) => void) => {
  const listener = (_: unknown, ...args: any[]) => fn(...args);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
};
contextBridge.exposeInMainWorld('desktop', {
  open: () => ipcRenderer.invoke('files:open'),
  read: (id: string) => ipcRenderer.invoke('files:read', id),
  drop: (files: File[]) =>
    ipcRenderer.invoke(
      'files:drop',
      files.map((file) => webUtils.getPathForFile(file)).filter(Boolean),
    ),
  importPackage: () => ipcRenderer.invoke('package:open'),
  save: (file: unknown, saveAs: boolean) => ipcRenderer.invoke('files:save', file, saveAs),
  drafts: () => ipcRenderer.invoke('drafts:list'),
  draft: (d: unknown) => ipcRenderer.invoke('drafts:write', d),
  removeDraft: (id: string) => ipcRenderer.invoke('drafts:remove', id),
  recents: () => ipcRenderer.invoke('files:recents'),
  folder: () => ipcRenderer.invoke('folder:open'),
  children: (id: string) => ipcRenderer.invoke('folder:children', id),
  fileAction: (action: string, id: string, name: string) =>
    ipcRenderer.invoke('files:action', action, id, name),
  searchFolder: (query: string, caseSensitive: boolean) =>
    ipcRenderer.invoke('folder:search', query, caseSensitive),
  replaceFiles: (query: string, replacement: string, caseSensitive: boolean, files: unknown) =>
    ipcRenderer.invoke('folder:replace', query, replacement, caseSensitive, files),
  addAsset: (id: string, data: string, name: string) =>
    ipcRenderer.invoke('assets:add', id, data, name),
  asset: (id: string, ref: string) => ipcRenderer.invoke('assets:read', id, ref),
  resource: (url: string) => ipcRenderer.invoke('assets:resource', url),
  renderDiagram: (source: string, id: string) => ipcRenderer.invoke('diagrams:render', source, id),
  exportFile: (name: string, data: string, format: string) =>
    ipcRenderer.invoke('export:file', name, data, format),
  pdf: (html: string, landscape: boolean) => ipcRenderer.invoke('export:pdf', html, landscape),
  external: (url: string) => ipcRenderer.invoke('external', url),
  navigate: (id: string, reference: string) => ipcRenderer.invoke('files:navigate', id, reference),
  history: (id: string) => ipcRenderer.invoke('history:list', id),
  settings: (value: unknown) => ipcRenderer.invoke('settings', value),
  session: (value: unknown) => ipcRenderer.invoke('session', value),
  info: () => ipcRenderer.invoke('app:info'),
  maintenance: (action: string) => ipcRenderer.invoke('app:maintenance', action),
  updates: (action: string, url: string) => ipcRenderer.invoke('app:updates', action, url),
  ready: () => ipcRenderer.send('renderer:ready'),
  onOpen: (fn: (...args: any[]) => void) => on('files:opened', fn),
  onMenu: (fn: (...args: any[]) => void) => on('menu', fn),
  onDiskChange: (fn: (...args: any[]) => void) => on('files:changed', fn),
  approveClose: () => ipcRenderer.send('window:close-approved'),
});
