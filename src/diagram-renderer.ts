import { getMermaid } from './core/mermaid';
declare global {
  interface Window {
    renderDiagram?: (source: string, id: string) => Promise<string>;
  }
}
window.renderDiagram = async (source, id) => {
  const mermaid = await getMermaid();
  const result = await mermaid.render(id, source);
  document.getElementById('d' + id)?.remove();
  return result.svg;
};
