/**
 * First look at Work Orders on the QA branch (2026-10-08): what the display switcher offers, the column
 * headings, the toolbar controls. Read-only. Uses the Global Search harness's unattended sign-in.
 *   cd build/global-search/e2e && GS_APP=https://sv10043.qa.shopview.com GS_SSO=... npx tsx ../../wo-board-tech-view/run498-2026-10-08/explore-workorders.mts
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildMarker } from '../../global-search/e2e/fixtures/auth.js';
import { open } from './session.mts';

const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence');
const s = await open('/workorders');
const p = s.page;
await p.waitForTimeout(4000); console.log('page open', new Date().toISOString().slice(11,19));
console.log('build:', await buildMarker(p), '| url:', p.url());
const read = async (label: string) => {
  const r: any = await p.evaluate(`(() => {
    const vis = (e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
    const txt = (e) => (e.innerText || e.getAttribute('aria-label') || e.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
    return {
      headings: [...document.querySelectorAll('h1,h2,h3,.q-toolbar__title')].filter(vis).map(txt).filter(Boolean).slice(0, 10),
      buttons: [...document.querySelectorAll('button,[role=button],[role=tab],.q-tab,.q-btn')].filter(vis).map(e => txt(e) || '[' + (e.getAttribute('aria-label') || String(e.className).slice(0, 40)) + ']').filter(Boolean).slice(0, 80),
      columns: [...document.querySelectorAll('thead th, [role=columnheader]')].filter(vis).map(txt).slice(0, 40),
      tooltips: [...document.querySelectorAll('[title],[aria-label]')].filter(vis).map(e => e.getAttribute('aria-label') || e.getAttribute('title')).filter(Boolean).slice(0, 60),
      rows: document.querySelectorAll('tbody tr').length,
    };
  })()`);
  fs.writeFileSync(path.join(OUT, `explore-${label}.json`), JSON.stringify(r, null, 1));
  await p.screenshot({ path: path.join(OUT, `explore-${label}.png`), fullPage: false });
  console.log(`== ${label}: ${r.rows} rows; columns: ${r.columns.join(' | ')}`);
  console.log('   buttons:', r.buttons.join(' · ').slice(0, 1500));
  console.log('   labels :', [...new Set(r.tooltips)].join(' · ').slice(0, 1200));
};
await read('list');
await s.browser.close();
