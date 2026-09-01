// probe_gaps.mjs — the three legs earlier probes measured badly rather than measured wrong.
//
//  TD2  the Tech View validation SENTENCES. The first Tech View probe read the page only AFTER the
//       field had been corrected, by which time the message has already cleared (that is S2-N5
//       working), and then reported the sentence absent. Read it AT each failure instead.
//  C1b  the keyboard-focus half of S1-R7. The first probe focused "some button in the row" and got
//       opacity 0; that proves nothing about focusing the PART LINE. Tab in from a known anchor and
//       watch the control's opacity at every stop.
//  C3b  the Full View edit modal's save (S5-R3). The first probe clicked "Save & Close" and then
//       read the line list too early / with the wrong description, and reported no update.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const results = {};
const { browser, page } = await boot('/workorders');
const settle = async () => {
  await page.waitForFunction(() => (document.body?.innerText || '').length > 1200, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3200);
};
const land = async () => { for (let a = 0; a < 3; a++) {
  await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  if (await page.evaluate(() => document.querySelectorAll('[data-test-id="button_add_part"]').length > 0)) return true;
} return false; };
const openRow = async () => { for (let a = 0; a < 3; a++) {
  await land();
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
const sentencesNow = () => page.evaluate(() => {
  const t = document.body?.innerText || '';
  return { combined: /to save this part/.test(t), qtyRule: /greater than 0/.test(t),
    matched: [...new Set([...document.querySelectorAll('div,span,p,small')]
      .map(e => (e.childElementCount === 0 ? (e.innerText || '') : '').replace(/\s+/g, ' ').trim())
      .filter(x => /to save this part|greater than 0/i.test(x)))].slice(0, 5) };
});

const P = {};

P['C1b-keyboard-focus'] = async () => {
  await land();
  const stops = [];
  // start from the page body and Tab until focus is inside a part row, reading the control each stop
  await page.evaluate(() => document.body.focus());
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(120);
    const r = await page.evaluate(() => {
      const a = document.activeElement;
      const row = a?.closest?.('tr') || null;
      const edit = row?.querySelector('[data-test-id="button_edit_part"]')
                || document.querySelector('[data-test-id="button_edit_part"]');
      const inPartRow = !!(row && row.querySelector('[data-test-id="button_edit_part"]'));
      return { focused: a?.getAttribute?.('data-test-id') || a?.tagName,
               inPartRow,
               editOpacity: edit ? getComputedStyle(edit).opacity : null,
               rowEditOpacity: (row && row.querySelector('[data-test-id="button_edit_part"]'))
                 ? getComputedStyle(row.querySelector('[data-test-id="button_edit_part"]')).opacity : null };
    });
    if (r.inPartRow) stops.push(r);
    if (stops.length >= 4) break;
  }
  await page.screenshot({ path: `${OUT}/evidence/gap-keyboard-focus.png`, fullPage: true });
  return { stopsInsideAPartRow: stops,
           revealedOnKeyboardFocus: stops.some(s => s.rowEditOpacity && Number(s.rowEditOpacity) > 0) };
};

P['TD2-tech-sentences'] = async () => {
  // Full View is enough to prove the sentence exists; what was in doubt is only WHEN it is on
  // screen. Read it at the moment of each failure, then again after the correction.
  await openRow();
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3000);
  const atFailure = await sentencesNow();
  await set('input_inline_part_description', 'ZZAUTOTEST when');
  await set('input_inline_part_quantity', '0');
  await set('input_inline_part_cost', '1');
  await set('input_inline_part_sell_price', '2');
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3000);
  const atZeroQty = await sentencesNow();
  await set('input_inline_part_quantity', '3');
  await page.waitForTimeout(2500);
  const afterCorrection = await sentencesNow();
  return { atFailure, atZeroQty, afterCorrection,
           note: 'S2-N5 says the message clears as soon as the field is corrected, so an empty '
               + 'afterCorrection is the requirement being met, not the message being absent' };
};

P['C3b-edit-modal-save'] = async () => {
  await land();
  const before = await page.evaluate(() => [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
    .map(b => ((b.closest('tr') || b.parentElement?.closest('div'))?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 140)));
  await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
  await page.waitForTimeout(4500);
  const tag = 'ZZAUTOTEST modaledit ' + Date.now();
  const before2 = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    return { open: !!d, ids: [...new Set([...(d?.querySelectorAll('[data-test-id]') || [])].map(e => e.getAttribute('data-test-id')))].slice(0, 20),
             values: [...(d?.querySelectorAll('input') || [])].map(i => ({ id: i.closest('[data-test-id]')?.getAttribute('data-test-id'), v: i.value })).filter(x => x.v) };
  });
  const typed = await page.evaluate(t => {
    const d = document.querySelector('.q-dialog');
    for (const sel of ['[data-test-id="input_workorder_part_description"]', 'input[name="description"]']) {
      const e = d?.querySelector(sel);
      const inp = e && (e.matches('input') ? e : e.querySelector('input'));
      if (inp) { inp.focus(); inp.value = t;
                 inp.dispatchEvent(new Event('input', { bubbles: true }));
                 inp.dispatchEvent(new Event('change', { bubbles: true }));
                 return sel; }
    }
    return null; }, tag);
  await page.waitForTimeout(1500);
  const saveLabel = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /save/i.test(x.innerText || ''));
    if (!b) return null; const l = (b.innerText || '').trim(); b.click(); return l; });
  await page.waitForTimeout(7000);
  const straightAfter = await page.evaluate(t => ({
    modalOpen: !!document.querySelector('.q-dialog'),
    inlineRowOpen: !!document.querySelector('[data-test-id="inline_part_row"]'),
    editRowOpen: !!document.querySelector('[data-test-id="inline_part_edit_row"]'),
    toast: [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()),
    lineNamesIt: [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .some(b => ((b.closest('tr') || b.parentElement?.closest('div'))?.innerText || '').includes(t)),
  }), tag);
  // and again after a full reload, which settles "did it persist" separately from "did the list refresh"
  await land();
  const afterReload = await page.evaluate(t => ({
    lineNamesIt: [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .some(b => ((b.closest('tr') || b.parentElement?.closest('div'))?.innerText || '').includes(t)),
    rows: [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .map(b => ((b.closest('tr') || b.parentElement?.closest('div'))?.innerText || '').replace(/\s+/g,' ').trim().slice(0, 140)).slice(0, 3),
  }), tag);
  await page.screenshot({ path: `${OUT}/evidence/gap-edit-modal-save.png`, fullPage: true });
  return { tag, rowsBefore: before.slice(0, 3), modal: before2, typedInto: typed,
           saveButtonLabel: saveLabel, straightAfter, afterReload };
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(`${OUT}/evidence/probe-gaps.json`, JSON.stringify(results, null, 1));
}
await browser.close();
