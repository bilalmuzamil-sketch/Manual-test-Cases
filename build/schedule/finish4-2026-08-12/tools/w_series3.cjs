// finish4 probe A3 - the SERIES cases.  C30057 C43556 C30060 C30065 C38864
//
// HARNESS FAULT RULED OUT FIRST, and it was ours twice over:
//   (1) the shift id first targeted was not among the blocks the grid renders;
//   (2) the block that IS rendered sits at y=1371 in a 1080-tall viewport, so a
//       coordinate click landed outside the viewport and elementFromPoint gave null.
// Both fixed by scrolling the element into view and clicking it through the DOM.
// The modal opens perfectly well - nothing was missing from the build.
//
// SAFETY (drag-retry-2026-08-12/INCIDENT-accidental-delete): selection is BY ID.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, ev, pops, esc, clickText } = require('./walkbase.cjs');
const fs = require('fs');

const R = mkRecorder(`${OUT}/walk_series.json`);
const board = JSON.parse(fs.readFileSync(`${OUT}/board-BEFORE.json`, 'utf8'));
const byId = {}; board.shifts.forEach(s => byId[s.id] = s);
const bySeries = {};
board.shifts.forEach(s => { if (s.seriesId) (bySeries[s.seriesId] = bySeries[s.seriesId] || []).push(s); });
Object.values(bySeries).forEach(a => a.sort((x, y) => x.startsAt < y.startsAt ? -1 : 1));

// scroll into view, then click through the DOM - the only reliable route for a
// grid taller than the viewport
async function openShift(page, id) {
  const r = await page.evaluate(async (id) => {
    const e = document.querySelector(`[data-shift-id="${id}"]`); if (!e) return { ok: false, why: 'no element' };
    e.scrollIntoViewIfNeeded ? e.scrollIntoViewIfNeeded() : e.scrollIntoView({ block: 'center' });
    await new Promise(r2 => setTimeout(r2, 500));
    const k = e.querySelector('*') || e; k.click();
    return { ok: true, clicked: k.tagName + '.' + (k.className || '').toString().slice(0, 50) };
  }, id);
  await page.waitForTimeout(2500); return r;
}
const dialogButtons = ({ v }) => { const vis = eval(v);
  const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop(); if (!d) return null;
  return [...d.querySelectorAll('button,.q-btn,.q-item,label,.q-radio,[role="option"]')].filter(vis)
    .map(e => ({ tid: e.getAttribute('data-test-id'), t: (e.innerText || '').replace(/\s+/g, ' ').trim() })).filter(o => o.t || o.tid); };
const toasts = ({ v }) => { const vis = eval(v);
  return [...document.querySelectorAll('[class*="toast"],.q-notification')].filter(vis)
    .map(e => ({ cls: (e.className || '').toString().slice(0, 60), t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 160),
                 btns: [...e.querySelectorAll('button,.q-btn')].map(b => (b.innerText || '').trim()).filter(Boolean) })); };

(async () => {
  const h = await makeHarness('series3'); const page = h.page;
  const nonget = [];
  page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url())) nonget.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(12000);
  const F = {}; const save = () => fs.writeFileSync(`${OUT}/series3-findings.json`, JSON.stringify(F, null, 1));
  const shot = async n => { try { await page.screenshot({ path: `${OUT}/series3-${n}.png` }); } catch (e) { } };

  const TARGET = '207e4f90-f3e5-4e1d-959e-d11022e4d527'; // series 7fca50c0, shift 3 of 4
  const ser = byId[TARGET].seriesId, arr = bySeries[ser];
  F.target = { id: TARGET, series: ser, n: arr.length, position: arr.findIndex(s => s.id === TARGET) + 1 };

  // ---------------- C30057 : delete a MIDDLE shift -> three scope options ----------------
  F.open1 = await openShift(page, TARGET);
  F.detail_modal = await pops(page); await shot('detail'); save();
  const delBtn = await ev(page, ({ v }) => { const vis = eval(v);
    const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop(); if (!d) return null;
    const b = [...d.querySelectorAll('button,.q-btn,i,span')].filter(vis).find(e => /delete/i.test(e.getAttribute('data-test-id') || '') || (e.innerText || '').trim() === 'delete_outline');
    if (!b) return null; b.click(); return { tid: b.getAttribute('data-test-id'), t: (b.innerText || '').trim() }; });
  await page.waitForTimeout(2200);
  F.delete_control = delBtn;
  F.scope_dialog = await pops(page); F.scope_options = await ev(page, dialogButtons);
  await shot('scope'); save();
  R.record(30057, [
    { step: 'precondition: a shift that is a MIDDLE member of a repeating series', seen: `series ${ser.slice(0, 8)}, ${arr.length} shifts; opened shift ${F.target.position} of ${arr.length}. The modal states it itself: "Part of a series - Shift 3 of 4". Selected BY ID, never by customer name.` },
    { step: '1 open that shift and press Delete', seen: `delete control = ${JSON.stringify(delBtn)}` },
    { step: '2 a scope dialog offers all three options', seen: JSON.stringify(F.scope_dialog) },
    { step: '  the dialog controls', seen: JSON.stringify(F.scope_options) },
  ], 'see RUNNABILITY');
  await clickText(page, 'Cancel'); await page.waitForTimeout(1200); await esc(page, 3);
  F.after_cancel = await pops(page); save();

  // ---------------- C43556 : week view - a SERIES member can be reassigned ----------------
  F.open2 = await openShift(page, TARGET);
  F.reassign_modal_controls = await ev(page, dialogButtons); save();
  // the technician control inside the detail modal
  const techCtl = await ev(page, ({ v }) => { const vis = eval(v);
    const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop(); if (!d) return null;
    const all = [...d.querySelectorAll('*')].filter(vis);
    const lab = all.find(e => (e.innerText || '').trim() === 'TECHNICIAN');
    if (!lab) return { found: false, labels: all.map(e => (e.innerText || '').trim()).filter(t => t && t.length < 22).slice(0, 25) };
    let p = lab.parentElement, box = null;
    for (let i = 0; i < 4 && p; i++) { const c = [...p.querySelectorAll('[data-test-id],select,input,.q-select,.q-field')].filter(vis); if (c.length) { box = c.map(e => ({ tid: e.getAttribute('data-test-id'), tag: e.tagName, t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 60) })); break; } p = p.parentElement; }
    return { found: true, controls: box }; });
  F.technician_control = techCtl; save();
  // right-click the block for the context menu route the case names
  await esc(page, 3);
  const ctx = await page.evaluate(async (id) => {
    const e = document.querySelector(`[data-shift-id="${id}"]`); if (!e) return { ok: false };
    e.scrollIntoViewIfNeeded && e.scrollIntoViewIfNeeded(); await new Promise(r => setTimeout(r, 400));
    const r2 = e.getBoundingClientRect();
    e.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: r2.x + r2.width / 2, clientY: r2.y + r2.height / 2 }));
    return { ok: true };
  }, TARGET);
  await page.waitForTimeout(1800);
  F.context_menu = await pops(page); await shot('ctx'); save();
  R.record(43556, [
    { step: 'precondition: week view, a shift that belongs to a repeating series', seen: `week view is the default on arrival; shift ${TARGET.slice(0, 8)} is member 3 of 4 of series ${ser.slice(0, 8)}` },
    { step: '1 open the shift and look for the technician control', seen: JSON.stringify(techCtl).slice(0, 500) },
    { step: '2 the context menu route', seen: JSON.stringify(F.context_menu).slice(0, 400) },
  ], 'see RUNNABILITY');
  await esc(page, 3);

  fs.writeFileSync(`${OUT}/series3-nonget.json`, JSON.stringify(nonget, null, 1));
  console.log('NON-GET API CALLS:', JSON.stringify(nonget));
  save(); await h.browser.close();
})();
