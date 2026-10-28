import { useT } from '../ui';
import { useEffect, useState } from 'react';
import { BookOpen, ShieldCheck } from 'lucide-react';
import { api } from '../platform';
import type { UpdateInfo } from '../types';
import { Modal } from './Modal';
export function AboutDialog({
  updateURL,
  onURL,
  onInstall,
  onClose,
}: {
  updateURL: string;
  onURL: (url: string) => void;
  onInstall: () => Promise<void>;
  onClose: () => void;
}) {
  const ui = useT();

  const [info, setInfo] = useState<Awaited<ReturnType<typeof api.info>>>(),
    [status, setStatus] = useState<UpdateInfo>(),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    void api.info().then(setInfo);
  }, []);
  async function update(action: 'check' | 'download') {
    setBusy(true);
    try {
      setStatus(await api.updates(action, updateURL));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={ui('Folio hakkında')}
      eyebrow={ui('YEREL MARKDOWN ATÖLYESİ')}
      onClose={onClose}
      footer={
        <>
          <span className="footer-hint">
            {info?.platform}
            {ui('·')}
            {info?.arch}
            {ui('·')}
            {info?.portable ? 'Portable' : info?.packaged ? 'Masaüstü paketi' : 'Geliştirme ortamı'}
          </span>
          <button className="button primary" onClick={onClose}>
            {ui('Tamam')}
          </button>
        </>
      }
    >
      <div className="about-brand">
        <BookOpen size={38} />
        <div>
          <strong>{ui('folio.')}</strong>
          <span>
            {ui('Sürüm')}
            {info?.version || '…'}
          </span>
        </div>
      </div>
      <div className="privacy-note">
        <ShieldCheck size={21} />
        <span>
          {ui(
            'Hesap, telemetri veya içerik yüklemesi yok. Belgelerin bilgisayarında kalır. Güncelleme denetimi yalnız aşağıdaki eylemle yapılır.',
          )}
        </span>
      </div>
      <h3>{ui('Güncellemeler')}</h3>
      <label className="form-stack">
        {ui('Yayın kanalı (HTTPS)')}
        <input
          placeholder={ui('https://yayinci.example/releases/')}
          value={updateURL}
          onChange={(e) => onURL(e.target.value)}
        />
      </label>
      <div className="settings-actions">
        <button className="button" disabled={busy} onClick={() => update('check')}>
          {busy ? 'İşlem sürüyor…' : 'Güncellemeleri denetle'}
        </button>
        {status?.state === 'available' && (
          <button className="button primary" disabled={busy} onClick={() => update('download')}>
            {ui('Sürüm')}
            {status.version}
            {ui('indir')}
          </button>
        )}
        {status?.state === 'downloaded' && (
          <button className="button primary" onClick={onInstall}>
            {ui('Belgeleri kaydet ve güncelle')}
          </button>
        )}
      </div>
      {status && (
        <p className={status.state === 'error' ? 'error-message' : 'muted'}>{status.message}</p>
      )}
      <hr />
      <h3>{ui('Yerel veriler')}</h3>
      <div className="settings-actions">
        <button className="button" onClick={() => api.maintenance('show-data')}>
          {ui('Veri klasörünü göster')}
        </button>
        <button className="button" onClick={() => api.maintenance('clear-recents')}>
          {ui('Son dosyaları temizle')}
        </button>
        <button className="button" onClick={() => api.maintenance('clear-history')}>
          {ui('Kayıt geçmişini temizle')}
        </button>
        <button
          className="button"
          onClick={() =>
            api.exportFile(
              'folio-tanilama.json',
              JSON.stringify(
                {
                  application: 'Folio',
                  ...info,
                  generated: new Date().toISOString(),
                  contentIncluded: false,
                  filePathsIncluded: false,
                },
                null,
                2,
              ),
              'json',
            )
          }
        >
          {ui('Tanılama bilgilerini kaydet')}
        </button>
      </div>
      <p className="muted">
        {ui(
          'Temizleme işlemleri Markdown dosyalarını veya kurtarılmamış taslakları silmez. Tanılama belgesi içerik ve kişisel dosya yolları içermez.',
        )}
      </p>
    </Modal>
  );
}
