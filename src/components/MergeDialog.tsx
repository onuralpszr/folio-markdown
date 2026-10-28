import { useT } from '../ui';
import { useMemo, useState } from 'react';
import { diff3Merge } from 'node-diff3';
import { Modal } from './Modal';
const lines = (s: string) => s.match(/[^\r\n]*(?:\r\n|\n|\r|$)/g)?.filter(Boolean) || [];
export function MergeDialog({
  base,
  local,
  disk,
  onApply,
  onClose,
}: {
  base: string;
  local: string;
  disk: string;
  onApply: (source: string) => void;
  onClose: () => void;
}) {
  const ui = useT();

  const regions = useMemo(
    () => diff3Merge(lines(local), lines(base), lines(disk), { excludeFalseConflicts: true }),
    [],
  );
  const [choices, setChoices] = useState<Record<number, 'local' | 'disk' | 'both'>>({});
  const conflicts = regions.flatMap((region, i) =>
    region.conflict ? [{ ...region.conflict, i }] : [],
  );
  const unresolved = conflicts.filter((c) => !choices[c.i]).length;
  const result = regions
    .map(
      (r, i) =>
        r.ok?.join('') ??
        (choices[i] === 'local'
          ? r.conflict!.a.join('')
          : choices[i] === 'disk'
            ? r.conflict!.b.join('')
            : choices[i] === 'both'
              ? r.conflict!.a.join('') + r.conflict!.b.join('')
              : ''),
    )
    .join('');
  return (
    <Modal
      title={ui('Değişiklikleri birleştir')}
      eyebrow={ui('ÜÇ YÖNLÜ KARŞILAŞTIRMA')}
      wide
      onClose={onClose}
      footer={
        <>
          <span className="footer-hint">
            {unresolved ? `${unresolved} çakışma seçim bekliyor` : 'Tüm değişiklikler çözümlendi'}
            {ui('· Henüz diske yazılmaz')}
          </span>
          <button className="button" onClick={onClose}>
            {ui('İptal')}
          </button>
          <button
            className="button primary"
            disabled={unresolved > 0}
            onClick={() => onApply(result)}
          >
            {ui('Birleşimi belgeye uygula')}
          </button>
        </>
      }
    >
      <p className="muted">
        {ui(
          'Çakışmayan değişiklikler otomatik birleştirildi. Aynı alanı etkileyen değişikliklerde hangi içeriği koruyacağını seç.',
        )}
      </p>
      {conflicts.map((c) => (
        <div className="merge-region" key={c.i}>
          <div className="section-label">
            {ui('Çakışan alan')}
            <div>
              {(
                [
                  ['local', 'Benimki'],
                  ['disk', 'Diskteki'],
                  ['both', 'İkisi de'],
                ] as const
              ).map(([key, label]) => (
                <button
                  className={`button small ${choices[c.i] === key ? 'primary' : ''}`}
                  key={key}
                  onClick={() => setChoices({ ...choices, [c.i]: key })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="conflict-columns">
            <div>
              <h4>{ui('Benim değişikliğim')}</h4>
              <pre>{c.a.join('')}</pre>
            </div>
            <div>
              <h4>{ui('Diskteki değişiklik')}</h4>
              <pre>{c.b.join('')}</pre>
            </div>
          </div>
          <details>
            <summary>{ui('Ortak önceki sürüm')}</summary>
            <pre>{c.o.join('')}</pre>
          </details>
        </div>
      ))}
      {!unresolved && (
        <div>
          <h3>{ui('Birleşmiş belge')}</h3>
          <pre className="merge-result">{result}</pre>
        </div>
      )}
    </Modal>
  );
}
