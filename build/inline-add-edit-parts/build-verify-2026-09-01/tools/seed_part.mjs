// seed_part.mjs — create ONE inventory part with NO bin and NO prices, through Parts > Inventory >
// "New Inventory Part". That single part covers the last two data states the branch does not have:
//   * a part held in no bin at all -> the "Not stocked" card (S7-R2 leg 3) and S7-N1 (C45239, C45222)
//   * a part with no cost and no sell price on record -> S4-E1 (C45060). Of the 18 zero-price parts
//     on the branch, every one holds 0.00, which is a value, not an empty field.
//
// Route confirmed by the QA lead 2026-09-01: "you have the inventory write access from Parts ->
// Click any inventory to edit - Also you can add you inventory from Parts -> Inventory".
// Rule 6: the name carries ZZAUTOTEST so it is obviously throwaway, and the created id is written to
// disk so it can be removed again.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const { browser, page } = await boot('/workorders');
const wait = ms => page.waitForTimeout(ms);
const TAG = 'ZZAUTOTEST-NOBIN-' + Date.now().toString().slice(-6);

await page.goto(`${APP}/parts/inventory`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await page.waitForFunction(() => !/\bLoading\.\.\./.test(document.body?.innerText || '')
  && document.querySelectorAll('tbody tr').length > 0, { timeout: 60000 }).catch(() => {});
await wait(2500);
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button, .q-btn')].find(x => /New Inventory Part/i.test(x.innerText || ''));
  b?.click(); });
await wait(5000);

// the dialog's catalog-part field is a typeahead; a NEW catalogue part is created by typing a name
// that matches nothing and taking the create action, the same pattern as the work-order row
const step1 = await page.evaluate(t => {
  const d = document.querySelector('.q-dialog');
  const e = d?.querySelector('[data-test-id="select_catalogue_part"]');
  const i = e && (e.matches('input') ? e : e.querySelector('input'));
  if (!i) return { ok: false, ids: [...new Set([...(d?.querySelectorAll('[data-test-id]') || [])].map(x => x.getAttribute('data-test-id')))] };
  i.focus(); return { ok: true };
}, TAG);
L('catalog field focused:', JSON.stringify(step1).slice(0, 400));
if (step1.ok) {
  await page.keyboard.type(TAG, { delay: 60 });
  await wait(3500);
  const menu = await page.evaluate(() => {
    const m = document.querySelector('.q-menu');
    return m ? { text: (m.innerText || '').replace(/\s+/g, ' ').slice(0, 300),
                 items: [...m.querySelectorAll('.q-item')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()).slice(0, 8) } : null; });
  L('catalog typeahead:', JSON.stringify(menu));
  const created = await page.evaluate(() => {
    const it = [...document.querySelectorAll('.q-menu .q-item')].find(e => /create|new/i.test(e.innerText || ''));
    if (!it) return false; it.click(); return (it.innerText || '').replace(/\s+/g,' ').trim(); });
  L('create action:', created);
  await wait(5000);
}
// leave cost, sell price and the bin location EMPTY, then try to save
const beforeSave = await page.evaluate(() => {
  const d = document.querySelector('.q-dialog');
  const g = id => { const e = d?.querySelector(`[data-test-id="${id}"]`);
    const i = e && (e.matches('input') ? e : e.querySelector('input')); return i ? i.value : null; };
  return { title: (d?.innerText || '').replace(/\s+/g,' ').slice(0, 200),
           cost: g('input_cost'), sell: g('input_sell_price'), bin0: g('select_bin_location_0'),
           buttons: [...(d?.querySelectorAll('button') || [])].map(b => (b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0, 12) };
});
L('before save:', JSON.stringify(beforeSave, null, 1).slice(0, 900));
const saved = await page.evaluate(() => {
  const b = [...document.querySelectorAll('.q-dialog button')].find(x => /^(save|create|add)/i.test((x.innerText||'').trim()));
  if (!b) return 'no save button'; if (b.disabled) return 'disabled'; b.click(); return (b.innerText||'').trim(); });
L('save clicked:', saved);
await wait(6000);
const after = await page.evaluate(t => ({
  dialogOpen: !!document.querySelector('.q-dialog'),
  dialogText: (document.querySelector('.q-dialog')?.innerText || '').replace(/\s+/g,' ').slice(0, 320),
  toast: [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()),
  rowPresent: [...document.querySelectorAll('tbody tr')].some(r => (r.innerText || '').includes(t)),
}), TAG);
L('after save:', JSON.stringify(after, null, 1).slice(0, 700));
fs.writeFileSync('/tmp/inl6597/SEEDED-PART.json', JSON.stringify({ tag: TAG, ...after }, null, 1));
await page.screenshot({ path: `${OUT}/evidence/seed-part-created.png`, fullPage: true });
fs.writeFileSync(`${OUT}/evidence/seed-part.log`, log.join('\n') + '\n');
await browser.close();
