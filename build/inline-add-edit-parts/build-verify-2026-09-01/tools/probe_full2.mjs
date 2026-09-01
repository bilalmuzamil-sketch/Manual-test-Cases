// probe_full2.mjs — the Full View legs the first pass could not decide from what it had captured.
// Each one is a requirement the suite tests directly, so none of them may be left inferred (Rule 12).
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const results = {};
const { browser, page } = await boot('/workorders');
const settle = async () => {
  // wait for the anchor, not a character count: the shell alone passes any count while
  // "Loading..." is still on screen and the Parts section is unmounted (proven 2026-09-01)
  await page.waitForFunction(sel => {
    const t = document.body?.innerText || '';
    if (/\bLoading\.\.\./.test(t)) return false;
    return !!document.querySelector(sel) || t.length > 4000;
  }, '[data-test-id="button_add_part"]', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
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
const dialogs = () => page.evaluate(() => [...document.querySelectorAll('.q-dialog')]
  .map(d => ({ text: (d.innerText || '').replace(/\s+/g, ' ').slice(0, 300),
               buttons: [...d.querySelectorAll('button')].map(b => (b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean) })));

const P = {};

// ---- the Edit control's reveal: at rest, on hover, on keyboard focus (S1-R6, S1-R7) ----
P['C1-edit-reveal'] = async () => {
  await land();
  const read = () => page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    if (!b) return null;
    const s = getComputedStyle(b);
    return { opacity: s.opacity, visibility: s.visibility, pointerEvents: s.pointerEvents };
  });
  const atRest = await read();
  const box = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    const r = b?.closest('tr') || b?.parentElement?.closest('div');
    const q = r?.getBoundingClientRect();
    return q ? { x: q.x + q.width / 2, y: q.y + q.height / 2 } : null; });
  if (box) { await page.mouse.move(box.x, box.y); await page.waitForTimeout(1500); }
  const onHover = await read();
  // keyboard focus on the part line
  await page.mouse.move(5, 5); await page.waitForTimeout(1200);
  const focused = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    const row = b?.closest('tr') || b?.parentElement?.closest('div');
    const target = row?.querySelector('[tabindex], a, button') || row;
    target?.focus?.();
    const s = b ? getComputedStyle(b) : null;
    return { focusedTag: document.activeElement?.tagName, opacity: s?.opacity, visibility: s?.visibility };
  });
  await page.screenshot({ path: `${OUT}/evidence/fv2-edit-reveal.png`, fullPage: true });
  return { atRest, onHover, onKeyboardFocus: focused };
};

// ---- More Options must NOT enforce the inline validation (S4-N4) ----
P['C2-more-options-no-validation'] = async () => {
  await openRow();
  // deliberately incomplete: description only, no qty, no cost, no sell price
  await set('input_inline_part_description', 'ZZAUTOTEST incomplete');
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelector('[data-test-id="button_more_options_inline_part"]')?.click());
  await page.waitForTimeout(4200);
  const d = await dialogs();
  const validationOnRow = await page.evaluate(() => ({
    errorFields: [...document.querySelectorAll('.q-field--error')].length,
    sentenceShown: (document.body?.innerText || '').includes('to save this part') }));
  await page.screenshot({ path: `${OUT}/evidence/fv2-more-options-incomplete.png`, fullPage: true });
  return { modalOpened: d.length > 0, modalTitle: d[0]?.text?.slice(0, 80), validationOnRow };
};

// ---- Full View EDIT modal: save updates the line and opens no inline row (S5-R3); cancel discards (S5-N2)
P['C3-edit-modal'] = async () => {
  await land();
  const original = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    const c = b?.closest('tr') || b?.parentElement?.closest('div');
    return (c?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160); });
  await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
  await page.waitForTimeout(4500);
  const tag = 'ZZAUTOTEST edited ' + Date.now();
  const typed = await page.evaluate(t => {
    const d = document.querySelector('.q-dialog');
    const i = d?.querySelector('[data-test-id="input_workorder_part_description"] input, [data-test-id="input_workorder_part_description"]');
    const inp = i && (i.matches('input') ? i : i.querySelector('input'));
    if (!inp) return false;
    inp.focus(); inp.value = t;
    inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true }));
    return true; }, tag);
  await page.waitForTimeout(1200);
  const saved = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /save & close|save part|^save$/i.test((x.innerText||'').trim()));
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(6000);
  const afterSave = await page.evaluate(t => ({
    modalOpen: !!document.querySelector('.q-dialog'),
    inlineRowOpen: !!document.querySelector('[data-test-id="inline_part_row"]'),
    editRowOpen: !!document.querySelector('[data-test-id="inline_part_edit_row"]'),
    lineUpdated: [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .some(b => ((b.closest('tr') || b.parentElement?.closest('div'))?.innerText || '').includes(t)),
  }), tag);
  // now cancel: change something and close the modal
  await land();
  const beforeCancel = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    const c = b?.closest('tr') || b?.parentElement?.closest('div');
    return (c?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160); });
  await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
  await page.waitForTimeout(4500);
  await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    const i = d?.querySelector('[data-test-id="input_workorder_part_description"] input, [data-test-id="input_workorder_part_description"]');
    const inp = i && (i.matches('input') ? i : i.querySelector('input'));
    if (inp) { inp.focus(); inp.value = 'ZZAUTOTEST discarded change';
               inp.dispatchEvent(new Event('input', { bubbles: true })); } });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    const b = [...(d?.querySelectorAll('button') || [])].find(x => /close/i.test(x.innerText || '') || x.querySelector('i')?.textContent === 'close');
    b?.click(); });
  await page.waitForTimeout(3500);
  const confirm = await dialogs();
  await page.evaluate(() => { const b = [...document.querySelectorAll('.q-dialog button')].find(x => /discard/i.test(x.innerText||'')); b?.click(); });
  await page.waitForTimeout(4000);
  await land();
  const afterCancel = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    const c = b?.closest('tr') || b?.parentElement?.closest('div');
    return (c?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160); });
  await page.screenshot({ path: `${OUT}/evidence/fv2-edit-modal.png`, fullPage: true });
  return { originalLine: original, typedIntoModal: typed, saveClicked: saved, afterSave,
           cancelLeg: { lineBefore: beforeCancel, confirmationShown: confirm.map(x => x.text.slice(0, 120)),
                        lineAfter: afterCancel,
                        unchanged: beforeCancel === afterCancel } };
};

// ---- the navigate-away confirmation's two actions (S6-E2 Leave, S6-E3 Stay) ----
P['C4-leave-stay'] = async () => {
  const arm = async () => {
    await openRow();
    await set('input_inline_part_description', 'ZZAUTOTEST leavestay');
    await set('input_inline_part_quantity', '5');
    await page.waitForTimeout(1400);
    await page.evaluate(() => {
      const a = [...document.querySelectorAll('a')].find(x => /\/workorders$/.test(x.getAttribute('href') || ''));
      a?.click(); });
    await page.waitForTimeout(4000);
    return dialogs();
  };
  const d1 = await arm();
  const stayClicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /stay on work order/i.test(x.innerText||''));
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(4000);
  const afterStay = await page.evaluate(() => ({
    url: location.pathname, rowOpen: !!document.querySelector('[data-test-id="inline_part_row"]'),
    desc: (() => { const e = document.querySelector('[data-test-id="input_inline_part_description"]');
      const i = e && (e.matches('input') ? e : e.querySelector('input')); return i ? i.value : null; })(),
    focusedInRow: !!document.activeElement?.closest?.('[data-test-id="inline_part_row"]'),
  }));
  const d2 = await arm();
  const leaveClicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /^leave$/i.test((x.innerText||'').trim()));
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(4500);
  const afterLeave = await page.evaluate(() => ({
    url: location.pathname + location.search, rowOpen: !!document.querySelector('[data-test-id="inline_part_row"]') }));
  await page.screenshot({ path: `${OUT}/evidence/fv2-leave-stay.png`, fullPage: true });
  return { firstConfirmation: d1.map(x => ({ text: x.text.slice(0, 200), buttons: x.buttons })),
           stayClicked, afterStay, secondConfirmation: d2.length > 0, leaveClicked, afterLeave };
};

// ---- with NO inline row open, navigation must be untouched (S6-N4) ----
P['C5-no-row-navigation'] = async () => {
  await land();
  const before = page.url();
  await page.evaluate(() => { const a = [...document.querySelectorAll('a')].find(x => /\/workorders$/.test(x.getAttribute('href') || '')); a?.click(); });
  await page.waitForTimeout(4000);
  const d = await dialogs();
  return { from: before.replace(/^https?:\/\/[^/]+/, ''), to: page.url().replace(/^https?:\/\/[^/]+/, ''),
           anyDialog: d.length > 0 };
};

// ---- a catalog part with no cost or sell price on record (S4-E1) ----
P['C6-part-without-prices'] = async () => {
  const seen = [];
  for (const q of ['NBOR', 'BSPP', 'O-RING', 'FREIGHT', 'SUBLET']) {
    await openRow();
    await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
      const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
    await page.waitForTimeout(900);
    await page.keyboard.type(q, { delay: 55 });
    await page.waitForTimeout(3600);
    const opts = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
      .map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).slice(0, 6));
    if (!opts.length) { seen.push({ query: q, cards: [] }); continue; }
    await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
    await page.waitForTimeout(4200);
    const v = await page.evaluate(() => {
      const g = i => { const e = document.querySelector(`[data-test-id="${i}"]`);
        const n = e && (e.matches('input') ? e : e.querySelector('input')); return n ? n.value : null; };
      return { cost: g('input_inline_part_cost'), sell: g('input_inline_part_sell_price'), desc: g('input_inline_part_description') };
    });
    seen.push({ query: q, card: opts[0], values: v });
    if (v.cost === '' || v.cost === null) break;
  }
  return seen;
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(`${OUT}/evidence/probe-full2.json`, JSON.stringify(results, null, 1));
}
await browser.close();
