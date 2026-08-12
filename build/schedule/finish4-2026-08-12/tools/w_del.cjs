// finish4 probe B - C30060 C30065 C38864.  The delete / undo / refresh chain.
// Precondition for C30060 was SEEDED: work order S-14209 now has a series on
// technician A (16469a2e) and an independent series on technician B (MQ Test
// Tech Qamar, 01ddd277) - see evidence/seed-series.json.
// SAFETY: every shift is chosen BY ID from the board fetch.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, ev, pops, esc } = require('./walkbase.cjs');
const fs = require('fs');
const R = mkRecorder(`${OUT}/walk_del.json`);
const SER_A = '7fca50c0-81bb-4692-a478-812791b32265';   // technician A, 4 shifts
const SER_B = '81a6b48c-4825-4beb-bb50-7792ff105218';   // technician B, seeded this pass
const TARGET = '207e4f90-f3e5-4e1d-959e-d11022e4d527';  // member 3 of series A

const shiftsOf = ({ ids }) => [...document.querySelectorAll('[data-shift-id]')].map(e => e.getAttribute('data-shift-id')).filter(i => ids.includes(i));
const toasts = ({ v }) => { const vis = eval(v);
  return [...document.querySelectorAll('[class*="toast"],.q-notification')].filter(vis)
    .map(e => ({ t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 140), btns: [...e.querySelectorAll('button,.q-btn')].map(b => (b.innerText || '').trim()).filter(Boolean) })); };
async function openShift(page, id) {
  const r = await page.evaluate(async id => { const e = document.querySelector(`[data-shift-id="${id}"]`);
    if (!e) return { ok: false }; e.scrollIntoViewIfNeeded && e.scrollIntoViewIfNeeded();
    await new Promise(r2 => setTimeout(r2, 500)); (e.querySelector('*') || e).click(); return { ok: true }; }, id);
  await page.waitForTimeout(2400); return r; }

(async () => {
  const h = await makeHarness('del'); const page = h.page;
  const nonget = [];
  page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url())) nonget.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
  const F = {}; const save = () => fs.writeFileSync(`${OUT}/del-findings.json`, JSON.stringify(F, null, 1));
  const shot = async n => { try { await page.screenshot({ path: `${OUT}/del-${n}.png` }); } catch (e) { } };
  const board = async () => { const r = await fetch('x'); return null; };

  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(13000);

  // read the board through the page so it carries the same session
  const api = async p => page.evaluate(async p => { const r = await fetch('https://sv8685api.qa.shopview.com' + p, { credentials: 'include', headers: { accept: 'application/json' } }); return { s: r.status, b: await r.json() }; }, p);
  const BOARD = '/api/schedule/board?from=2026-08-01T00:00:00Z&to=2026-09-15T00:00:00Z';
  const snap = async () => { const r = await api(BOARD); const b = r.b.data.board;
    return { total: b.shifts.length, A: b.shifts.filter(s => s.seriesId === SER_A).map(s => s.id), B: b.shifts.filter(s => s.seriesId === SER_B).map(s => s.id) }; };

  F.before = await snap(); save();
  console.log('BEFORE', JSON.stringify(F.before).slice(0, 200));

  // ---------------- C30060 : 'Entire series' removes ONLY technician A's series ----------------
  F.open = await openShift(page, TARGET);
  await ev(page, ({ v }) => { const vis = eval(v);
    const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop();
    const b = [...d.querySelectorAll('button,.q-btn,i,span')].filter(vis).find(e => /delete/i.test(e.getAttribute('data-test-id') || ''));
    if (b) b.click(); });
  await page.waitForTimeout(2000);
  F.scope_dialog = await pops(page); await shot('scope'); save();
  const clickedSeries = await ev(page, ({ v }) => { const vis = eval(v);
    const b = [...document.querySelectorAll('[data-test-id="button_delete_scope_series"]')].filter(vis)[0];
    if (!b) return null; const t = (b.innerText || '').replace(/\s+/g, ' ').trim(); b.click(); return t; });
  await page.waitForTimeout(900);
  F.toast_after_series_delete = await ev(page, toasts);   // read EARLY - a toast lasts ~4s
  await shot('toast'); save();
  await page.waitForTimeout(2500);
  F.after_series_delete = await snap(); save();
  R.record(30060, [
    { step: "precondition: the SAME work order has a series on technician A and an independent series on technician B", seen: `SEEDED this pass: work order S-14209 carries series ${SER_A.slice(0, 8)} on technician A and series ${SER_B.slice(0, 8)} on MQ Test Tech Qamar (evidence/seed-series.json)` },
    { step: "1 delete one of technician A's series shifts with the 'whole series' scope", seen: `the scope control read "${clickedSeries}"` },
    { step: "2 look at both technicians' rows", seen: `technician A's series: ${F.before.A.length} shifts -> ${F.after_series_delete.A.length}; technician B's series: ${F.before.B.length} -> ${F.after_series_delete.B.length}; board total ${F.before.total} -> ${F.after_series_delete.total}` },
    { step: '3 an undo toast appears', seen: JSON.stringify(F.toast_after_series_delete) },
  ], 'see RUNNABILITY');

  // ---------------- C38864 step 1-2 : refresh WITHOUT Undo - the delete stuck ----------------
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForTimeout(12000);
  F.after_reload = await snap(); save();

  // ---------------- C38864 step 4 / C30065 step 2 : delete one shift, then click Undo ----------------
  const victim = F.after_reload.B[0];
  F.undo_victim = victim;
  F.open2 = await openShift(page, victim);
  await ev(page, ({ v }) => { const vis = eval(v);
    const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop(); if (!d) return;
    const b = [...d.querySelectorAll('button,.q-btn,i,span')].filter(vis).find(e => /delete/i.test(e.getAttribute('data-test-id') || '')); if (b) b.click(); });
  await page.waitForTimeout(1600);
  F.second_scope = await pops(page); save();
  // this shift is also a series member, so choose 'this shift only'
  await ev(page, ({ v }) => { const vis = eval(v);
    const b = [...document.querySelectorAll('[data-test-id="button_delete_scope_shift"]')].filter(vis)[0]; if (b) b.click(); });
  await page.waitForTimeout(800);
  F.toast_after_single_delete = await ev(page, toasts); await shot('toast2'); save();
  const undone = await ev(page, ({ v }) => { const vis = eval(v);
    const t = [...document.querySelectorAll('[class*="toast"],.q-notification')].filter(vis);
    for (const e of t) { const b = [...e.querySelectorAll('button,.q-btn')].find(x => /undo/i.test(x.innerText || '')); if (b) { b.click(); return true; } }
    return false; });
  F.undo_clicked = undone; await page.waitForTimeout(3000);
  F.after_undo = await snap(); save();
  R.record(38864, [
    { step: '1 delete the shift, then refresh WITHOUT clicking Undo', seen: `technician A's series went ${F.before.A.length} -> ${F.after_series_delete.A.length} on delete, and after a full page reload it reads ${F.after_reload.A.length}` },
    { step: '2 check the grid for the shift', seen: `board total ${F.after_series_delete.total} before reload, ${F.after_reload.total} after` },
    { step: '4 delete once more and this time click Undo before the toast disappears', seen: `deleted ${String(victim).slice(0, 8)}, Undo control found and clicked = ${undone}; board ${F.after_reload.total} -> ${F.after_undo.total}` },
  ], 'see RUNNABILITY');
  R.record(30065, [
    { step: '2 delete the shift, watch for the toast, then click Undo on it', seen: `toast read within 900ms of the delete: ${JSON.stringify(F.toast_after_single_delete)}; Undo clicked = ${undone}; board total returned ${F.after_reload.total} -> ${F.after_undo.total}` },
    { step: '1 (delete half) each action produces a toast offering Undo', seen: `series delete toast: ${JSON.stringify(F.toast_after_series_delete)}` },
    { step: 'create / move / reassign halves', seen: 'NOT driven in this probe - see RUNNABILITY for what remains' },
  ], 'see RUNNABILITY');

  fs.writeFileSync(`${OUT}/del-nonget.json`, JSON.stringify(nonget, null, 1));
  console.log('NON-GET API CALLS:', JSON.stringify(nonget, null, 1));
  save(); await h.browser.close();
})();
