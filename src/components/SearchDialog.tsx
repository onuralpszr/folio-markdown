import { useT } from '../ui';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Modal } from './Modal';
import { searchDocument, type Match } from '../core/search';
export function SearchDialog({
  source,
  onApply,
  onClose,
}: {
  source: string;
  onApply: (source: string) => void;
  onClose: () => void;
}) {
  const ui = useT();

  const [query, setQuery] = useState(''),
    [replacement, setReplacement] = useState(''),
    [regex, setRegex] = useState(false),
    [caseSensitive, setCaseSensitive] = useState(false),
    [wholeWord, setWholeWord] = useState(false),
    [matches, setMatches] = useState<Match[]>([]),
    [error, setError] = useState(''),
    [index, setIndex] = useState(0);
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      void searchDocument(source, query, regex, caseSensitive, undefined, wholeWord)
        .then((r) => {
          if (active) {
            setMatches(r.matches);
            setError('');
            setIndex(0);
          }
        })
        .catch((e) => {
          if (active) {
            setMatches([]);
            setError(e.message);
          }
        });
    }, 120);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [source, query, regex, caseSensitive, wholeWord]);
  async function replace(all: boolean) {
    if (all && !window.confirm(`${matches.length} eşleşme değiştirilecek. Devam edilsin mi?`))
      return;
    try {
      const result = await searchDocument(
        source,
        query,
        regex,
        caseSensitive,
        replacement,
        wholeWord,
        all ? undefined : index,
      );
      if (result.result !== undefined) onApply(result.result);
    } catch (e: any) {
      setError(e.message);
    }
  }
  return (
    <Modal
      title={ui('Belgende ara')}
      eyebrow={ui('ARA VE DEĞİŞTİR')}
      onClose={onClose}
      footer={
        <>
          <span className="footer-hint">
            {matches.length ? `${index + 1} / ${matches.length}` : '0'}
            {ui('eşleşme · Markdown kaynağı')}
          </span>
          <button className="button" disabled={!matches.length} onClick={() => replace(false)}>
            {ui('Değiştir')}
          </button>
          <button
            className="button primary"
            disabled={!matches.length}
            onClick={() => replace(true)}
          >
            {ui('Tümünü değiştir')}
          </button>
        </>
      }
    >
      <div className="form-stack">
        <label>
          {ui('Aranacak metin')}
          <div className="search-input-row">
            <input
              autoFocus
              placeholder={ui('Ne arıyorsun?')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              title={ui('Önceki eşleşme')}
              onClick={() => setIndex((index - 1 + matches.length) % Math.max(1, matches.length))}
            >
              <ChevronUp size={16} />
            </button>
            <button
              title={ui('Sonraki eşleşme')}
              onClick={() => setIndex((index + 1) % Math.max(1, matches.length))}
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </label>
        <label>
          {ui('Yeni metin')}
          <input value={replacement} onChange={(e) => setReplacement(e.target.value)} />
        </label>
        <div className="dialog-options">
          <label>
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            {ui('Büyük/küçük harf')}
          </label>
          <label>
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
            />
            {ui('Tam sözcük')}
          </label>
          <label>
            <input type="checkbox" checked={regex} onChange={(e) => setRegex(e.target.checked)} />
            {ui('Regex')}
          </label>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="search-results">
          {matches.slice(0, 100).map((m, i) => (
            <button className={i === index ? 'selected' : ''} key={i} onClick={() => setIndex(i)}>
              <span>{source.slice(0, m.index).split('\n').length}</span>
              <code>
                {source.slice(Math.max(0, m.index - 25), m.index)}
                <mark>{m[0]}</mark>
                {source.slice(m.index + m[0].length, m.index + m[0].length + 40)}
              </code>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
