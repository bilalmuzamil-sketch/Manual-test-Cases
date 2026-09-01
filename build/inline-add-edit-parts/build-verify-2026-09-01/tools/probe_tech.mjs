// probe_tech.mjs — TECH VIEW per-case evidence for suite 6597 (Story 2 add row, Story 3 edit row,
// and the Tech View legs of Stories 6 and 7).
//
// Impersonation, not a role swap: the Technician role on this organisation already carries
// view_mode 'tech'. The technician must be at the WORK ORDER'S OWN workplace or the Parts controls
// never render — that mismatch produced a false "Add Part missing in Tech View" earlier today.
// Impersonation is ended with POST /api/exit-switch-user; quick-login does NOT end it.
import { boot, APP, apiPost } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';   // S9315-14846 @ Heavy Duty 9919
const TECH = process.env.TECH || '2d36a5f5-c957-45e0-a376-46d24df2a44c'; // Christopher Smith, Technician
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const results = {};
const { browser, page } = await boot('/workorders');

const settle = async (m = 1200) => {
  await page.waitForFunction(x => (document.body?.innerText || '').length > x, m, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3200);
};
// ---- become the technician, and PROVE the page rendered before reading anything off it ----
await apiPost('/api/exit-switch-user', {}).catch(() => {});
const sw = await apiPost('/api/switch-user', { user_id: TECH });
console.log('switch-user HTTP', sw.status);
if (sw.status !== 200 && sw.status !== 201) { console.log('could not impersonate — STOP'); await browser.close(); process.exit(2); }

// 🛑 A RELOAD IS NOT ENOUGH, AND THIS COST A WHOLE RUN. boot() hydrated localStorage from
// quick-login {admin}: `user`, `fe_permissions_wrapper` and `token` all describe the ADMIN, and the
// SPA reads view_mode out of localStorage, not off the wire. So after switch-user the API is the
// technician while the page is still Full View -- the run reported six fields WITH pricing as the
// "Tech View" row, which is a false negative dressed up as data. Re-hydrate from the technician's
// own fe-permissions before touching the page, then assert view_mode is 'tech'.
const fe = await apiGet('/api/auth/me/fe-permissions');
if (fe.status !== 200) { console.log('post-switch fe-permissions HTTP ' + fe.status + ' — STOP'); await browser.close(); process.exit(2); }
const feData = fe.body?.data;
console.log('view_mode after switch-user:', feData?.view_mode, '| perms:', feData?.fe_permissions?.length);
if (feData?.view_mode !== 'tech') {
  console.log('THE IMPERSONATED USER IS NOT IN TECH VIEW — STOP rather than report Full View as Tech View');
  await apiPost('/api/exit-switch-user', {}).catch(() => {});
  await browser.close(); process.exit(3);
}
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await page.evaluate(f => {
  const u = JSON.parse(localStorage.getItem('user') || '{}');
  if (u?.data) { u.data.role = f?.role ?? u.data.role; localStorage.setItem('user', JSON.stringify(u)); }
  localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
}, feData);

const land = async () => {
  for (let a = 0; a < 3; a++) {
    await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await settle();
    const ok = await page.evaluate(() => ({
      onLogin: /\/login/.test(location.pathname),
      chars: (document.body?.innerText || '').length,
      addPart: document.querySelectorAll('[data-test-id="button_add_part"]').length,
      editBtns: document.querySelectorAll('[data-test-id="button_edit_part"]').length,
      // the page's OWN idea of the view mode, read back every landing: a stale localStorage is the
      // one failure that makes a Tech View run silently report Full View
      viewModeInPage: (() => { try { return JSON.parse(localStorage.getItem('fe_permissions_wrapper') || '{}').view_mode; }
                              catch (_) { return null; } })(),
    }));
    if (ok.viewModeInPage !== 'tech') { console.log('LANDED WITH view_mode=' + ok.viewModeInPage + ' — not Tech View'); }
    if (!ok.onLogin && ok.chars > 1200 && ok.addPart) return ok;
    if (a === 2) { console.log('LANDING ASSERTION FAILED', JSON.stringify(ok)); return ok; }
  }
};
const openRow = async (n = 0) => {
  await land();
  await page.evaluate(i => document.querySelectorAll('[data-test-id="button_add_part"]')[i]?.click(), n);
  await page.waitForTimeout(4000);
  return page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]'));
};
const openEditRow = async (n = 0) => {
  await land();
  await page.evaluate(i => document.querySelectorAll('[data-test-id="button_edit_part"]')[i]?.click(), n);
  await page.waitForTimeout(4500);
  return page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_edit_row"]'));
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
const shot = () => page.evaluate(() => {
  const row = document.querySelector('[data-test-id="inline_part_row"]') || document.querySelector('[data-test-id="inline_part_edit_row"]');
  const val = i => { const e = document.querySelector(`[data-test-id="${i}"]`);
    const n = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea')); return n ? n.value : null; };
  const dlg = document.querySelector('.q-dialog');
  const legend = document.querySelector('[data-test-id="inline_part_row_legend"]');
  return {
    addRowOpen: !!document.querySelector('[data-test-id="inline_part_row"]'),
    editRowOpen: !!document.querySelector('[data-test-id="inline_part_edit_row"]'),
    rowIds: row ? [...new Set([...row.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))] : [],
    rowText: row ? (row.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 600) : null,
    pricingOnRow: row ? /cost|sell price|margin|\$/i.test(row.innerText || '') : null,
    legend: legend ? (legend.innerText || '').replace(/\s+/g, ' ').trim() : null,
    values: { desc: val('input_inline_part_description'), part: val('select_inline_part_number'),
              qty: val('input_inline_part_quantity') },
    focused: document.activeElement?.closest?.('[data-test-id]')?.getAttribute('data-test-id') || document.activeElement?.tagName,
    dialog: dlg ? { text: (dlg.innerText || '').replace(/\s+/g, ' ').slice(0, 400),
                    buttons: [...dlg.querySelectorAll('button')].map(b => (b.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean) } : null,
    toast: [...document.querySelectorAll('.q-notification')].map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean),
    errorFieldIds: [...document.querySelectorAll('.q-field--error')].map(e => {
      const inner = e.querySelector('[data-test-id]'); const outer = e.closest('[data-test-id]');
      return inner ? inner.getAttribute('data-test-id') : (outer ? outer.getAttribute('data-test-id') : null); }).filter(Boolean),
    pulledFrom: (() => { const b = document.querySelector('[data-test-id="button_pulled_from_bin"]');
      return b ? (b.innerText || '').replace(/\s+/g,' ').trim() : null; })(),
    pageHasPulledFrom: /Pulled from/i.test(document.body?.innerText || ''),
    moreOptionsPresent: !!document.querySelector('[data-test-id="button_more_options_inline_part"]'),
  };
});
const openTypeahead = async (q) => {
  await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
    const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
  await page.waitForTimeout(1200);
  if (q) { await page.keyboard.type(q, { delay: 60 }); await page.waitForTimeout(3500); } else await page.waitForTimeout(2500);
  return page.evaluate(() => ({
    items: [...document.querySelectorAll('.q-menu .q-item')].map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 12),
    menuText: (document.querySelector('.q-menu')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 300),
  }));
};

const P = {};

P['TA-add-row'] = async () => {
  const open = await openRow(0);
  const s = await shot();
  await page.screenshot({ path: `${OUT}/evidence/tv-add-row.png`, fullPage: true });
  return { open, ...s };
};

P['TB-typeahead'] = async () => {
  await openRow(0);
  const list = await openTypeahead('CLAMP');
  const nonsense = await (async () => { await openRow(0); return openTypeahead('ZZQXNOSUCHPART'); })();
  return { onClamp: list, onNonsense: nonsense,
           createOfferedInTechView: /as a new part/i.test(nonsense.menuText || '') };
};

P['TC-select'] = async () => {
  await openRow(0);
  const l = await openTypeahead('CLAMP');
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4500);
  const s = await shot();
  await page.screenshot({ path: `${OUT}/evidence/tv-selected.png`, fullPage: true });
  return { chosen: l.items[0], ...s };
};

P['TD-validation'] = async () => {
  await openRow(0);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3200);
  const empty = await shot();
  await set('input_inline_part_description', 'ZZAUTOTEST tv');
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3200);
  const noQty = await shot();
  await set('input_inline_part_quantity', '0');
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3200);
  const zero = await shot();
  await set('input_inline_part_quantity', '2');
  await page.waitForTimeout(2200);
  const fixed = await shot();
  const sentences = await page.evaluate(() => {
    const t = document.body?.innerText || '';
    return { hasSaveThisPart: t.includes('to save this part'), hasQtyGreater: t.includes('greater than 0') };
  });
  return { emptyErrors: empty.errorFieldIds, emptyFocus: empty.focused,
           noQtyErrors: noQty.errorFieldIds, noQtyFocus: noQty.focused,
           zeroErrors: zero.errorFieldIds, afterFixErrors: fixed.errorFieldIds, sentences };
};

P['TE-save'] = async () => {
  await openRow(0);
  const before = await page.evaluate(() => document.querySelectorAll('[data-test-id="button_edit_part"]').length);
  await set('input_inline_part_description', 'ZZAUTOTEST tv save ' + Date.now());
  await set('input_inline_part_quantity', '1');
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(2000);
  const toast = await page.evaluate(() => [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()));
  await page.waitForTimeout(4000);
  const s = await shot();
  const rows = await page.evaluate(() => [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
    .map(b => { const c = b.closest('tr') || b.parentElement?.closest('div');
                return c ? (c.innerText||'').replace(/\s+/g,' ').trim().slice(0, 150) : null; }).slice(0, 3));
  await page.screenshot({ path: `${OUT}/evidence/tv-saved.png`, fullPage: true });
  return { editBtnsBefore: before, toast, freshRowOpen: s.addRowOpen, freshValues: s.values,
           focusAfterSave: s.focused, topRows: rows };
};

P['TF-keyboard'] = async () => {
  await openRow(0);
  await page.evaluate(() => { const e = document.querySelector('[data-test-id="input_inline_part_description"]');
    (e?.matches('input') ? e : e?.querySelector('input'))?.focus(); });
  const seq = [];
  for (let i = 0; i < 8; i++) {
    seq.push(await page.evaluate(() => {
      const a = document.activeElement;
      return { id: a?.closest?.('[data-test-id]')?.getAttribute('data-test-id') || a?.tagName,
               inRow: !!a?.closest?.('[data-test-id="inline_part_row"]') };
    }));
    await page.keyboard.press('Tab'); await page.waitForTimeout(420);
  }
  // Enter saves
  await openRow(0);
  await set('input_inline_part_description', 'ZZAUTOTEST tv enter ' + Date.now());
  await set('input_inline_part_quantity', '1');
  await page.evaluate(() => { const e = document.querySelector('[data-test-id="input_inline_part_quantity"]');
    (e?.matches('input') ? e : e?.querySelector('input'))?.focus(); });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4500);
  const afterEnter = await shot();
  // Shift+Enter must NOT open a modal in Tech View
  await openRow(0);
  await set('input_inline_part_description', 'ZZAUTOTEST tv shift');
  await page.keyboard.press('Shift+Enter');
  await page.waitForTimeout(3000);
  const afterShift = await shot();
  return { tabSequence: seq, everLeftRow: seq.some(x => !x.inRow),
           afterEnter: { rowOpen: afterEnter.addRowOpen, toast: afterEnter.toast, values: afterEnter.values },
           afterShiftEnter: { dialog: afterShift.dialog, rowOpen: afterShift.addRowOpen } };
};

P['TG-close'] = async () => {
  await openRow(0);
  await page.keyboard.press('Escape'); await page.waitForTimeout(3000);
  const emptyEsc = await shot();
  await openRow(0);
  await set('input_inline_part_description', 'ZZAUTOTEST tv esc');
  await page.waitForTimeout(900);
  await page.evaluate(() => document.querySelector('[data-test-id="button_cancel_inline_part"]')?.click());
  await page.waitForTimeout(3000);
  const dataX = await shot();
  return { emptyEscape: { rowOpen: emptyEsc.addRowOpen, dialog: emptyEsc.dialog },
           populatedX: { rowOpen: dataX.addRowOpen, dialog: dataX.dialog } };
};

P['TH-click-outside'] = async () => {
  await openRow(0);
  await set('input_inline_part_description', 'ZZAUTOTEST tv outside');
  await set('input_inline_part_quantity', '3');
  await page.waitForTimeout(900);
  await page.mouse.click(30, 300);
  await page.waitForTimeout(3000);
  const s = await shot();
  return { rowOpen: s.addRowOpen, values: s.values, dialog: s.dialog };
};

// ---------------- Story 3: the inline EDIT row ----------------
P['TI-edit-row'] = async () => {
  const open = await openEditRow(0);
  const s = await shot();
  await page.screenshot({ path: `${OUT}/evidence/tv-edit-row.png`, fullPage: true });
  return { open, ...s };
};

P['TJ-edit-save'] = async () => {
  await openEditRow(0);
  const before = await shot();
  const newDesc = 'ZZAUTOTEST tv edited ' + Date.now();
  await set('input_inline_part_description', newDesc);
  await page.waitForTimeout(900);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(2000);
  const toast = await page.evaluate(() => [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()));
  await page.waitForTimeout(4000);
  const after = await shot();
  const lineNow = await page.evaluate(t => {
    const rows = [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .map(b => { const c = b.closest('tr') || b.parentElement?.closest('div');
                  return c ? (c.innerText||'').replace(/\s+/g,' ').trim().slice(0, 200) : ''; });
    return { updatedInPlace: rows.some(r => r.includes(t)), rows: rows.slice(0, 3) };
  }, newDesc);
  return { valuesBefore: before.values, newDesc, toast,
           editRowStillOpen: after.editRowOpen, newAddRowOpened: after.addRowOpen, ...lineNow };
};

P['TK-edit-guard'] = async () => {
  await openEditRow(0);
  const before = await shot();
  await set('input_inline_part_description', 'ZZAUTOTEST tv changed');
  await page.waitForTimeout(900);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(3200);
  const changed = await shot();
  // unchanged edit row: reopen, touch nothing, escape
  const dismiss = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.q-dialog button')].find(x => /discard/i.test(x.innerText||''));
    if (b) { b.click(); return true; } return false; });
  await page.waitForTimeout(2500);
  await openEditRow(0);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(3000);
  const untouched = await shot();
  return { originalValues: before.values,
           changedThenEscape: { dialog: changed.dialog, rowOpen: changed.editRowOpen },
           discardClicked: dismiss,
           unchangedThenEscape: { dialog: untouched.dialog, rowOpen: untouched.editRowOpen } };
};

P['TL-edit-relink'] = async () => {
  await openEditRow(0);
  const before = await shot();
  const l = await openTypeahead('CLAMP');
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4500);
  const after = await shot();
  return { before: before.values, chosen: l.items[0], after: after.values,
           focusAfter: after.focused, chip: after.pulledFrom };
};

P['TM-edit-clear-desc'] = async () => {
  await openEditRow(0);
  await set('input_inline_part_description', '');
  await page.waitForTimeout(900);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(3500);
  const s = await shot();
  const sentence = await page.evaluate(() => (document.body?.innerText||'').includes('to save this part'));
  return { rowStillOpen: s.editRowOpen, errorFieldIds: s.errorFieldIds, focused: s.focused,
           documentedSentencePresent: sentence, toast: s.toast };
};

// Story 7 in Tech View: chip, picker, Bin Locations modal (the ONE modal a Tech View user reaches)
P['TN-bins'] = async () => {
  await openRow(0);
  const l = await openTypeahead(null);
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4500);
  const chip = await shot();
  await page.evaluate(() => document.querySelector('[data-test-id="button_pulled_from_bin"]')?.click());
  await page.waitForTimeout(3500);
  const picker = await page.evaluate(() => {
    const m = document.querySelector('.q-menu') || document.querySelector('.q-dialog');
    return m ? { text: (m.innerText||'').replace(/\s+/g,' ').slice(0, 500),
                 items: [...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,12) } : null; });
  const splitClicked = await page.evaluate(() => {
    const it = [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')].find(e => /split across/i.test(e.innerText||''));
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(4000);
  const modal = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    if (!d) return { open: false };
    const t = (d.innerText||'').replace(/\s+/g,' ');
    return { open: true, text: t.slice(0, 900),
             exposesPricing: /cost|sell price|margin/i.test(t),
             buttons: [...d.querySelectorAll('button')].map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,12),
             ids: [...new Set([...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].slice(0,25) };
  });
  await page.screenshot({ path: `${OUT}/evidence/tv-bin-split.png`, fullPage: true });
  return { chosen: l.items[0], chip: chip.pulledFrom, picker, splitClicked, binLocationsModal: modal };
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(`${OUT}/evidence/probe-tech.json`, JSON.stringify(results, null, 1));
}
// hand the session back
const ex = await apiPost('/api/exit-switch-user', {});
console.log('\nexit-switch-user HTTP', ex.status);
await browser.close();
