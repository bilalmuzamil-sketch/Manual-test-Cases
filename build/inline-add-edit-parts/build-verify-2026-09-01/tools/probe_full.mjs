// probe_full.mjs — FULL VIEW (admin) per-case evidence for suite 6597.
//
// One browser session, a registry of independent probes. Each probe is isolated: it reloads the
// Lines tab and opens a clean inline row, so a failure in one cannot poison the next (skill 03
// §8.0-b — most false findings this session came from state left behind by the previous check).
//
// Every probe writes what it OBSERVED, never a verdict. Verdicts are assigned afterwards against
// the documents (Rule 57): from the build we take only labels/navigation and the pass/fail call.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';   // S9315-14846, 3 lines, 3 parts
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const results = {};
const { browser, page } = await boot('/workorders');

const settle = async (m = 1200) => {
  await page.waitForFunction(x => (document.body?.innerText || '').length > x, m, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3200);
};
const land = async () => {
  await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
};
// nth Add Part button (0-based) — there is one per work order line
const openRow = async (n = 0) => {
  await land();
  await page.evaluate(i => document.querySelectorAll('[data-test-id="button_add_part"]')[i]?.click(), n);
  await page.waitForTimeout(4000);
  return page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]'));
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
const rowShot = () => page.evaluate(() => {
  const pick = s => document.querySelector(s);
  const row = pick('[data-test-id="inline_part_row"]') || pick('[data-test-id="inline_part_edit_row"]');
  const val = i => { const e = document.querySelector(`[data-test-id="${i}"]`);
    const n = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea')); return n ? n.value : null; };
  const dlg = pick('.q-dialog');
  return {
    rowOpen: !!pick('[data-test-id="inline_part_row"]'),
    editRowOpen: !!pick('[data-test-id="inline_part_edit_row"]'),
    rowIds: row ? [...new Set([...row.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))] : [],
    rowText: row ? (row.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 700) : null,
    values: { desc: val('input_inline_part_description'), part: val('select_inline_part_number'),
              qty: val('input_inline_part_quantity'), cat: val('select_inline_part_category'),
              cost: val('input_inline_part_cost'), sell: val('input_inline_part_sell_price') },
    focused: document.activeElement?.getAttribute?.('data-test-id')
             || document.activeElement?.closest?.('[data-test-id]')?.getAttribute('data-test-id')
             || document.activeElement?.tagName,
    dialog: dlg ? { text: (dlg.innerText || '').replace(/\s+/g, ' ').slice(0, 400),
                    buttons: [...dlg.querySelectorAll('button')].map(b => (b.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean) } : null,
    toast: [...document.querySelectorAll('.q-notification, .q-notification__message')]
             .map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0, 4),
    errorText: [...document.querySelectorAll('.q-field--error .q-field__messages, .q-field__messages, .text-negative')]
             .map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0, 8),
    errorFields: [...document.querySelectorAll('.q-field--error')]
             .map(e => e.closest('[data-test-id]')?.getAttribute('data-test-id') || e.querySelector('[data-test-id]')?.getAttribute('data-test-id')).filter(Boolean),
    pulledFrom: (() => { const b = pick('[data-test-id="button_pulled_from_bin"]');
             return b ? (b.innerText || '').replace(/\s+/g,' ').trim() : null; })(),
    pageHasPulledFrom: /Pulled from/i.test(document.body?.innerText || ''),
  };
});
const openTypeahead = async (q) => {
  await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
    const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
  await page.waitForTimeout(1200);
  if (q) { await page.keyboard.type(q, { delay: 60 }); await page.waitForTimeout(3500); }
  else await page.waitForTimeout(2500);
  return page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 14));
};

const P = {};

// every visible validation surface, not just .q-field__messages — the first pass read only field
// LABELS back and would have reported the messages as absent
const messages = () => page.evaluate(() => {
  const row = document.querySelector('[data-test-id="inline_part_row"]') || document.querySelector('[data-test-id="inline_part_edit_row"]');
  const pick = sel => [...document.querySelectorAll(sel)].map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  return {
    fieldBottoms: pick('.q-field__bottom'),
    errorFieldLabels: [...document.querySelectorAll('.q-field--error')].map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).slice(0, 8),
    errorFieldIds: [...document.querySelectorAll('.q-field--error')].map(e => {
      const inner = e.querySelector('[data-test-id]'); const outer = e.closest('[data-test-id]');
      return inner ? inner.getAttribute('data-test-id') : (outer ? outer.getAttribute('data-test-id') : null); }).filter(Boolean),
    notifications: pick('.q-notification'),
    tooltips: pick('.q-tooltip'),
    rowText: row ? (row.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 500) : null,
    redText: pick('.text-negative, .text-red, [class*="error"]').slice(0, 10),
  };
});

// ---- FV-A: the add row itself: fields, order, actions, legend, cursor, position ----
P['A-add-row'] = async () => {
  const open = await openRow(0);
  const s = await rowShot();
  const extra = await page.evaluate(() => {
    const row = document.querySelector('[data-test-id="inline_part_row"]');
    const legend = document.querySelector('[data-test-id="inline_part_row_legend"]');
    // is the new row ABOVE the existing part rows of the same line?
    const existing = [...document.querySelectorAll('[data-test-id="button_edit_part"]')].map(b => b.closest('tr,div'));
    let above = null;
    if (row && existing.length) {
      const first = existing.find(Boolean);
      if (first) above = !!(row.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING);
    }
    return { legendText: legend ? (legend.innerText || '').replace(/\s+/g, ' ').trim() : null,
             fieldOrder: row ? [...row.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id'))
                 .filter(x => /^(input|select)_inline_part/.test(x)) : [],
             newRowAboveExistingParts: above,
             addPartButtons: document.querySelectorAll('[data-test-id="button_add_part"]').length,
             editButtons: document.querySelectorAll('[data-test-id="button_edit_part"]').length };
  });
  await page.screenshot({ path: `${OUT}/evidence/fv-add-row.png`, fullPage: true });
  return { open, ...s, ...extra };
};

// ---- FV-B: typeahead, and whether it offers creating a new part ----
P['B-typeahead'] = async () => {
  await openRow(0);
  const blank = await openTypeahead(null);
  const typed = await openTypeahead('CLAMP');
  const createOffer = typed.filter(t => /create|new part|add as/i.test(t));
  return { optionsBeforeTyping: blank.slice(0, 6), optionsAfterTyping: typed,
           createAsNewPartOffered: createOffer, count: typed.length };
};

// ---- FV-C: selecting a catalog part — population, $ prefix, focus, bin chip ----
P['C-select-part'] = async () => {
  await openRow(0);
  const opts = await openTypeahead('CLAMP');
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4500);
  const s = await rowShot();
  const prefix = await page.evaluate(() => {
    const g = i => { const e = document.querySelector(`[data-test-id="${i}"]`); return e ? (e.innerText || '').replace(/\s+/g,' ').trim() : null; };
    return { costCell: g('input_inline_part_cost'), sellCell: g('input_inline_part_sell_price') };
  });
  await page.screenshot({ path: `${OUT}/evidence/fv-selected.png`, fullPage: true });
  return { chosen: opts[0], ...s, ...prefix };
};

// ---- FV-D: overwrite the populated cost and sell price ----
P['D-overwrite'] = async () => {
  await openRow(0);
  await openTypeahead('CLAMP');
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4000);
  const before = (await rowShot()).values;
  await set('input_inline_part_description', 'ZZAUTOTEST overwritten description');
  await set('input_inline_part_cost', '12.34');
  await set('input_inline_part_sell_price', '56.78');
  await page.waitForTimeout(1500);
  const after = (await rowShot()).values;
  return { before, after };
};

// ---- FV-E: category select ----
P['E-category'] = async () => {
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  const el = await page.evaluate(() => {
    const e = document.querySelector('[data-test-id="select_inline_part_category"]');
    if (!e) return null;
    (e.querySelector('input') || e).click();
    return { tag: e.tagName, text: (e.innerText || '').replace(/\s+/g,' ').trim(),
             isSelect: !!e.querySelector('input') || e.classList.contains('q-select') || e.closest('.q-select') !== null };
  });
  await page.waitForTimeout(2500);
  const opts = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
    .map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).slice(0, 15));
  return { control: el, options: opts };
};

// ---- FV-F: validation — empty save, then qty 0, then correction ----
P['F-validation'] = async () => {
  await openRow(0);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3000);
  const emptySave = await rowShot();
  await set('input_inline_part_description', 'ZZAUTOTEST validation');
  await set('input_inline_part_quantity', '0');
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3000);
  const zeroQty = await rowShot();
  await set('input_inline_part_quantity', '2');
  await page.waitForTimeout(2000);
  const corrected = await rowShot();
  await page.screenshot({ path: `${OUT}/evidence/fv-validation.png`, fullPage: true });
  return { emptySave: { text: emptySave.errorText, fields: emptySave.errorFields, focused: emptySave.focused, rowOpen: emptySave.rowOpen },
           zeroQty: { text: zeroQty.errorText, fields: zeroQty.errorFields, focused: zeroQty.focused },
           afterCorrection: { text: corrected.errorText, fields: corrected.errorFields } };
};

// ---- FV-G: happy-path save — toast, position, fresh row ----
P['G-save'] = async () => {
  await openRow(0);
  const partsBefore = await page.evaluate(() => document.querySelectorAll('[data-test-id="button_edit_part"]').length);
  await set('input_inline_part_description', 'ZZAUTOTEST fv save ' + Date.now());
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '1.11');
  await set('input_inline_part_sell_price', '2.22');
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(2000);
  const toastNow = await page.evaluate(() => [...document.querySelectorAll('.q-notification')]
    .map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean));
  await page.waitForTimeout(4000);
  const s = await rowShot();
  const after = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-test-id="button_edit_part"]')].map(b => {
      const c = b.closest('tr') || b.parentElement?.closest('div');
      return c ? (c.innerText || '').replace(/\s+/g,' ').trim().slice(0, 160) : null; });
    return { partsAfter: rows.length, firstRows: rows.slice(0, 3) };
  });
  await page.screenshot({ path: `${OUT}/evidence/fv-saved.png`, fullPage: true });
  return { partsBefore, toastNow, freshRowOpen: s.rowOpen, freshRowValues: s.values, focusedAfterSave: s.focused, ...after };
};

// ---- FV-H: Enter saves, Shift+Enter opens More Options ----
P['H-keyboard-save'] = async () => {
  await openRow(0);
  await set('input_inline_part_description', 'ZZAUTOTEST enter ' + Date.now());
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '1.00');
  await set('input_inline_part_sell_price', '2.00');
  await page.evaluate(() => { const e = document.querySelector('[data-test-id="input_inline_part_quantity"]');
    (e?.matches('input') ? e : e?.querySelector('input'))?.focus(); });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4500);
  const afterEnter = await rowShot();
  // Shift+Enter
  await openRow(0);
  await set('input_inline_part_description', 'ZZAUTOTEST shiftenter');
  await page.evaluate(() => { const e = document.querySelector('[data-test-id="input_inline_part_description"]');
    (e?.matches('input') ? e : e?.querySelector('input'))?.focus(); });
  await page.keyboard.press('Shift+Enter');
  await page.waitForTimeout(3500);
  const afterShift = await page.evaluate(() => {
    const dlg = document.querySelector('.q-dialog');
    return { dialogOpen: !!dlg, title: dlg ? (dlg.innerText || '').replace(/\s+/g,' ').slice(0, 200) : null };
  });
  return { afterEnter: { rowOpen: afterEnter.rowOpen, values: afterEnter.values, toast: afterEnter.toast, errors: afterEnter.errorText },
           afterShiftEnter: afterShift };
};

// ---- FV-I: Tab order, and whether focus ever leaves the row ----
P['I-tab-order'] = async () => {
  await openRow(0);
  await page.evaluate(() => { const e = document.querySelector('[data-test-id="input_inline_part_description"]');
    (e?.matches('input') ? e : e?.querySelector('input'))?.focus(); });
  const seq = [];
  for (let i = 0; i < 10; i++) {
    seq.push(await page.evaluate(() => {
      const a = document.activeElement;
      const own = a?.closest?.('[data-test-id]')?.getAttribute('data-test-id');
      const inRow = !!a?.closest?.('[data-test-id="inline_part_row"]');
      return { id: own || a?.tagName, inRow };
    }));
    await page.keyboard.press('Tab');
    await page.waitForTimeout(450);
  }
  return { sequence: seq, everLeftRow: seq.some(s => !s.inRow) };
};

// ---- FV-J: Escape / X on empty and populated rows ----
P['J-close'] = async () => {
  await openRow(0);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(3000);
  const emptyEsc = await rowShot();
  await openRow(0);
  await set('input_inline_part_description', 'ZZAUTOTEST esc data');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(3000);
  const dataEsc = await rowShot();
  // Keep Editing
  const keep = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /keep editing/i.test(x.innerText || ''));
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(3000);
  const afterKeep = await rowShot();
  // then Discard
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2500);
  const discarded = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /discard/i.test(x.innerText || ''));
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(3500);
  const afterDiscard = await rowShot();
  return {
    emptyEscape: { rowOpen: emptyEsc.rowOpen, dialog: emptyEsc.dialog },
    populatedEscape: { rowOpen: dataEsc.rowOpen, dialog: dataEsc.dialog },
    keepEditingClicked: keep, afterKeepEditing: { rowOpen: afterKeep.rowOpen, values: afterKeep.values, focused: afterKeep.focused },
    discardClicked: discarded, afterDiscard: { rowOpen: afterDiscard.rowOpen, dialog: afterDiscard.dialog },
  };
};

// ---- FV-K: clicking outside a populated row ----
P['K-click-outside'] = async () => {
  await openRow(0);
  await set('input_inline_part_description', 'ZZAUTOTEST outside');
  await set('input_inline_part_quantity', '3');
  await page.waitForTimeout(1000);
  await page.mouse.click(30, 300);
  await page.waitForTimeout(3000);
  const s = await rowShot();
  return { rowOpen: s.rowOpen, values: s.values, dialog: s.dialog };
};

// ---- FV-L: More Options modal — carry-over, cancel, save ----
P['L-more-options'] = async () => {
  await openRow(0);
  await set('input_inline_part_description', 'ZZAUTOTEST carryover');
  await set('input_inline_part_quantity', '4');
  await set('input_inline_part_cost', '9.99');
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelector('[data-test-id="button_more_options_inline_part"]')?.click());
  await page.waitForTimeout(4000);
  const modal = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    if (!d) return { open: false };
    const vals = [...d.querySelectorAll('input')].map(i => ({
      id: i.closest('[data-test-id]')?.getAttribute('data-test-id') || i.getAttribute('data-test-id') || i.name, v: i.value }))
      .filter(x => x.v);
    return { open: true, text: (d.innerText || '').replace(/\s+/g,' ').slice(0, 500), values: vals.slice(0, 20),
             buttons: [...d.querySelectorAll('button')].map(b => (b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,10) };
  });
  await page.screenshot({ path: `${OUT}/evidence/fv-more-options.png`, fullPage: true });
  // cancel it
  const cancelled = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /^(cancel|close)$/i.test((x.innerText||'').trim()));
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(3500);
  const afterCancel = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    return { dialogOpen: !!d, dialogText: d ? (d.innerText||'').replace(/\s+/g,' ').slice(0,300) : null,
             inlineRowOpen: !!document.querySelector('[data-test-id="inline_part_row"]') };
  });
  return { modal, cancelClicked: cancelled, afterCancel };
};

// ---- FV-M: guard when opening a second row / editing while a row is open ----
P['M-second-row'] = async () => {
  const opened = await openRow(0);
  await set('input_inline_part_description', 'ZZAUTOTEST guard');
  await page.waitForTimeout(1200);
  const n = await page.evaluate(() => document.querySelectorAll('[data-test-id="button_add_part"]').length);
  await page.evaluate(() => { const b = document.querySelectorAll('[data-test-id="button_add_part"]'); (b[1] || b[0])?.click(); });
  await page.waitForTimeout(3500);
  const afterSecondAdd = await rowShot();
  const rowCount = await page.evaluate(() => document.querySelectorAll('[data-test-id="inline_part_row"]').length);
  // and Edit while a populated add row is open
  await page.evaluate(() => { const b = [...document.querySelectorAll('.q-dialog button')].find(x => /keep editing/i.test(x.innerText||'')); b?.click(); });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
  await page.waitForTimeout(3500);
  const afterEditClick = await rowShot();
  return { opened, addPartButtons: n, afterSecondAdd: { dialog: afterSecondAdd.dialog, rowOpen: afterSecondAdd.rowOpen },
           simultaneousInlineRows: rowCount,
           afterEditWhileOpen: { dialog: afterEditClick.dialog, editRowOpen: afterEditClick.editRowOpen } };
};

// ---- FV-N: navigating away with data ----
// S6-R4 names THREE routes away from the work order: browser back, browser forward, in-app
// navigation. A tab switch inside the same work order is not one of them, so all three are tried
// separately — reporting "no confirmation" off a Notes-tab click would have been an instrument error.
P['N-navigate-away'] = async () => {
  const arm = async () => {
    for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
    await set('input_inline_part_description', 'ZZAUTOTEST navaway');
    await page.waitForTimeout(1400);
    return (await rowShot()).values.desc;
  };
  const readGuard = async () => {
    const s = await rowShot();
    return { dialog: s.dialog, rowOpen: s.rowOpen, url: page.url().replace(/^https?:\/\/[^/]+/, '') };
  };
  // 1. in-app navigation OFF the work order — the Work Orders list in the main menu
  const armed1 = await arm();
  await page.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find(x => /\/workorders$/.test(x.getAttribute('href') || ''));
    if (a) { a.click(); return; }
    const m = [...document.querySelectorAll('.q-item, a')].find(x => /^work orders$/i.test((x.innerText||'').trim()));
    m?.click();
  });
  await page.waitForTimeout(4000);
  const inApp = await readGuard();
  // 2. browser back
  const armed2 = await arm();
  await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(4000);
  const back = await readGuard();
  // 3. a tab inside the same work order (NOT navigating away — expected to be unaffected)
  const armed3 = await arm();
  await page.evaluate(() => {
    const t = [...document.querySelectorAll('.q-tab, [role="tab"]')].find(e => /notes|history|photos/i.test(e.innerText||''));
    t?.click(); });
  await page.waitForTimeout(3500);
  const tab = await readGuard();
  await page.screenshot({ path: `${OUT}/evidence/fv-navaway.png`, fullPage: true });
  return { armedValues: [armed1, armed2, armed3], inAppNavigationOffTheWorkOrder: inApp,
           browserBack: back, tabInsideTheSameWorkOrder: tab };
};

// ---- FV-O: sell below cost, and bad numbers ----
P['O-price-rules'] = async () => {
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  await set('input_inline_part_description', 'ZZAUTOTEST price');
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '100');
  await set('input_inline_part_sell_price', '10');
  await page.waitForTimeout(2500);
  const belowCost = await rowShot();
  await set('input_inline_part_cost', 'abc');
  await set('input_inline_part_sell_price', '-5');
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3000);
  const bad = await rowShot();
  return { sellBelowCost: { messages: belowCost.errorText, rowText: belowCost.rowText, values: belowCost.values },
           badNumbers: { messages: bad.errorText, fields: bad.errorFields, values: bad.values, rowOpen: bad.rowOpen } };
};

// ---- FV-P: the Edit control — reveal, modal, no inline edit row in Full View ----
P['P-edit'] = async () => {
  await land();
  const reveal = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    if (!b) return { present: false };
    const st = getComputedStyle(b);
    return { present: true, opacity: st.opacity, visibility: st.visibility, display: st.display,
             text: (b.innerText||'').trim() };
  });
  await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
  await page.waitForTimeout(4500);
  const s = await rowShot();
  const modal = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    if (!d) return { open: false };
    return { open: true, text: (d.innerText||'').replace(/\s+/g,' ').slice(0, 600),
             populatedInputs: [...d.querySelectorAll('input')].map(i => i.value).filter(Boolean).slice(0, 14),
             buttons: [...d.querySelectorAll('button')].map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,10) };
  });
  await page.screenshot({ path: `${OUT}/evidence/fv-edit-modal.png`, fullPage: true });
  return { editControl: reveal, modal, inlineEditRowInFullView: s.editRowOpen };
};

// ---- FV-Q: bins — a part with several bins, the picker, split modal ----
P['Q-bins'] = async () => {
  await openRow(0);
  const opts = await openTypeahead(null);
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4500);
  const chip = await rowShot();
  await page.evaluate(() => document.querySelector('[data-test-id="button_pulled_from_bin"]')?.click());
  await page.waitForTimeout(3500);
  const picker = await page.evaluate(() => {
    const m = document.querySelector('.q-menu') || document.querySelector('.q-dialog');
    return m ? { text: (m.innerText||'').replace(/\s+/g,' ').slice(0, 600),
                 items: [...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,12) } : null;
  });
  await page.screenshot({ path: `${OUT}/evidence/fv-bin-picker.png`, fullPage: true });
  // split across bins
  const splitClicked = await page.evaluate(() => {
    const it = [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')]
      .find(e => /split across/i.test(e.innerText||''));
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(4000);
  const split = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    if (!d) return { open: false };
    return { open: true, text: (d.innerText||'').replace(/\s+/g,' ').slice(0, 900),
             buttons: [...d.querySelectorAll('button')].map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,12),
             ids: [...new Set([...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].slice(0,25),
             rows: [...d.querySelectorAll('tr, .q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,12) };
  });
  await page.screenshot({ path: `${OUT}/evidence/fv-bin-split.png`, fullPage: true });
  return { chosen: opts[0], chip: chip.pulledFrom, rowText: chip.rowText, picker, splitClicked, splitModal: split };
};

// ---- FV-R: bin over-allocation warning: ask for more than the bin holds ----
P['R-bin-warning'] = async () => {
  await openRow(0);
  const opts = await openTypeahead(null);
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4000);
  const base = await rowShot();
  await set('input_inline_part_quantity', '999');
  await page.waitForTimeout(4000);
  const over = await rowShot();
  return { chosen: opts[0], baseChip: base.pulledFrom, baseRow: base.rowText,
           overChip: over.pulledFrom, overRow: over.rowText, overMessages: over.errorText };
};


// ---- FV-F2: validation, captured from EVERY message surface ----
P['F2-validation-text'] = async () => {
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3000);
  const allEmpty = await messages();
  await set('input_inline_part_description', 'ZZAUTOTEST v');
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3000);
  const descOnly = await messages();
  await set('input_inline_part_quantity', '0');
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3000);
  const zero = await messages();
  await set('input_inline_part_quantity', '2');
  await page.waitForTimeout(2200);
  const fixed = await messages();
  await page.screenshot({ path: `${OUT}/evidence/fv-validation-text.png`, fullPage: true });
  return { allEmpty, descOnly, zeroQty: zero, afterFix: fixed };
};

// ---- FV-S: a nonsense search — does the typeahead offer to create the part? ----
P['S-create-new'] = async () => {
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  const nonsense = await openTypeahead('ZZQXNOSUCHPART');
  const rowText = (await rowShot()).rowText;
  const menuText = await page.evaluate(() => {
    const m = document.querySelector('.q-menu');
    return m ? (m.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 400) : null; });
  return { options: nonsense, menuText, rowText };
};


// ---- FV-T: are cost and sell price actually REQUIRED in Full View? ----
P['T-cost-required'] = async () => {
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  await set('input_inline_part_description', 'ZZAUTOTEST nocost ' + Date.now());
  await set('input_inline_part_quantity', '1');
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(4000);
  const m = await messages();
  const s2 = await rowShot();
  return { messages: m, rowStillOpen: s2.rowOpen, valuesNow: s2.values, toast: s2.toast };
};

// ---- FV-U: same part added twice ----
P['U-duplicate'] = async () => {
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  const tag = 'ZZAUTOTEST dup ' + Date.now();
  const before = await page.evaluate(() => document.querySelectorAll('[data-test-id="button_edit_part"]').length);
  for (let i = 0; i < 2; i++) {
    await set('input_inline_part_description', tag);
    await set('input_inline_part_quantity', '1');
    await set('input_inline_part_cost', '1.00');
    await set('input_inline_part_sell_price', '2.00');
    await page.waitForTimeout(900);
    await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
    await page.waitForTimeout(4500);
  }
  const after = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .map(b => { const c = b.closest('tr') || b.parentElement?.closest('div');
                  return c ? (c.innerText || '').replace(/\s+/g,' ').trim().slice(0, 120) : null; });
    return { count: rows.length, rows: rows.slice(0, 4) };
  });
  return { tag, editButtonsBefore: before, ...after,
           duplicateRows: after.rows.filter(r => r && r.includes(tag)).length };
};


// ---- FV-V: the documented validation SENTENCES — hunt them in the WHOLE page, not one selector.
// The spec (§8 User Feedback Summary) names exact strings. Absence must be proved against the whole
// rendered surface before it is reported, or it is an instrument error (skill 03 §8.0-b).
P['V-message-hunt'] = async () => {
  const NEEDLES = ['to save this part', 'Qty must be greater than 0', 'must be a number',
                   'cannot be negative', 'Sell price is below cost'];
  const scan = async (label) => {
    const r = await page.evaluate((ns) => {
      const txt = document.body?.innerText || '';
      const htm = document.body?.innerHTML || '';
      const found = {};
      for (const n of ns) found[n] = { inText: txt.includes(n), inHtml: htm.includes(n) };
      // any element whose text looks like a validation sentence
      const sentences = [...document.querySelectorAll('div,span,p,small')]
        .map(e => (e.childElementCount === 0 ? (e.innerText || '') : '').replace(/\s+/g, ' ').trim())
        .filter(t => t.length > 8 && t.length < 140 && /save this part|must be|cannot be|below cost|greater than/i.test(t));
      return { found, sentences: [...new Set(sentences)].slice(0, 10), bodyChars: txt.length };
    }, NEEDLES);
    return { label, ...r };
  };
  const out = [];
  // 1. everything empty
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3500);
  out.push(await scan('save with every field empty'));
  // 2. qty zero
  await set('input_inline_part_description', 'ZZAUTOTEST msg');
  await set('input_inline_part_quantity', '0');
  await set('input_inline_part_cost', '1');
  await set('input_inline_part_sell_price', '2');
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3500);
  out.push(await scan('save with qty = 0'));
  // 3. cost not a number
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', 'abc');
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3500);
  out.push(await scan('cost = abc'));
  // 4. negative cost
  await set('input_inline_part_cost', '-5');
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3500);
  out.push(await scan('cost = -5'));
  // 5. sell below cost
  await set('input_inline_part_cost', '100');
  await set('input_inline_part_sell_price', '10');
  await page.waitForTimeout(3000);
  out.push(await scan('sell price 10 below cost 100'));
  await page.screenshot({ path: `${OUT}/evidence/fv-message-hunt.png`, fullPage: true });
  return out;
};


// ---- FV-W: browser BACK, with a native-dialog listener. S6-R4 names browser back explicitly, and
// an SPA can guard it either with its own dialog or with the browser's beforeunload prompt —
// Playwright auto-dismisses the latter, so a run without a listener cannot tell "no guard" from
// "guard dismissed for me". Both are captured here before anything is reported.
P['W-browser-back'] = async () => {
  const native = [];
  page.on('dialog', async d => { native.push({ type: d.type(), message: d.message() }); await d.dismiss().catch(() => {}); });
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  await set('input_inline_part_description', 'ZZAUTOTEST back');
  await page.waitForTimeout(1500);
  const armed = (await rowShot()).values.desc;
  await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(4000);
  const after = await rowShot();
  const back1 = { nativeDialogs: [...native], appDialog: after.dialog, rowOpen: after.rowOpen,
                  url: page.url().replace(/^https?:\/\/[^/]+/, '') };
  // browser FORWARD, the other route S6-R4 names
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  await set('input_inline_part_description', 'ZZAUTOTEST fwd');
  await page.waitForTimeout(1500);
  await page.goForward({ waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(4000);
  const after2 = await rowShot();
  await page.screenshot({ path: `${OUT}/evidence/fv-browser-back.png`, fullPage: true });
  return { armed, browserBack: back1,
           browserForward: { nativeDialogs: [...native], appDialog: after2.dialog, rowOpen: after2.rowOpen,
                             url: page.url().replace(/^https?:\/\/[^/]+/, '') } };
};

// ---- FV-X: the modal's own Save and Cancel (S4-R11, S4-R12) and the S6-E1 untouched follow-on row
P['X-modal-exit'] = async () => {
  // Save Part from the modal
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  const tag = 'ZZAUTOTEST modal save ' + Date.now();
  await set('input_inline_part_description', tag);
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '3.00');
  await set('input_inline_part_sell_price', '4.00');
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.querySelector('[data-test-id="button_more_options_inline_part"]')?.click());
  await page.waitForTimeout(4000);
  const savedClick = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /save part/i.test(x.innerText || ''));
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(5000);
  const afterSave = await page.evaluate(t => ({
    dialogOpen: !!document.querySelector('.q-dialog'),
    inlineRowOpen: !!document.querySelector('[data-test-id="inline_part_row"]'),
    toast: [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()),
    partOnLine: [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .some(b => ((b.closest('tr') || b.parentElement?.closest('div'))?.innerText || '').includes(t)),
  }), tag);
  // Cancel the modal: the close control, then whatever confirmation follows
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  await set('input_inline_part_description', 'ZZAUTOTEST modal cancel');
  await page.waitForTimeout(900);
  await page.evaluate(() => document.querySelector('[data-test-id="button_more_options_inline_part"]')?.click());
  await page.waitForTimeout(4000);
  const before = await page.evaluate(() => document.querySelectorAll('.q-dialog').length);
  await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    const b = [...(d?.querySelectorAll('button') || [])].find(x => /close|cancel/i.test(x.innerText || '') || x.querySelector('i')?.textContent === 'close');
    b?.click(); });
  await page.waitForTimeout(4000);
  const step1 = await page.evaluate(() => ({
    dialogs: document.querySelectorAll('.q-dialog').length,
    text: (document.querySelector('.q-dialog')?.innerText || '').replace(/\s+/g,' ').slice(0, 300),
    buttons: [...document.querySelectorAll('.q-dialog button')].map(b => (b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    inlineRowOpen: !!document.querySelector('[data-test-id="inline_part_row"]'),
  }));
  // if a confirmation appeared, take the discard branch
  const discarded = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /discard|yes|leave/i.test(x.innerText || ''));
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(4000);
  const step2 = await page.evaluate(() => ({
    dialogs: document.querySelectorAll('.q-dialog').length,
    inlineRowOpen: !!document.querySelector('[data-test-id="inline_part_row"]') }));
  await page.screenshot({ path: `${OUT}/evidence/fv-modal-exit.png`, fullPage: true });
  return { modalSave: { clicked: savedClick, ...afterSave },
           modalCancel: { dialogsBefore: before, afterCloseClick: step1, discardClicked: discarded, afterDiscard: step2 } };
};

// ---- FV-Y: Edit on a part line while a populated add row is open (S5-E1 / S6-R5) ----
P['Y-edit-while-open'] = async () => {
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  await set('input_inline_part_description', 'ZZAUTOTEST editguard');
  await page.waitForTimeout(1400);
  const armed = (await rowShot()).values.desc;
  const clicked = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(4000);
  const s = await rowShot();
  const modalOpen = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    return { open: !!d, text: d ? (d.innerText || '').replace(/\s+/g,' ').slice(0, 250) : null }; });
  await page.screenshot({ path: `${OUT}/evidence/fv-edit-while-open.png`, fullPage: true });
  return { armed, editClicked: clicked, dialog: s.dialog, modal: modalOpen, addRowStillOpen: s.rowOpen };
};

// ---- FV-Z: the follow-on empty row after a save must prompt nothing (S6-E1) ----
P['Z-followon-row'] = async () => {
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  await set('input_inline_part_description', 'ZZAUTOTEST followon ' + Date.now());
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '1.00');
  await set('input_inline_part_sell_price', '2.00');
  await page.waitForTimeout(900);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(5000);
  const fresh = await rowShot();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(3000);
  const afterEsc = await rowShot();
  // and navigating away from an untouched follow-on row
  const reopened = await openRow(0);
  await page.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find(x => /\/workorders$/.test(x.getAttribute('href') || ''));
    a?.click(); });
  await page.waitForTimeout(4000);
  const afterNav = await rowShot();
  return { freshRowOpen: fresh.rowOpen, freshValues: fresh.values,
           escapeOnFreshRow: { dialog: afterEsc.dialog, rowOpen: afterEsc.rowOpen },
           reopenedEmptyRow: reopened,
           navigateFromEmptyRow: { dialog: afterNav.dialog, url: page.url().replace(/^https?:\/\/[^/]+/, '') } };
};


// ---- FV-AA: does the inline CATEGORY carry into the modal, and does the modal then save?
// The first pass clicked "Save Part" and it did nothing; the modal was in fact showing
// "Category is a required field". That distinguishes two very different findings — carry-over
// broken (S4-R10) versus the modal simply demanding a category the inline row never sets — so it
// is separated here instead of being reported as either.
P['AA-category-carryover'] = async () => {
  const pickCategory = async () => {
    await page.evaluate(() => { const e = document.querySelector('[data-test-id="select_inline_part_category"]');
      (e?.querySelector('input') || e)?.click(); });
    await page.waitForTimeout(2500);
    const chosen = await page.evaluate(() => {
      const items = [...document.querySelectorAll('.q-menu .q-item')];
      const it = items.find(e => /^AUTO-Batteries$/i.test((e.innerText||'').trim())) || items[2] || items[1];
      const label = (it?.innerText || '').replace(/\s+/g, ' ').trim();
      it?.click(); return label; });
    await page.waitForTimeout(2200);
    return chosen;
  };
  // leg 1: category left alone -> More options -> what does the modal say?
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  await set('input_inline_part_description', 'ZZAUTOTEST cat-none ' + Date.now());
  await set('input_inline_part_quantity', '2');
  await set('input_inline_part_cost', '5.00');
  await set('input_inline_part_sell_price', '9.00');
  await page.waitForTimeout(900);
  await page.evaluate(() => document.querySelector('[data-test-id="button_more_options_inline_part"]')?.click());
  await page.waitForTimeout(4000);
  const noCat = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    return { modalOpen: !!d, categoryRequiredShown: /Category is a required field/i.test(d?.innerText || ''),
             values: [...(d?.querySelectorAll('input') || [])].map(i => ({
               id: i.closest('[data-test-id]')?.getAttribute('data-test-id') || i.name, v: i.value })).filter(x => x.v) };
  });
  // leg 2: pick a category inline, then escalate and save
  for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
  const tag = 'ZZAUTOTEST cat-set ' + Date.now();
  await set('input_inline_part_description', tag);
  await set('input_inline_part_quantity', '2');
  await set('input_inline_part_cost', '5.00');
  await set('input_inline_part_sell_price', '9.00');
  const category = await pickCategory();
  await page.evaluate(() => document.querySelector('[data-test-id="button_more_options_inline_part"]')?.click());
  await page.waitForTimeout(4000);
  const withCat = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    return { modalOpen: !!d, categoryRequiredShown: /Category is a required field/i.test(d?.innerText || ''),
             modalText: (d?.innerText || '').replace(/\s+/g,' ').slice(0, 400),
             values: [...(d?.querySelectorAll('input') || [])].map(i => ({
               id: i.closest('[data-test-id]')?.getAttribute('data-test-id') || i.name, v: i.value })).filter(x => x.v) };
  });
  const saved = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /save part/i.test(x.innerText || ''));
    if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(6000);
  const after = await page.evaluate(t => ({
    modalOpen: !!document.querySelector('.q-dialog'),
    inlineRowOpen: !!document.querySelector('[data-test-id="inline_part_row"]'),
    toast: [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()),
    partOnLine: [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .some(b => ((b.closest('tr') || b.parentElement?.closest('div'))?.innerText || '').includes(t)),
  }), tag);
  await page.screenshot({ path: `${OUT}/evidence/fv-category-carryover.png`, fullPage: true });
  return { categoryLeftAlone: noCat, categoryChosenInline: category, modalWithCategory: withCat,
           savePartClicked: saved, afterSavePart: after };
};

// ---- FV-AB: Edit while a populated add row is open — re-run, because a NEGATIVE is being reported
P['AB-edit-guard-recheck'] = async () => {
  const legs = [];
  for (const which of ['edit-control', 'edit-control-again']) {
    for (let a = 0; a < 3; a++) { if (await openRow(0)) break; }
    await set('input_inline_part_description', 'ZZAUTOTEST guard ' + which);
    await set('input_inline_part_quantity', '1');
    await page.waitForTimeout(1600);
    const armed = await rowShot();
    await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
    await page.waitForTimeout(4500);
    const after = await page.evaluate(() => {
      const dialogs = [...document.querySelectorAll('.q-dialog')].map(d => (d.innerText||'').replace(/\s+/g,' ').slice(0, 160));
      return { dialogCount: dialogs.length, dialogs,
               discardConfirmationShown: dialogs.some(t => /Discard this part\?/i.test(t)),
               editModalShown: dialogs.some(t => /Edit Part Request/i.test(t)),
               addRowStillOpen: !!document.querySelector('[data-test-id="inline_part_row"]') };
    });
    legs.push({ which, armedDesc: armed.values.desc, ...after });
  }
  return legs;
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(`${OUT}/evidence/probe-full.json`, JSON.stringify(results, null, 1));
}
await browser.close();
