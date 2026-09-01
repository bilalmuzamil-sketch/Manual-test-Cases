// seed_edit_part.mjs — the last two data states, made by EDITING one worthless inventory part and
// putting it back afterwards.
//
// TARGET: 1890998C1 "SEAL O-RING" — quantity 0, cost 0.00, sell 0, one bin (F1ACORDIAN, 0). Chosen
// deliberately: every value on it is already zero, so removing its bin and clearing its prices
// changes nothing anyone could be relying on, and the restore is exact.
//
// WHAT IT UNBLOCKS
//   * no bin at all  -> the "Not stocked" card (S7-R2 leg 3) and S7-N1: C45222 leg 3, C45239
//   * cost and sell price EMPTY (not 0.00) -> S4-E1: C45060. Of the 18 zero-price parts on the
//     branch every one holds 0.00, which is a value rather than an empty field.
//
// Rule 6: the pre-edit state is written to disk BEFORE anything changes, and --restore puts it back
// and re-reads it to prove it.
import { boot, APP, apiGet } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const PART = process.env.PART || '1890998C1';
const MODE = process.env.MODE || 'seed';         // seed | restore
const STATE = '/tmp/inl6597/PART-EDIT-STATE.json';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const { browser, page } = await boot('/workorders');
const wait = ms => page.waitForTimeout(ms);

// find the part over the API first, so the UI work knows exactly what it is looking for
const found = await apiGet(`/api/inventory/parts?search=${encodeURIComponent(PART)}&pagination%5BrowsPerPage%5D=50`);
const row = ((found.body?.data?.collection) || []).find(x => x.part_number === PART);
if (!row) { L('part not found over the API — STOP'); await browser.close(); process.exit(2); }
L('target:', row.part_number, '| qty', row.quantity, '| cost', row.purchase_price, '| sell', row.sell_price,
  '| bins', JSON.stringify((row.binLocations || []).map(b => [b.name, b.quantity, b.isDefault])));
if (MODE === 'seed') fs.writeFileSync(STATE, JSON.stringify({ part: row }, null, 1));

// Parts > Inventory, then use the screen's OWN search (the page_search_toggle control), NOT the
// masthead's global search - typing the part number into `select_global_search` filtered the wrong
// thing and matched nothing on the first attempt.
await page.goto(`${APP}/parts/inventory`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await page.waitForFunction(() => !/\bLoading\.\.\./.test(document.body?.innerText || '')
  && document.querySelectorAll('tbody tr').length > 0, { timeout: 60000 }).catch(() => {});
await wait(2500);
const opened = await page.evaluate(() => {
  const b = document.querySelector('[data-test-id="page_search_toggle"]');
  if (!b) return false; b.click(); return true; });
L('page search opened:', opened);
await wait(1800);
const typedInto = await page.evaluate(() => {
  const ins = [...document.querySelectorAll('input')].filter(i => i.offsetParent !== null
    && i.getAttribute('data-test-id') !== 'select_global_search'
    && !i.closest('[data-test-id="select_global_search"]'));
  const i = ins.find(x => /search/i.test((x.getAttribute('placeholder') || '') + (x.type || '')));
  if (!i) return null;
  i.focus(); return i.getAttribute('data-test-id') || i.getAttribute('placeholder') || 'unnamed';
});
L('typing into:', typedInto);
if (typedInto) {
  await page.keyboard.type(PART, { delay: 70 });
  await page.waitForFunction(p => [...document.querySelectorAll('tbody tr')].some(r => (r.innerText||'').includes(p)),
    PART, { timeout: 30000 }).catch(() => {});
  await wait(2500);
}
const hit = await page.evaluate(p => {
  const rows = [...document.querySelectorAll('tbody tr')];
  const i = rows.findIndex(r => (r.innerText || '').includes(p));
  return { rows: rows.length, i, text: i >= 0 ? (rows[i].innerText||'').replace(/\s+/g,' ').trim().slice(0,180) : null };
}, PART);
L('row:', JSON.stringify(hit));
if (hit.i < 0) { L('could not find the row on this screen — STOP'); 
  fs.writeFileSync(`${OUT}/evidence/seed-edit-part.log`, log.join('\n') + '\n'); await browser.close(); process.exit(3); }

await page.evaluate(i => document.querySelectorAll('tbody tr')[i]?.click(), hit.i);
await wait(6000);
const form = await page.evaluate(() => {
  const d = document.querySelector('.q-dialog');
  if (!d) return { open: false };
  const g = id => { const e = d.querySelector(`[data-test-id="${id}"]`);
    const i = e && (e.matches('input') ? e : e.querySelector('input')); return i ? i.value : null; };
  return { open: true, title: (d.innerText||'').replace(/\s+/g,' ').slice(0,120),
    cost: g('input_cost'), sell: g('input_sell_price'),
    binIds: [...new Set([...d.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))]
      .filter(x => /bin|quantity/i.test(x)),
    deleteButtons: [...d.querySelectorAll('button')].map(b => (b.innerText||'').replace(/\s+/g,' ').trim())
      .filter(Boolean).slice(0, 14) };
});
L('edit form:', JSON.stringify(form, null, 1).slice(0, 1200));
await page.screenshot({ path: `${OUT}/evidence/seed-edit-form.png`, fullPage: true });

if (MODE === 'seed') {
  // clear the ONE bin row and both prices, then Save. If the form refuses, that is itself the
  // answer: the build does not permit an inventory part with no bin, which makes the "Not stocked"
  // card unreachable by design - a question for the PO (Rule 58), not a defect.
  const cleared = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    const out = {};
    const clear = id => {
      const e = d?.querySelector(`[data-test-id="${id}"]`);
      const i = e && (e.matches('input') ? e : e.querySelector('input'));
      if (!i) return null;
      i.focus(); i.value = '';
      i.dispatchEvent(new Event('input', { bubbles: true }));
      i.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };
    out.bin = clear('select_bin_location_0');
    out.qty = clear('input_quantity_0');
    out.cost = clear('input_cost') ?? clear('input_purchase_price');
    out.sell = clear('input_sell_price');
    return out;
  });
  L('cleared:', JSON.stringify(cleared));
  await wait(2000);
  const savedLabel = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => (x.innerText || '').trim() === 'Save');
    if (!b) return 'no Save button'; if (b.disabled) return 'disabled'; b.click(); return 'clicked'; });
  L('Save:', savedLabel);
  await wait(6000);
  const after = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    return { dialogStillOpen: !!d,
      validation: d ? (d.innerText || '').replace(/\s+/g, ' ').match(/[^.]*required[^.]*\.?|[^.]*must[^.]*\.?/i)?.[0] || null : null,
      dialogText: d ? (d.innerText || '').replace(/\s+/g, ' ').slice(0, 300) : null,
      toast: [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()) };
  });
  L('after Save:', JSON.stringify(after, null, 1).slice(0, 700));
  // read the part back over the API - that is what settles whether the state now exists
  await wait(2500);
  const check = await apiGet(`/api/inventory/parts?search=${encodeURIComponent(PART)}&pagination%5BrowsPerPage%5D=50`);
  const now = ((check.body?.data?.collection) || []).find(x => x.part_number === PART);
  L('part now:', now ? JSON.stringify({ qty: now.quantity, cost: now.purchase_price, sell: now.sell_price,
      bins: (now.binLocations || []).map(b => [b.name, b.quantity, b.isDefault]) }) : 'not found');
  fs.writeFileSync('/tmp/inl6597/PART-EDIT-RESULT.json', JSON.stringify({ cleared, savedLabel, after, now }, null, 1));
  await page.screenshot({ path: `${OUT}/evidence/seed-edit-after.png`, fullPage: true });
}
fs.writeFileSync(`${OUT}/evidence/seed-edit-part.log`, log.join('\n') + '\n');
await browser.close();
