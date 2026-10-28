import { describe, it, expect } from 'vitest';
import { project, serialize, bindLedger, headings, parse } from '../src/core/markdown';
import {
  diagramKinds,
  diagramSource,
  newDiagram,
  parseDiagram,
  validateDiagram,
} from '../src/core/diagrams';
import { parseCSV, stringifyCSV, tableMarkdown } from '../src/core/csv';
import { DocumentHistory } from '../src/core/history';

describe('source preservation', () => {
  it('treats a Markdown details section as one lossless editable block', () => {
    const source =
      '<details>\n<summary>Ayrıntılar</summary>\n\n**İçerik**\n\n- Bir öğe\n\n</details>\n\n# Sonraki\n';
    const result = project(source);
    expect(result.doc.content?.[0].attrs?.kind).toBe('details');
    expect(result.doc.content).toHaveLength(2);
    bindLedger(result.doc, result.ledger);
    expect(serialize(result.doc, result.ledger)).toBe(source);
  });
  const fixtures = [
    '\uFEFF# Başlık\r\n\r\nBir **fikir**.\r\n\r\n<!-- özel yorum -->\r\n',
    'Başlık\n======\n\nBir [bağlantı][hedef].\n\n[hedef]: https://example.com "Başlık"\n',
    '---\ntitle: Örnek # yorum\n---\n\n$$\nx^2\n$$\n\n~~~mermaid\nflowchart LR\n A --> B\n~~~\n',
    '- [x] İş\n- [ ] Başka iş\n\n| A | B |\n| :- | -: |\n| a \\| b | c |\n',
    '<details>\n<summary>Not</summary>\n\nİçerik\n</details>\n\n[^n]: Dipnot\n',
    '# 😀 Türkçe İıı\n\nBir satır\nsonraki.\n\n```js\nconst x = `a`;\n```',
    '',
    '\n\n',
    '# Başlık\r\n\nMetin\n\r\n',
  ];
  for (const [i, fixture] of fixtures.entries())
    it(`preserves unchanged fixture ${i} byte-for-byte`, () => {
      const p = project(fixture);
      bindLedger(p.doc, p.ledger);
      if (fixture.trim()) expect(serialize(p.doc, p.ledger)).toBe(fixture);
    });
  it('changes one block without rewriting comments or other syntax', () => {
    const source = 'Başlık\n======\n\nBir metin.\n\n<!-- gizli yorum -->\n\n~~~js\nx()\n~~~\n';
    const p = project(source);
    bindLedger(p.doc, p.ledger);
    p.doc.content![1].content![0].text = 'Yeni metin.';
    const result = serialize(p.doc, p.ledger);
    expect(result).toBe(source.replace('Bir metin.', 'Yeni metin.'));
  });
  it('escapes newly inserted table pipes', () => {
    const p = project('| A | B |\n| - | - |\n| C | D |\n');
    bindLedger(p.doc, p.ledger);
    p.doc.content![0].content![1].content![0].content![0].content![0].text = 'a | b';
    expect(
      parse(serialize(p.doc, p.ledger)).children[0].children[1].children[0].children[0].value,
    ).toBe('a | b');
  });
  it('creates deterministic duplicate heading anchors', () => {
    expect(headings('# Aynı\n\n## Aynı\n').map((h) => h.id)).toEqual(['aynı', 'aynı-1']);
  });
});
describe('diagram model round trips', () => {
  for (const [kind] of diagramKinds)
    it(kind, () => {
      const original = newDiagram(kind);
      expect(validateDiagram(original)).toEqual([]);
      const source = diagramSource(original);
      const parsed = parseDiagram(source);
      expect(parsed.safe, source).toBe(true);
      expect(diagramSource(parsed.model)).toBe(source);
    });
  it('preserves an unknown dialect instead of pretending visual support', () => {
    expect(parseDiagram('flowchart LR\n A@{shape: cloud} --> B').safe).toBe(false);
  });
  it('detects cyclic sankey data', () => {
    const m = newDiagram('sankey-beta');
    m.rows = [
      { from: 'A', to: 'B', value: '1' },
      { from: 'B', to: 'A', value: '1' },
    ];
    expect(validateDiagram(m).length).toBeGreaterThan(0);
  });
  it('detects mindmap loops', () => {
    const m = newDiagram('mindmap');
    m.nodes[0].group = m.nodes[1].id;
    expect(validateDiagram(m).length).toBeGreaterThan(0);
  });
});
describe('tabular interchange', () => {
  it('reads quoted fields and multiline cells', () => {
    expect(parseCSV('A,B\r\n"a,b","c""d"\r\n"iki\nsatır",x')).toEqual([
      ['A', 'B'],
      ['a,b', 'c"d'],
      ['iki\nsatır', 'x'],
    ]);
  });
  it('round trips TSV', () => {
    const rows = [
      ['a', 'b'],
      ['çok\nsatır', 'a\tb'],
    ];
    expect(parseCSV(stringifyCSV(rows, '\t'), '\t')).toEqual(rows);
  });
  it('neutralizes spreadsheet formula injection', () => {
    expect(stringifyCSV([['=HYPERLINK("x")']])).toContain("'=HYPERLINK");
  });
  it('escapes Markdown table data', () => {
    const md = tableMarkdown([
      ['A', 'B'],
      ['x|y', 'iki\nsatır'],
    ]);
    expect(md).toContain('x\\|y');
    expect(md).toContain('<br>');
  });
});
describe('shared document history', () => {
  it('coalesces typing but keeps modal edits separate across views', () => {
    const h = new DocumentHistory('');
    h.record('a', 1000);
    h.record('ab', 1100);
    h.record('abc', 1200);
    h.isolate();
    h.record('abc\n\n| A |\n| - |\n', 1300);
    expect(h.undo()).toBe('abc');
    expect(h.undo()).toBe('');
    expect(h.redo()).toBe('abc');
    expect(h.redo()).toContain('| A |');
  });
  it('invalidates redo only after a new edit', () => {
    const h = new DocumentHistory('old');
    h.record('new');
    h.undo();
    h.record('other');
    expect(h.canRedo).toBe(false);
  });
});
