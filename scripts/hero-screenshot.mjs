// Builds the README hero image from the light and dark screenshots, split corner to corner with rounded corners.
// Refresh the screenshots first with: npx playwright test -g "captures light and dark"
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

const dir = 'docs/screenshots';
const image = async (name) =>
  'data:image/png;base64,' + (await fs.readFile(`${dir}/${name}`)).toString('base64');
const [light, dark] = await Promise.all([image('folio-light.png'), image('folio-dark.png')]);
const width = 1440,
  height = 1000;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.setContent(`<style>
  html, body { margin: 0; background: transparent; }
  .frame { position: relative; width: ${width}px; height: ${height}px; border-radius: 28px; overflow: hidden; }
  .frame img, .frame svg, .edge { position: absolute; inset: 0; width: 100%; height: 100%; }
  .dark { clip-path: polygon(100% 0, 100% 100%, 0 100%); }
  .edge { border-radius: 28px; box-shadow: inset 0 0 0 1px #8a927f59; }
</style>
<div class="frame">
  <img src="${light}" />
  <img class="dark" src="${dark}" />
  <svg viewBox="0 0 ${width} ${height}">
    <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="#aec38b" stroke-width="3" />
  </svg>
  <div class="edge"></div>
</div>`);
await page.locator('.frame').screenshot({
  path: `${dir}/folio-hero.png`,
  omitBackground: true,
});
await browser.close();
