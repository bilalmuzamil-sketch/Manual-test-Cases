// Section 6666 batch 1 - the Work Orders settings page exactly as a tester sees it.
// Route (found by walking the UI 2026-09-24): /administration/settings -> tab strip "Organization | Invoice | Work Orders".
// Serves C44549 (labels + grouping), C44550 (rename), C44551(1), C44552(3) (defaults).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { save, record } from './lib.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';

const { browser, page, version } = await bootProdLogin('/administration/settings', { settle: 16000 });
record('ENV','build_marker_at_start',version);
console.log('build', version, '| workplace check:', (await page.evaluate(()=>document.body.innerText)).includes('Trucks Hill 2'));

// Click the Work Orders TAB (in the tab strip), not the sidebar nav item.
const tabs = page.locator('[role=tab], .q-tab');
const n = await tabs.count();
let clicked = false;
for (let i = n - 1; i >= 0; i--) {           // the three page tabs are last in the strip
  const txt = (await tabs.nth(i).innerText()).trim();
  if (txt === 'Work Orders') { await tabs.nth(i).click(); clicked = true; break; }
}
if (!clicked) throw new Error('Work Orders tab not found in the tab strip');
await page.waitForTimeout(6000);

const t = await save(page, 'C44549-settings-work-orders');
console.log('--- PAGE TEXT from PARTS/WORKFLOW ---');
console.log(t.slice(Math.max(0, t.indexOf('WORKFLOW'))).slice(0, 2000));

// Each setting row: its own label, its description, its on/off state - read from the smallest element that owns it.
const rows = await page.evaluate(() => {
  const out = [];
  const root = document.querySelector('.q-tab-panel:not([style*="display: none"])') || document.body;
  const walk = (el) => {
    for (const c of el.children) {
      const cls = (c.className || '').toString();
      const txt = (c.innerText || '').trim();
      if (/q-toggle/.test(cls)) {
        const inp = c.querySelector('input[type=checkbox]');
        out.push({ kind: 'toggle', label: txt.split('\n')[0], on: inp ? !!inp.checked : (c.getAttribute('aria-checked') === 'true') });
        continue;
      }
      // group headings render as short all-caps standalone text
      if (c.children.length === 0 && txt && txt.length < 40 && txt === txt.toUpperCase() && /[A-Z]/.test(txt)) {
        out.push({ kind: 'heading', text: txt });
        continue;
      }
      walk(c);
    }
  };
  walk(root);
  return out;
});
fs.writeFileSync(`${EV}/C44549-toggle-rows.json`, JSON.stringify(rows, null, 1));
console.log('--- ROWS ---'); console.log(JSON.stringify(rows, null, 1));
await browser.close();
