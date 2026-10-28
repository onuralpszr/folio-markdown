export type DiskFile = {
  id: string;
  name: string;
  path?: string;
  source: string;
  hash?: string;
  readonly?: boolean;
  eol?: string;
  encoding?: string;
};
export type SaveResult = {
  ok: boolean;
  canceled?: boolean;
  conflict?: boolean;
  error?: string;
  file?: DiskFile;
};
export type Tab = DiskFile & {
  saved: string;
  revision: number;
  recovered?: boolean;
  pinned?: boolean;
};
export type Draft = { id: string; name: string; path?: string; source: string; date: string };
export type FileEntry = { id: string; name: string; directory: boolean };
export type FolderMatch = {
  id: string;
  name: string;
  hash: string;
  count: number;
  matches: { line: number; excerpt: string }[];
};
export type UpdateInfo = {
  state: 'idle' | 'checking' | 'available' | 'current' | 'downloaded' | 'error';
  message: string;
  version?: string;
};
export interface DesktopAPI {
  open(): Promise<DiskFile[]>;
  drop(files: File[]): Promise<DiskFile[]>;
  importPackage(): Promise<DiskFile[]>;
  read(id: string): Promise<DiskFile>;
  save(file: DiskFile, saveAs?: boolean): Promise<SaveResult>;
  drafts(): Promise<Draft[]>;
  draft(draft: Draft): Promise<void>;
  removeDraft(id: string): Promise<void>;
  recents(): Promise<{ id: string; name: string; path: string }[]>;
  folder(): Promise<FileEntry[]>;
  children(id: string): Promise<FileEntry[]>;
  fileAction(
    action: 'rename' | 'trash' | 'reveal' | 'create-file' | 'create-folder',
    id: string,
    name?: string,
  ): Promise<{ file?: DiskFile; entries?: FileEntry[] }>;
  searchFolder(
    query: string,
    caseSensitive: boolean,
  ): Promise<{ results: FolderMatch[]; truncated: boolean }>;
  replaceFiles(
    query: string,
    replacement: string,
    caseSensitive: boolean,
    files: { id: string; hash: string }[],
  ): Promise<{ id: string; error?: string }[]>;
  addAsset(documentId: string, data: string, name: string): Promise<string>;
  asset(documentId: string, reference: string): Promise<string>;
  resource(url: string): Promise<string>;
  renderDiagram(source: string, id: string): Promise<string>;
  exportFile(name: string, data: string, format: string): Promise<boolean>;
  pdf(html: string, landscape: boolean): Promise<boolean>;
  external(url: string): Promise<void>;
  navigate(documentId: string, reference: string): Promise<void>;
  history(id: string): Promise<Draft[]>;
  settings(value?: Record<string, unknown>): Promise<Record<string, unknown>>;
  session(value?: {
    documents: { id: string; pinned?: boolean }[];
    activeId: string;
    mode: string;
  }): Promise<{ files: (DiskFile & { pinned?: boolean })[]; activeId?: string; mode?: string }>;
  info(): Promise<{
    version: string;
    platform: string;
    arch: string;
    portable: boolean;
    packaged: boolean;
  }>;
  maintenance(action: 'show-data' | 'clear-recents' | 'clear-history'): Promise<void>;
  updates(action: 'check' | 'download' | 'install', url?: string): Promise<UpdateInfo>;
  ready(): void;
  onOpen(fn: (files: DiskFile[]) => void): () => void;
  onMenu(fn: (action: string) => void): () => void;
  onDiskChange(fn: (file: DiskFile) => void): () => void;
  approveClose(): void;
}
declare global {
  interface Window {
    desktop?: DesktopAPI;
  }
}
