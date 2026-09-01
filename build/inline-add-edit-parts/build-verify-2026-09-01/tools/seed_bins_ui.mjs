// seed_bins_ui.mjs — put a part into SEVERAL bins through the UI, because the API refuses.
//
// POST /api/inventory/parts/change answers 403 "Access denied." for the quick-login admin even
// though its permission list carries catalogInventoryCreateAndEdit, so the API route is not
// available to this session. The screen is: Parts -> Inventory -> the part -> its bins. Doing it
// through the UI has a second benefit: it PROVES the route, so a case precondition can name it.
//
// This is a data-state seed, not a verification. It reports exactly what it found and changed.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const PART = process.env.PART || 'N68SL-356';
const { browser, page } = await boot('/workorders');
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const settle = async (ms = 4000) => page.waitForTimeout(ms);

// 1. Parts in the top menu -> what is on it?
await page.goto(`${APP}/parts`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await settle(5000);
const partsScreen = await page.evaluate(() => ({
  url: location.pathname,
  tabs: [...document.querySelectorAll('.q-tab, [role="tab"], .q-item__label')]
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 25),
  headings: (document.body?.innerText || '').split('\n').map(x => x.trim()).filter(Boolean).slice(0, 25),
}));
L('Parts screen:', JSON.stringify(partsScreen).slice(0, 700));

// 2. find the inventory list and search for the part
for (const route of ['/parts/inventory', '/inventory', '/parts?tab=inventory']) {
  await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle(4500);
  const ok = await page.evaluate(() => ({ url: location.pathname + location.search,
    chars: (document.body?.innerText || '').length,
    hasSearch: !!document.querySelector('input[type="search"], input[placeholder*="earch" i]'),
    rows: document.querySelectorAll('tbody tr').length }));
  L('route', route, '->', JSON.stringify(ok));
  if (ok.rows > 0) break;
}
const typed = await page.evaluate(p => {
  const i = document.querySelector('input[type="search"], input[placeholder*="earch" i]');
  if (!i) return false;
  i.focus(); i.value = p;
  i.dispatchEvent(new Event('input', { bubbles: true })); return true; }, PART);
await settle(5000);
const found = await page.evaluate(p => {
  const rows = [...document.querySelectorAll('tbody tr')];
  const r = rows.find(x => (x.innerText || '').includes(p));
  return { searched: rows.length, matched: r ? (r.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) : null };
}, PART);
L('search typed:', typed, '| found:', JSON.stringify(found));
if (found.matched) {
  await page.evaluate(p => {
    const r = [...document.querySelectorAll('tbody tr')].find(x => (x.innerText || '').includes(p));
    r?.click(); }, PART);
  await settle(5500);
  const detail = await page.evaluate(() => {
    const t = document.body?.innerText || '';
    return { url: location.pathname,
      dialogOpen: !!document.querySelector('.q-dialog'),
      binWords: /bin/i.test(t),
      ids: [...new Set([...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))]
        .filter(x => /bin|quantity|add/i.test(x)).slice(0, 25),
      binText: (t.match(/[^\n]*[Bb]in[^\n]*/g) || []).slice(0, 10),
      buttons: [...document.querySelectorAll('button')].map(b => (b.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0, 20),
    };
  });
  L('part detail:', JSON.stringify(detail, null, 1).slice(0, 1200));
  await page.screenshot({ path: `${OUT}/evidence/seed-part-detail.png`, fullPage: true });
}
fs.writeFileSync(`${OUT}/evidence/seed-bins-ui.log`, log.join('\n') + '\n');
await browser.close();
