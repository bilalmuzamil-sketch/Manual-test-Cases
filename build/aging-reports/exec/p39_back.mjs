// p39_back.mjs — 11 Nov 2026: what does browser Back do on the aging reports? (C715393/C715397 saw Back leave the report after a filter change.)
// Through the screen only: open each page from the left menu, record history.length and the address before/after a filter change, press Back;
// then the other reading of PRD S5-R10: change a filter, leave via the left menu (Sales By Customer), press Back, read the chips.
// Control: Sales By Customer (the native report the PRD points to) does the same filter change + Back. Pictures at each step. Output p39/.
import { start } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./p39/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/dashboard'); const p = s.page; const F = mkFilt(p); const o = {};
const menu = async (label) => { await p.locator('a, .q-item').filter({ hasText: new RegExp('^\\s*\\S*\\s*' + label.replace('/', '\\/') + '\\s*$') }).first().click(); await p.waitForTimeout(3500); };
const st = async () => ({ url: p.url().replace(/^https:\/\/[^/]+/, ''), hist: await p.evaluate(() => history.length), chips: await F.chips() });
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
try {
  await s.go('/reports/sales-by-customer'); await p.waitForTimeout(3000);
  for (const [k, label, kind, item] of [['arc', 'A/R Aging Collection', 'Location', 'Staging Lethbridge - 4310'], ['ars', 'A/R Aging Summary', 'Past due', '91+ days'], ['sbc', 'Sales By Customer', 'Location', 'Staging Lethbridge - 4310']]) {
    const r = (o[k] = {}); await menu('A/P Aging Summary'); await menu(label); r.a = await st(); await F.menuClick(kind, item); r.b = await st(); await s.shot(k + '-1-changed');
    await p.goBack(); await p.waitForTimeout(3500); r.c = await st(); await s.shot(k + '-2-after-back'); save();
    // the other reading: change, leave via the menu, Back
    await menu(label); await F.menuClick(kind, item); r.d = await st(); await menu('Sales By Representative'); r.e = await st(); await p.goBack(); await p.waitForTimeout(3500); r.f = await st(); await s.shot(k + '-3-leave-and-back'); save(); }
} catch (e) { o.err = String(e).slice(0, 300); }
save(); console.log(JSON.stringify(o).slice(0, 3000)); await s.close(); process.exit(0);
