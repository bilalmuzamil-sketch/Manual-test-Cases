// probe_nobin.mjs — C45239 and C45060, seeded rather than reported missing.
//
// 🛑 THE MISTAKE THIS PROBE CORRECTS. Both cases were reported NOT VERIFIED because "every part on
// this test system is in at least one bin" and "every part holds 0.00 in cost and sell price". Both
// conclusions came from /api/inventory/parts - the STOCKED parts - and the suite's own cases are
// about CATALOGUE parts, which are a different set. The build has an endpoint that names the state
// outright: GET /api/parts-catalogue/catalogue-parts-that-are-not-on-location returns 19,496 of
// them. The state was never missing. This is the second false "the data does not exist" of the pass
// (playbook S was the first), and both had the same shape: a conclusion drawn from the wrong list.
import { boot, APP, apiGet } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const RESULTS = `${OUT}/evidence/probe-nobin.json`;
const results = (() => { try { return JSON.parse(fs.readFileSync(RESULTS, 'utf8')); } catch (_) { return {}; } })();
const { browser, page } = await boot('/workorders');
const settle = async () => {
  await page.waitForFunction(sel => {
    const t = document.body?.innerText || '';
    if (/\bLoading\.\.\./.test(t)) return false;
    return !!document.querySelector(sel) || t.length > 4000;
  }, '[data-test-id="button_add_part"]', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
};
const openRow = async () => { for (let a = 0; a < 3; a++) {
  await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  if (await page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]'))) return true;
} return false; };
const search = async (q) => {
  await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
    const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
  await page.waitForTimeout(1000);
  await page.keyboard.type(q, { delay: 55 });
  await page.waitForTimeout(4200);
  return page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 10));
};
const pick = async (n = 0) => { await page.evaluate(i => document.querySelectorAll('.q-menu .q-item')[i]?.click(), n);
  await page.waitForTimeout(4500); };
const rowState = () => page.evaluate(() => {
  const t = document.body?.innerText || '';
  const val = i => { const e = document.querySelector(`[data-test-id="${i}"]`);
    const n = e && (e.matches('input') ? e : e.querySelector('input')); return n ? n.value : null; };
  const enabled = i => { const e = document.querySelector(`[data-test-id="${i}"]`);
    const n = e && (e.matches('input') ? e : e.querySelector('input'));
    return n ? !(n.disabled || n.readOnly) : null; };
  const chip = document.querySelector('[data-test-id="button_pulled_from_bin"]');
  return {
    description: val('input_inline_part_description'),
    cost: val('input_inline_part_cost'), sell: val('input_inline_part_sell_price'),
    costEditable: enabled('input_inline_part_cost'), sellEditable: enabled('input_inline_part_sell_price'),
    qty: val('input_inline_part_quantity'),
    binChipPresent: !!chip,
    binChipLabel: chip ? (chip.innerText || '').replace(/\s+/g, ' ').trim() : null,
    notStockedWord: /not stocked|Not stocked|no inventory|not in inventory/i.test(t),
    rowText: (document.querySelector('[data-test-id="inline_part_row"]')?.innerText || '')
      .replace(/\s+/g, ' ').slice(0, 400),
  };
});

const P = {};
P['C45239-C45060-catalogue-part-with-no-bin'] = async () => {
  const cat = await apiGet('/api/parts-catalogue/catalogue-parts-that-are-not-on-location');
  const all = cat.body?.data?.collection || [];
  const target = all[0];
  const opened = await openRow();
  if (!opened) return { ROW_NOT_OPENED: true };
  // POSITIVE CONTROL: a STOCKED part first, so an absent bin chip is known to mean something
  const stocked = await apiGet('/api/inventory/parts?pagination%5BrowsPerPage%5D=5&pagination%5Bpage%5D=1');
  const sp = (stocked.body?.data?.parts || stocked.body?.data?.collection || [])[0];
  let control = null;
  if (sp) {
    const opts = await search(String(sp.partNumber || sp.part_number || sp.number || sp.name).slice(0, 12));
    if (opts.length) { await pick(0); control = await rowState(); }
  }
  // now the catalogue part that is on NO bin location
  const opened2 = await openRow();
  const opts2 = await search(String(target.partNumber));
  let observed = null;
  if (opts2.length) { await pick(0); observed = await rowState(); }
  await page.screenshot({ path: `${OUT}/evidence/nobin-catalogue-part.png`, fullPage: true });
  return { catalogueEndpoint: '/api/parts-catalogue/catalogue-parts-that-are-not-on-location',
           partsWithNoBinLocation: all.length,
           targetPart: { partNumber: target.partNumber, name: target.name },
           positiveControlStockedPart: { part: sp && (sp.partNumber || sp.name), state: control },
           typeaheadOptions: opts2, secondRowOpened: opened2, observedForTheNoBinPart: observed };
};

for (const [k, fn] of Object.entries(P)) {
  console.log(`\n### ${k}`);
  try { results[k] = await fn(); } catch (e) { results[k] = { PROBE_ERROR: String(e).slice(0, 400) }; }
  console.log(JSON.stringify(results[k], null, 1).slice(0, 3500));
  fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
  fs.writeFileSync(RESULTS, JSON.stringify(results, null, 1));
}
await browser.close();
