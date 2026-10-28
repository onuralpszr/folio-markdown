import { describe, it, expect } from 'vitest';
import { diff3Merge } from 'node-diff3';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { relocateAssets } from '../electron/assets';
describe('three-way merge', () => {
  it('merges nonoverlapping edits', () => {
    const base = ['a', 'b', 'c', 'd', 'e'];
    const regions = diff3Merge(['A', 'b', 'c', 'd', 'e'], base, ['a', 'b', 'c', 'd', 'E']);
    expect(regions.flatMap((r) => r.ok || [])).toEqual(['A', 'b', 'c', 'd', 'E']);
    expect(regions.some((r) => r.conflict)).toBe(false);
  });
  it('exposes a real conflict instead of silently choosing a side', () => {
    const regions = diff3Merge(['mine'], ['base'], ['theirs']);
    expect(regions[0].conflict).toMatchObject({ a: ['mine'], b: ['theirs'], o: ['base'] });
  });
});
describe('asset relocation', () => {
  it('copies assets, adjusts links, and preserves the original document', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'folio-assets-'));
    try {
      const original = path.join(dir, 'old.md'),
        target = path.join(dir, 'nested', 'new.md');
      await fs.mkdir(path.dirname(target));
      await fs.writeFile(path.join(dir, 'image.png'), 'test bytes');
      const source = '# Başlık\n\n![görsel](image.png)\n\n[Not](other.md#baslik)\n';
      const next = await relocateAssets(source, original, target);
      expect(next).toContain('new.assets/image-');
      expect(next).toContain('../other.md#baslik');
      const files = await fs.readdir(path.join(dir, 'nested', 'new.assets'));
      expect(await fs.readFile(path.join(dir, 'nested', 'new.assets', files[0]), 'utf8')).toBe(
        'test bytes',
      );
      expect(await fs.readFile(path.join(dir, 'image.png'), 'utf8')).toBe('test bytes');
    } finally {
      await fs.rm(dir, { recursive: true });
    }
  });
  it('keeps links with a literal percent sign instead of failing', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'folio-assets-'));
    try {
      await fs.mkdir(path.join(dir, 'nested'));
      const next = await relocateAssets(
        '[Rapor](100%.md)\n',
        path.join(dir, 'old.md'),
        path.join(dir, 'nested', 'new.md'),
      );
      expect(next).toBe('[Rapor](../100%.md)\n');
    } finally {
      await fs.rm(dir, { recursive: true });
    }
  });
});
