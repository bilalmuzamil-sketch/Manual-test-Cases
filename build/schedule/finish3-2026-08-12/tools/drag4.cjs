// drag4.cjs — re-drive the two results whose first measurement was MY OWN fault.
//
//  C29960  the first run sampled the "cell under the cursor" while the cursor was
//          over the SIDEBAR - which is not a cell.  Re-driven heading INTO the grid,
//          sampling repeatedly over real cells, and looking for a body-level mirror.
//  C29955  the first run read the toast ~5.5 s after the drop.  C30064 says a toast
//          without Undo lasts about 4 s, so 5.5 s can miss it entirely.  Re-driven
//          with the toast polled from 300 ms.
//  C29961  roster sync - the half C29955/C29964 assert and nothing has checked.
const { makeHarness, APP, OUT, CK, UA } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';
const REC = mkRecorder(`${OUT}/walk_drag.json`);

const TOAST = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; };
  const n=[...document.querySelectorAll('.q-notification,[class*=notification],[class*=toast],[role=alert],[role=status],.q-banner')].filter(vis);
  return n.map(e=>({ cls:(e.className||'').toString().slice(0,70),
                     text:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,200),
                     buttons:[...e.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean) }));
})()`;

async function cardBox(page, kind) {
  return page.evaluate((kind) => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const p = cs.find(c => { const t = c.innerText || ''; const m = t.match(/(\d+)\s+lines?/); const n = m ? +m[1] : 0;
      return kind === 'single' ? /\b1 line\b/.test(t) : (n >= 2 && n <= 6); });
    if (!p) return { ok: false };
    p.scrollIntoView({ block: 'center' });
    const r = p.getBoundingClientRect();
    return { ok: true, text: (p.innerText || '').replace(/\s+/g, ' ').slice(0, 90), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  }, kind);
}
async function cellAt(page, frac, dy) {
  return page.evaluate(({ frac, dy }) => {
    const cal = document.querySelector('[data-test-id=schedule_calendar]');
    const r = cal.getBoundingClientRect();
    return { x: Math.round(r.x + r.width * frac), y: Math.round(Math.min(r.y + dy, window.innerHeight - 170)) };
  }, { frac, dy });
}

(async () => {
  const t0 = await board();
  const h = await makeHarness('drag4');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');

  // ---------- C29960 : sample OVER THE GRID, not over the sidebar -------------
  const src = await cardBox(page, 'single');
  const tgt = await cellAt(page, 0.5, 330);
  const samples = [];
  await page.mouse.move(src.x, src.y);
  await page.mouse.down();
  for (let i = 1; i <= 24; i++) {
    await page.mouse.move(src.x + (tgt.x - src.x) * i / 24, src.y + (tgt.y - src.y) * i / 24);
    await page.waitForTimeout(60);
    if (i >= 16) {   // by now the cursor is well inside the calendar
      const s = await page.evaluate(() => {
        const vis = e => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
          const st = getComputedStyle(e); return st.display !== 'none' && st.visibility !== 'hidden'; };
        const cls = e => (e.className || '').toString();
        const all = [...document.querySelectorAll('*')].filter(vis);
        // a drag mirror in FullCalendar/Quasar is usually a direct child of body
        const bodyKids = [...document.body.children].map(e => ({ tag: e.tagName, cls: cls(e).slice(0, 90), t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 70) }));
        return {
          mirror: all.filter(e => /mirror|ghost|drag-preview|dragging|fc-event-drag/i.test(cls(e)))
            .map(e => ({ cls: cls(e).slice(0, 100), t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 80), parent: e.parentElement ? e.parentElement.tagName : null })),
          highlight: all.filter(e => /is-drop|drop-target|drag-over|is-over|highlight|fc-highlight/i.test(cls(e)))
            .map(e => ({ cls: cls(e).slice(0, 100) })),
          bodyKidCount: bodyKids.length, bodyKids: bodyKids.slice(-4),
          elemAtCursor: null,
        };
      });
      samples.push({ i, ...s });
    }
  }
  const atCursor = await page.evaluate(({ x, y }) => {
    const e = document.elementFromPoint(x, y);
    const chain = []; let n = e;
    for (let k = 0; k < 5 && n; k++) { chain.push({ tag: n.tagName, cls: (n.className || '').toString().slice(0, 90), tid: n.getAttribute && n.getAttribute('data-test-id') }); n = n.parentElement; }
    return chain;
  }, tgt);
  await page.screenshot({ path: `${OUT}/drag4-middrag.png` }).catch(() => { });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const toastEarly = [];
  for (const w of [0, 500, 900, 1500, 2500, 4000]) {
    if (w) await page.waitForTimeout(w - (toastEarly.length ? 0 : 0));
    const t = await page.evaluate(TOAST);
    toastEarly.push({ approx_ms_after_drop: 400 + w, toast: t });
    if (w === 0) await page.waitForTimeout(500);
  }
  await page.waitForTimeout(4000);
  const b1 = await board();
  const d1 = diff(t0, b1);
  fs.writeFileSync(`${OUT}/drag4-29960.json`, JSON.stringify({ src, tgt, samples, atCursor, toastEarly, board: d1 }, null, 1));

  const anyMirror = samples.some(s => s.mirror.length);
  const anyHi = samples.some(s => s.highlight.length);
  REC.record(29960, [
    { step: '1 drag a card and hold it OVER A GRID CELL (re-driven: the first attempt sampled while the cursor was over the sidebar, which is not a cell)', seen: 'sampled ' + samples.length + ' times with the cursor inside the calendar, ending at ' + JSON.stringify(tgt) },
    { step: '1 the cell under the cursor highlights as a drop target', seen: anyHi ? JSON.stringify(samples.find(s => s.highlight.length).highlight.slice(0, 4)) : 'NO element carrying a drop-target/highlight class was present in any of the ' + samples.length + ' mid-drag samples. Element chain under the cursor: ' + JSON.stringify(atCursor) },
    { step: '2 a ghost block follows the drag showing the line name and its hours', seen: anyMirror ? JSON.stringify(samples.find(s => s.mirror.length).mirror.slice(0, 3)) : 'NO mirror/ghost/drag-preview element found in any sample; body children stayed at ' + samples[0].bodyKidCount },
    { step: '3 releasing outside any valid cell creates nothing', seen: 'proven in the first run: released over the sidebar, board 675 -> 675, 0 added' },
  ], 'see RUNNABILITY');

  // ---------- C29955 : the toast, polled EARLY --------------------------------
  const firstToast = toastEarly.find(t => t.toast.length);
  REC.record(29955, [
    { step: '1-2 drag a single-line card and drop it on a technician cell', seen: src.text + ' -> ' + JSON.stringify(tgt) + '; board added=' + d1.added.length },
    { step: '1 a shift is created immediately, no scope picker and no spread step', seen: 'board added=' + d1.added.length + ' ' + JSON.stringify(d1.added_detail.map(a => ({ wo: a.wo, mins: a.durationMinutes }))) },
    { step: '2 the block shows customer name, unit number and the line name', seen: 'confirmed in the first run: "Pamill Paving 713 Replace - Rear ramp handles"' },
    { step: '4 a toast with an Undo option appears (re-driven: polled from 400 ms, because a toast without Undo lasts about 4 s and the first run read at 5.5 s)', seen: firstToast ? 'FOUND at ~' + firstToast.approx_ms_after_drop + ' ms: ' + JSON.stringify(firstToast.toast) : 'NOT FOUND at any of ' + JSON.stringify(toastEarly.map(t => t.approx_ms_after_drop)) + ' ms after the drop' },
  ], 'see RUNNABILITY');

  // ---------- C29961 : roster sync -------------------------------------------
  // read the line rosters straight from the picker, which renders them as avatars
  const s2 = await cardBox(page, 'multi');
  const c2 = await cellAt(page, 0.62, 330);
  await page.mouse.move(s2.x, s2.y); await page.mouse.down();
  for (let i = 1; i <= 20; i++) { await page.mouse.move(s2.x + (c2.x - s2.x) * i / 20, s2.y + (c2.y - s2.y) * i / 20); await page.waitForTimeout(55); }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
  const rosterBefore = await page.evaluate(`(() => [...document.querySelectorAll('[data-test-id^=line_picker_line_]')]
     .map(e=>({id:e.getAttribute('data-test-id'), t:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,110)})))()`);
  // schedule ONE line, then re-open the picker and compare that line's roster
  const picked = await page.evaluate(`(() => {
    const rows=[...document.querySelectorAll('[data-test-id^=line_picker_line_]')];
    const r = rows[rows.length-1]; if(!r) return null;
    const o = {id:r.getAttribute('data-test-id'), t:(r.innerText||'').replace(/\\s+/g,' ').trim()};
    r.click(); return o; })()`);
  await page.waitForTimeout(7000);
  const b2 = await board();
  const d2 = diff(b1, b2);
  // re-open the picker on the SAME work order to read the roster again
  const s3 = await cardBox(page, 'multi');
  const c3 = await cellAt(page, 0.3, 330);
  await page.mouse.move(s3.x, s3.y); await page.mouse.down();
  for (let i = 1; i <= 20; i++) { await page.mouse.move(s3.x + (c3.x - s3.x) * i / 20, s3.y + (c3.y - s3.y) * i / 20); await page.waitForTimeout(55); }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
  const rosterAfter = await page.evaluate(`(() => [...document.querySelectorAll('[data-test-id^=line_picker_line_]')]
     .map(e=>({id:e.getAttribute('data-test-id'), t:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,110)})))()`);
  await esc(page, 3);
  await page.screenshot({ path: `${OUT}/drag4-roster.png` }).catch(() => { });
  fs.writeFileSync(`${OUT}/drag4-29961.json`, JSON.stringify({ rosterBefore, picked, board: d2, rosterAfter }, null, 1));

  const bMap = {}; rosterBefore.forEach(r => bMap[r.id] = r.t);
  const changes = rosterAfter.filter(r => bMap[r.id] && bMap[r.id] !== r.t)
    .map(r => ({ id: r.id, before: bMap[r.id], after: r.t }));
  REC.record(29961, [
    { step: '1 drag a line onto a technician cell and create the shift', seen: (picked || {}).t + ' ; board added=' + d2.added.length },
    { step: "2 check the line's technician roster afterwards", seen: 'roster rows re-read from the picker; rows whose roster text changed: ' + JSON.stringify(changes) },
    { step: '1-2 the technician appears on the roster and the avatar stack updates', seen: changes.length ? JSON.stringify(changes) : 'NO roster row changed. before=' + JSON.stringify(rosterBefore.map(r => r.t.slice(-22))) + ' after=' + JSON.stringify(rosterAfter.map(r => r.t.slice(-22))) },
    { step: '4-5 a second technician can be added without swapping the first', seen: 'not driven this run - needs a second drop of the SAME line onto another technician' },
  ], 'partial');

  await h.browser.close();
  const bF = await board();
  const dF = diff(t0, bF);
  fs.writeFileSync(`${OUT}/drag4-board.json`, JSON.stringify(dF, null, 1));
  console.log('\nRUN board', dF.shifts_before, '->', dF.shifts_after, 'added', dF.added.length, 'removed', dF.removed.length);
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
