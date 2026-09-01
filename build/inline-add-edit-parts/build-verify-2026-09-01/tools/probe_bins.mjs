// probe_bins.mjs — Story 7 (bin allocation) on the inline row, 22 cases.
//
// The lesson from the earlier passes is built in: every documented sentence is searched for in the
// WHOLE rendered page, never in one selector. The warning and the informational note sit BESIDE the
// chip, which is outside `inline_part_row`, so a row-scoped read reports them absent every time.
import { boot, APP, apiGet } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const results = {};
const { browser, page } = await boot('/workorders');
const settle = async (m = 1200) => {
  await page.waitForFunction(x => (document.body?.innerText || '').length > x, m, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3200);
};
const openRow = async () => {
  for (let a = 0; a < 3; a++) {
    await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await settle();
    await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
    await page.waitForTimeout(4000);
    if (await page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]'))) return true;
  }
  return false;
};
const set = async (id, v) => page.evaluate(([i, val]) => {
  const e = document.querySelector(`[data-test-id="${i}"]`);
  const inp = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea'));
  if (!inp) return false;
  inp.focus(); inp.value = val;
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}, [id, v]);
const search = async (q) => {
  await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
    const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
  await page.waitForTimeout(1000);
  if (q) { await page.keyboard.type(q, { delay: 55 }); await page.waitForTimeout(3800); } else await page.waitForTimeout(2600);
  return page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 12));
};
const pick = async (n = 0) => { await page.evaluate(i => document.querySelectorAll('.q-menu .q-item')[i]?.click(), n);
  await page.waitForTimeout(4500); };
// THE WHOLE PAGE, plus the chip's own neighbourhood
const binState = () => page.evaluate(() => {
  const t = document.body?.innerText || '';
  const chipBtn = document.querySelector('[data-test-id="button_pulled_from_bin"]');
  const near = chipBtn ? (chipBtn.closest('div')?.parentElement?.innerText || chipBtn.closest('div')?.innerText || '') : '';
  return {
    pulledFromOnPage: /Pulled from/i.test(t),
    chipLabel: chipBtn ? (chipBtn.innerText || '').replace(/\s+/g, ' ').trim() : null,
    chipClasses: chipBtn ? chipBtn.className : null,
    chipWarningStyled: chipBtn ? /warning|negative|orange|red/i.test(chipBtn.className + ' ' + (chipBtn.parentElement?.className || '')) : null,
    textNearChip: near.replace(/\s+/g, ' ').trim().slice(0, 320),
    sentences: {
      takesNegative: /takes this bin negative/i.test(t),
      defaultSwitched: /Switched to a bin that covers/i.test(t),
      notStocked: /Not stocked/i.test(t),
    },
    matchedSentences: [...new Set([...document.querySelectorAll('div,span,p,small')]
      .map(e => (e.childElementCount === 0 ? (e.innerText || '') : '').replace(/\s+/g, ' ').trim())
      .filter(x => /takes this bin negative|Switched to a bin|Not stocked|bins$/i.test(x)))].slice(0, 8),
  };
});

const P = {};

// B1: the typeahead card — total quantity then per-bin chips; and what a 0-quantity part shows
P['B1-cards'] = async () => {
  await openRow();
  const clamp = await search('CLAMP');
  const zero = await (async () => { await openRow(); return search('BSPP REPLACEMENT'); })();
  await page.screenshot({ path: `${OUT}/evidence/bin-cards2.png`, fullPage: true });
  return { clampCards: clamp, zeroQuantityCards: zero };
};

// B2: select a part -> auto allocation, chip label, picker contents
P['B2-picker'] = async () => {
  await openRow();
  const opts = await search('CLAMP');
  await pick(0);
  const afterSelect = await binState();
  await page.evaluate(() => document.querySelector('[data-test-id="button_pulled_from_bin"]')?.click());
  await page.waitForTimeout(3500);
  const picker = await page.evaluate(() => {
    const m = document.querySelector('.q-menu') || document.querySelector('.q-dialog');
    if (!m) return null;
    return { text: (m.innerText || '').replace(/\s+/g, ' ').slice(0, 600),
             items: [...m.querySelectorAll('.q-item')].map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).slice(0, 15),
             hasSplitAction: /split across/i.test(m.innerText || ''),
             defaultBadge: /Default/i.test(m.innerText || ''),
             checkMark: /check/i.test(m.innerText || '') };
  });
  await page.screenshot({ path: `${OUT}/evidence/bin-picker2.png`, fullPage: true });
  return { chosen: opts[0], afterSelect, picker };
};

// B3: choose a DIFFERENT bin from the picker (S7-R7) — needs a part held in more than one bin
P['B3-choose-bin'] = async () => {
  const tries = ['CLAMP', 'FILTER', 'OIL', 'HOSE', 'BOLT'];
  const out = [];
  for (const q of tries) {
    await openRow();
    const opts = await search(q);
    // pick the first card that lists more than one bin: two "name qty" pairs after the quantity
    let idx = 0, multi = null;
    for (let i = 0; i < opts.length; i++) {
      const tail = opts[i].split(/Inventory Qty:\s*-?\d+\s*\S+/i)[1] || '';
      const pairs = tail.trim().split(/\s+(?=[A-Z0-9])/).length;
      if (/\d+\s+\S+.*\d+/.test(tail) && tail.trim().split(/\s+/).length >= 4) { idx = i; multi = opts[i]; break; }
    }
    out.push({ query: q, multiBinCard: multi, cardsSample: opts.slice(0, 3) });
    if (multi) {
      await pick(idx);
      const before = await binState();
      await page.evaluate(() => document.querySelector('[data-test-id="button_pulled_from_bin"]')?.click());
      await page.waitForTimeout(3200);
      const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')]
        .map(e => (e.innerText || '').replace(/\s+/g,' ').trim()));
      const target = items.findIndex(x => !/split across/i.test(x)) + 1;
      await page.evaluate(i => { const l = [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')];
        (l[i] || l[0])?.click(); }, target);
      await page.waitForTimeout(3500);
      const after = await binState();
      out[out.length - 1].beforeChip = before.chipLabel;
      out[out.length - 1].pickerItems = items.slice(0, 10);
      out[out.length - 1].afterChip = after.chipLabel;
      out[out.length - 1].afterSentences = after.matchedSentences;
      break;
    }
  }
  return out;
};

// B4: over-allocate — the warning must appear BESIDE the chip (whole-page search)
P['B4-over-allocate'] = async () => {
  await openRow();
  const opts = await search('CLAMP');
  await pick(0);
  const base = await binState();
  await set('input_inline_part_quantity', '999');
  await page.waitForTimeout(4500);
  const over = await binState();
  await page.screenshot({ path: `${OUT}/evidence/bin-over-allocate.png`, fullPage: true });
  return { chosen: opts[0], base, over };
};

// B5: "Split across bins…" — which modal opens, and what it contains
P['B5-split'] = async () => {
  await openRow();
  const opts = await search('CLAMP');
  await pick(0);
  await page.evaluate(() => document.querySelector('[data-test-id="button_pulled_from_bin"]')?.click());
  await page.waitForTimeout(3200);
  const clicked = await page.evaluate(() => {
    const it = [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')].find(e => /split across/i.test(e.innerText || ''));
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(4500);
  const modal = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    if (!d) return { open: false };
    const t = (d.innerText || '').replace(/\s+/g, ' ');
    return { open: true, text: t.slice(0, 900), title: t.slice(0, 60),
             hasAuto: /\bAuto\b/.test(t), hasApply: /\bApply\b/.test(t),
             hasDefaultBadge: /Default/.test(t), exposesPricing: /cost|sell price|margin/i.test(t),
             ids: [...new Set([...d.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))].slice(0, 30),
             rows: [...d.querySelectorAll('tr, .q-item, .row')].map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0, 12),
             inputs: [...d.querySelectorAll('input')].length };
  });
  await page.screenshot({ path: `${OUT}/evidence/bin-split-modal.png`, fullPage: true });
  return { chosen: opts[0], splitActionClicked: clicked, modal };
};

// B6: the chip is reachable by Tab, and sits after the row's own controls (S7-R18)
P['B6-tab-to-chip'] = async () => {
  await openRow();
  await search('CLAMP'); await pick(0);
  await page.evaluate(() => { const e = document.querySelector('[data-test-id="input_inline_part_description"]');
    (e?.matches('input') ? e : e?.querySelector('input'))?.focus(); });
  const seq = [];
  for (let i = 0; i < 12; i++) {
    seq.push(await page.evaluate(() => document.activeElement?.closest?.('[data-test-id]')?.getAttribute('data-test-id')
      || document.activeElement?.tagName));
    await page.keyboard.press('Tab'); await page.waitForTimeout(400);
  }
  return { tabSequence: seq, chipReached: seq.includes('button_pulled_from_bin') };
};

// B7: a free-typed part (no catalog link) must get no allocation and no chip (S7-N2)
P['B7-no-catalog-part'] = async () => {
  await openRow();
  await set('input_inline_part_description', 'ZZAUTOTEST freetyped');
  await set('input_inline_part_quantity', '2');
  await page.waitForTimeout(2500);
  const s = await binState();
  return { chipLabel: s.chipLabel, pulledFromOnPage: s.pulledFromOnPage, sentences: s.sentences };
};

// B8: what the saved part row shows — the allocation must NOT be on it (S7-R17)
P['B8-saved-row'] = async () => {
  await openRow();
  const opts = await search('CLAMP');
  await pick(0);
  await set('input_inline_part_quantity', '1');
  await page.waitForTimeout(1200);
  const chipBefore = (await binState()).chipLabel;
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(5500);
  const after = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .map(b => { const c = b.closest('tr') || b.parentElement?.closest('div');
                  return c ? (c.innerText || '').replace(/\s+/g,' ').trim().slice(0, 200) : ''; });
    return { topRow: rows[0], anyRowNamesABin: rows.some(r => /Pulled from|\bPB\d\b|\bbin\b/i.test(r)) };
  });
  await page.screenshot({ path: `${OUT}/evidence/bin-saved-row.png`, fullPage: true });
  return { chosen: opts[0], chipBeforeSave: chipBefore, ...after };
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(`${OUT}/evidence/probe-bins.json`, JSON.stringify(results, null, 1));
}
await browser.close();
