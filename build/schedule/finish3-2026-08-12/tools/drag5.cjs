// drag5.cjs — drag a LINE out of the sidebar drill-down.
//   C29957  a drill-down line drag creates a single-line shift with NO scope picker
//   C29960  re-driven AGAIN: the case says "start dragging a LINE", and the previous
//           run dragged a work-order CARD.  Also the earlier "mirror" hits were a
//           false positive - the pattern fc-event-drag matches fc-event-draggable,
//           which every existing block on the calendar carries.  The real ghost is a
//           clone reparented to <body>, so it is tracked by position here.
//   C29961  roster sync, onto a technician PROVEN not already on the line.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');
const REC = mkRecorder(`${OUT}/walk_drag.json`);

const GHOST = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'; };
  const kids=[...document.body.children].filter(vis).map(e=>{const r=e.getBoundingClientRect();
    return {tag:e.tagName, cls:(e.className||'').toString().slice(0,90),
            t:(e.innerText||'').replace(/\\s+/g,' ').slice(0,110),
            x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height),
            pos:getComputedStyle(e).position};});
  const hi=[...document.querySelectorAll('.schedule-drop-target,[class*=drop-target],[class*=fc-highlight]')].filter(vis)
    .map(e=>{const r=e.getBoundingClientRect(); return {cls:(e.className||'').toString().slice(0,70),
      x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};});
  return {kids, hi};
})()`;

const LANES = `(() => [...document.querySelectorAll('[data-test-id=schedule_lane_label]')]
  .map(e=>{const r=e.getBoundingClientRect(); return {t:(e.innerText||'').replace(/\\s+/g,' ').trim(),
    y:Math.round(r.y), h:Math.round(r.height)};}))()`;

const PICKOPEN = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; };
  const open=[...document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu')].filter(vis);
  return { n: open.length,
    picker: open.some(e=>e.querySelector('[data-test-id=line_picker_list],[data-test-id=line_picker_whole_work_order]')),
    spread: open.some(e=>/spread|how much|full estimate|until a date/i.test(e.innerText||'')),
    texts: open.map(e=>(e.innerText||'').replace(/\\s+/g,' ').slice(0,250)) };
})()`;

(async () => {
  const t0 = await board();
  const h = await makeHarness('drag5');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');

  // ---- open a work order's drill-down in the sidebar -------------------------
  const opened = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const p = cs.find(c => { const m = (c.innerText || '').match(/(\d+)\s+lines?/); return m && +m[1] >= 2 && +m[1] <= 8; });
    if (!p) return { ok: false };
    const t = (p.innerText || '').replace(/\s+/g, ' ').slice(0, 70);
    const chev = p.querySelector('[data-test-id*=chevron],[class*=chevron],i');
    (chev || p).click();
    return { ok: true, card: t };
  });
  await page.waitForTimeout(4500);
  const drill = await page.evaluate(`(() => {
    const vis = e => { const r=e.getBoundingClientRect(); return r.width>0&&r.height>0&&getComputedStyle(e).display!=='none'; };
    const ids={}; document.querySelectorAll('[data-test-id]').forEach(e=>{const k=e.getAttribute('data-test-id');
      if(/line|drill|handle|drag/i.test(k)) ids[k]=(ids[k]||0)+1;});
    const sb=document.querySelector('[data-test-id=schedule_sidebar]');
    return { ids, sidebar_text:(sb?(sb.innerText||''):'').replace(/\\s+/g,' ').slice(0,700) };
  })()`);
  fs.writeFileSync(`${OUT}/drag5-drill.json`, JSON.stringify({ opened, drill }, null, 1));
  await page.screenshot({ path: `${OUT}/drag5-drill.png` }).catch(() => { });
  console.log('DRILL ids:', JSON.stringify(drill.ids));
  console.log('SIDEBAR :', drill.sidebar_text.slice(0, 420));

  // ---- find a draggable LINE row inside the drill-down -----------------------
  const lineRow = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    // sidebar_line_row is the ROW.  The previous run grabbed sidebar_line_LIST,
    // the container, and started the drag in dead space between rows - which is
    // why nothing dragged.  Grab the row, and press on its drag_indicator handle.
    const rows = [...document.querySelectorAll('[data-test-id=sidebar_line_row]')].filter(vis);
    if (!rows.length) return { ok: false, why: 'no sidebar_line_row' };
    const pick = rows[0];
    pick.scrollIntoView({ block: 'center' });
    const r = pick.getBoundingClientRect();
    // the handle renders as the literal text 'drag_indicator'
    let hx = r.x + 14, hy = r.y + r.height / 2;
    const handle = [...pick.querySelectorAll('*')].filter(vis)
      .find(e => e.children.length === 0 && /drag_indicator/.test(e.textContent || ''));
    if (handle) { const hr = handle.getBoundingClientRect(); hx = hr.x + hr.width / 2; hy = hr.y + hr.height / 2; }
    return { ok: true, tid: 'sidebar_line_row', rows: rows.length, handle: !!handle,
      text: (pick.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 110),
      x: Math.round(hx), y: Math.round(hy),
      rowbox: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } };
  });
  console.log('LINE ROW:', JSON.stringify(lineRow).slice(0, 220));

  const lanes = await page.evaluate(LANES);
  // pick a technician lane whose initials are NOT already in the line row text
  const tgtLane = lanes.filter(l => !/WORK ORDER STATUS|Unassigned/i.test(l.t) && l.y > 380 && l.y < 900)
    .find(l => {
      const ini = (l.t.match(/^([A-Z]{2})\b/) || [])[1];
      return ini && lineRow.text && !new RegExp('\\b' + ini + '\\b').test(lineRow.text);
    }) || lanes[3];
  const tgt = await page.evaluate(({ y }) => {
    const cal = document.querySelector('[data-test-id=schedule_calendar]');
    const r = cal.getBoundingClientRect();
    return { x: Math.round(r.x + r.width * 0.42), y: Math.round(Math.min(Math.max(y + 12, r.y + 120), window.innerHeight - 170)) };
  }, { y: tgtLane.y });
  console.log('TARGET LANE:', JSON.stringify(tgtLane), '->', JSON.stringify(tgt));

  // ---- drag the LINE, tracking the ghost by position ------------------------
  const samples = [];
  let dragged = false;
  if (lineRow.ok) {
    dragged = true;
    await page.mouse.move(lineRow.x, lineRow.y); await page.mouse.down();
    for (let i = 1; i <= 24; i++) {
      const cx = lineRow.x + (tgt.x - lineRow.x) * i / 24, cy = lineRow.y + (tgt.y - lineRow.y) * i / 24;
      await page.mouse.move(cx, cy); await page.waitForTimeout(60);
      if (i === 14 || i === 19 || i === 23) {
        const g = await page.evaluate(GHOST);
        samples.push({ i, cursor: { x: Math.round(cx), y: Math.round(cy) }, hi: g.hi, kids: g.kids.filter(k => k.pos === 'fixed' || k.pos === 'absolute' || k.t) });
      }
    }
    await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
  }
  const after = await page.evaluate(PICKOPEN);
  const b1 = await board();
  const d1 = diff(t0, b1);
  await page.screenshot({ path: `${OUT}/drag5-after.png` }).catch(() => { });
  fs.writeFileSync(`${OUT}/drag5.json`, JSON.stringify({ opened, lineRow, lanes, tgtLane, tgt, samples, after, board: d1 }, null, 1));

  // ghost = a body-level element that MOVES with the cursor and carries the drag text
  const moving = [];
  if (samples.length >= 2) {
    const key = k => k.tag + '|' + k.cls;
    const s0 = samples[0], sN = samples[samples.length - 1];
    s0.kids.forEach(a => {
      const b = sN.kids.find(z => key(z) === key(a));
      if (b && (Math.abs(b.x - a.x) > 25 || Math.abs(b.y - a.y) > 25)) moving.push({ cls: a.cls, t: a.t, from: { x: a.x, y: a.y }, to: { x: b.x, y: b.y } });
    });
  }
  REC.record(29960, [
    { step: '1 start dragging A LINE from the sidebar and hold it over grid cells (re-driven twice: the first run sampled over the sidebar, the second dragged a work-order card instead of a line)', seen: dragged ? 'line dragged: ' + lineRow.text : 'NO draggable line row found in the drill-down: ' + JSON.stringify(lineRow) },
    { step: '1 the cell under the cursor highlights as a drop target', seen: samples.some(s => s.hi.length) ? JSON.stringify(samples.map(s => ({ i: s.i, cursor: s.cursor, hi: s.hi }))) : 'no drop-target element in any sample' },
    { step: '2 a ghost block follows the drag showing the line name and its hours', seen: moving.length ? 'a body-level element MOVED with the cursor: ' + JSON.stringify(moving) : 'no body-level element moved with the cursor across samples; body children seen: ' + JSON.stringify((samples[0] || { kids: [] }).kids.map(k => ({ cls: k.cls.slice(0, 50), t: k.t.slice(0, 45) }))) },
    { step: '3 releasing outside any valid cell creates nothing', seen: 'proven earlier: released over the sidebar, board 675 -> 675, 0 added' },
  ], 'see RUNNABILITY');

  REC.record(29957, [
    { step: '0 open the work order drill-down in the sidebar', seen: 'card ' + (opened.card || '?') + ' ; drill-down test ids: ' + JSON.stringify(drill.ids) },
    { step: "1 using the line's drag handle, drag one line from the drill-down", seen: lineRow.ok ? lineRow.tid + ' :: ' + lineRow.text : 'NO drag handle / line row found: ' + JSON.stringify(lineRow) },
    { step: '2 drop it onto a technician cell', seen: 'lane ' + tgtLane.t + ' at ' + JSON.stringify(tgt) },
    { step: '1 a single-line shift is created directly, NO scope picker appears', seen: 'picker=' + after.picker + ' dialogs=' + after.n + ' ; board added=' + d1.added.length + ' ' + JSON.stringify(d1.added_detail.map(a => ({ wo: a.wo, lines: a.lines.length, mins: a.durationMinutes }))) },
    { step: "2 the block's last text line shows that line's name", seen: JSON.stringify(d1.added_detail.map(a => a.lines.length + ' line(s)')) },
    { step: '3 the technician is added to that line roster only', seen: 'see C29961' },
  ], 'see RUNNABILITY');

  await esc(page, 2);
  await h.browser.close();
  const bF = await board();
  const dF = diff(t0, bF);
  console.log('\nRUN board', dF.shifts_before, '->', dF.shifts_after, 'added', dF.added.length, 'removed', dF.removed.length);
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
