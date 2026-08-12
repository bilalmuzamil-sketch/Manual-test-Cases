// finish4 probe B2 - the UNDO half of C30065 and C38864.
// The first attempt targeted a shift that the grid does not render (the lane caps
// at three with a "+N more"), so the modal never opened and nothing was clicked -
// OUR harness again, not a missing Undo.  The victim is now chosen from the
// data-shift-id values ACTUALLY ON SCREEN, intersected with the board fetch.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, ev, pops } = require('./walkbase.cjs');
const fs = require('fs');
const R = mkRecorder(`${OUT}/walk_del.json`);
const toasts = ({ v }) => { const vis = eval(v);
  return [...document.querySelectorAll('[class*="toast"],.q-notification')].filter(vis)
    .map(e => ({ t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 120), btns: [...e.querySelectorAll('button,.q-btn')].map(b => (b.innerText || '').trim()).filter(Boolean) }))
    .filter(o => o.t && o.t !== 'check'); };

(async () => {
  const h = await makeHarness('undo'); const page = h.page;
  const nonget = [];
  page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url())) nonget.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
  const F = {}; const save = () => fs.writeFileSync(`${OUT}/undo-findings.json`, JSON.stringify(F, null, 1));
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(13000);
  const api = async p => page.evaluate(async p => { const r = await fetch('https://sv8685api.qa.shopview.com' + p, { credentials: 'include', headers: { accept: 'application/json' } }); return { s: r.status, b: await r.json() }; }, p);
  const BOARD = '/api/schedule/board?from=2026-08-01T00:00:00Z&to=2026-09-15T00:00:00Z';
  const snap = async () => { const r = await api(BOARD); const b = r.b.data.board; return { total: b.shifts.length, ids: b.shifts.map(s => s.id) }; };

  const before = await snap(); F.before_total = before.total;
  const onscreen = await ev(page, ({ v }) => { const vis = eval(v);
    return [...new Set([...document.querySelectorAll('[data-shift-id]')].filter(vis).map(e => e.getAttribute('data-shift-id')))]; });
  const victim = onscreen.find(i => before.ids.includes(i));
  F.onscreen_count = onscreen.length; F.victim = victim; save();
  console.log('on screen', onscreen.length, 'victim', victim, 'board', before.total);

  // open it, note what it is, delete it
  await page.evaluate(async id => { const e = document.querySelector(`[data-shift-id="${id}"]`);
    e.scrollIntoViewIfNeeded && e.scrollIntoViewIfNeeded(); await new Promise(r => setTimeout(r, 500)); (e.querySelector('*') || e).click(); }, victim);
  await page.waitForTimeout(2400);
  F.modal = await pops(page); save();
  await ev(page, ({ v }) => { const vis = eval(v);
    const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop(); if (!d) return;
    const b = [...d.querySelectorAll('button,.q-btn,i,span')].filter(vis).find(e => /delete/i.test(e.getAttribute('data-test-id') || '')); if (b) b.click(); });
  await page.waitForTimeout(1300);
  // a series member shows a scope dialog; a lone shift does not
  const scope = await ev(page, ({ v }) => { const vis = eval(v);
    const b = [...document.querySelectorAll('[data-test-id="button_delete_scope_shift"]')].filter(vis)[0];
    if (!b) return 'no scope dialog - this is a lone shift, the delete went straight through';
    b.click(); return 'scope dialog shown; chose "this shift only"'; });
  F.scope = scope; await page.waitForTimeout(700);
  F.toast = await ev(page, toasts);
  try { await page.screenshot({ path: `${OUT}/undo-toast.png` }); } catch (e) { }
  save();
  const clicked = await ev(page, ({ v }) => { const vis = eval(v);
    for (const e of [...document.querySelectorAll('[class*="toast"],.q-notification')].filter(vis)) {
      const b = [...e.querySelectorAll('button,.q-btn')].find(x => /undo/i.test(x.innerText || ''));
      if (b) { b.click(); return true; } } return false; });
  F.undo_clicked = clicked; await page.waitForTimeout(3500);
  const after = await snap(); F.after_total = after.total;
  F.victim_back = after.ids.includes(victim);
  F.a_shift_returned = after.total === before.total;
  save();

  R.record(30065, [
    { step: 'precondition: a shift exists; note its technician, day and time', seen: `shift ${String(victim).slice(0, 8)}, chosen from the blocks the grid actually renders; board held ${before.total} shifts` },
    { step: '2 delete the shift, watch for the toast, then click Undo on it', seen: `${scope}; toast read within 700ms: ${JSON.stringify(F.toast)}; Undo control found and clicked = ${clicked}` },
    { step: '  after Undo', seen: `board ${before.total} -> ${after.total}; the same shift id present again = ${F.victim_back}` },
    { step: '1 create / 3 move / 4 reassign halves', seen: 'not driven in this probe - the create half was driven by the finish3 pass on C29955 (toast "Shift scheduled. Undo" found at ~400ms); move and reassign remain' },
  ], 'see RUNNABILITY');
  R.record(38864, [
    { step: '1-2 delete, refresh WITHOUT clicking Undo, then check the grid', seen: 'driven in probe B: technician A\'s 4-shift series went 4 -> 0 on delete and still read 0 after a full page reload, with Undo never clicked. Board total 174 -> 170 -> 170.' },
    { step: '4 delete once more and this time click Undo before the toast disappears', seen: `${scope}; toast ${JSON.stringify(F.toast)}; Undo clicked = ${clicked}; board ${before.total} -> ${after.total}` },
    { step: '3 recreate, move, refresh while the toast shows', seen: 'the MOVE half is not driven here - it needs a drag between two days' },
  ], 'see RUNNABILITY');

  fs.writeFileSync(`${OUT}/undo-nonget.json`, JSON.stringify(nonget, null, 1));
  console.log('NON-GET:', JSON.stringify(nonget));
  save(); await h.browser.close();
})();
