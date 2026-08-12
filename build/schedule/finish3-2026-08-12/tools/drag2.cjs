// drag2.cjs — walk the SCOPE PICKER cases against a real drag.
//   C29956 picker opens, anchored to the dropped cell, offers the three things
//   C29963 picker contents: pinned whole-order row + line rows
//   C29967 'Select multiple' mode: tally, Select all, Cancel
// Nothing is confirmed here: the picker is closed with Escape, and the board is
// diffed by id afterwards to prove it.  Delete is never touched.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');
const REC = mkRecorder(`${OUT}/walk_drag.json`);

const VIS = `e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
  const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; }`;

const PICKER = `(() => {
  const vis = ${VIS};
  const open = [...document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu')].filter(vis);
  const s = open.find(e => e.querySelector('[data-test-id=line_picker_list],[data-test-id=line_picker_whole_work_order]')) || open[open.length-1];
  if(!s) return {open:0};
  const r = s.getBoundingClientRect();
  const q = id => { const e = s.querySelector('[data-test-id='+id+']'); return e ? (e.innerText||'').replace(/\\s+/g,' ').trim() : null; };
  const rows = [...s.querySelectorAll('[data-test-id^=line_picker_line_]')].map(e => ({
     id: e.getAttribute('data-test-id'),
     text: (e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,120),
     cb: e.querySelectorAll('input[type=checkbox],.q-checkbox').length,
     avatars: e.querySelectorAll('[class*=avatar],.q-avatar').length }));
  const whole = s.querySelector('[data-test-id=line_picker_whole_work_order]');
  const wr = whole ? whole.getBoundingClientRect() : null;
  const firstRow = s.querySelector('[data-test-id^=line_picker_line_]');
  const fr = firstRow ? firstRow.getBoundingClientRect() : null;
  return { open: open.length,
    box: {x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height)},
    dropped_on: q('text_line_picker_dropped_on'), title: q('text_line_picker_title'),
    whole_text: q('line_picker_whole_work_order'),
    whole_box: wr ? {x:Math.round(wr.x),y:Math.round(wr.y)} : null,
    first_row_box: fr ? {x:Math.round(fr.x),y:Math.round(fr.y)} : null,
    whole_style: whole ? (()=>{const c=getComputedStyle(whole);return {bg:c.backgroundColor,border:c.border,weight:c.fontWeight};})() : null,
    row_style: firstRow ? (()=>{const c=getComputedStyle(firstRow);return {bg:c.backgroundColor,border:c.border,weight:c.fontWeight};})() : null,
    multi_select: q('button_line_picker_multi_select'),
    scope_all: q('button_line_picker_scope_all'), scope_unsched: q('button_line_picker_scope_unscheduled'),
    rows, row_count: rows.length,
    checkboxes: s.querySelectorAll('input[type=checkbox],.q-checkbox').length,
    ids: [...s.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')),
    buttons: [...s.querySelectorAll('button,.q-btn')].filter(vis).map(e=>(e.innerText||'').replace(/\\s+/g,' ').trim()).filter(Boolean),
    text: (s.innerText||'').replace(/\\s+/g,' ').slice(0,1500) };
})()`;

async function dropMulti(page, frac) {
  const src = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const p = cs.find(c => { const m = (c.innerText || '').match(/(\d+)\s+lines?/); return m && +m[1] >= 3 && +m[1] < 10; });
    if (!p) return { ok: false };
    p.scrollIntoView({ block: 'center' });
    const r = p.getBoundingClientRect();
    return { ok: true, text: (p.innerText || '').replace(/\s+/g, ' ').slice(0, 70), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const tgt = await page.evaluate((frac) => {
    const cal = document.querySelector('[data-test-id=schedule_calendar]');
    const r = cal.getBoundingClientRect();
    return { ok: true, x: Math.round(r.x + r.width * frac), y: Math.round(Math.min(r.y + 260, window.innerHeight - 180)) };
  }, frac);
  if (!src.ok) return { src, tgt, ok: false };
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 20; i++) {
    await page.mouse.move(src.x + (tgt.x - src.x) * i / 20, src.y + (tgt.y - src.y) * i / 20);
    await page.waitForTimeout(55);
  }
  await page.waitForTimeout(800); await page.mouse.up(); await page.waitForTimeout(6000);
  return { src, tgt, ok: true };
}

(async () => {
  const before = await board();
  const h = await makeHarness('drag2');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  const wk = await setView(page, 'Week');

  const d = await dropMulti(page, 0.45);
  const p1 = await page.evaluate(PICKER);
  await page.screenshot({ path: `${OUT}/drag2-picker.png` }).catch(() => { });
  fs.writeFileSync(`${OUT}/drag2-picker.json`, JSON.stringify({ week_view: wk, drop: d, picker: p1 }, null, 1));

  // ---- C29956 ----
  const anchored = p1.box && d.tgt &&
    Math.abs(p1.box.x - d.tgt.x) < 700 && Math.abs(p1.box.y - d.tgt.y) < 700;
  REC.record(29956, [
    { step: 'week view', seen: wk },
    { step: 'drag multi-line card from sidebar', seen: d.src.text },
    { step: 'drop on technician cell at ' + JSON.stringify(d.tgt), seen: 'picker open=' + p1.open },
    { step: '1 picker opens, anchored to the dropped cell', seen: 'picker box ' + JSON.stringify(p1.box) + ' ; dropped-on label: ' + p1.dropped_on + ' ; near drop point: ' + anchored },
    { step: "2 offers 'Schedule whole work order' / line rows / 'Select multiple'", seen: JSON.stringify([p1.whole_text, p1.row_count + ' line rows', p1.multi_select]) },
    { step: '3 no shift created until a scope is chosen', seen: 'checked by board diff at end of run' },
  ], 'pending-board-diff');

  // ---- C29963 ----
  REC.record(29963, [
    { step: '2 read the top option', seen: p1.whole_text },
    { step: '1 pinned at top, visually distinct', seen: 'whole at y=' + (p1.whole_box || {}).y + ' vs first line row y=' + (p1.first_row_box || {}).y + ' ; whole style ' + JSON.stringify(p1.whole_style) + ' vs row style ' + JSON.stringify(p1.row_style) },
    { step: '2 labelled with line count and total hours', seen: p1.whole_text },
    { step: '3 anchored to the dropped cell', seen: p1.dropped_on },
    { step: '4 each line row shows title and estimated hours', seen: JSON.stringify(p1.rows.slice(0, 3)) },
    { step: '5 rows with technicians show an avatar stack plus count', seen: JSON.stringify(p1.rows.map(r => ({ t: r.text.slice(0, 45), av: r.avatars }))) },
  ], 'see RUNNABILITY');

  // ---- C29967 : Select multiple ----
  const clicked = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id=button_line_picker_multi_select]');
    if (!b) return false; b.click(); return true;
  });
  await page.waitForTimeout(1800);
  const p2 = await page.evaluate(PICKER);
  // tick two rows
  const ticked = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-test-id^=line_picker_line_]')];
    let n = 0;
    for (const r of rows.slice(0, 2)) { r.click(); n++; }
    return n;
  });
  await page.waitForTimeout(1800);
  const p3 = await page.evaluate(PICKER);
  const bar = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const open = [...document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu')].filter(vis);
    const s = open[open.length - 1]; if (!s) return null;
    return {
      buttons: [...s.querySelectorAll('button,.q-btn')].filter(vis).map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean),
      tail: (s.innerText || '').replace(/\s+/g, ' ').slice(-260),
      has_select_all: /select all/i.test(s.innerText || ''),
      has_cancel: /\bcancel\b/i.test(s.innerText || ''),
    };
  });
  fs.writeFileSync(`${OUT}/drag2-multiselect.json`, JSON.stringify({ clicked, p2_after_click: p2, ticked, p3_after_tick: p3, bar }, null, 1));
  await page.screenshot({ path: `${OUT}/drag2-multiselect.png` }).catch(() => { });

  REC.record(29967, [
    { step: "2 click 'Select multiple'", seen: 'clicked=' + clicked + ' ; checkboxes in picker before=' + p1.checkboxes + ' after=' + p2.checkboxes },
    { step: '1 rows become tick boxes, one per line', seen: 'rows=' + p2.row_count + ' checkbox-bearing rows=' + p2.rows.filter(r => r.cb > 0).length },
    { step: '3 tick two lines and read the confirm bar', seen: 'ticked=' + ticked + ' ; bar tail: ' + (bar || {}).tail },
    { step: "4 'Select all' shortcut present?", seen: 'has_select_all=' + (bar || {}).has_select_all + ' ; buttons=' + JSON.stringify((bar || {}).buttons) },
    { step: "5 'Cancel' control present?", seen: 'has_cancel=' + (bar || {}).has_cancel },
  ], 'see RUNNABILITY');

  await esc(page, 3);
  await page.waitForTimeout(2500);
  await h.browser.close();

  const after = await board();
  const dd = diff(before, after);
  fs.writeFileSync(`${OUT}/drag2-board.json`, JSON.stringify(dd, null, 1));
  console.log('\nBOARD shifts', dd.shifts_before, '->', dd.shifts_after,
    '| added', dd.added.length, 'removed', dd.removed.length, 'changed', dd.changed.length);
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
  console.log('bridge errors:', h.bridgeErrors.length);
})();
