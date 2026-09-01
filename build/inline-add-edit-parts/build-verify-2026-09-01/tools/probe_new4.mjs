// probe_new4.mjs — the four cases the QA lead added on 2026-09-01 to replace C44996:
//   C45250  a Complete line does not offer "+ Add Part"   (his route: part ADDED AND PICKED first)
//   C45251  a Complete line: which part fields stay editable, inventory vs special order
//   C45252  entering Cost fills Sell Price from the pricing matrix
//   C45253  changing Category recalculates Sell Price from the matrix
//
// 🛑 WHY C45250 IS NOT THE SAME AS THE OLD C44996, AND WHY MY OLD FINDING MAY NOT TRANSFER.
// My C44996 run completed a line that had NO parts, because a line with unfulfilled part requests
// cannot be completed at all. His route says: add a part, PICK/RECEIVE it, and only then complete the
// line - which is exactly the state the requirement is about. A picked part is fulfilled, so the line
// CAN complete. So this must be re-run his way before any verdict is claimed.
import { boot, APP, apiGet, apiPost, apiCall } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const RESULTS = `${OUT}/evidence/probe-new4.json`;
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
const go = async (wo = WO) => { for (let a = 0; a < 3; a++) {
  await page.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  if (await page.evaluate(() => !!document.querySelector('[data-test-id="button_add_part"]'))) return true;
} return false; };
const openRow = async () => { await go();
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  return page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]')); };
const search = async (q) => {
  await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
    const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
  await page.waitForTimeout(1000);
  await page.keyboard.type(q, { delay: 55 });
  await page.waitForTimeout(4200);
  return page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 8));
};
const pick = async (n = 0) => { await page.evaluate(i => document.querySelectorAll('.q-menu .q-item')[i]?.click(), n);
  await page.waitForTimeout(4500); };
const set = async (id, v) => page.evaluate(([i, val]) => {
  const e = document.querySelector(`[data-test-id="${i}"]`);
  const inp = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea'));
  if (!inp) return false;
  inp.focus(); inp.value = val;
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
  inp.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  inp.blur();
  return true;
}, [id, v]);
const val = i => page.evaluate(id => { const e = document.querySelector(`[data-test-id="${id}"]`);
  const n = e && (e.matches('input') ? e : e.querySelector('input')); return n ? n.value : null; }, i);
// 🛑 EVERY FIELD IN THIS ROW IS AN <input>, THE CATEGORY SELECT INCLUDED. Reading innerText off the
// category returns "" and looks like an empty field; read .value. (Measured from a DOM dump of the
// open row - the first version of this probe reported category "" five times in a row and would have
// called a working control broken.)
const rowVals = () => page.evaluate(() => {
  const v = i => { const e = document.querySelector(`[data-test-id="${i}"]`);
    const n = e && (e.matches('input') ? e : e.querySelector('input')); return n ? n.value : null; };
  const row = document.querySelector('[data-test-id="inline_part_row"]');
  return { desc: v('input_inline_part_description'), qty: v('input_inline_part_quantity'),
           cost: v('input_inline_part_cost'), sell: v('input_inline_part_sell_price'),
           category: v('select_inline_part_category'),
           rowText: row ? (row.innerText || '').replace(/\s+/g, ' ').slice(0, 200) : null };
});
// 🛑 TYPE, DO NOT ASSIGN. Setting .value and dispatching input/change is enough for a plain field but
// is NOT reliably seen by the component that DERIVES the sell price from the cost. A run that assigns
// the cost and then reports "sell price never changed" is measuring its own instrumentation. So click
// the field, select all, type with real key events, and Tab out.
const typeInto = async (id, text) => {
  const loc = page.locator(`[data-test-id="${id}"]`);
  await loc.click({ timeout: 15000 }).catch(() => {});
  await page.keyboard.press('Control+A').catch(() => {});
  await page.keyboard.type(text, { delay: 70 });
  await page.keyboard.press('Tab').catch(() => {});
  await page.waitForTimeout(2200);
};

const P = {};

// ---------------------------------------------------------------- C45252
P['C45252-cost-fills-sell-price'] = async () => {
  if (!(await openRow())) return { ROW_NOT_OPENED: true };
  const opts = await search('F40010212');
  if (!opts.length) return { TYPEAHEAD_EMPTY: true };
  await pick(0);
  const afterPick = await rowVals();
  await typeInto('input_inline_part_quantity', '2');
  const trials = [];
  for (const cost of ['10.00', '250.00']) {
    await typeInto('input_inline_part_cost', cost);
    trials.push({ costTyped: cost, ...(await rowVals()) });
  }
  await page.screenshot({ path: `${OUT}/evidence/new4-cost-to-sell.png`, fullPage: true });
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(e => /Discard/i.test(e.innerText || ''));
    b?.click();
  });
  return { afterPick, trials };
};

// ---------------------------------------------------------------- C45253
P['C45253-category-recalculates-sell-price'] = async () => {
  if (!(await openRow())) return { ROW_NOT_OPENED: true };
  const opts = await search('F40010212');
  if (!opts.length) return { TYPEAHEAD_EMPTY: true };
  await pick(0);
  await typeInto('input_inline_part_quantity', '1');
  await typeInto('input_inline_part_cost', '100.00');
  const before = await rowVals();
  const seen = [];
  for (let n = 0; n < 5; n++) {
    await page.evaluate(() => document.querySelector('[data-test-id="select_inline_part_category"]')?.click());
    await page.waitForTimeout(1800);
    const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
      .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()));
    if (!items.length) { seen.push({ note: 'category menu did not open' }); break; }
    const idx = Math.min(n + 1, items.length - 1);
    const chosen = items[idx];
    await page.evaluate(i => document.querySelectorAll('.q-menu .q-item')[i]?.click(), idx);
    await page.waitForTimeout(2600);
    seen.push({ chose: chosen, ...(await rowVals()) });
  }
  await page.screenshot({ path: `${OUT}/evidence/new4-category-to-sell.png`, fullPage: true });
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(e => /Discard/i.test(e.innerText || ''));
    b?.click();
  });
  const sells = seen.filter(s => s.sell).map(s => s.sell);
  return { before, categoriesTried: seen,
           sellPriceChangedAtAll: new Set(sells).size > 1, distinctSellPrices: [...new Set(sells)] };
};

for (const [k, fn] of Object.entries(P)) {
  if (ONLY.length && !ONLY.includes(k)) continue;
  console.log(`\n### ${k}`);
  try { results[k] = await fn(); } catch (e) { results[k] = { PROBE_ERROR: String(e).slice(0, 400) }; }
  console.log(JSON.stringify(results[k], null, 1).slice(0, 3000));
  fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
  fs.writeFileSync(RESULTS, JSON.stringify(results, null, 1));
}
await browser.close();
