// probe_bins2.mjs — the Story 7 legs that need a part held in MORE THAN ONE bin. Run AFTER
// tools/seed_bins.py --seed, which re-allocates N68SL-356 across four bins with the Default cut to
// 1, one bin at 10, one at 4 and one at -2. Every shape below is chosen to make one documented
// sentence or behaviour observable, and each probe reads the WHOLE page for the documented string.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
// S31S-950 is held in FOUR bins - SKID1 6 (Default), ST20 4, ST24 4, ST25 3, total 17 - which makes
// the "+ N" collapse chip, the multi-bin picker, the auto-switch note, the split label and the
// Bin Locations Auto/Apply flow all observable on one part. It was there all along: the inventory
// API ignores rowsPerPage and page and only honours pagination[rowsPerPage] / pagination[page], so
// the first survey read 100 of 6,879 parts and concluded no multi-bin part existed.
const PART = process.env.PART || 'S31S-950';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const RESULTS_FILE = `${OUT}/evidence/probe-bins2.json`;
const results = (() => { try { return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8')); } catch (_) { return {}; } })();
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
const set = async (id, v) => page.evaluate(([i, val]) => {
  const e = document.querySelector(`[data-test-id="${i}"]`);
  const inp = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea'));
  if (!inp) return false;
  inp.focus(); inp.value = val;
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}, [id, v]);
const pickPart = async () => {
  await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
    const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
  await page.waitForTimeout(900);
  await page.keyboard.type(PART, { delay: 55 });
  await page.waitForTimeout(3800);
  const cards = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 6));
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4500);
  return cards;
};
const state = () => page.evaluate(() => {
  const t = document.body?.innerText || '';
  const chip = document.querySelector('[data-test-id="button_pulled_from_bin"]');
  const near = chip ? (chip.closest('div')?.parentElement?.innerText || '') : '';
  const val = i => { const e = document.querySelector(`[data-test-id="${i}"]`);
    const n = e && (e.matches('input') ? e : e.querySelector('input')); return n ? n.value : null; };
  return {
    chipLabel: chip ? (chip.innerText || '').replace(/\s+/g, ' ').trim() : null,
    chipWarn: chip ? /--warn|warning|negative/.test(chip.className + ' ' + (chip.parentElement?.className || '')) : null,
    textNearChip: near.replace(/\s+/g, ' ').trim().slice(0, 400),
    qty: val('input_inline_part_quantity'),
    takesNegative: /takes this bin negative/.test(t),
    defaultSwitched: /Switched to a bin that covers/.test(t),
    notStocked: /Not stocked/.test(t),
    sentences: [...new Set([...document.querySelectorAll('div,span,p,small')]
      .map(e => (e.childElementCount === 0 ? (e.innerText || '') : '').replace(/\s+/g, ' ').trim())
      .filter(x => /takes this bin negative|Switched to a bin|Not stocked|\d+ bins/i.test(x)))].slice(0, 6),
  };
});
const openPicker = async () => {
  await page.evaluate(() => document.querySelector('[data-test-id="button_pulled_from_bin"]')?.click());
  await page.waitForTimeout(3200);
  return page.evaluate(() => {
    const m = document.querySelector('.q-menu') || document.querySelector('.q-dialog');
    return m ? { items: [...m.querySelectorAll('.q-item')].map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).slice(0, 15),
                 text: (m.innerText || '').replace(/\s+/g,' ').slice(0, 500) } : null; });
};

const P = {};

// S7-R2 leg 2: four bins -> up to three chips then a "+ N" chip on the card
P['S1-card-chips'] = async () => {
  await openRow();
  const cards = await pickPart();
  return { cards, plusNChipPresent: cards.some(c => /\+\s?\d/.test(c)) };
};

// S7-R3 + S7-R10: the Default holds 1, so any quantity above 1 must move off it and say so
P['S2-auto-switch'] = async () => {
  await openRow();
  const cards = await pickPart();
  const atSelect = await state();
  await set('input_inline_part_quantity', '3');
  await page.waitForTimeout(4200);
  const atThree = await state();
  await page.screenshot({ path: `${OUT}/evidence/bin2-auto-switch.png`, fullPage: true });
  return { card: cards[0], atSelect, atThree };
};

// S7-R7 + S7-R11: choose a different bin from the picker, then change the quantity - a manually
// chosen bin must be KEPT, not re-picked
P['S3-manual-bin'] = async () => {
  await openRow();
  await pickPart();
  await set('input_inline_part_quantity', '2');
  await page.waitForTimeout(3000);
  const before = await state();
  const picker = await openPicker();
  const chosen = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')]
      .filter(e => !/split across/i.test(e.innerText || ''));
    const target = items.find(e => !/check/i.test(e.innerText || '')) || items[1] || items[0];
    const label = (target?.innerText || '').replace(/\s+/g, ' ').trim();
    target?.click(); return label; });
  await page.waitForTimeout(4000);
  const afterChoose = await state();
  await set('input_inline_part_quantity', '9');
  await page.waitForTimeout(4200);
  const afterQtyChange = await state();
  await page.screenshot({ path: `${OUT}/evidence/bin2-manual-bin.png`, fullPage: true });
  return { before, picker, chosen, afterChoose, afterQtyChange };
};

// S7-R13/R14/R15/R5/E2: the Bin Locations modal - Auto, Apply, an already-negative bin in error
// styling, the "N bins" chip label after a split, and no takes-negative warning on a split
P['S4-split-apply'] = async () => {
  await openRow();
  await pickPart();
  await set('input_inline_part_quantity', '2');
  await page.waitForTimeout(2500);
  await openPicker();
  const splitClicked = await page.evaluate(() => {
    const it = [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')].find(e => /split across/i.test(e.innerText || ''));
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(4500);
  const modal = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    if (!d) return { open: false };
    const rows = [...d.querySelectorAll('tr')].map(r => ({
      text: (r.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120),
      errorStyled: /error|negative|text-red|bg-red/.test(r.className + ' ' + [...r.children].map(c => c.className).join(' ')),
    })).filter(r => r.text);
    return { open: true, title: (d.innerText || '').replace(/\s+/g, ' ').slice(0, 60),
             rows, hasAuto: /\bAuto\b/.test(d.innerText || ''), hasApply: /\bApply\b/.test(d.innerText || ''),
             amountInputs: [...d.querySelectorAll('input')].map(i => i.getAttribute('data-test-id')).filter(Boolean) };
  });
  // Auto first, then read what it distributed
  const autoClicked = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_auto_bin_locations"]');
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(3000);
  const afterAuto = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    return { amounts: [...(d?.querySelectorAll('input') || [])].map(i => i.value),
             note: ((d?.innerText || '').match(/Nothing allocated[^\n]*|Allocated[^\n]*|Total[^\n]*/) || [])[0] || null };
  });
  // now hand-enter a split across two bins and Apply
  const entered = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    const ins = [...(d?.querySelectorAll('input') || [])];
    const vals = [];
    ins.slice(0, 2).forEach((i, n) => { i.focus(); i.value = String(n === 0 ? 1 : 2);
      i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true }));
      vals.push(i.value); });
    return vals; });
  await page.waitForTimeout(2200);
  const applyClicked = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_apply_bin_locations"]');
    if (!b || b.disabled) return b ? 'disabled' : false; b.click(); return true; });
  await page.waitForTimeout(4500);
  const afterApply = await state();
  await page.screenshot({ path: `${OUT}/evidence/bin2-split-apply.png`, fullPage: true });
  return { splitClicked, modal, autoClicked, afterAuto, enteredAmounts: entered, applyClicked, afterApply };
};


// S7-R15 (C45235): a bin already at a negative on-hand shows in error styling and does not block.
// TP-12-1013-CH holds LGRACK -1 and D1F 3 (Default).
P['S5-negative-bin'] = async () => {
  await openRow();
  await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
    const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
  await page.waitForTimeout(900);
  await page.keyboard.type('TP-12-1013-CH', { delay: 55 });
  await page.waitForTimeout(3800);
  const cards = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 5));
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4500);
  await set('input_inline_part_quantity', '2');
  await page.waitForTimeout(2500);
  const chip = await state();
  await openPicker();
  const picker = await page.evaluate(() => {
    const m = document.querySelector('.q-menu') || document.querySelector('.q-dialog');
    return m ? { items: [...m.querySelectorAll('.q-item')].map(e => ({
      text: (e.innerText || '').replace(/\s+/g,' ').trim(),
      errorStyled: /negative|error|text-red|text-negative|warn/.test(e.className + ' ' +
        [...e.querySelectorAll('*')].map(c => c.className).join(' ')) })).slice(0, 12) } : null; });
  const splitClicked = await page.evaluate(() => {
    const it = [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')].find(e => /split across/i.test(e.innerText || ''));
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(4500);
  const modal = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    if (!d) return { open: false };
    return { open: true,
      rows: [...d.querySelectorAll('tr')].map(r => ({
        text: (r.innerText || '').replace(/\s+/g,' ').trim().slice(0, 100),
        errorStyled: /negative|error|text-red|text-negative/.test(r.className + ' ' +
          [...r.querySelectorAll('*')].map(c => c.className).join(' ')) })).filter(r => r.text),
      applyDisabled: !!d.querySelector('[data-test-id="button_apply_bin_locations"]')?.disabled };
  });
  await page.screenshot({ path: `${OUT}/evidence/bin2-negative.png`, fullPage: true });
  return { cards, chip, picker, splitClicked, modal };
};

// S4-E1 (C45060): a catalog part with NO cost and NO sell price on record opens those fields empty.
// 6050-P has neither.
P['S6-no-prices'] = async () => {
  await openRow();
  await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
    const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
  await page.waitForTimeout(900);
  await page.keyboard.type('6050-P', { delay: 60 });
  await page.waitForTimeout(3800);
  const cards = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 5));
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4500);
  const vals = await page.evaluate(() => {
    const g = i => { const e = document.querySelector(`[data-test-id="${i}"]`);
      const n = e && (e.matches('input') ? e : e.querySelector('input')); return n ? n.value : null; };
    return { desc: g('input_inline_part_description'), part: g('select_inline_part_number'),
             cost: g('input_inline_part_cost'), sell: g('input_inline_part_sell_price') };
  });
  // and confirm the row refuses to save while they are empty
  await set('input_inline_part_quantity', '1');
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3200);
  const after = await page.evaluate(() => ({
    rowOpen: !!document.querySelector('[data-test-id="inline_part_row"]'),
    sentence: (document.body?.innerText || '').match(/Enter a[^\n]*to save this part\./)?.[0] || null }));
  await page.screenshot({ path: `${OUT}/evidence/bin2-no-prices.png`, fullPage: true });
  return { cards, valuesAfterSelecting: vals, saveAttempt: after };
};


// S7-R10 (C45230): the auto-switch NOTE needs a Default that is BELOW the quantity while another
// SINGLE bin covers it. S31S-950 cannot show it - its Default (SKID1 6) is its largest bin, so per
// S7-R3 the allocation correctly STAYS on the Default and no note is due. P550848 is the right
// shape: H3B 6 is the Default and A2CA holds 50.
P['S7-default-switch'] = async () => {
  const pick = async (q) => {
    await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
      const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
    await page.waitForTimeout(900);
    await page.keyboard.type(q, { delay: 55 });
    await page.waitForTimeout(3800);
    const cards = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
      .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 4));
    await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
    await page.waitForTimeout(4500);
    return cards;
  };
  await openRow();
  const cards = await pick('P550848');
  const atSelect = await state();
  await set('input_inline_part_quantity', '4');       // Default H3B holds 6, so it covers 4
  await page.waitForTimeout(4000);
  const withinDefault = await state();
  await set('input_inline_part_quantity', '10');      // Default 6 < 10, and A2CA (50) covers it
  await page.waitForTimeout(4500);
  const overDefault = await state();
  await page.screenshot({ path: `${OUT}/evidence/bin2-default-switch.png`, fullPage: true });
  return { cards, atSelect, quantity4_withinDefault: withinDefault, quantity10_overDefault: overDefault };
};

// S7-E2 (C45243): a SPLIT allocation never shows the takes-negative warning, even when one of the
// bins in the split is short. Built on P550848 by splitting across H3B and A2CA.
P['S8-split-never-warns'] = async () => {
  await openRow();
  await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
    const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
  await page.waitForTimeout(900);
  await page.keyboard.type('P550848', { delay: 55 });
  await page.waitForTimeout(3800);
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4500);
  await set('input_inline_part_quantity', '8');
  await page.waitForTimeout(3000);
  await openPicker();
  const splitClicked = await page.evaluate(() => {
    const it = [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')].find(e => /split across/i.test(e.innerText || ''));
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(4500);
  const modalRows = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    return d ? [...d.querySelectorAll('tr')].map(r => (r.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0, 10) : null; });
  // put MORE into the small bin than it holds, and the rest into the big one, then Apply
  const entered = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    const ins = [...(d?.querySelectorAll('input') || [])];
    const vals = [];
    ins.slice(0, 2).forEach((i, n) => { i.focus(); i.value = String(n === 0 ? 7 : 3);
      i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true }));
      vals.push(i.value); });
    return vals; });
  await page.waitForTimeout(2200);
  const applied = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_apply_bin_locations"]');
    if (!b) return 'no apply button'; if (b.disabled) return 'disabled'; b.click(); return true; });
  await page.waitForTimeout(4500);
  const after = await state();
  await page.screenshot({ path: `${OUT}/evidence/bin2-split-no-warn.png`, fullPage: true });
  return { modalRows, enteredAmounts: entered, applied, after };
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 1));
}
await browser.close();
