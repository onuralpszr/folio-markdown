/// <reference lib="webworker" />
import { mathjax } from '@mathjax/src/js/mathjax.js';
import { TeX } from '@mathjax/src/js/input/tex.js';
import { SVG } from '@mathjax/src/js/output/svg.js';
import { liteAdaptor } from '@mathjax/src/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from '@mathjax/src/js/handlers/html.js';
import { MathJaxTexFont } from '@mathjax/mathjax-tex-font/js/svg.js';
import '@mathjax/src/js/input/tex/ams/AmsConfiguration.js';
import '@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js';
import '@mathjax/src/js/input/tex/textmacros/TextMacrosConfiguration.js';
import '@mathjax/src/js/input/tex/configmacros/ConfigMacrosConfiguration.js';
import '@mathjax/src/js/input/tex/mathtools/MathtoolsConfiguration.js';
import '@mathjax/src/js/input/tex/cancel/CancelConfiguration.js';
import '@mathjax/src/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const output = new SVG({ fontData: new MathJaxTexFont(), fontCache: 'local' });
const document = mathjax.document('', {
  InputJax: new TeX({
    packages: [
      'base',
      'ams',
      'newcommand',
      'textmacros',
      'configmacros',
      'mathtools',
      'cancel',
      'boldsymbol',
    ],
    maxBuffer: 32768,
    maxMacros: 200,
  }),
  OutputJax: output,
});
self.onmessage = (event: MessageEvent<{ latex: string; display: boolean }>) => {
  try {
    const { latex, display } = event.data;
    if (!latex.trim() || latex.length > 32768) throw new Error('Geçersiz formül.');
    const node = document.convert(latex, { display, em: 20, ex: 10, containerWidth: 1600 });
    const svg = adaptor.tags(node, 'svg')[0];
    if (
      !svg ||
      adaptor.tags(svg, 'g').some((g) => adaptor.getAttribute(g, 'data-mml-node') === 'merror')
    )
      throw new Error('Bu formül SVG motorunda desteklenmiyor. LaTeX veya MathML kullanın.');
    adaptor.setAttribute(svg, 'xmlns', 'http://www.w3.org/2000/svg');
    adaptor.setAttribute(svg, 'color', '#161c19');
    const viewbox: number[] = (adaptor.getAttribute(svg, 'viewBox') || '').split(/\s+/).map(Number);
    if (viewbox.length !== 4 || viewbox.some((n) => !Number.isFinite(n)))
      throw new Error('Geçersiz çizim.');
    // SVG viewBox uses 1000 units/em; fixed CSS pixels keep standalone images portable.
    adaptor.setAttribute(svg, 'width', String(Math.max(1, viewbox[2] / 50)));
    adaptor.setAttribute(svg, 'height', String(Math.max(1, viewbox[3] / 50)));
    const defs = adaptor.tags(svg, 'defs')[0] || adaptor.append(svg, adaptor.node('defs'));
    adaptor.append(
      defs,
      adaptor.node('style', {}, [
        adaptor.text(
          '[data-line],[data-frame]{stroke-width:70px;fill:none}.mjx-dashed{stroke-dasharray:140}.mjx-dotted{stroke-linecap:round;stroke-dasharray:0,140}use[data-c]{stroke-width:3px}',
        ),
      ]),
    );
    self.postMessage({ svg: adaptor.outerHTML(svg) });
  } catch (error) {
    self.postMessage({ error: (error as Error).message });
  }
};
