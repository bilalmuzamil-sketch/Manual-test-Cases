// seed_bins_ui2.mjs — find the bin editor on the Parts > Inventory screen and put one part into
// several bins. Rule 14: a missing DATA STATE is seeded, never reported as unverified. Rule 6: this
// branch is disposable - tag ZZAUTOTEST where a name is entered, and restore what is changed.
//
// The first explorer typed into the inventory search box and matched nothing, so this one does not
// assume the search works: it pages the list, and it also tries opening a row directly.
import { boot, APP, apiGet } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const PART = process.env.PART || 'N68SL-356';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const { browser, page } = await boot('/workorders');
const wait = (ms) => page.waitForTimeout(ms);

await page.goto(`${APP}/parts/inventory`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await page.waitForFunction(() => !/\bLoading\.\.\./.test(document.body?.innerText || '')
  && document.querySelectorAll('tbody tr').length > 0, { timeout: 60000 }).catch(() => {});
await wait(2500);

// 1. what does the search control actually look like, and how is it wired?
const searchInfo = await page.evaluate(() => {
  const ins = [...document.querySelectorAll('input')].map(i => ({
    id: i.closest('[data-test-id]')?.getAttribute('data-test-id') || i.getAttribute('data-test-id'),
    ph: i.getAttribute('placeholder'), type: i.type, name: i.name }));
  return { inputs: ins.slice(0, 12), rows: document.querySelectorAll('tbody tr').length,
           firstRow: (document.querySelector('tbody tr')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160),
           headers: [...document.querySelectorAll('thead th')].map(t => (t.innerText||'').replace(/\s+/g,' ').trim()) };
});
L('search inputs:', JSON.stringify(searchInfo.inputs));
L('columns      :', JSON.stringify(searchInfo.headers));
L('rows         :', searchInfo.rows, '| first:', searchInfo.firstRow);

// 2. 🛑 DO NOT TOUCH THE HEADER SEARCH. The only <input type=search> on this screen is
// `select_global_search` - the GLOBAL search in the masthead, not a filter for this table. Typing
// the part number into it took the row count from 32 to 3 and matched nothing, which is what the
// first explorer misread as "the search does not work". The table carries a
// "Bin Location / Quantity" COLUMN, so the part can simply be found by paging the table.
const findRow = async () => {
  for (let pageNo = 0; pageNo < 40; pageNo++) {
    const hit = await page.evaluate(p => {
      const rows = [...document.querySelectorAll('tbody tr')];
      const i = rows.findIndex(r => (r.innerText || '').includes(p));
      return { rows: rows.length, i,
               text: i >= 0 ? (rows[i].innerText || '').replace(/\s+/g, ' ').trim().slice(0, 220) : null };
    }, PART);
    if (hit.i >= 0) return { ...hit, pageNo };
    const advanced = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find(x =>
        /chevron_right|next/i.test(x.innerText || '') || x.getAttribute('aria-label') === 'Next page');
      if (!b || b.disabled) return false; b.click(); return true;
    });
    if (!advanced) return { ...hit, pageNo, exhausted: true };
    await page.waitForFunction(() => !/\bLoading\.\.\./.test(document.body?.innerText || ''), { timeout: 30000 }).catch(() => {});
    await wait(2200);
  }
  return { i: -1, exhausted: true };
};
const afterSearch = await findRow();
L('found by paging:', JSON.stringify(afterSearch));
// what the bin column holds for a few rows, so the seeded state can be recognised later
const binColumn = await page.evaluate(() => {
  const heads = [...document.querySelectorAll('thead th')].map(t => (t.innerText||'').replace(/\s+/g,' ').trim());
  const idx = heads.findIndex(h => /Bin Location/i.test(h));
  if (idx < 0) return null;
  return { columnIndex: idx,
           sample: [...document.querySelectorAll('tbody tr')].slice(0, 5)
             .map(r => (r.children[idx]?.innerText || '').replace(/\s+/g, ' ').trim()) };
});
L('bin column:', JSON.stringify(binColumn));

// 3. open it and describe every editable thing on the detail surface
if (afterSearch.i >= 0) {
  await page.evaluate(i => document.querySelectorAll('tbody tr')[i]?.click(), afterSearch.i);
  await wait(6000);
  const detail = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog') || document.body;
    const t = (d.innerText || '');
    return { url: location.pathname, isDialog: !!document.querySelector('.q-dialog'),
      title: t.replace(/\s+/g, ' ').slice(0, 120),
      ids: [...new Set([...d.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))].slice(0, 45),
      binLines: (t.match(/[^\n]*[Bb]in[^\n]*/g) || []).slice(0, 12),
      buttons: [...d.querySelectorAll('button')].map(b => (b.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0, 22),
      tabs: [...d.querySelectorAll('.q-tab, [role="tab"]')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    };
  });
  L('detail surface:', JSON.stringify(detail, null, 1).slice(0, 1800));
  await page.screenshot({ path: `${OUT}/evidence/seed-inventory-detail.png`, fullPage: true });
}
fs.writeFileSync(`${OUT}/evidence/seed-bins-ui2.log`, log.join('\n') + '\n');
await browser.close();
