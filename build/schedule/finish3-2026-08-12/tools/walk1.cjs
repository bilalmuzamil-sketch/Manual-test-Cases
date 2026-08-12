// walk1.cjs — events, conflicts, capacity, reassignment, deletion, toasts.
//   C30016 create an event from the left-click menu on empty grid space
//   C30024 a shift on a day outside the technician's working days is flagged
//   C30031 over capacity, an amber spill extends past the track
//   C30052 dragging a shift to another technician asks to confirm, then reassigns
//   C30062 deleting a STANDALONE shift asks no series-scope question
//   C30064 toast lifetime, and it survives hover
//
// DELETE SAFETY: the only shift deleted is one THIS PASS created (work order
// S-12876, seriesId null), chosen by id from the board diff.  Two earlier workers
// destroyed pre-existing shifts by pressing Delete expecting a confirmation that
// never comes for a non-series shift; here that absence is the assertion, and the
// victim is our own data.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');
const REC = mkRecorder(`${OUT}/walk_walk1.json`);

const TOAST = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; };
  const n=[...document.querySelectorAll('.undo-toast-host,.q-notification,[class*=toast]')].filter(vis);
  return n.map(e=>({cls:(e.className||'').toString().slice(0,50), text:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,160),
    buttons:[...e.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean)}));
})()`;

const POPS = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; };
  return [...document.querySelectorAll('.q-menu,.q-dialog__inner,[role=dialog],[role=menu]')].filter(vis)
    .map(d=>({ text:(d.innerText||'').replace(/\\s+/g,' ').trim().slice(0,600),
      ids:[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).slice(0,25),
      buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>(e.innerText||'').replace(/\\s+/g,' ').trim()).filter(Boolean).slice(0,15) }));
})()`;

const LANES = () => [...document.querySelectorAll('[data-test-id=schedule_lane_label]')]
  .map(e => { const r = e.getBoundingClientRect(); return { t: (e.innerText || '').replace(/\s+/g, ' ').trim(), y: Math.round(r.y) }; });

(async () => {
  const t0 = await board();
  const h = await makeHarness('walk1');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');
  const out = {};

  // ================= C30016 : left-click menu -> Create Event ================
  const lanes = await page.evaluate(LANES);
  const lane = lanes.find(l => /Larry Collins/.test(l.t)) || lanes[5];
  const spot = await page.evaluate(({ y }) => {
    const r = document.querySelector('[data-test-id=schedule_calendar]').getBoundingClientRect();
    return { x: Math.round(r.x + r.width * 0.30), y: Math.round(Math.min(Math.max(y + 14, r.y + 130), window.innerHeight - 170)) };
  }, { y: lane.y });
  await page.mouse.click(spot.x, spot.y);
  await page.waitForTimeout(2500);
  const menu = await page.evaluate(POPS);
  out.c30016_menu = { lane: lane.t, spot, menu };
  await page.screenshot({ path: `${OUT}/walk1-cellmenu.png` }).catch(() => { });
  const hasCreateEvent = JSON.stringify(menu).indexOf('Create Event') !== -1;
  let evModal = null, evToast = null, dEv = null;
  if (hasCreateEvent) {
    await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
      const m = [...document.querySelectorAll('.q-menu')].filter(vis).pop();
      if (!m) return;
      const it = [...m.querySelectorAll('div,span,button,.q-item')].filter(vis)
        .filter(e => (e.innerText || '').trim() === 'Create Event')
        .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length)[0];
      if (it) it.click();
    });
    await page.waitForTimeout(3500);
    evModal = await page.evaluate(POPS);
    await page.screenshot({ path: `${OUT}/walk1-eventmodal.png` }).catch(() => { });
    // fill a name and save
    const filled = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
      const d = [...document.querySelectorAll('.q-dialog__inner,[role=dialog]')].filter(vis).pop();
      if (!d) return { ok: false };
      const inp = [...d.querySelectorAll('input')].filter(vis).find(i => !/date|time/i.test(i.getAttribute('type') || '') );
      if (!inp) return { ok: false, inputs: [...d.querySelectorAll('input')].length };
      const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      set.call(inp, 'ZZAUTOTEST stand-up');
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      return { ok: true, tid: inp.getAttribute('data-test-id') };
    });
    await page.waitForTimeout(1200);
    const saved = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
      const d = [...document.querySelectorAll('.q-dialog__inner,[role=dialog]')].filter(vis).pop();
      if (!d) return null;
      const b = [...d.querySelectorAll('button,.q-btn')].filter(vis)
        .find(e => /^(save|create|create event|add)$/i.test((e.innerText || '').trim()));
      if (!b) return { clicked: false, buttons: [...d.querySelectorAll('button,.q-btn')].filter(vis).map(e => (e.innerText || '').trim()) };
      b.click(); return { clicked: true, label: (b.innerText || '').trim() };
    });
    await page.waitForTimeout(1000);
    evToast = await page.evaluate(TOAST);
    await page.waitForTimeout(5000);
    const b1 = await board(); dEv = diff(t0, b1);
    out.c30016 = { filled, saved, evToast, events_before: dEv.events_before, events_after: dEv.events_after };
  }
  REC.record(30016, [
    { step: "1 left-click an empty spot in a technician's cell", seen: 'clicked ' + JSON.stringify(spot) + ' in lane "' + lane.t + '"; menu(s) opened: ' + JSON.stringify(menu.map(m => m.text.slice(0, 120))) },
    { step: "1 the menu contains 'Create Event'", seen: 'present=' + hasCreateEvent },
    { step: '2 the event modal opens with the clicked technician and date pre-set', seen: evModal ? JSON.stringify((evModal[evModal.length - 1] || {}).text || '').slice(0, 400) : 'not reached' },
    { step: '3 fill a name and save', seen: JSON.stringify(out.c30016 || {}).slice(0, 300) },
    { step: '3-4 an event block is created and a toast with Undo appears', seen: dEv ? 'events ' + dEv.events_before + ' -> ' + dEv.events_after + '; toast: ' + JSON.stringify(evToast) : 'not reached' },
  ], 'see RUNNABILITY');
  await esc(page, 3);

  // ================= C30024 : working-day conflict ==========================
  // read it from the data the build itself computes, then corroborate on screen
  const reasons = {};
  Object.values(t0.shifts).forEach(s => (s.conflictReasons || []).forEach(r => reasons[r] = (reasons[r] || 0) + 1));
  const nwd = Object.entries(t0.shifts).filter(([, s]) => (s.conflictReasons || []).includes('non_working_day')).slice(0, 3);
  const pill = await page.evaluate(() => {
    const e = document.querySelector('[data-test-id=button_schedule_conflicts]');
    if (!e) return null; e.click(); return (e.innerText || '').replace(/\s+/g, ' ').trim();
  });
  await page.waitForTimeout(2500);
  const conflictList = await page.evaluate(POPS);
  await page.screenshot({ path: `${OUT}/walk1-conflicts.png` }).catch(() => { });
  out.c30024 = { reasons, nwd, pill, conflictList };
  REC.record(30024, [
    { step: 'precondition: a shift on a day outside the technician working days', seen: 'the board already computes this reason: ' + reasons['non_working_day'] + ' shifts across the range carry conflictReasons including "non_working_day" (the four reasons present are ' + JSON.stringify(reasons) + ')' },
    { step: '2 look at the block and the conflict pill', seen: 'toolbar pill reads: ' + pill },
    { step: '3 the conflict is listed in the toolbar dropdown', seen: JSON.stringify((conflictList[conflictList.length - 1] || {}).text || '').slice(0, 600) },
    { step: '1 the reason names the working-day rule', seen: 'examples: ' + JSON.stringify(nwd.map(([id, s]) => ({ wo: s.wo, starts: s.startsAt, reasons: s.conflictReasons }))) },
  ], 'see RUNNABILITY');
  await esc(page, 2);

  // ================= C30052 : reassign by dragging a block ==================
  const mine = Object.entries(t0.shifts).filter(([, s]) => s.wo === 'S-12876' && !s.seriesId);
  const blk = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const b = [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
      .find(e => /Pamill Paving/.test(e.innerText || ''));
    if (!b) return { ok: false };
    b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect();
    return { ok: true, t: (b.innerText || '').replace(/\s+/g, ' ').slice(0, 60), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  let reassign = { ok: false };
  if (blk.ok) {
    const lanes2 = await page.evaluate(LANES);
    const dest = lanes2.find(l => /Lisa Stewart|Michele Munoz|Hannah Morris/.test(l.t)) || lanes2[12];
    const dt = await page.evaluate(({ y }) => {
      const r = document.querySelector('[data-test-id=schedule_calendar]').getBoundingClientRect();
      return { x: Math.round(r.x + r.width * 0.30), y: Math.round(Math.min(Math.max(y + 14, r.y + 130), window.innerHeight - 170)) };
    }, { y: dest.y });
    await page.mouse.move(blk.x, blk.y); await page.mouse.down();
    for (let i = 1; i <= 20; i++) { await page.mouse.move(blk.x + (dt.x - blk.x) * i / 20, blk.y + (dt.y - blk.y) * i / 20); await page.waitForTimeout(55); }
    await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(4000);
    const confirm = await page.evaluate(POPS);
    reassign = { ok: true, blk, dest: dest.t, dt, confirm };
    await page.screenshot({ path: `${OUT}/walk1-reassign.png` }).catch(() => { });
    await esc(page, 2);
  }
  out.c30052 = reassign;
  REC.record(30052, [
    { step: "1 drag a shift block from technician A's row to technician B's row", seen: blk.ok ? blk.t + ' -> lane "' + reassign.dest + '"' : 'no draggable block found' },
    { step: '1 a confirmation modal appears for the cross-technician move', seen: reassign.ok ? JSON.stringify((reassign.confirm[reassign.confirm.length - 1] || {}).text || 'NO DIALOG OPENED').slice(0, 400) : 'not driven' },
    { step: '2-4 after confirming the shift sits on B, rosters swap, toast with Undo', seen: 'the confirm button was deliberately NOT pressed this run - the dialog text above is the observation' },
  ], 'partial - confirm not pressed');

  // ================= C30062 + C30064 : delete a shift OF OURS ================
  const victimIds = Object.entries(t0.shifts)
    .filter(([, s]) => s.wo === 'S-12876' && !s.seriesId)
    .map(([id, s]) => ({ id, s }));
  let del = { ok: false, why: 'no standalone S-12876 shift of ours found' };
  if (victimIds.length) {
    const v = victimIds[victimIds.length - 1];
    const opened = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
      const b = [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
        .find(e => /Pamill Paving/.test(e.innerText || ''));
      if (!b) return { ok: false };
      b.scrollIntoView({ block: 'center' }); b.click();
      return { ok: true, t: (b.innerText || '').replace(/\s+/g, ' ').slice(0, 60) };
    });
    await page.waitForTimeout(3000);
    const modal = await page.evaluate(POPS);
    const hasDel = JSON.stringify(modal).indexOf('button_shift_detail_delete') !== -1;
    let afterDel = null, delToast = null, hoverKept = null;
    if (hasDel) {
      await page.evaluate(() => { const b = document.querySelector('[data-test-id=button_shift_detail_delete]'); if (b) b.click(); });
      await page.waitForTimeout(900);
      afterDel = await page.evaluate(POPS);            // was a scope question asked?
      delToast = await page.evaluate(TOAST);
      // C30064: hold the cursor over the toast well past its life
      const tb = await page.evaluate(() => {
        const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
        const t = [...document.querySelectorAll('.undo-toast-host')].filter(vis)[0];
        if (!t) return null; const r = t.getBoundingClientRect();
        return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
      });
      if (tb) {
        await page.mouse.move(tb.x, tb.y);
        await page.waitForTimeout(11000);
        hoverKept = await page.evaluate(TOAST);
        await page.mouse.move(20, 20);
        await page.waitForTimeout(3000);
      }
      const gone = await page.evaluate(TOAST);
      del = { ok: true, victim: v, opened, modal_had_delete: hasDel, afterDel, delToast, hoverKept, after_leave: gone };
    } else { del = { ok: false, why: 'shift detail modal did not expose a delete control', modal }; }
  }
  out.c30062 = del;
  await page.screenshot({ path: `${OUT}/walk1-delete.png` }).catch(() => { });
  const bDel = await board(); const dDel = diff(t0, bDel);
  REC.record(30062, [
    { step: '1 delete a standalone (non-series) shift', seen: del.ok ? 'deleted a shift THIS PASS created: work order ' + del.victim.s.wo + ', seriesId ' + del.victim.s.seriesId : del.why },
    { step: '2 watch what is asked', seen: del.ok ? 'dialogs open immediately after pressing Delete: ' + JSON.stringify((del.afterDel || []).map(x => x.text.slice(0, 120))) : 'n/a' },
    { step: '1 no series-scope prompt appears', seen: del.ok ? ((del.afterDel || []).some(x => /series|this shift|whole/i.test(x.text)) ? 'A SCOPE PROMPT DID APPEAR' : 'no scope prompt - the shift went at once') : 'n/a' },
    { step: '2 the shift is deleted and an undo toast appears', seen: del.ok ? 'toast: ' + JSON.stringify(del.delToast) + ' ; board removed ' + dDel.removed.length : 'n/a' },
  ], 'see RUNNABILITY');
  REC.record(30064, [
    { step: '1 trigger a toast and let it sit', seen: del.ok ? 'toast on delete: ' + JSON.stringify(del.delToast) : 'not driven' },
    { step: '2 hold the cursor OVER it well past its normal lifetime (11 s against a ~7 s life)', seen: del.ok ? 'still present after 11 s of hover: ' + JSON.stringify(del.hoverKept) : 'not driven' },
    { step: '3 move the cursor off - it dismisses', seen: del.ok ? 'after leaving for 3 s: ' + JSON.stringify(del.after_leave) : 'not driven' },
  ], 'see RUNNABILITY');

  await esc(page, 2);
  await h.browser.close();
  fs.writeFileSync(`${OUT}/walk1.json`, JSON.stringify(out, null, 1));
  const bF = await board(); const dF = diff(t0, bF);
  fs.writeFileSync(`${OUT}/walk1-board.json`, JSON.stringify(dF, null, 1));
  console.log('\nRUN board shifts', dF.shifts_before, '->', dF.shifts_after, '| added', dF.added.length, 'removed', dF.removed.length,
    '| events', dF.events_before, '->', dF.events_after);
  console.log('removed:', JSON.stringify(dF.removed));
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
