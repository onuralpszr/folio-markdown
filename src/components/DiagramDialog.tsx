import { useT } from '../ui';
import { useMemo, useState } from 'react';
import { ReactFlow, Background, Controls, MarkerType, type Connection } from '@xyflow/react';
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Plus,
  Shapes,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { Modal } from './Modal';
import { MermaidView } from './Preview';
import {
  diagramKinds,
  diagramSource,
  newDiagram,
  parseDiagram,
  rowFields,
  validateDiagram,
  type DiagramModel,
  type DNode,
} from '../core/diagrams';
import '@xyflow/react/dist/style.css';

const graphKinds = [
  'flowchart',
  'classDiagram',
  'erDiagram',
  'stateDiagram-v2',
  'mindmap',
  'requirementDiagram',
];
const shapes: Record<string, string[]> = {
  flowchart: ['process', 'round', 'decision', 'database', 'data', 'subprocess', 'note'],
  sequenceDiagram: ['participant', 'actor'],
  requirementDiagram: [
    'requirement',
    'functionalRequirement',
    'interfaceRequirement',
    'performanceRequirement',
    'physicalRequirement',
    'designConstraint',
    'element',
  ],
  kanban: ['column', 'card'],
};
const shapeLabels: Record<string, string> = {
  process: 'İşlem',
  round: 'Başlangıç / bitiş',
  decision: 'Karar',
  database: 'Veritabanı',
  data: 'Veri',
  subprocess: 'Alt süreç',
  note: 'Not',
  actor: 'Aktör',
  participant: 'Katılımcı',
  requirement: 'Gereksinim',
  functionalRequirement: 'İşlevsel gereksinim',
  interfaceRequirement: 'Arayüz gereksinimi',
  performanceRequirement: 'Performans',
  physicalRequirement: 'Fiziksel gereksinim',
  designConstraint: 'Tasarım kısıtı',
  element: 'Öğe',
  column: 'Sütun',
  card: 'Kart',
};
const optionLabels: Record<string, string> = {
  '-->': 'İlişki',
  '<|--': 'Kalıtım',
  '<|..': 'Gerçekleştirme',
  '*--': 'Bileşim',
  'o--': 'Bütün / parça',
  '..>': 'Bağımlılık',
  '||--o{': 'Bir → sıfır veya çok',
  '||--||': 'Bir → bir',
  '}o--o{': 'Çok → çok',
  '||..o{': 'Tanımlayıcı olmayan ilişki',
  '|o--||': 'Opsiyonel bir → bir',
  arrow: 'Ok',
  dotted: 'Kesikli ok',
  thick: 'Kalın ok',
  line: 'Çizgi',
  message: 'Mesaj',
  note: 'Not',
  activate: 'Etkinleştir',
  deactivate: 'Etkinliği bitir',
  loop: 'Döngü başlat',
  alt: 'Koşul başlat',
  else: 'Alternatif',
  opt: 'İsteğe bağlı bölüm',
  par: 'Paralel bölüm',
  and: 'Paralel dal',
  break: 'Kesme bölümü',
  critical: 'Kritik bölüm',
  end: 'Bölümü kapat',
  '->>': 'Senkron mesaj',
  '-->>': 'Dönüş mesajı',
  '-)': 'Asenkron mesaj',
  '--)': 'Asenkron dönüş',
  active: 'Devam ediyor',
  done: 'Tamamlandı',
  crit: 'Kritik',
  milestone: 'Kilometre taşı',
  contains: 'İçerir',
  copies: 'Kopyalar',
  derives: 'Türetilir',
  satisfies: 'Karşılar',
  verifies: 'Doğrular',
  refines: 'Ayrıntılandırır',
  traces: 'İzler',
  lineSeries: 'Çizgi',
  bar: 'Sütun',
};
function RowField({
  model,
  row,
  field,
  onChange,
}: {
  model: DiagramModel;
  row: Record<string, string>;
  field: { key: string; type?: string; options?: string[]; placeholder?: string };
  onChange: (value: string) => void;
}) {
  const ui = useT(),
    value = row[field.key] || '';
  if (model.kind === 'sequenceDiagram' && ['from', 'to'].includes(field.key))
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Seçin…</option>
        {model.nodes.map((n) => (
          <option key={n.id} value={n.id}>
            {n.label}
          </option>
        ))}
      </select>
    );
  if (model.kind === 'gantt' && field.key === 'start')
    return (
      <div className="gantt-start">
        <select
          aria-label="Başlangıç yöntemi"
          value={value.startsWith('after ') ? value : 'date'}
          onChange={(e) =>
            onChange(
              e.target.value === 'date' ? new Date().toISOString().slice(0, 10) : e.target.value,
            )
          }
        >
          <option value="date">Takvim tarihi</option>
          {model.rows
            .filter((r) => r.id && r.id !== row.id)
            .map((r) => (
              <option value={'after ' + r.id} key={r.id}>
                {r.name} sonrasında
              </option>
            ))}
        </select>
        {!value.startsWith('after ') && (
          <input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>
    );
  if (model.kind === 'gantt' && field.key === 'duration') {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(value),
      match = value.match(/^(\d+)([dhmw])$/);
    return (
      <div className="gantt-start">
        <select
          aria-label="Süre veya bitiş tarihi"
          value={date ? 'date' : 'duration'}
          onChange={(e) =>
            onChange(e.target.value === 'date' ? new Date().toISOString().slice(0, 10) : '5d')
          }
        >
          <option value="duration">Süre</option>
          <option value="date">Bitiş tarihi</option>
        </select>
        {date ? (
          <input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <div className="duration-input">
            <input
              aria-label="Süre miktarı"
              type="number"
              min="0"
              value={match?.[1] || ''}
              onChange={(e) => onChange(e.target.value + (match?.[2] || 'd'))}
            />
            <select
              aria-label="Süre birimi"
              value={match?.[2] || 'd'}
              onChange={(e) => onChange((match?.[1] || '5') + e.target.value)}
            >
              {[
                ['d', 'Gün'],
                ['h', 'Saat'],
                ['m', 'Dakika'],
                ['w', 'Hafta'],
              ].map(([v, l]) => (
                <option value={v} key={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }
  return field.options ? (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {field.options.map((v) => (
        <option value={v} key={v}>
          {ui(optionLabels[v] || v || '—')}
        </option>
      ))}
    </select>
  ) : (
    <input
      type={field.type || 'text'}
      step="any"
      value={value}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
function StructuredDetails({
  node,
  kind,
  onChange,
}: {
  node: DNode;
  kind: string;
  onChange: (s: string) => void;
}) {
  const ui = useT();

  if (kind === 'requirementDiagram') {
    const values = Object.fromEntries(
      node.detail.split('\n').map((s) => {
        const [key, ...rest] = s.split(':');
        return [key.trim(), rest.join(':').trim()];
      }),
    );
    const set = (key: string, value: string) =>
      onChange(
        Object.entries({ ...values, [key]: value })
          .filter(([k, v]) => k && v)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n'),
      );
    return (
      <div className="property-fields">
        {(node.shape === 'element'
          ? [['type', 'Tür', null]]
          : [
              ['id', 'Gereksinim kimliği', null],
              ['risk', 'Risk', ['low', 'medium', 'high']],
              ['verifymethod', 'Doğrulama', ['analysis', 'inspection', 'test', 'demonstration']],
            ]
        ).map(([key, label, options]: any) => (
          <label key={key}>
            {label}
            {options ? (
              <select value={values[key] || options[0]} onChange={(e) => set(key, e.target.value)}>
                {options.map((v: string) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            ) : (
              <input value={values[key] || ''} onChange={(e) => set(key, e.target.value)} />
            )}
          </label>
        ))}
      </div>
    );
  }
  const rows = node.detail ? node.detail.split('\n') : [];
  const update = (index: number, value: string) =>
    onChange(rows.map((s, i) => (i === index ? value : s)).join('\n'));
  return (
    <div className="members">
      <div className="section-label">
        {kind === 'erDiagram' ? 'Alanlar' : 'Alanlar ve metotlar'}
        <button
          className="text-button"
          onClick={() =>
            onChange(
              [...rows, kind === 'erDiagram' ? 'string yeniAlan' : '+String yeniAlan'].join('\n'),
            )
          }
        >
          <Plus size={13} />
          {ui('Ekle')}
        </button>
      </div>
      {rows.map((s, i) => {
        if (kind === 'erDiagram') {
          const [type = 'string', name = '', key = ''] = s.split(/\s+/);
          return (
            <div className="member-row" key={i}>
              <input
                aria-label={ui('Alan adı')}
                value={name}
                onChange={(e) =>
                  update(i, `${type} ${e.target.value.replace(/\s/g, '_')} ${key}`.trim())
                }
              />
              <select
                aria-label={ui('Alan türü')}
                value={type}
                onChange={(e) => update(i, `${e.target.value} ${name} ${key}`.trim())}
              >
                {['string', 'int', 'float', 'boolean', 'date', 'uuid'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <select
                aria-label={ui('Anahtar')}
                value={key}
                onChange={(e) => update(i, `${type} ${name} ${e.target.value}`.trim())}
              >
                {['', 'PK', 'FK', 'UK'].map((t) => (
                  <option key={t}>{t || '—'}</option>
                ))}
              </select>
              <button
                aria-label={ui('Alanı sil')}
                onClick={() => onChange(rows.filter((_, j) => j !== i).join('\n'))}
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        }
        const visibility = /^[+#~-]/.test(s) ? s[0] : '+',
          val = s.replace(/^[+#~-]/, ''),
          method = val.includes('(');
        const parts = method
          ? [
              val.split('(')[0],
              val.match(/\((.*?)\)/)?.[1] || '',
              val.split(')')[1]?.trim() || 'void',
            ]
          : val.split(/\s+/);
        return (
          <div className="member-row class-member" key={i}>
            <select
              aria-label={ui('Görünürlük')}
              value={visibility}
              onChange={(e) => update(i, e.target.value + val)}
            >
              {[
                ['+', 'Herkese açık'],
                ['-', 'Özel'],
                ['#', 'Korumalı'],
                ['~', 'Paket içi'],
              ].map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <input
              aria-label={method ? 'Metot adı' : 'Alan adı'}
              value={method ? parts[0] : parts[1] || ''}
              onChange={(e) =>
                update(
                  i,
                  method
                    ? `${visibility}${e.target.value}(${parts[1]}) ${parts[2]}`
                    : `${visibility}${parts[0]} ${e.target.value}`,
                )
              }
            />
            <input
              aria-label={method ? 'Dönüş türü' : 'Alan türü'}
              value={method ? parts[2] : parts[0]}
              onChange={(e) =>
                update(
                  i,
                  method
                    ? `${visibility}${parts[0]}(${parts[1]}) ${e.target.value}`
                    : `${visibility}${e.target.value} ${parts[1] || 'alan'}`,
                )
              }
            />
            <button
              aria-label={ui('Üyeyi sil')}
              onClick={() => onChange(rows.filter((_, j) => j !== i).join('\n'))}
            >
              <Trash2 size={13} />
            </button>
          </div>
        );
      })}
      {kind === 'classDiagram' && (
        <button
          className="text-button"
          onClick={() => onChange([...rows, '+yeniMetot() void'].join('\n'))}
        >
          <Plus size={13} />
          {ui('Metot ekle')}
        </button>
      )}
    </div>
  );
}
export function DiagramDialog({
  value,
  onApply,
  onClose,
}: {
  value: string;
  onApply: (source: string) => void;
  onClose: () => void;
}) {
  const ui = useT();

  const parsed = useMemo(
    () => (value ? parseDiagram(value) : { model: newDiagram('flowchart'), safe: true }),
    [],
  );
  const [model, setModel] = useState<DiagramModel>(parsed.model),
    [sourceMode, setSourceMode] = useState(!parsed.safe),
    [raw, setRaw] = useState(value || diagramSource(model));
  const [tab, setTab] = useState<'build' | 'preview'>('build'),
    [selected, setSelected] = useState(''),
    [stack, setStack] = useState<DiagramModel[]>([]);
  const errors = validateDiagram(model),
    source = sourceMode ? raw : errors.length ? '' : diagramSource(model);
  function update(next: DiagramModel) {
    setStack((s) => [...s.slice(-49), model]);
    setModel(next);
  }
  const updateNode = (id: string, patch: Partial<DNode>) =>
    update({ ...model, nodes: model.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)) });
  const addNode = () => {
    const id = 'n' + crypto.randomUUID().replaceAll('-', '').slice(0, 12);
    const shape = shapes[model.kind]?.[0] || 'process';
    update({
      ...model,
      nodes: [
        ...model.nodes,
        {
          id,
          label: 'Yeni öğe',
          shape,
          group: model.kind === 'mindmap' ? model.nodes[0]?.id || '' : '',
          detail:
            model.kind === 'requirementDiagram' ? `id: ${id}\nrisk: low\nverifymethod: test` : '',
        },
      ],
    });
    setSelected(id);
  };
  const removeNode = (id: string) => {
    if (
      model.edges.some((e) => e.from === id || e.to === id) &&
      !window.confirm('Bu öğe ve ona bağlı bağlantılar silinecek. Devam edilsin mi?')
    )
      return;
    update({
      ...model,
      nodes: model.nodes.filter((n) => n.id !== id && n.group !== id),
      edges: model.edges.filter((e) => e.from !== id && e.to !== id),
    });
  };
  const selectedNode = model.nodes.find((n) => n.id === selected);
  const graphNodes = model.nodes.map((n, i) => ({
    id: n.id,
    position: { x: n.x ?? (i % 3) * 210 + 30, y: n.y ?? Math.floor(i / 3) * 130 + 35 },
    data: { label: n.label },
    selected: n.id === selected,
    style: {
      borderRadius: n.shape === 'round' ? 36 : 10,
      background: n.shape === 'decision' ? '#faf0d6' : '#edf1e6',
      border: n.id === selected ? '2px solid #718359' : '1px solid #b9c5a9',
      color: '#384632',
      padding: 10,
      width: 155,
      fontSize: 12,
    },
  }));
  const graphEdges = model.edges
    .filter((e) => e.from !== '[*]' && e.to !== '[*]')
    .map((e) => ({
      id: e.id,
      source: e.from,
      target: e.to,
      label: e.label,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#91a17d' },
      style: { stroke: '#91a17d' },
    }));
  const connect = (c: Connection) => {
    if (c.source && c.target)
      update({
        ...model,
        edges: [
          ...model.edges,
          {
            id: crypto.randomUUID(),
            from: c.source,
            to: c.target,
            label: '',
            type:
              model.kind === 'erDiagram'
                ? '||--o{'
                : model.kind === 'classDiagram'
                  ? '-->'
                  : model.kind === 'requirementDiagram'
                    ? 'satisfies'
                    : 'arrow',
          },
        ],
      });
  };
  const moveRow = (i: number, d: number) => {
    const rows = [...model.rows];
    if (i + d < 0 || i + d >= rows.length) return;
    [rows[i], rows[i + d]] = [rows[i + d], rows[i]];
    update({ ...model, rows });
  };
  return (
    <Modal
      title={ui('Düşüncelerini görselleştir')}
      eyebrow={ui('DİYAGRAM ATÖLYESİ')}
      onClose={onClose}
      wide
      footer={
        <>
          <span className="footer-hint">
            {diagramKinds.find(([k]) => k === model.kind)?.[1]}
            {ui('· Mermaid olarak kaydedilir')}
          </span>
          <button className="button" onClick={onClose}>
            {ui('İptal')}
          </button>
          <button
            className="button primary"
            disabled={!source.trim() || (!sourceMode && !!errors.length)}
            onClick={() => onApply(source)}
          >
            {ui('Diyagramı uygula')}
          </button>
        </>
      }
    >
      <div className="diagram-workshop">
        <nav className="diagram-types" aria-label={ui('Diyagram türleri')}>
          {diagramKinds.map(([kind, label, description]) => (
            <button
              key={kind}
              className={kind === model.kind ? 'active' : ''}
              title={description}
              onClick={() => {
                if (kind === model.kind) return;
                if (
                  (model.nodes.length || model.rows.length) &&
                  !window.confirm(
                    'Tür değiştirmek mevcut çalışma taslağını yeni bir örnekle değiştirecek. Devam edilsin mi?',
                  )
                )
                  return;
                const next = newDiagram(kind);
                update(next);
                setSourceMode(false);
                setRaw(diagramSource(next));
                setSelected('');
              }}
            >
              <Shapes size={14} />
              <span>{ui(label)}</span>
              <ChevronRight size={12} />
            </button>
          ))}
        </nav>
        <div className="diagram-editor">
          <div className="workshop-tabs">
            <button
              className={!sourceMode && tab === 'build' ? 'active' : ''}
              onClick={() => {
                if (
                  !parseDiagram(raw).safe &&
                  sourceMode &&
                  !window.confirm(
                    'Bu harici kaynak görsel modele tam çevrilemiyor. Dönüşüm tanınmayan ayrıntıları kaldırabilir. Kaynağın kopyasını sakladığınızdan emin olun.',
                  )
                )
                  return;
                setSourceMode(false);
                setTab('build');
              }}
            >
              {ui('Görsel oluşturucu')}
            </button>
            <button
              className={!sourceMode && tab === 'preview' ? 'active' : ''}
              onClick={() => {
                if (sourceMode && !parseDiagram(raw).safe) {
                  setTab('preview');
                  return;
                }
                setSourceMode(false);
                setTab('preview');
              }}
            >
              {ui('Önizleme')}
            </button>
            <button
              className={sourceMode && tab === 'build' ? 'active' : ''}
              onClick={() => {
                setRaw(source || raw);
                setTab('build');
                setSourceMode(true);
              }}
            >
              {ui('Mermaid kaynağı')}
            </button>
            <button
              className="undo-workshop"
              disabled={!stack.length}
              onClick={() => {
                const old = stack.at(-1);
                if (old) {
                  setModel(old);
                  setStack(stack.slice(0, -1));
                }
              }}
            >
              {ui('Geri al')}
            </button>
          </div>
          {sourceMode ? (
            <>
              <p className="muted">
                {ui(
                  'Kaynak aynen korunur. Harici diyagramlarda görsel modele aktarılamayan ayrıntılar olabilir.',
                )}
              </p>
              <textarea
                style={{ display: tab === 'preview' ? 'none' : undefined }}
                aria-label={ui('Mermaid kaynağı')}
                className="code-input diagram-source"
                value={raw}
                onChange={(e) => {
                  setRaw(e.target.value);
                  const p = parseDiagram(e.target.value);
                  if (p.safe) setModel(p.model);
                }}
              />
              {tab === 'preview' && <MermaidView source={raw} compact />}
            </>
          ) : (
            <>
              <div className="diagram-settings">
                <label>
                  {ui('Başlık')}
                  <input
                    value={model.title}
                    placeholder={ui('İsteğe bağlı başlık')}
                    onChange={(e) => update({ ...model, title: e.target.value })}
                  />
                </label>
                {graphKinds.includes(model.kind) && model.kind !== 'mindmap' && (
                  <label>
                    {ui('Yön')}
                    <select
                      value={model.direction}
                      onChange={(e) => update({ ...model, direction: e.target.value })}
                    >
                      {[
                        ['TD', 'Yukarıdan aşağı'],
                        ['LR', 'Soldan sağa'],
                        ['BT', 'Aşağıdan yukarı'],
                        ['RL', 'Sağdan sola'],
                      ].map(([v, l]) => (
                        <option value={v} key={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              {Object.keys(model.options).length > 0 && (
                <div className="option-grid">
                  {Object.entries(model.options).map(([key, value]) => (
                    <label key={key}>
                      {(
                        {
                          categories: 'Kategoriler (virgülle)',
                          yLabel: 'Y ekseni',
                          yMin: 'Y alt sınır',
                          yMax: 'Y üst sınır',
                          x1: 'X başlangıcı',
                          x2: 'X sonu',
                          y1: 'Y başlangıcı',
                          y2: 'Y sonu',
                          q1: '1. bölge',
                          q2: '2. bölge',
                          q3: '3. bölge',
                          q4: '4. bölge',
                        } as any
                      )[key] || key}
                      <input
                        value={value}
                        onChange={(e) =>
                          update({ ...model, options: { ...model.options, [key]: e.target.value } })
                        }
                      />
                    </label>
                  ))}
                </div>
              )}
              {tab === 'build' && (
                <>
                  {graphKinds.includes(model.kind) && (
                    <div className="graph-canvas">
                      <ReactFlow
                        nodes={graphNodes}
                        edges={graphEdges}
                        fitView
                        onConnect={connect}
                        onNodeClick={(_, n) => setSelected(n.id)}
                        onNodeDragStop={(_, node) =>
                          updateNode(node.id, { x: node.position.x, y: node.position.y })
                        }
                        nodesDraggable
                        elementsSelectable
                      >
                        <Background color="#d8ddce" gap={20} />
                        <Controls showInteractive={false} />
                      </ReactFlow>
                    </div>
                  )}
                  {(graphKinds.includes(model.kind) ||
                    ['sequenceDiagram', 'kanban'].includes(model.kind)) && (
                    <div className="node-builder">
                      <div className="section-label">
                        {model.kind === 'sequenceDiagram' ? 'Katılımcılar' : 'Öğeler'}
                        <button className="text-button" onClick={addNode}>
                          <Plus size={14} />
                          {ui('Öğe ekle')}
                        </button>
                      </div>
                      <div className="node-list">
                        {model.nodes.map((n) => (
                          <div
                            key={n.id}
                            className={`node-item ${selected === n.id ? 'selected' : ''}`}
                          >
                            <button className="node-key" onClick={() => setSelected(n.id)}>
                              {n.id}
                            </button>
                            <input
                              aria-label={ui('Öğe etiketi')}
                              value={n.label}
                              onChange={(e) => updateNode(n.id, { label: e.target.value })}
                            />
                            {shapes[model.kind] && (
                              <select
                                aria-label={ui('Öğe türü')}
                                value={n.shape}
                                onChange={(e) => updateNode(n.id, { shape: e.target.value })}
                              >
                                {shapes[model.kind].map((s) => (
                                  <option key={s} value={s}>
                                    {ui(shapeLabels[s] || s)}
                                  </option>
                                ))}
                              </select>
                            )}
                            {model.kind === 'flowchart' && (
                              <input
                                aria-label={ui('Grup veya üst öğe')}
                                placeholder="Grup adı"
                                value={n.group}
                                onChange={(e) => updateNode(n.id, { group: e.target.value })}
                              />
                            )}
                            {['mindmap', 'kanban'].includes(model.kind) && (
                              <select
                                aria-label="Üst öğe"
                                value={n.group}
                                onChange={(e) => updateNode(n.id, { group: e.target.value })}
                              >
                                <option value="">Kök / sütun</option>
                                {model.nodes
                                  .filter(
                                    (parent) =>
                                      parent.id !== n.id &&
                                      (model.kind !== 'kanban' || parent.shape === 'column'),
                                  )
                                  .map((parent) => (
                                    <option key={parent.id} value={parent.id}>
                                      {parent.label}
                                    </option>
                                  ))}
                              </select>
                            )}
                            <button aria-label={ui('Öğeyi sil')} onClick={() => removeNode(n.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      {selectedNode &&
                        ['classDiagram', 'erDiagram', 'requirementDiagram'].includes(
                          model.kind,
                        ) && (
                          <StructuredDetails
                            node={selectedNode}
                            kind={model.kind}
                            onChange={(detail) => updateNode(selectedNode.id, { detail })}
                          />
                        )}
                    </div>
                  )}
                  {graphKinds.includes(model.kind) && model.kind !== 'mindmap' && (
                    <div className="edge-builder">
                      <div className="section-label">
                        {ui('Bağlantılar')}
                        <button
                          className="text-button"
                          disabled={!model.nodes.length}
                          onClick={() =>
                            connect({
                              source: model.nodes[0]?.id,
                              target: model.nodes[1]?.id || model.nodes[0]?.id,
                              sourceHandle: null,
                              targetHandle: null,
                            })
                          }
                        >
                          <Plus size={14} />
                          {ui('Bağlantı ekle')}
                        </button>
                      </div>
                      {model.edges.map((edge) => (
                        <div className="edge-item" key={edge.id}>
                          <select
                            aria-label={ui('Kaynak öğe')}
                            value={edge.from}
                            onChange={(e) =>
                              update({
                                ...model,
                                edges: model.edges.map((x) =>
                                  x.id === edge.id ? { ...x, from: e.target.value } : x,
                                ),
                              })
                            }
                          >
                            {model.kind === 'stateDiagram-v2' && (
                              <option value="[*]">{ui('Başlangıç/bitiş')}</option>
                            )}
                            {model.nodes.map((n) => (
                              <option key={n.id} value={n.id}>
                                {n.label}
                              </option>
                            ))}
                          </select>
                          <ChevronRight size={14} />
                          <select
                            aria-label={ui('Hedef öğe')}
                            value={edge.to}
                            onChange={(e) =>
                              update({
                                ...model,
                                edges: model.edges.map((x) =>
                                  x.id === edge.id ? { ...x, to: e.target.value } : x,
                                ),
                              })
                            }
                          >
                            {model.kind === 'stateDiagram-v2' && (
                              <option value="[*]">{ui('Başlangıç/bitiş')}</option>
                            )}
                            {model.nodes.map((n) => (
                              <option key={n.id} value={n.id}>
                                {n.label}
                              </option>
                            ))}
                          </select>
                          <input
                            aria-label={ui('Bağlantı etiketi')}
                            value={edge.label}
                            placeholder={ui('Etiket')}
                            onChange={(e) =>
                              update({
                                ...model,
                                edges: model.edges.map((x) =>
                                  x.id === edge.id ? { ...x, label: e.target.value } : x,
                                ),
                              })
                            }
                          />
                          <select
                            aria-label={ui('İlişki türü')}
                            value={edge.type}
                            onChange={(e) =>
                              update({
                                ...model,
                                edges: model.edges.map((x) =>
                                  x.id === edge.id ? { ...x, type: e.target.value } : x,
                                ),
                              })
                            }
                          >
                            {(model.kind === 'classDiagram'
                              ? ['-->', '<|--', '<|..', '*--', 'o--', '..>']
                              : model.kind === 'erDiagram'
                                ? ['||--o{', '||--||', '}o--o{', '||..o{', '|o--||']
                                : model.kind === 'requirementDiagram'
                                  ? [
                                      'contains',
                                      'copies',
                                      'derives',
                                      'satisfies',
                                      'verifies',
                                      'refines',
                                      'traces',
                                    ]
                                  : ['arrow', 'dotted', 'thick', 'line']
                            ).map((s) => (
                              <option key={s} value={s}>
                                {ui(optionLabels[s] || s)}
                              </option>
                            ))}
                          </select>
                          <button
                            aria-label={ui('Bağlantıyı sil')}
                            onClick={() =>
                              update({
                                ...model,
                                edges: model.edges.filter((e) => e.id !== edge.id),
                              })
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {rowFields[model.kind] && (
                    <div className="row-builder">
                      <div className="section-label">
                        {model.kind === 'sequenceDiagram' ? 'Mesajlar ve çerçeveler' : 'Veriler'}
                        <button
                          className="text-button"
                          onClick={() => {
                            const fields = rowFields[model.kind]!;
                            const row = Object.fromEntries(
                              fields.map((f) => [
                                f.key,
                                f.options?.[0] || (f.type === 'number' ? '1' : ''),
                              ]),
                            );
                            if (model.kind === 'gantt')
                              Object.assign(row, {
                                id: 'task_' + crypto.randomUUID().slice(0, 8),
                                start: new Date().toISOString().slice(0, 10),
                                duration: '5d',
                              });
                            update({ ...model, rows: [...model.rows, row] });
                          }}
                        >
                          <Plus size={14} />
                          {ui('Satır ekle')}
                        </button>
                      </div>
                      {model.rows.map((row, i) => (
                        <div className="data-row" key={i}>
                          <span className="row-number">{i + 1}</span>
                          <div className="data-fields">
                            {rowFields[model.kind]!.map((f) => (
                              <label key={f.key}>
                                {ui(f.label)}
                                <RowField
                                  model={model}
                                  row={row}
                                  field={f}
                                  onChange={(value) =>
                                    update({
                                      ...model,
                                      rows: model.rows.map((r, j) =>
                                        j === i ? { ...r, [f.key]: value } : r,
                                      ),
                                    })
                                  }
                                />
                              </label>
                            ))}
                          </div>
                          <div className="row-actions">
                            <button
                              aria-label={ui('Satırı yukarı taşı')}
                              onClick={() => moveRow(i, -1)}
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              aria-label={ui('Satırı aşağı taşı')}
                              onClick={() => moveRow(i, 1)}
                            >
                              <ArrowDown size={13} />
                            </button>
                            <button
                              aria-label={ui('Satırı sil')}
                              onClick={() =>
                                update({ ...model, rows: model.rows.filter((_, j) => j !== i) })
                              }
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {errors.length > 0 ? (
                <div className="validation-errors">
                  {errors.map((s) => (
                    <p key={s}>
                      <TriangleAlert size={14} />
                      {s}
                    </p>
                  ))}
                </div>
              ) : (
                <div className={tab === 'preview' ? 'large-live-preview' : 'small-live-preview'}>
                  <span className="eyebrow">{ui('CANLI ÖNİZLEME')}</span>
                  <MermaidView source={source} compact />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
