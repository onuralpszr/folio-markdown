import { useT } from '../ui';
import { useState } from 'react';
import { FileText, Search } from 'lucide-react';
import { Modal } from './Modal';
import { api } from '../platform';
import type { FolderMatch } from '../types';
export function FolderSearchDialog({
  dirtyIds,
  onOpen,
  onClose,
}: {
  dirtyIds: string[];
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const ui = useT();

  const [query, setQuery] = useState(''),
    [replacement, setReplacement] = useState(''),
    [caseSensitive, setCaseSensitive] = useState(false),
    [results, setResults] = useState<FolderMatch[]>([]),
    [selected, setSelected] = useState<Set<string>>(new Set()),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [report, setReport] = useState('');
  async function search() {
    if (!query.trim()) return;
    setBusy(true);
    setError('');
    setReport('');
    try {
      const r = await api.searchFolder(query, caseSensitive);
      setResults(r.results);
      setSelected(new Set(r.results.filter((f) => !dirtyIds.includes(f.id)).map((f) => f.id)));
      if (r.truncated)
        setError('Tarama sınırına ulaşıldı; bazı büyük dosyalar veya sonuçlar atlandı.');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function replace() {
    const files = results.filter((f) => selected.has(f.id));
    if (
      !window.confirm(
        `${files.length} ${ui('dosyada değişiklik yapılacak. Özgün sürümler yerel geçmişte korunacak. Devam edilsin mi?')}`,
      )
    )
      return;
    setBusy(true);
    try {
      const outcome = await api.replaceFiles(
        query,
        replacement,
        caseSensitive,
        files.map((f) => ({ id: f.id, hash: f.hash })),
      );
      const errors = outcome.filter((r) => r.error);
      setReport(
        `${outcome.length - errors.length} dosya değiştirildi. ${errors.length} dosya değiştirilemedi.`,
      );
      if (errors.length)
        setError(
          errors.map((r) => `${results.find((f) => f.id === r.id)?.name}: ${r.error}`).join('\n'),
        );
      setResults([]);
      setSelected(new Set());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={ui('Klasörde ara ve değiştir')}
      eyebrow={ui('ÇALIŞMA ALANI ARAÇLARI')}
      wide
      onClose={onClose}
      footer={
        <>
          <span className="footer-hint">
            {selected.size}
            {ui('dosya seçili · Kaydedilmemiş açık dosyalar korunur')}
          </span>
          <button className="button" onClick={onClose}>
            {ui('Kapat')}
          </button>
          <button className="button primary" disabled={busy || !selected.size} onClick={replace}>
            {ui('Seçili dosyalarda değiştir')}
          </button>
        </>
      }
    >
      <div className="folder-search-fields">
        <label>
          {ui('Aranacak metin')}
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setResults([]);
              setSelected(new Set());
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void search();
            }}
          />
        </label>
        <label>
          {ui('Yeni metin')}
          <input value={replacement} onChange={(e) => setReplacement(e.target.value)} />
        </label>
        <button className="button primary" disabled={busy || !query.trim()} onClick={search}>
          <Search size={14} />
          {busy ? 'Aranıyor…' : 'Ara'}
        </button>
      </div>
      <label className="setting-toggle">
        <span>{ui('Büyük/küçük harfe duyarlı')}</span>
        <input
          type="checkbox"
          checked={caseSensitive}
          onChange={(e) => {
            setCaseSensitive(e.target.checked);
            setResults([]);
            setSelected(new Set());
          }}
        />
      </label>
      {error && <p className="error-message">{error}</p>}
      {report && <div className="privacy-note">{report}</div>}
      <div className="folder-search-results">
        {results.map((file) => (
          <section key={file.id}>
            <header>
              <input
                aria-label={file.name + ' dosyasını seç'}
                disabled={dirtyIds.includes(file.id)}
                type="checkbox"
                checked={selected.has(file.id)}
                onChange={(e) =>
                  setSelected((old) => {
                    const next = new Set(old);
                    if (e.target.checked) next.add(file.id);
                    else next.delete(file.id);
                    return next;
                  })
                }
              />
              <FileText size={14} />
              <button
                onClick={() => {
                  onOpen(file.id);
                  onClose();
                }}
              >
                {file.name}
              </button>
              <span>
                {file.count}
                {ui('eşleşme')}
              </span>
              {dirtyIds.includes(file.id) && <small>{ui('Kaydedilmemiş değişiklik var')}</small>}
            </header>
            {file.matches.slice(0, 20).map((m, i) => (
              <div key={i}>
                <span>{m.line}</span>
                <code>{m.excerpt}</code>
              </div>
            ))}
          </section>
        ))}
      </div>
      {!results.length && !busy && (
        <p className="muted">
          {ui(
            'Açık klasördeki Markdown dosyaları taranır. Değişiklikten önce dosyaları ve yeni metni inceleyin. Diskte değişmiş dosyalara yazılmaz.',
          )}
        </p>
      )}
    </Modal>
  );
}
