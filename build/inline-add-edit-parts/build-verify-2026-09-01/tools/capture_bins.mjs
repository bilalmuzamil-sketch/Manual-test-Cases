// capture_bins.mjs — Bin Allocation, searched for with the RIGHT words.
//
// capture3 reported '"bin" in page text: false' and I nearly read that as the feature being absent.
// It was the matcher: the control the spec describes is labelled "Pulled from", which contains no
// "bin" at all, and `button_pulled_from_bin` was already visible in the same capture. Search for
// what the cases actually say (C45224: 'displayed below the row as "Pulled from" followed by a chip').
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const save = (n, o) => fs.writeFileSync(`${OUT}/evidence/${n}`, JSON.stringify(o, null, 1));
const WO = process.env.WO;
const { browser, page } = await boot('/workorders');
await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await page.waitForFunction(() => (document.body?.innerText||'').length > 1200, { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(3500);
await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
await page.waitForTimeout(4000);

// open the part-number typeahead and capture the RESULT CARDS (C45222: qty + bin chips + Not stocked)
await page.evaluate(() => {
  const s = document.querySelector('[data-test-id="select_inline_part_number"]');
  (s?.matches('input') ? s : s?.querySelector('input') || s)?.click();
});
await page.waitForTimeout(3500);
const cards = await page.evaluate(() => {
  const items = [...document.querySelectorAll('.q-menu .q-item')];
  return items.slice(0, 8).map(e => ({
    text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200),
    chips: [...e.querySelectorAll('.q-chip')].map(c => (c.innerText||'').replace(/\s+/g,' ').trim()),
    notStocked: /not stocked/i.test(e.innerText || ''),
    plusN: /\+\s*\d+/.test(e.innerText || ''),
  }));
});
L('=== C45222 typeahead result cards ===');
cards.forEach((c,i) => L(`  [${i}] chips=${JSON.stringify(c.chips)} notStocked=${c.notStocked} plusN=${c.plusN}\n       ${c.text}`));
L('  any "Not stocked" card:', cards.some(c => c.notStocked));
L('  any "+N" collapse chip:', cards.some(c => c.plusN));
save('bin-cards.json', cards);
await page.screenshot({ path: `${OUT}/evidence/bin-cards.png`, fullPage: true });

// pick a STOCKED part, then look for the "Pulled from" chip below the row (C45224/C45225)
const picked = await page.evaluate(() => {
  const items = [...document.querySelectorAll('.q-menu .q-item')];
  const stocked = items.find(e => /Inventory Qty:\s*[1-9]/i.test(e.innerText || ''));
  const target = stocked || items[0];
  if (!target) return null;
  const txt = (target.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 140);
  target.click(); return txt;
});
L('\n  picked part:', JSON.stringify(picked));
await page.waitForTimeout(5000);
const alloc = await page.evaluate(() => {
  const row = document.querySelector('[data-test-id="inline_part_row"]');
  const t = document.body?.innerText || '';
  const chip = document.querySelector('[data-test-id="button_pulled_from_bin"]');
  return {
    pulledFromText: /pulled from/i.test(t),
    chipPresent: !!chip,
    chipLabel: chip ? (chip.innerText || '').replace(/\s+/g,' ').trim() : null,
    rowText: row ? (row.innerText||'').replace(/\s+/g,' ').slice(0, 400) : null,
    qty: document.querySelector('[data-test-id="input_inline_part_quantity"]')?.value,
  };
});
L('\n=== C45224/C45225 the "Pulled from" chip ===');
L('  "Pulled from" on screen :', alloc.pulledFromText);
L('  chip control present    :', alloc.chipPresent, '| label:', JSON.stringify(alloc.chipLabel));
L('  quantity auto-filled    :', JSON.stringify(alloc.qty));
L('  row text                :', JSON.stringify(alloc.rowText));
save('bin-allocation.json', alloc);
await page.screenshot({ path: `${OUT}/evidence/bin-allocation.png`, fullPage: true });

// open the chip -> the bin picker (C45226: every bin, on-hand qty, check + Default badge)
if (alloc.chipPresent) {
  await page.evaluate(() => document.querySelector('[data-test-id="button_pulled_from_bin"]')?.click());
  await page.waitForTimeout(3500);
  const picker = await page.evaluate(() => {
    const menu = document.querySelector('.q-menu, .q-dialog');
    if (!menu) return { opened: false };
    const rows = [...menu.querySelectorAll('.q-item, tr')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
    const t = menu.innerText || '';
    return { opened: true, rows: rows.slice(0, 15),
             hasDefaultBadge: /\bdefault\b/i.test(t), hasCheck: !!menu.querySelector('.q-icon'),
             text: t.replace(/\s+/g,' ').slice(0, 500) };
  });
  L('\n=== C45226 the bin picker ===');
  L('  opened          :', picker.opened);
  L('  "Default" badge :', picker.hasDefaultBadge);
  L('  rows            :', JSON.stringify(picker.rows));
  save('bin-picker.json', picker);
  await page.screenshot({ path: `${OUT}/evidence/bin-picker.png`, fullPage: true });
}
fs.appendFileSync(`${OUT}/evidence/capture.log`, '\n' + log.join('\n') + '\n');
await browser.close();
