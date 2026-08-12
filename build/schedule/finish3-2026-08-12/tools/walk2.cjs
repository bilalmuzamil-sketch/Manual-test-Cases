// walk2.cjs — re-drive two results whose first measurement was MY OWN aim/timing,
// and pick up the series-scope deletion cases.
//   C30052 reassign: the first run reported "no confirmation modal", but the lane
//          band I aimed at was off by a row (proven when the cell menu named a
//          different technician than the lane I targeted).  Here the move is proven
//          cross-technician by reading staffId from the API before and after.
//   C30064 toast: the first run waited only 3 s after the cursor left.  Here the
//          lifetime is measured by polling.
//   C30057 deleting a MIDDLE shift of a series offers three scope options
//   C30065 Undo reverses the action
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');
const REC = mkRecorder(`${OUT}/walk_walk1.json`);

const TOAST = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; };
  const n=[...document.querySelectorAll('.undo-toast-host')].filter(vis);
  return n.map(e=>({text:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,120),
    buttons:[...e.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean)}));
})()`;
const POPS = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; };
  return [...document.querySelectorAll('.q-menu,.q-dialog__inner,[role=dialog]')].filter(vis)
    .map(d=>({ text:(d.innerText||'').replace(/\\s+/g,' ').trim().slice(0,500),
      buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>(e.innerText||'').replace(/\\s+/g,' ').trim()).filter(Boolean).slice(0,12) }));
})()`;

(async () => {
  const t0 = await board();
  const h = await makeHarness('walk2');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');
  const out = {};

  // ---------- C30052 : reassign, proven cross-technician --------------------
  // pick a block, note its shift id from the API by matching work order + start,
  // drag it a long way DOWN the grid, then read staffId again.
  const pick = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const bs = [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
      .filter(e => /Pamill Paving|Fuline/.test(e.innerText || ''));
    // choose the one nearest the TOP so there is room to drag downwards
    const b = bs.sort((a, z) => a.getBoundingClientRect().y - z.getBoundingClientRect().y)[0];
    if (!b) return { ok: false };
    b.scrollIntoView({ block: 'center' });
    const r = b.getBoundingClientRect();
    return { ok: true, t: (b.innerText || '').replace(/\s+/g, ' ').slice(0, 70), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const dest = await page.evaluate(() => {
    const labels = [...document.querySelectorAll('[data-test-id=schedule_lane_label]')]
      .map(e => { const r = e.getBoundingClientRect(); return { t: (e.innerText || '').replace(/\s+/g, ' ').trim(), y: r.y }; })
      .filter(l => !/^(SERVICE|SERVICE\/PARTS|WORK ORDER STATUS)$/.test(l.t))
      .sort((a, b) => a.y - b.y);
    const vh = window.innerHeight;
    // a technician lane that is fully on screen and well BELOW the block
    const l = labels.filter(x => x.y > 500 && x.y < vh - 200).pop() || labels[labels.length - 1];
    return { t: l.t, y: Math.round(l.y) };
  });
  const dt = await page.evaluate(({ y }) => {
    const r = document.querySelector('[data-test-id=schedule_calendar]').getBoundingClientRect();
    return { x: Math.round(r.x + r.width * 0.30), y: Math.round(Math.min(y + 16, window.innerHeight - 150)) };
  }, { y: dest.y });
  await page.mouse.move(pick.x, pick.y); await page.mouse.down();
  for (let i = 1; i <= 22; i++) { await page.mouse.move(pick.x + (dt.x - pick.x) * i / 22, pick.y + (dt.y - pick.y) * i / 22); await page.waitForTimeout(60); }
  await page.waitForTimeout(800); await page.mouse.up(); await page.waitForTimeout(3500);
  const conf = await page.evaluate(POPS);
  await page.screenshot({ path: `${OUT}/walk2-reassign.png` }).catch(() => { });
  // did anything actually move?
  const b1 = await board(); const d1 = diff(t0, b1);
  const moved = d1.changed_detail.filter(c => c.before.staffId !== c.after.staffId);
  const movedSameStaff = d1.changed_detail.filter(c => c.before.staffId === c.after.staffId);
  out.c30052 = { pick, dest, dt, conf, changed: d1.changed_detail.length, moved, movedSameStaff };
  REC.record(30052, [
    { step: "1 drag a shift block from one technician's row towards another", seen: pick.t + '  ->  aimed at lane "' + dest.t + '" at ' + JSON.stringify(dt) },
    { step: 'was the move actually cross-technician? (proven from the API, not from my aim)', seen: 'shifts whose staffId changed: ' + moved.length + ' ' + JSON.stringify(moved.map(m => ({ wo: m.after.wo, from: m.before.staffId, to: m.after.staffId }))) + ' ; shifts that moved but kept the same technician: ' + movedSameStaff.length },
    { step: '1 a confirmation modal appears for the cross-technician move', seen: (conf.length ? JSON.stringify(conf.map(c => c.text.slice(0, 200))) : 'NO DIALOG OPENED') + (moved.length ? '' : '  [and no cross-technician move actually occurred, so this is NOT evidence either way]') },
    { step: '2-4 shift sits on B, rosters swap, toast with Undo', seen: 'toast: ' + JSON.stringify(await page.evaluate(TOAST)) },
  ], moved.length ? 'see RUNNABILITY' : 'INCONCLUSIVE - the drag did not produce a cross-technician move');
  await esc(page, 2);

  // ---------- C30064 : toast lifetime, measured by polling ------------------
  // provoke a toast by moving a shift a short way (same technician, different day)
  const p2 = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const b = [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
      .filter(e => /Pamill Paving|Fuline/.test(e.innerText || ''))[0];
    if (!b) return { ok: false };
    b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect();
    return { ok: true, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), w: Math.round(r.width) };
  });
  let life = null, hoverLife = null;
  if (p2.ok) {
    await page.mouse.move(p2.x, p2.y); await page.mouse.down();
    for (let i = 1; i <= 12; i++) { await page.mouse.move(p2.x + 150 * i / 12, p2.y); await page.waitForTimeout(55); }
    await page.mouse.up(); await page.waitForTimeout(600);
    await page.mouse.move(20, 20);                 // keep the cursor OFF the toast
    // poll until it goes
    const t0ms = Date.now(); const seen = [];
    for (let i = 0; i < 30; i++) {
      const t = await page.evaluate(TOAST);
      seen.push({ ms: Date.now() - t0ms, n: t.length, undo: t.length ? /Undo/.test(JSON.stringify(t)) : null });
      if (!t.length) break;
      await page.waitForTimeout(500);
    }
    life = seen;
  }
  // now the hover half, on a fresh toast
  const p3 = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const b = [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
      .filter(e => /Pamill Paving|Fuline/.test(e.innerText || ''))[0];
    if (!b) return { ok: false };
    const r = b.getBoundingClientRect();
    return { ok: true, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  if (p3.ok) {
    await page.mouse.move(p3.x, p3.y); await page.mouse.down();
    for (let i = 1; i <= 12; i++) { await page.mouse.move(p3.x - 150 * i / 12, p3.y); await page.waitForTimeout(55); }
    await page.mouse.up(); await page.waitForTimeout(700);
    const tb = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
      const t = [...document.querySelectorAll('.undo-toast-host')].filter(vis)[0];
      if (!t) return null; const r = t.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    });
    if (tb) {
      await page.mouse.move(tb.x, tb.y);
      await page.waitForTimeout(14000);
      const still = await page.evaluate(TOAST);
      await page.mouse.move(20, 20);
      const t1 = Date.now(); const after = [];
      for (let i = 0; i < 30; i++) {
        const t = await page.evaluate(TOAST);
        after.push({ ms: Date.now() - t1, n: t.length });
        if (!t.length) break;
        await page.waitForTimeout(500);
      }
      hoverLife = { still_after_14s_hover: still, after_leaving: after };
    }
  }
  out.c30064 = { life, hoverLife };
  const gone = life ? life.find(x => x.n === 0) : null;
  const goneAfter = hoverLife ? hoverLife.after_leaving.find(x => x.n === 0) : null;
  REC.record(30064, [
    { step: '1 trigger a toast, leave it alone, and time it', seen: life ? 'polled every 500 ms with the cursor parked away from it: ' + (gone ? 'gone by ' + gone.ms + ' ms' : 'STILL PRESENT after ' + life[life.length - 1].ms + ' ms') + ' ; had an Undo action: ' + (life[0] || {}).undo : 'not driven' },
    { step: '2 hold the cursor over it well past its life (14 s)', seen: hoverLife ? 'still present: ' + (hoverLife.still_after_14s_hover.length > 0) + ' ' + JSON.stringify(hoverLife.still_after_14s_hover) : 'not driven' },
    { step: '3 move the cursor off - it dismisses', seen: hoverLife ? (goneAfter ? 'gone ' + goneAfter.ms + ' ms after the cursor left' : 'STILL PRESENT ' + hoverLife.after_leaving[hoverLife.after_leaving.length - 1].ms + ' ms after the cursor left') : 'not driven' },
  ], 'see RUNNABILITY');

  // ---------- C30057 : a SERIES member's delete scopes -----------------------
  const seriesShift = Object.entries(t0.shifts).find(([, s]) => s.seriesId);
  const openedSeries = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const b = [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
      .find(e => /Week \d+ of \d+/.test(e.innerText || '') || e.querySelector('[data-test-id=schedule_block_series_cue]'));
    if (!b) return { ok: false };
    b.scrollIntoView({ block: 'center' }); b.click();
    return { ok: true, t: (b.innerText || '').replace(/\s+/g, ' ').slice(0, 80) };
  });
  await page.waitForTimeout(3000);
  let scopeDlg = null;
  if (openedSeries.ok) {
    const modal = await page.evaluate(POPS);
    const hasDel = await page.evaluate(() => !!document.querySelector('[data-test-id=button_shift_detail_delete]'));
    if (hasDel) {
      await page.evaluate(() => { const b = document.querySelector('[data-test-id=button_shift_detail_delete]'); if (b) b.click(); });
      await page.waitForTimeout(2500);
      scopeDlg = await page.evaluate(POPS);
      await page.screenshot({ path: `${OUT}/walk2-seriesdelete.png` }).catch(() => { });
      await esc(page, 3);       // DO NOT confirm any scope
    }
    out.c30057 = { openedSeries, modal, scopeDlg };
  }
  REC.record(30057, [
    { step: '1 open a shift that belongs to a series and press Delete', seen: openedSeries.ok ? 'opened ' + openedSeries.t : 'no series block found on screen' },
    { step: '1 three scope options are offered', seen: scopeDlg ? JSON.stringify(scopeDlg.map(d => ({ text: d.text.slice(0, 260), buttons: d.buttons }))) : 'no scope dialog captured' },
    { step: 'nothing was confirmed', seen: 'the run pressed Escape rather than any scope button' },
  ], 'see RUNNABILITY');

  await esc(page, 3);
  await h.browser.close();
  fs.writeFileSync(`${OUT}/walk2.json`, JSON.stringify(out, null, 1));
  const bF = await board(); const dF = diff(t0, bF);
  fs.writeFileSync(`${OUT}/walk2-board.json`, JSON.stringify(dF, null, 1));
  console.log('\nRUN board', dF.shifts_before, '->', dF.shifts_after, 'added', dF.added.length, 'removed', dF.removed.length, 'changed', dF.changed.length);
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
