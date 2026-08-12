// drag3.cjs — the CREATING drags.
//   C29960  ghost + highlight while dragging; release outside a cell creates nothing
//   C29955  single-line work order -> immediate shift, no picker, toast with Undo
//   C29965  tap a line row in the picker -> single-line shift, picker closes
//   C29959  ... and the spread step does NOT appear for a small line
//   C29964  'Schedule whole work order' -> ONE shift covering all lines, block reads 'N Lines'
//
// Shifts ARE created here.  That is the test, and the QA lead's ruling is that
// test data on this branch need not be restored.  Delete is never pressed.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');
const REC = mkRecorder(`${OUT}/walk_drag.json`);

const SIG = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; };
  const out = [];
  document.querySelectorAll('*').forEach(e => { if(!vis(e)) return;
    const c=(e.className||'').toString(); const t=e.getAttribute('data-test-id')||'';
    out.push(e.tagName+'|'+c.slice(0,110)+'|'+t); });
  return out;
})()`;

const TOAST = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; };
  const n=[...document.querySelectorAll('.q-notification,.q-notifications__list > *,[class*=toast],[role=alert],[role=status]')].filter(vis);
  return n.map(e=>({ text:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,220),
                     buttons:[...e.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean) }));
})()`;

const PICKOPEN = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; };
  const open=[...document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu')].filter(vis);
  return { n: open.length,
    picker: open.some(e=>e.querySelector('[data-test-id=line_picker_list],[data-test-id=line_picker_whole_work_order]')),
    spread: open.some(e=>/spread|how much|full estimate|until a date/i.test(e.innerText||'')),
    texts: open.map(e=>(e.innerText||'').replace(/\\s+/g,' ').slice(0,300)) };
})()`;

async function cardBox(page, kind) {
  return page.evaluate((kind) => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const p = cs.find(c => {
      const t = c.innerText || ''; const m = t.match(/(\d+)\s+lines?/); const n = m ? +m[1] : 0;
      if (kind === 'single') return /\b1 line\b/.test(t);
      return n >= 2 && n <= 6;
    });
    if (!p) return { ok: false, n: cs.length };
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
async function dragTo(page, src, tgt, sampleAt) {
  let sample = null;
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 20; i++) {
    await page.mouse.move(src.x + (tgt.x - src.x) * i / 20, src.y + (tgt.y - src.y) * i / 20);
    await page.waitForTimeout(55);
    if (sampleAt && i === 14) sample = await sampleAt();
  }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(5500);
  return sample;
}

(async () => {
  const t0 = await board();
  const h = await makeHarness('drag3');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');
  const log = {};

  // ================= C29960 : ghost + highlight, release outside a cell =========
  const base = await page.evaluate(SIG);
  const s0 = await cardBox(page, 'single');
  const overSidebar = { x: 140, y: 250 };          // NOT a grid cell
  const mid = await dragTo(page, s0, overSidebar, async () => {
    const now = await page.evaluate(SIG);
    const added = now.filter(x => !base.includes(x));
    const cell = await page.evaluate(`(() => {
      const vis = e => { const r=e.getBoundingClientRect(); return r.width>0&&r.height>0&&getComputedStyle(e).display!=='none'; };
      return [...document.querySelectorAll('*')].filter(vis)
        .filter(e=>/is-drop|drop-target|drag-over|is-over|highlight/i.test((e.className||'').toString()))
        .slice(0,8).map(e=>({cls:(e.className||'').toString().slice(0,100)}));
    })()`);
    return { added: added.slice(0, 25), highlight: cell };
  });
  const afterOutside = await page.evaluate(PICKOPEN);
  log.c29960 = { base_n: base.length, mid, afterOutside };
  await esc(page, 2);
  const b1 = await board();
  const d1 = diff(t0, b1);
  const ghost = (mid && mid.added || []).filter(x => /drag|ghost|preview|mirror|clone/i.test(x));
  REC.record(29960, [
    { step: '1 start dragging and hold over grid cells', seen: 'drag driven; ' + (mid ? mid.added.length : 0) + ' new visible elements appeared mid-drag' },
    { step: '2 a ghost block follows the drag showing the line name and hours', seen: ghost.length ? JSON.stringify(ghost.slice(0, 4)) : 'NO element with a drag/ghost/preview class appeared mid-drag. New elements were: ' + JSON.stringify((mid ? mid.added : []).slice(0, 6)) },
    { step: '1 the cell under the cursor highlights as a drop target', seen: JSON.stringify(mid ? mid.highlight : null) },
    { step: '3 releasing outside any valid cell creates nothing', seen: 'released over the sidebar at ' + JSON.stringify(overSidebar) + '; dialogs open=' + afterOutside.n + '; board ' + d1.shifts_before + ' -> ' + d1.shifts_after + ' added=' + d1.added.length },
  ], 'see RUNNABILITY');
  fs.writeFileSync(`${OUT}/drag3-29960.json`, JSON.stringify({ log: log.c29960, board: d1 }, null, 1));

  // ================= C29955 : single-line drop =================================
  const s1 = await cardBox(page, 'single');
  const c1 = await cellAt(page, 0.35, 300);
  await dragTo(page, s1, c1);
  const open1 = await page.evaluate(PICKOPEN);
  const toast1 = await page.evaluate(TOAST);
  const b2 = await board();
  const d2 = diff(b1, b2);
  const blocks1 = await page.evaluate(`(() => {
    const vis = e => { const r=e.getBoundingClientRect(); return r.width>0&&r.height>0&&getComputedStyle(e).display!=='none'; };
    return [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
      .map(e=>(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,140)); })()`);
  await page.screenshot({ path: `${OUT}/drag3-single.png` }).catch(() => { });
  fs.writeFileSync(`${OUT}/drag3-29955.json`, JSON.stringify({ src: s1, tgt: c1, open: open1, toast: toast1, board: d2, blocks: blocks1.slice(0, 10) }, null, 1));
  REC.record(29955, [
    { step: '1-2 drag a single-line card and drop it on a technician cell', seen: s1.text + '  ->  ' + JSON.stringify(c1) },
    { step: '1 a shift is created immediately, no scope picker and no spread step', seen: 'dialogs open=' + open1.n + ' picker=' + open1.picker + ' spread=' + open1.spread + '; board added=' + d2.added.length + ' ' + JSON.stringify(d2.added_detail.map(a => ({ wo: a.wo, starts: a.startsAt, mins: a.durationMinutes }))) },
    { step: '2 the block shows customer name, unit number and the line name', seen: JSON.stringify(blocks1.slice(0, 3)) },
    { step: '4 a toast with an Undo option appears', seen: JSON.stringify(toast1) },
  ], 'see RUNNABILITY');

  // ================= C29965 / C29959 : tap one line row ========================
  const s2 = await cardBox(page, 'multi');
  const c2 = await cellAt(page, 0.55, 300);
  await dragTo(page, s2, c2);
  const pk = await page.evaluate(PICKOPEN);
  const rowInfo = await page.evaluate(`(() => {
    const rows=[...document.querySelectorAll('[data-test-id^=line_picker_line_]')];
    const small = rows.map((r,i)=>({i, t:(r.innerText||'').replace(/\\s+/g,' ').trim(),
      h: (()=>{const m=(r.innerText||'').match(/Est\\. ([\\d.]+)h/); return m?parseFloat(m[1]):999;})()}))
      .sort((a,b)=>a.h-b.h)[0];
    if(!small) return null;
    rows[small.i].click();
    return small; })()`);
  await page.waitForTimeout(6000);
  const open2 = await page.evaluate(PICKOPEN);
  const toast2 = await page.evaluate(TOAST);
  const b3 = await board();
  const d3 = diff(b2, b3);
  const blocks2 = await page.evaluate(`(() => {
    const vis = e => { const r=e.getBoundingClientRect(); return r.width>0&&r.height>0&&getComputedStyle(e).display!=='none'; };
    return [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
      .map(e=>(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,140)); })()`);
  await page.screenshot({ path: `${OUT}/drag3-linerow.png` }).catch(() => { });
  fs.writeFileSync(`${OUT}/drag3-29965.json`, JSON.stringify({ src: s2, tgt: c2, picker: pk, clicked_row: rowInfo, after: open2, toast: toast2, board: d3, blocks: blocks2.slice(0, 12) }, null, 1));
  const newBlk = d3.added_detail.map(a => ({ wo: a.wo, lines: a.lines.length, mins: a.durationMinutes, starts: a.startsAt }));
  REC.record(29965, [
    { step: '1 drag the work order onto a technician cell', seen: s2.text + ' -> picker=' + pk.picker },
    { step: '2 click one line row (not Select multiple)', seen: JSON.stringify(rowInfo) },
    { step: '1 a single-line shift is created immediately, no extra confirmation', seen: 'board added=' + d3.added.length + ' ' + JSON.stringify(newBlk) },
    { step: '2 the picker closes', seen: 'dialogs open=' + open2.n + ' picker=' + open2.picker },
    { step: "3 the block's last text line shows the line's name", seen: JSON.stringify(blocks2.slice(0, 3)) },
  ], 'see RUNNABILITY');
  REC.record(29959, [
    { step: '2 in the scope picker tap the small line (' + (rowInfo || {}).h + 'h)', seen: JSON.stringify(rowInfo) },
    { step: '1 the shift is created straight away, the spread step does NOT appear', seen: 'spread dialog present=' + open2.spread + '; dialogs open=' + open2.n + '; board added=' + d3.added.length },
    { step: '2 the shift sits on the dropped day only', seen: JSON.stringify(newBlk) },
  ], 'see RUNNABILITY');

  // ================= C29964 : Schedule whole work order ========================
  const s3 = await cardBox(page, 'multi');
  const c3 = await cellAt(page, 0.72, 300);
  await dragTo(page, s3, c3);
  const pk3 = await page.evaluate(PICKOPEN);
  const wholeText = await page.evaluate(`(() => {
    const w=document.querySelector('[data-test-id=line_picker_whole_work_order]');
    if(!w) return null; const t=(w.innerText||'').replace(/\\s+/g,' ').trim(); w.click(); return t; })()`);
  await page.waitForTimeout(7000);
  const open3 = await page.evaluate(PICKOPEN);
  const toast3 = await page.evaluate(TOAST);
  const b4 = await board();
  const d4 = diff(b3, b4);
  const blocks3 = await page.evaluate(`(() => {
    const vis = e => { const r=e.getBoundingClientRect(); return r.width>0&&r.height>0&&getComputedStyle(e).display!=='none'; };
    return [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
      .map(e=>(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,160)); })()`);
  await page.screenshot({ path: `${OUT}/drag3-whole.png` }).catch(() => { });
  fs.writeFileSync(`${OUT}/drag3-29964.json`, JSON.stringify({ src: s3, tgt: c3, picker: pk3, whole: wholeText, after: open3, toast: toast3, board: d4, blocks: blocks3.slice(0, 12) }, null, 1));
  REC.record(29964, [
    { step: '1 drag the work order onto a technician cell', seen: s3.text + ' -> picker=' + pk3.picker },
    { step: "2 choose 'Schedule whole work order'", seen: wholeText },
    { step: '1 ONE shift is created covering all the approved lines', seen: 'board added=' + d4.added.length + ' ' + JSON.stringify(d4.added_detail.map(a => ({ wo: a.wo, lines: a.lines.length, mins: a.durationMinutes, series: a.seriesId }))) + '; dialogs still open=' + open3.n + ' spread=' + open3.spread },
    { step: "2 the block's last text line reads 'N Lines'", seen: JSON.stringify(blocks3.slice(0, 4)) },
  ], 'see RUNNABILITY');

  await esc(page, 2);
  await h.browser.close();
  const bF = await board();
  const dF = diff(t0, bF);
  fs.writeFileSync(`${OUT}/drag3-board.json`, JSON.stringify(dF, null, 1));
  console.log('\nWHOLE RUN board', dF.shifts_before, '->', dF.shifts_after, 'added', dF.added.length, 'removed', dF.removed.length, 'changed', dF.changed.length);
  console.log('added detail:', JSON.stringify(dF.added_detail.map(a => ({ id: a.id.slice(0, 8), wo: a.wo, lines: a.lines.length, mins: a.durationMinutes }))));
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
