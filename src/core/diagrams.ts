export const diagramKinds = [
  ['flowchart', 'Akış diyagramı', 'Süreçler, kararlar ve bağlantılar'],
  ['sequenceDiagram', 'Sıralama', 'Katılımcılar ve mesajlar'],
  ['classDiagram', 'Sınıf diyagramı', 'Sınıflar, alanlar ve ilişkiler'],
  ['erDiagram', 'Varlık ilişkileri', 'Veri modelleri ve kardinalite'],
  ['stateDiagram-v2', 'Durum diyagramı', 'Durumlar ve geçişler'],
  ['gantt', 'Gantt', 'Görevler, tarihler ve bağımlılıklar'],
  ['timeline', 'Zaman çizelgesi', 'Dönemler ve önemli olaylar'],
  ['mindmap', 'Zihin haritası', 'Düşünceleri dallandırın'],
  ['pie', 'Pasta grafik', 'Değerler ve dağılımlar'],
  ['journey', 'Kullanıcı yolculuğu', 'Aşamalar ve deneyim puanları'],
  ['gitGraph', 'Git grafiği', 'Dallar, commit ve birleştirmeler'],
  ['quadrantChart', 'Dört bölge', 'Öncelikler ve konumlandırma'],
  ['xychart-beta', 'XY grafik', 'Çizgi ve sütun serileri'],
  ['sankey-beta', 'Sankey', 'Kaynaklar, hedefler ve akışlar'],
  ['requirementDiagram', 'Gereksinimler', 'İsterler ve doğrulama ilişkileri'],
  ['kanban', 'Kanban', 'Sütunlar ve görev kartları'],
] as const;
export type DiagramKind = (typeof diagramKinds)[number][0];
export type DNode = {
  id: string;
  label: string;
  shape: string;
  group: string;
  detail: string;
  x?: number;
  y?: number;
};
export type DEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  type: string;
  start?: string;
  end?: string;
};
export type DiagramModel = {
  kind: DiagramKind;
  title: string;
  direction: string;
  nodes: DNode[];
  edges: DEdge[];
  rows: Record<string, string>[];
  options: Record<string, string>;
};
export type Field = {
  key: string;
  label: string;
  options?: string[];
  placeholder?: string;
  type?: string;
};
export const rowFields: Partial<Record<DiagramKind, Field[]>> = {
  sequenceDiagram: [
    {
      key: 'kind',
      label: 'İşlem',
      options: [
        'message',
        'note',
        'activate',
        'deactivate',
        'loop',
        'alt',
        'else',
        'opt',
        'par',
        'and',
        'break',
        'critical',
        'end',
      ],
    },
    { key: 'from', label: 'Gönderen / katılımcı' },
    { key: 'to', label: 'Alıcı' },
    { key: 'text', label: 'Mesaj / koşul' },
    { key: 'style', label: 'Ok', options: ['->>', '-->>', '-)', '--)'] },
  ],
  gantt: [
    { key: 'name', label: 'Görev' },
    { key: 'section', label: 'Bölüm' },
    { key: 'id', label: 'Kimlik' },
    { key: 'start', label: 'Başlangıç / bağımlılık', placeholder: '2026-10-26 veya after task1' },
    { key: 'duration', label: 'Süre / bitiş', placeholder: '5d' },
    { key: 'status', label: 'Durum', options: ['', 'active', 'done', 'crit', 'milestone'] },
  ],
  timeline: [
    { key: 'period', label: 'Dönem' },
    { key: 'text', label: 'Olay' },
    { key: 'section', label: 'Bölüm' },
  ],
  pie: [
    { key: 'label', label: 'Etiket' },
    { key: 'value', label: 'Değer', type: 'number' },
  ],
  journey: [
    { key: 'name', label: 'Görev' },
    { key: 'section', label: 'Aşama' },
    { key: 'score', label: 'Puan (1–5)', type: 'number' },
    { key: 'actors', label: 'Katılımcılar', placeholder: 'Kullanıcı, Ekip' },
  ],
  gitGraph: [
    {
      key: 'operation',
      label: 'İşlem',
      options: ['commit', 'branch', 'checkout', 'merge', 'cherry-pick'],
    },
    { key: 'name', label: 'Dal / commit kimliği' },
    { key: 'tag', label: 'Etiket' },
    { key: 'type', label: 'Commit tipi', options: ['', 'NORMAL', 'REVERSE', 'HIGHLIGHT'] },
  ],
  quadrantChart: [
    { key: 'label', label: 'Nokta' },
    { key: 'x', label: 'X (0–1)', type: 'number' },
    { key: 'y', label: 'Y (0–1)', type: 'number' },
  ],
  'xychart-beta': [
    { key: 'type', label: 'Seri', options: ['line', 'bar'] },
    { key: 'values', label: 'Değerler', placeholder: '10, 30, 20, 45' },
  ],
  'sankey-beta': [
    { key: 'from', label: 'Kaynak' },
    { key: 'to', label: 'Hedef' },
    { key: 'value', label: 'Ağırlık', type: 'number' },
  ],
};
const n = (id: string, label: string, shape = 'process', group = '', detail = ''): DNode => ({
  id,
  label,
  shape,
  group,
  detail,
});
const e = (from: string, to: string, label = '', type = 'arrow'): DEdge => ({
  id: `e-${from}-${to}`,
  from,
  to,
  label,
  type,
});
export function newDiagram(kind: DiagramKind): DiagramModel {
  const model: DiagramModel = {
    kind,
    title: '',
    direction: 'TD',
    nodes: [],
    edges: [],
    rows: [],
    options: {},
  };
  if (kind === 'flowchart') {
    model.nodes = [
      n('n1', 'Başlangıç', 'round'),
      n('n2', 'Fikri geliştir'),
      n('n3', 'Hazır mı?', 'decision'),
      n('n4', 'Paylaş', 'round'),
    ];
    model.edges = [e('n1', 'n2'), e('n2', 'n3'), e('n3', 'n4', 'Evet'), e('n3', 'n2', 'Hayır')];
    model.direction = 'LR';
  }
  if (kind === 'sequenceDiagram') {
    model.nodes = [n('n1', 'Kullanıcı', 'actor'), n('n2', 'Uygulama', 'participant')];
    model.rows = [
      { kind: 'message', from: 'n1', to: 'n2', text: 'Belgeyi aç', style: '->>' },
      { kind: 'message', from: 'n2', to: 'n1', text: 'Belge hazır', style: '-->>' },
    ];
  }
  if (kind === 'classDiagram') {
    model.nodes = [
      n('n1', 'Belge', '', '', '+String baslik\n+kaydet() void'),
      n('n2', 'Markdown', '', '', '+String kaynak'),
    ];
    model.edges = [e('n1', 'n2', '', '<|--')];
  }
  if (kind === 'erDiagram') {
    model.nodes = [
      n('n1', 'KULLANICI', '', '', 'int id PK\nstring ad'),
      n('n2', 'BELGE', '', '', 'int id PK\nstring baslik'),
    ];
    model.edges = [e('n1', 'n2', 'oluşturur', '||--o{')];
  }
  if (kind === 'stateDiagram-v2') {
    model.nodes = [n('n1', 'Taslak'), n('n2', 'Kaydedildi')];
    model.edges = [e('[*]', 'n1'), e('n1', 'n2', 'Kaydet'), e('n2', '[*]')];
  }
  if (kind === 'gantt') {
    model.title = 'Proje takvimi';
    model.rows = [
      {
        name: 'Tasarım',
        section: 'Ürün',
        id: 'task1',
        start: '2026-10-26',
        duration: '5d',
        status: 'done',
      },
      {
        name: 'Geliştirme',
        section: 'Ürün',
        id: 'task2',
        start: 'after task1',
        duration: '10d',
        status: 'active',
      },
    ];
  }
  if (kind === 'timeline') {
    model.title = 'Yolculuk';
    model.rows = [
      { period: '2026', text: 'İlk fikir', section: '' },
      { period: '2027', text: 'Yeni başlangıç', section: '' },
    ];
  }
  if (kind === 'mindmap')
    model.nodes = [
      n('n1', 'Ana fikir', 'root'),
      n('n2', 'Araştırma', '', 'n1'),
      n('n3', 'Tasarım', '', 'n1'),
      n('n4', 'Notlar', '', 'n2'),
    ];
  if (kind === 'pie') {
    model.title = 'Zaman dağılımı';
    model.rows = [
      { label: 'Tasarım', value: '35' },
      { label: 'Geliştirme', value: '50' },
      { label: 'Test', value: '15' },
    ];
  }
  if (kind === 'journey') {
    model.title = 'Belge deneyimi';
    model.rows = [
      { name: 'Dosyayı aç', section: 'Başlangıç', score: '5', actors: 'Kullanıcı' },
      { name: 'Düzenle', section: 'Üretim', score: '4', actors: 'Kullanıcı' },
    ];
  }
  if (kind === 'gitGraph')
    model.rows = [
      { operation: 'commit', name: 'ilk', tag: '', type: '' },
      { operation: 'branch', name: 'feature', tag: '', type: '' },
      { operation: 'commit', name: 'degisiklik', tag: '', type: '' },
      { operation: 'checkout', name: 'main', tag: '', type: '' },
      { operation: 'merge', name: 'feature', tag: '', type: '' },
    ];
  if (kind === 'quadrantChart') {
    model.title = 'Öncelikler';
    model.options = {
      x1: 'Düşük efor',
      x2: 'Yüksek efor',
      y1: 'Düşük etki',
      y2: 'Yüksek etki',
      q1: 'Planla',
      q2: 'Hemen yap',
      q3: 'Ele',
      q4: 'Değerlendir',
    };
    model.rows = [
      { label: 'İlk fikir', x: '0.25', y: '0.8' },
      { label: 'İyileştirme', x: '0.7', y: '0.6' },
    ];
  }
  if (kind === 'xychart-beta') {
    model.title = 'Aylık ilerleme';
    model.options = {
      categories: 'Ocak, Şubat, Mart, Nisan',
      yLabel: 'Tamamlanan',
      yMin: '0',
      yMax: '100',
    };
    model.rows = [{ type: 'bar', values: '25, 40, 65, 90' }];
  }
  if (kind === 'sankey-beta')
    model.rows = [
      { from: 'Fikirler', to: 'Tasarım', value: '40' },
      { from: 'Fikirler', to: 'Araştırma', value: '60' },
      { from: 'Tasarım', to: 'Ürün', value: '40' },
      { from: 'Araştırma', to: 'Ürün', value: '60' },
    ];
  if (kind === 'requirementDiagram') {
    model.nodes = [
      n('n1', 'Güvenli kaydetme', 'requirement', '', 'id: REQ-01\nrisk: high\nverifymethod: test'),
      n('n2', 'Kayıt testi', 'element', '', 'type: test'),
    ];
    model.edges = [e('n2', 'n1', '', 'verifies')];
  }
  if (kind === 'kanban')
    model.nodes = [
      n('n1', 'Yapılacak', 'column'),
      n('n2', 'Devam ediyor', 'column'),
      n('n3', 'Tamamlandı', 'column'),
      n('n4', 'Yeni fikir', 'card', 'n1'),
      n('n5', 'Tasarım', 'card', 'n2'),
    ];
  return model;
}
const clean = (s: string) =>
  s
    .replace(/[\r\n]/g, ' ')
    .replaceAll('"', '#quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const q = (s: string) => `"${clean(s)}"`;
const id = (s: string) => (s === '[*]' ? s : s.replace(/[^a-zA-Z0-9_]/g, '_'));
const safeLine = (s: string) => s.replace(/[\r\n:]/g, ' ').trim();
export function validateDiagram(m: DiagramModel): string[] {
  const errors: string[] = [];
  if (m.nodes.length > 500 || m.edges.length > 1000 || m.rows.length > 2000)
    errors.push('Diyagram etkileşimli düzenleme sınırını aşıyor. Kaynağı korunur.');
  const ids = new Set(m.nodes.map((n) => n.id));
  if (ids.size !== m.nodes.length) errors.push('Düğüm kimlikleri benzersiz olmalı.');
  for (const edge of m.edges) {
    if (![edge.from, edge.to].every((s) => ids.has(s) || s === '[*]'))
      errors.push('Bağlantının kaynak veya hedef düğümü bulunamadı.');
  }
  if (m.kind === 'pie') {
    if (m.rows.some((r) => !Number.isFinite(Number(r.value)) || Number(r.value) < 0))
      errors.push('Değerler sıfır veya pozitif sonlu sayı olmalı.');
    if (!m.rows.some((r) => Number(r.value) > 0)) errors.push('Toplam sıfırdan büyük olmalı.');
  }
  if (m.kind === 'journey' && m.rows.some((r) => +r.score < 1 || +r.score > 5 || !r.score))
    errors.push('Puan 1 ile 5 arasında olmalı.');
  if (
    m.kind === 'quadrantChart' &&
    m.rows.some((r) => ['x', 'y'].some((k) => !Number.isFinite(+r[k]) || +r[k] < 0 || +r[k] > 1))
  )
    errors.push('Koordinatlar 0–1 aralığında olmalı.');
  if (m.kind === 'sankey-beta') {
    if (
      m.rows.some(
        (r) => !Number.isFinite(+r.value) || +r.value <= 0 || r.from === r.to || !r.from || !r.to,
      )
    )
      errors.push('Akışlar pozitif ağırlıklı, farklı ve dolu kaynak/hedef içermeli.');
    const visiting = new Set<string>(),
      done = new Set<string>();
    const walk = (s: string): boolean => {
      if (visiting.has(s)) return true;
      if (done.has(s)) return false;
      visiting.add(s);
      for (const r of m.rows.filter((r) => r.from === s)) if (walk(r.to)) return true;
      visiting.delete(s);
      done.add(s);
      return false;
    };
    if (m.rows.some((r) => walk(r.from))) errors.push('Sankey grafiğinde döngü bulunamaz.');
  }
  if (m.kind === 'mindmap') {
    if (m.nodes.filter((n) => !n.group).length !== 1)
      errors.push('Zihin haritasının tek kökü olmalı.');
    for (const node of m.nodes) {
      const seen = new Set<string>([node.id]);
      let p = node.group;
      while (p) {
        if (seen.has(p)) {
          errors.push('Dallar döngü oluşturamaz.');
          break;
        }
        seen.add(p);
        p = m.nodes.find((n) => n.id === p)?.group || '';
      }
    }
  }
  if (m.kind === 'xychart-beta') {
    const count = m.options.categories.split(',').length;
    if (
      m.rows.some(
        (r) =>
          r.values.split(',').length !== count ||
          r.values.split(',').some((v) => !Number.isFinite(+v)),
      )
    )
      errors.push('Her seri kategori sayısı kadar sayısal değer içermeli.');
    if (+m.options.yMin >= +m.options.yMax)
      errors.push('Y ekseninin üst sınırı alt sınırdan büyük olmalı.');
  }
  if (m.kind === 'gantt') {
    const byId = new Map(m.rows.map((r) => [r.id, r]));
    for (const row of m.rows) {
      const visited = new Set<string>();
      let current = row;
      while (current.start.startsWith('after ')) {
        if (visited.has(current.id)) {
          errors.push('Görev bağımlılıkları döngü oluşturamaz.');
          break;
        }
        visited.add(current.id);
        const parent = byId.get(current.start.slice(6));
        if (!parent) break;
        current = parent;
      }
    }
    const tasks = new Set(m.rows.map((r) => r.id));
    if (tasks.size !== m.rows.length) errors.push('Görev kimlikleri benzersiz olmalı.');
    for (const r of m.rows) {
      if (
        r.start.startsWith('after ') &&
        (!tasks.has(r.start.slice(6)) || r.start.slice(6) === r.id)
      )
        errors.push('Bağımlılık geçerli bir başka görev olmalı.');
      if (
        /^\d{4}-\d{2}-\d{2}$/.test(r.duration) &&
        /^\d{4}-\d{2}-\d{2}$/.test(r.start) &&
        r.duration < r.start
      )
        errors.push('Bitiş başlangıçtan önce olamaz.');
    }
  }
  if (m.kind === 'sequenceDiagram') {
    let depth = 0;
    for (const r of m.rows) {
      if (['loop', 'alt', 'opt', 'par', 'break', 'critical'].includes(r.kind)) depth++;
      if (r.kind === 'end') depth--;
      if (depth < 0) errors.push('Çerçeve kapanış sırası geçersiz.');
      if (r.kind === 'message' && (!ids.has(r.from) || !ids.has(r.to)))
        errors.push('Mesaj katılımcıları seçilmeli.');
    }
    if (depth) errors.push('Açık çerçeveleri “end” işlemiyle kapatın.');
  }
  if (m.kind === 'gitGraph') {
    const branches = new Set(['main']),
      commits = new Set<string>();
    let active = 'main';
    for (const r of m.rows) {
      if (r.operation === 'branch') {
        if (branches.has(r.name)) errors.push('Dal adı benzersiz olmalı.');
        branches.add(r.name);
        active = r.name;
      }
      if (r.operation === 'checkout') {
        if (!branches.has(r.name)) errors.push('Checkout hedefi bulunamadı.');
        active = r.name;
      }
      if (r.operation === 'merge' && (!branches.has(r.name) || r.name === active))
        errors.push('Birleştirme için başka bir mevcut dal seçin.');
      if (r.operation === 'commit' && r.name) {
        if (commits.has(r.name)) errors.push('Commit kimliği benzersiz olmalı.');
        commits.add(r.name);
      }
      if (r.operation === 'cherry-pick' && !commits.has(r.name))
        errors.push('Cherry-pick commit kimliği bulunamadı.');
    }
  }
  return [...new Set(errors)];
}
export function diagramSource(m: DiagramModel): string {
  const out: string[] = [];
  const title = () => {
    if (m.title) out.push(`  title ${safeLine(m.title)}`);
  };
  switch (m.kind) {
    case 'flowchart': {
      out.push(`flowchart ${m.direction}`);
      const node = (n: DNode) => {
        const label = q(n.label),
          shape = n.shape;
        const pairs: Record<string, [string, string]> = {
          process: ['[', ']'],
          decision: ['{', '}'],
          round: ['([', '])'],
          database: ['[(', ')]'],
          data: ['[/', '/]'],
          subprocess: ['[[', ']]'],
          note: ['[', ']'],
        };
        const [a, b] = pairs[shape] || pairs.process;
        return `  ${id(n.id)}${a}${label}${b}`;
      };
      const groups = [...new Set(m.nodes.map((n) => n.group).filter(Boolean))];
      out.push(...m.nodes.filter((n) => !n.group).map(node));
      groups.forEach((g, i) => {
        out.push(
          `  subgraph group_${i}[${q(g)}]`,
          ...m.nodes.filter((n) => n.group === g).map(node),
          '  end',
        );
      });
      for (const e of m.edges) {
        const arrow =
          e.type === 'dotted'
            ? '-.->'
            : e.type === 'thick'
              ? '==>'
              : e.type === 'line'
                ? '---'
                : '-->';
        out.push(`  ${id(e.from)} ${arrow}${e.label ? `|${q(e.label)}|` : ''} ${id(e.to)}`);
      }
      break;
    }
    case 'sequenceDiagram':
      out.push(
        'sequenceDiagram',
        ...m.nodes.map(
          (n) =>
            `  ${n.shape === 'actor' ? 'actor' : 'participant'} ${id(n.id)} as ${clean(n.label)}`,
        ),
      );
      for (const r of m.rows) {
        if (r.kind === 'message')
          out.push(`  ${id(r.from)}${r.style || '->>'}${id(r.to)}: ${clean(r.text)}`);
        else if (r.kind === 'note') out.push(`  Note over ${id(r.from)}: ${clean(r.text)}`);
        else if (['activate', 'deactivate'].includes(r.kind)) out.push(`  ${r.kind} ${id(r.from)}`);
        else out.push(`  ${r.kind}${r.kind === 'end' ? '' : ' ' + clean(r.text)}`);
      }
      break;
    case 'classDiagram':
      out.push('classDiagram', `  direction ${m.direction}`);
      for (const n of m.nodes) {
        out.push(
          `  class ${id(n.id)}[${q(n.label)}]`,
          `  class ${id(n.id)} {`,
          ...n.detail
            .split('\n')
            .filter(Boolean)
            .map((s) => `    ${s.replace(/[{}\r]/g, '')}`),
          '  }',
        );
      }
      m.edges.forEach((e) =>
        out.push(
          `  ${id(e.from)} ${e.type || '-->'} ${id(e.to)}${e.label ? ' : ' + clean(e.label) : ''}`,
        ),
      );
      break;
    case 'erDiagram':
      out.push('erDiagram');
      m.nodes.forEach((n) =>
        out.push(
          `  ${id(n.id)}[${q(n.label)}] {`,
          ...n.detail
            .split('\n')
            .filter(Boolean)
            .map((s) => `    ${s.replace(/[{}\r]/g, '')}`),
          '  }',
        ),
      );
      m.edges.forEach((e) =>
        out.push(`  ${id(e.from)} ${e.type || '||--o{'} ${id(e.to)} : ${q(e.label || 'ilişki')}`),
      );
      break;
    case 'stateDiagram-v2':
      out.push('stateDiagram-v2', `  direction ${m.direction}`);
      m.nodes.forEach((n) => out.push(`  state ${q(n.label)} as ${id(n.id)}`));
      m.edges.forEach((e) =>
        out.push(`  ${id(e.from)} --> ${id(e.to)}${e.label ? ': ' + clean(e.label) : ''}`),
      );
      break;
    case 'gantt': {
      out.push('gantt', '  dateFormat YYYY-MM-DD');
      title();
      let section = '';
      m.rows.forEach((r) => {
        if (r.section !== section) {
          section = r.section;
          out.push(`  section ${safeLine(section || 'Görevler')}`);
        }
        out.push(
          `  ${safeLine(r.name)} :${r.status ? r.status + ', ' : ''}${id(r.id)}, ${r.start.replace(/[\r\n]/g, '')}, ${r.duration.replace(/[\r\n]/g, '')}`,
        );
      });
      break;
    }
    case 'timeline': {
      out.push('timeline');
      title();
      let section = '';
      m.rows.forEach((r) => {
        if (r.section && section !== r.section) {
          section = r.section;
          out.push(`  section ${safeLine(section)}`);
        }
        out.push(`  ${safeLine(r.period)} : ${safeLine(r.text)}`);
      });
      break;
    }
    case 'mindmap': {
      out.push('mindmap');
      const visit = (node: DNode, depth: number) => {
        out.push(`${'  '.repeat(depth)}${id(node.id)}[${q(node.label)}]`);
        m.nodes.filter((n) => n.group === node.id).forEach((n) => visit(n, depth + 1));
      };
      const root = m.nodes.find((n) => !n.group);
      if (root) visit(root, 1);
      break;
    }
    case 'pie':
      out.push('pie showData');
      title();
      m.rows.forEach((r) => out.push(`  ${q(r.label)} : ${Number(r.value)}`));
      break;
    case 'journey': {
      out.push('journey');
      title();
      let section = '';
      m.rows.forEach((r) => {
        if (section !== r.section) {
          section = r.section;
          out.push(`  section ${safeLine(section || 'Aşama')}`);
        }
        out.push(`  ${safeLine(r.name)}: ${Number(r.score)}: ${safeLine(r.actors)}`);
      });
      break;
    }
    case 'gitGraph':
      out.push('gitGraph');
      m.rows.forEach((r) => {
        if (r.operation === 'commit')
          out.push(
            `  commit${r.name ? ' id: ' + q(r.name) : ''}${r.tag ? ' tag: ' + q(r.tag) : ''}${r.type ? ' type: ' + r.type : ''}`,
          );
        else if (r.operation === 'cherry-pick') out.push(`  cherry-pick id: ${q(r.name)}`);
        else out.push(`  ${r.operation} ${id(r.name)}`);
      });
      break;
    case 'quadrantChart':
      out.push('quadrantChart');
      title();
      out.push(
        `  x-axis ${safeLine(m.options.x1)} --> ${safeLine(m.options.x2)}`,
        `  y-axis ${safeLine(m.options.y1)} --> ${safeLine(m.options.y2)}`,
        ...[1, 2, 3, 4].map((i) => `  quadrant-${i} ${safeLine(m.options['q' + i])}`),
      );
      m.rows.forEach((r) => out.push(`  ${safeLine(r.label)}: [${Number(r.x)}, ${Number(r.y)}]`));
      break;
    case 'xychart-beta':
      out.push('xychart-beta');
      if (m.title) out.push(`  title ${q(m.title)}`);
      out.push(
        `  x-axis [${m.options.categories
          .split(',')
          .map((s) => q(s.trim()))
          .join(', ')}]`,
        `  y-axis ${q(m.options.yLabel)} ${Number(m.options.yMin)} --> ${Number(m.options.yMax)}`,
      );
      m.rows.forEach((r) =>
        out.push(
          `  ${r.type === 'bar' ? 'bar' : 'line'} [${r.values.split(',').map(Number).join(', ')}]`,
        ),
      );
      break;
    case 'sankey-beta':
      out.push('sankey-beta', '');
      m.rows.forEach((r) =>
        out.push(`${JSON.stringify(r.from)},${JSON.stringify(r.to)},${Number(r.value)}`),
      );
      break;
    case 'requirementDiagram':
      out.push('requirementDiagram');
      m.nodes.forEach((n) => {
        out.push(`  ${n.shape || 'requirement'} ${id(n.id)} {`);
        if (n.shape !== 'element') out.push(`    text: ${q(n.label)}`);
        else out.push(`    docref: ${q(n.label)}`);
        out.push(
          ...n.detail
            .split('\n')
            .filter(Boolean)
            .map((s) => {
              const [key, ...rest] = s.replace(/[{}\r]/g, '').split(':');
              const value = rest.join(':').trim().replace(/^"|"$/g, '');
              return `    ${key.trim()}: ${['risk', 'verifymethod'].includes(key.trim().toLowerCase()) ? value : q(value)}`;
            }),
          '  }',
        );
      });
      m.edges.forEach((e) => out.push(`  ${id(e.from)} - ${e.type || 'satisfies'} -> ${id(e.to)}`));
      break;
    case 'kanban':
      out.push('kanban');
      m.nodes
        .filter((n) => n.shape === 'column')
        .forEach((column) => {
          out.push(`  ${id(column.id)}[${clean(column.label).replaceAll(']', '')}]`);
          m.nodes
            .filter((n) => n.group === column.id)
            .forEach((n) => out.push(`    ${id(n.id)}[${clean(n.label).replaceAll(']', '')}]`));
        });
      break;
  }
  return out.join('\n');
}

// Parsers accept the emitted dialect. Unrecognized syntax is never discarded by a visual conversion.
export function parseDiagram(source: string): { model: DiagramModel; safe: boolean } {
  const raw = source.trim(),
    lines = raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  const kind = diagramKinds.find(([k]) => raw.startsWith(k))?.[0] || 'flowchart';
  const m: DiagramModel = {
    kind,
    title: '',
    direction: 'TD',
    nodes: [],
    edges: [],
    rows: [],
    options: {},
  };
  const unq = (s = '') =>
    s
      .replace(/^"|"$/g, '')
      .replaceAll('#quot;', '"')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>');
  let safe = true,
    section = '',
    group = '',
    node: DNode | undefined;
  const pushEdge = (a: string, b: string, label = '', type = 'arrow') =>
    m.edges.push(e(a, b, unq(label), type));
  m.direction = lines[0].split(/\s+/)[1] || 'TD';
  for (const line of lines.slice(1)) {
    let a: RegExpMatchArray | null;
    if ((a = line.match(/^title\s+(.+)$/))) {
      m.title = unq(a[1]);
      continue;
    }
    if ((a = line.match(/^direction\s+(\w+)$/))) {
      m.direction = a[1];
      continue;
    }
    if ((a = line.match(/^section\s+(.+)$/))) {
      section = a[1];
      continue;
    }
    if (line.startsWith('%%')) {
      safe = false;
      continue;
    }
    switch (kind) {
      case 'flowchart':
        if ((a = line.match(/^subgraph\s+\w+\["(.*)"\]$/))) group = unq(a[1]);
        else if (line === 'end') group = '';
        else if (
          (a = line.match(/^(\w+)(\[\[|\[\(|\[\/|\(\[|\[|\{)"(.*)"(\]\]|\)\]|\/\]|\]\)|\]|\})$/))
        ) {
          const shapes: Record<string, string> = {
            '[': 'process',
            '{': 'decision',
            '([': 'round',
            '[(': 'database',
            '[/': 'data',
            '[[': 'subprocess',
          };
          m.nodes.push(n(a[1], unq(a[3]), shapes[a[2]], group));
        } else if ((a = line.match(/^(\w+)\s+(-->|-\.->|==>|---)(?:\|"(.*)"\|)?\s+(\w+)$/)))
          pushEdge(
            a[1],
            a[4],
            a[3],
            ({ '-->': 'arrow', '-.->': 'dotted', '==>': 'thick', '---': 'line' } as any)[a[2]],
          );
        else safe = false;
        break;
      case 'sequenceDiagram':
        if ((a = line.match(/^(actor|participant)\s+(\w+)\s+as\s+(.+)$/)))
          m.nodes.push(n(a[2], unq(a[3]), a[1]));
        else if ((a = line.match(/^(\w+)(-->>|->>|--\)|-\))(\w+):\s*(.*)$/)))
          m.rows.push({ kind: 'message', from: a[1], to: a[3], text: unq(a[4]), style: a[2] });
        else if ((a = line.match(/^Note over (\w+):\s*(.*)$/)))
          m.rows.push({ kind: 'note', from: a[1], text: unq(a[2]) });
        else if ((a = line.match(/^(activate|deactivate)\s+(\w+)$/)))
          m.rows.push({ kind: a[1], from: a[2] });
        else if ((a = line.match(/^(loop|alt|else|opt|par|and|break|critical|end)(?:\s+(.*))?$/)))
          m.rows.push({ kind: a[1], text: a[2] || '' });
        else safe = false;
        break;
      case 'classDiagram':
        if ((a = line.match(/^class (\w+)\["(.*)"\]$/)))
          m.nodes.push(n(a[1], unq(a[2]), '', '', ''));
        else if ((a = line.match(/^class (\w+) \{$/))) node = m.nodes.find((n) => n.id === a![1]);
        else if (line === '}') node = undefined;
        else if (node) node.detail += (node.detail ? '\n' : '') + line;
        else if ((a = line.match(/^(\w+)\s+(\S+)\s+(\w+)(?:\s*:\s*(.*))?$/)))
          pushEdge(a[1], a[3], a[4], a[2]);
        else safe = false;
        break;
      case 'erDiagram':
        if ((a = line.match(/^(\w+)\["(.*)"\] \{$/))) {
          node = n(a[1], unq(a[2]), '', '', '');
          m.nodes.push(node);
        } else if (line === '}') node = undefined;
        else if (node) node.detail += (node.detail ? '\n' : '') + line;
        else if ((a = line.match(/^(\w+)\s+(\S+)\s+(\w+)\s*:\s*(.*)$/)))
          pushEdge(a[1], a[3], a[4], a[2]);
        else safe = false;
        break;
      case 'stateDiagram-v2':
        if ((a = line.match(/^state "(.*)" as (\w+)$/))) m.nodes.push(n(a[2], unq(a[1])));
        else if ((a = line.match(/^(\w+|\[\*\]) --> (\w+|\[\*\])(?::\s*(.*))?$/)))
          pushEdge(a[1], a[2], a[3]);
        else safe = false;
        break;
      case 'gantt':
        if (line === 'dateFormat YYYY-MM-DD') break;
        if (
          (a = line.match(
            /^(.*?)\s*:\s*(?:(active|done|crit|milestone),\s*)?(\w+),\s*(.*?),\s*(.*)$/,
          ))
        )
          m.rows.push({
            name: a[1],
            status: a[2] || '',
            id: a[3],
            start: a[4],
            duration: a[5],
            section,
          });
        else safe = false;
        break;
      case 'timeline':
        if ((a = line.match(/^(.*?)\s*:\s*(.*)$/)))
          m.rows.push({ period: a[1].trim(), text: a[2], section });
        else safe = false;
        break;
      case 'mindmap': {
        const original = source.split(/\r?\n/).find((l) => l.trim() === line) || '';
        if ((a = line.match(/^(\w+)\["(.*)"\]$/))) {
          const depth = Math.floor((original.length - original.trimStart().length) / 2);
          const ancestors = (m as any)._ancestors || [];
          const parent = ancestors[depth - 1] || '';
          m.nodes.push(n(a[1], unq(a[2]), depth === 1 ? 'root' : '', parent));
          ancestors[depth] = a[1];
          (m as any)._ancestors = ancestors;
        } else safe = false;
        break;
      }
      case 'pie':
        if ((a = line.match(/^"(.*)"\s*:\s*([\d.e+-]+)$/)))
          m.rows.push({ label: unq(a[1]), value: a[2] });
        else safe = false;
        break;
      case 'journey':
        if ((a = line.match(/^(.*?):\s*([1-5]):\s*(.*)$/)))
          m.rows.push({ name: a[1].trim(), score: a[2], actors: a[3], section });
        else safe = false;
        break;
      case 'gitGraph':
        if ((a = line.match(/^(commit|branch|checkout|merge|cherry-pick)(?:\s+(.*))?$/))) {
          const rest = a[2] || '';
          m.rows.push({
            operation: a[1],
            name: ['commit', 'cherry-pick'].includes(a[1])
              ? rest.match(/id:\s*"(.*?)"/)?.[1] || ''
              : rest,
            tag: rest.match(/tag:\s*"(.*?)"/)?.[1] || '',
            type: rest.match(/type:\s*(\w+)/)?.[1] || '',
          });
        } else safe = false;
        break;
      case 'quadrantChart':
        if ((a = line.match(/^([xy])-axis (.*?) --> (.*)$/))) {
          m.options[a[1] + '1'] = a[2];
          m.options[a[1] + '2'] = a[3];
        } else if ((a = line.match(/^quadrant-([1-4]) (.*)$/))) m.options['q' + a[1]] = a[2];
        else if ((a = line.match(/^(.*?):\s*\[([\d.e+-]+),\s*([\d.e+-]+)\]$/)))
          m.rows.push({ label: a[1], x: a[2], y: a[3] });
        else safe = false;
        break;
      case 'xychart-beta':
        if ((a = line.match(/^x-axis \[(.*)\]$/)))
          m.options.categories = a[1]
            .split(',')
            .map((s) => unq(s.trim()))
            .join(', ');
        else if ((a = line.match(/^y-axis "(.*)" ([\d.e+-]+) --> ([\d.e+-]+)$/)))
          Object.assign(m.options, { yLabel: unq(a[1]), yMin: a[2], yMax: a[3] });
        else if ((a = line.match(/^(line|bar) \[(.*)\]$/)))
          m.rows.push({ type: a[1], values: a[2] });
        else safe = false;
        break;
      case 'sankey-beta':
        try {
          const [from, to, value] = JSON.parse('[' + line + ']');
          m.rows.push({ from, to, value: String(value) });
        } catch {
          safe = false;
        }
        break;
      case 'requirementDiagram':
        if (
          (a = line.match(
            /^(requirement|element|functionalRequirement|interfaceRequirement|performanceRequirement|physicalRequirement|designConstraint) (\w+) \{$/,
          ))
        ) {
          node = n(a[2], '', a[1], '', '');
          m.nodes.push(node);
        } else if (line === '}') node = undefined;
        else if (node) {
          if ((a = line.match(/^(?:text|docref):\s*"(.*)"$/))) node.label = unq(a[1]);
          else node.detail += (node.detail ? '\n' : '') + line;
        } else if ((a = line.match(/^(\w+) - (\w+) -> (\w+)$/))) pushEdge(a[1], a[3], '', a[2]);
        else safe = false;
        break;
      case 'kanban':
        if ((a = line.match(/^(\w+)\[(.*)\]$/))) {
          const original = source.split(/\r?\n/).find((l) => l.trim() === line) || '';
          const column = original.length - original.trimStart().length < 4;
          if (column) group = a[1];
          m.nodes.push(n(a[1], unq(a[2]), column ? 'column' : 'card', column ? '' : group));
        } else safe = false;
        break;
    }
  }
  delete (m as any)._ancestors;
  return { model: m, safe: safe && !!raw && (m.nodes.length > 0 || m.rows.length > 0) };
}
