import { describe, it, expect } from 'vitest';
import { zipSync, strToU8 } from 'fflate';
import { readArchive } from '../electron/archive';
describe('safe document packages', () => {
  it('previews without inflating then validates and inflates', () => {
    const bytes = zipSync({
      'Belge.md': strToU8('# Türkçe'),
      'Belge.assets/resim.png': new Uint8Array([1, 2, 3]),
    });
    const preview = readArchive(bytes);
    expect(preview.list).toHaveLength(2);
    expect(Object.keys(preview.data)).toHaveLength(0);
    const result = readArchive(bytes, true);
    expect(new TextDecoder().decode(result.data['Belge.md'])).toBe('# Türkçe');
  });
  for (const name of ['../secret.md', '/secret.md', 'C:\\secret.md', 'a/../../secret.md'])
    it(`rejects ${name}`, () => {
      const bytes = zipSync({ [name]: strToU8('x') });
      expect(() => readArchive(bytes, true)).toThrow();
    });
  it('rejects executable payloads', () =>
    expect(() => readArchive(zipSync({ 'run.js': strToU8('evil()') }))).toThrow('desteklenmeyen'));
  it('rejects names that collide on case-insensitive file systems', () =>
    expect(() => readArchive(zipSync({ 'A.md': strToU8('a'), 'a.md': strToU8('b') }))).toThrow(
      'çakışan',
    ));
  it('detects corrupt data using CRC', () => {
    const bytes = zipSync({ 'a.md': strToU8('document') }, { level: 0 });
    const nameLength = new DataView(bytes.buffer).getUint16(26, true),
      extraLength = new DataView(bytes.buffer).getUint16(28, true);
    bytes[30 + nameLength + extraLength] ^= 1;
    expect(() => readArchive(bytes, true)).toThrow('bütünlük');
  });
});
