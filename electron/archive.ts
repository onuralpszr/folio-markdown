import { unzipSync } from 'fflate';
const crcTable = Uint32Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(data: Uint8Array) {
  let crc = -1;
  for (const byte of data) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 255];
  return (crc ^ -1) >>> 0;
}
export function readArchive(bytes: Uint8Array, inflate = false) {
  if (bytes.byteLength > 100 * 1024 * 1024) throw new Error('ZIP dosyası 100 MiB sınırını aşıyor.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength),
    metadata = new Map<string, { crc: number; size: number }>();
  let end = -1;
  for (let p = bytes.length - 22; p >= Math.max(0, bytes.length - 65557); p--)
    if (view.getUint32(p, true) === 0x06054b50) {
      end = p;
      break;
    }
  if (end < 0) throw new Error('Geçersiz ZIP arşivi.');
  const count = view.getUint16(end + 10, true);
  let cursor = view.getUint32(end + 16, true);
  if (
    count > 10000 ||
    count === 0xffff ||
    cursor === 0xffffffff ||
    view.getUint16(end + 4, true) !== 0
  )
    throw new Error('Çok parçalı/ZIP64 arşiv veya dosya sayısı destek sınırını aşıyor.');
  for (let i = 0; i < count; i++) {
    if (cursor + 46 > bytes.length || view.getUint32(cursor, true) !== 0x02014b50)
      throw new Error('Bozuk ZIP dizini.');
    const flags = view.getUint16(cursor + 8, true),
      length = view.getUint16(cursor + 28, true),
      extra = view.getUint16(cursor + 30, true),
      comment = view.getUint16(cursor + 32, true);
    if (flags & 1) throw new Error('Şifreli ZIP dosyaları desteklenmiyor.');
    if (((view.getUint32(cursor + 38, true) >>> 16) & 0xf000) === 0xa000)
      throw new Error('Arşivde sembolik bağlantı bulunamaz.');
    const name = new TextDecoder('utf-8', { fatal: true }).decode(
      bytes.subarray(cursor + 46, cursor + 46 + length),
    );
    metadata.set(name, {
      crc: view.getUint32(cursor + 16, true),
      size: view.getUint32(cursor + 24, true),
    });
    cursor += 46 + length + extra + comment;
  }
  const names = new Set<string>(),
    list: { name: string; size: number }[] = [];
  let total = 0;
  const data = unzipSync(bytes, {
    filter: (entry) => {
      const name = entry.name.replaceAll('\\', '/');
      if (
        name.startsWith('/') ||
        /^[a-z]:/i.test(name) ||
        name.split('/').some((s) => s === '..' || s === '.') ||
        /[\x00-\x1F]/.test(name)
      )
        throw new Error('Güvenli olmayan arşiv yolu: ' + name);
      if (name.endsWith('/')) return false;
      if (!/\.(md|markdown|txt|png|jpe?g|webp|gif|svg|json)$/i.test(name))
        throw new Error('Arşivde desteklenmeyen dosya var: ' + name);
      const key = name.normalize('NFC').toLowerCase();
      if (names.has(key)) throw new Error('Arşivde çakışan dosya adı: ' + name);
      names.add(key);
      const meta = metadata.get(entry.name);
      if (!meta || meta.size !== entry.originalSize)
        throw new Error('Arşiv dosya bilgileri tutarsız.');
      total += entry.originalSize;
      if (names.size > 10000 || total > 500 * 1024 * 1024 || entry.originalSize > 60 * 1024 * 1024)
        throw new Error('ZIP açılım boyutu veya dosya sayısı sınırı aşıldı.');
      list.push({ name, size: entry.originalSize });
      return inflate;
    },
  });
  if (inflate)
    for (const [name, contents] of Object.entries(data)) {
      const meta = metadata.get(name);
      if (!meta || contents.length !== meta.size || crc32(contents) !== meta.crc)
        throw new Error('Arşiv bütünlük kontrolü başarısız: ' + name);
    }
  return { data, list, total };
}
