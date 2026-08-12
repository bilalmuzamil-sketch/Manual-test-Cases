// spread.cjs — reach the MULTI-DAY SPREAD step through a real drag and walk it.
//   C29958 a scope over the technician's day opens the spread step
//   C29978 header shows the scope; 'Change scope' returns to the picker
//   C29979 how-much selector defaults to Full estimate; presets apply at once
//   C29980 'Until a date...' reveals a single finish-by date field
//   C29981 'Specific hours...' reveals an hours stepper
//   C29982 start date defaults to the earliest working day and can be changed
//   C29984 preview: one-line summary, expandable to a week-by-week breakdown
//   C38863 spread past 8 weeks asks to confirm; a series can never exceed 120 shifts
// The spread is NEVER confirmed - the run ends on Escape and the board is diffed
// by id to prove nothing was created.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');
const REC = mkRecorder(`${OUT}/walk_spread.json`);

function MODAL() {
  const vis = e => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01; };
  const open = [...document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu')].filter(vis);
  const s = open[open.length - 1];
  if (!s) return { open: 0 };
  return {
    open: open.length,
    ids: [...s.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')),
    buttons: [...s.querySelectorAll('button,.q-btn')].filter(vis).map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean),
    inputs: [...s.querySelectorAll('input,select,.q-field')].filter(vis).map(e => ({
      tid: e.getAttribute('data-test-id'), type: e.getAttribute('type'),
      val: e.value !== undefined ? String(e.value).slice(0, 40) : null,
      txt: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60)
    })),
    text: (s.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 1400),
    isPicker: !!s.querySelector('[data-test-id=line_picker_list],[data-test-id=line_picker_whole_work_order]'),
  };
}

(async () => {
  const t0 = await board();
  const h = await makeHarness('spread');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');

  // a work order far bigger than one working day
  const src = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const best = cs.map(c => { const m = (c.innerText || '').match(/([\d.]+)h Est/); return { c, h: m ? parseFloat(m[1]) : 0 }; })
      .sort((a, b) => b.h - a.h)[0];
    if (!best || best.h < 12) return { ok: false, best: best && best.h };
    best.c.scrollIntoView({ block: 'center' });
    const r = best.c.getBoundingClientRect();
    return { ok: true, hours: best.h, text: (best.c.innerText || '').replace(/\s+/g, ' ').slice(0, 80), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const tgt = await page.evaluate(() => {
    const cal = document.querySelector('[data-test-id=schedule_calendar]');
    const r = cal.getBoundingClientRect();
    return { x: Math.round(r.x + r.width * 0.4), y: Math.round(Math.min(r.y + 300, window.innerHeight - 180)) };
  });
  console.log('SRC:', JSON.stringify(src));
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 20; i++) { await page.mouse.move(src.x + (tgt.x - src.x) * i / 20, src.y + (tgt.y - src.y) * i / 20); await page.waitForTimeout(55); }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);

  const step1 = await page.evaluate(MODAL);
  // choose the whole work order = the large scope
  const chose = await page.evaluate(() => {
    const w = document.querySelector('[data-test-id=line_picker_whole_work_order]');
    if (!w) return null; const t = (w.innerText || '').replace(/\s+/g, ' ').trim(); w.click(); return t;
  });
  await page.waitForTimeout(6500);
  const step2 = await page.evaluate(MODAL);
  await page.screenshot({ path: `${OUT}/spread-step2.png` }).catch(() => { });
  const bAfterOpen = await board();
  const dOpen = diff(t0, bAfterOpen);
  fs.writeFileSync(`${OUT}/spread-step2.json`, JSON.stringify({ src, tgt, step1, chose, step2, board_while_open: dOpen }, null, 1));
  console.log('STEP2 ids:', JSON.stringify(step2.ids || []).slice(0, 400));
  console.log('STEP2 buttons:', JSON.stringify(step2.buttons || []));
  console.log('STEP2 text:', (step2.text || '').slice(0, 900));

  const reached = !!step2.open && !step2.isPicker;
  REC.record(29958, [
    { step: '1 drag a work order far bigger than one working day onto a technician cell', seen: src.text + ' (' + src.hours + 'h estimated)' },
    { step: '2 choose the large scope', seen: chose },
    { step: '1 the spread step opens as step 2 of the same modal', seen: 'dialog open=' + step2.open + ' still the picker=' + step2.isPicker + ' ; text: ' + (step2.text || '').slice(0, 320) },
    { step: "2 header shows the chosen scope and a 'Change scope' back-link", seen: JSON.stringify(step2.buttons) },
    { step: '3 no shifts exist yet until the spread is confirmed', seen: 'board while the spread step is open: ' + dOpen.shifts_before + ' -> ' + dOpen.shifts_after + ', added ' + dOpen.added.length },
  ], reached ? 'see RUNNABILITY' : 'spread step NOT reached');

  if (reached) {
    // ---- C29979 : the how-much selector -------------------------------------
    const sel = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
      const open = [...document.querySelectorAll('.q-dialog__inner,[role=dialog]')].filter(vis);
      const s = open[open.length - 1]; if (!s) return null;
      const f = [...s.querySelectorAll('.q-field,.q-select,select,[data-test-id*=amount],[data-test-id*=how],[data-test-id*=preset]')].filter(vis)
        .map(e => ({ tid: e.getAttribute('data-test-id'), t: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70) }));
      return f;
    });
    const openedSel = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
      const open = [...document.querySelectorAll('.q-dialog__inner,[role=dialog]')].filter(vis);
      const s = open[open.length - 1]; if (!s) return false;
      const f = [...s.querySelectorAll('.q-select,.q-field')].filter(vis)
        .find(e => /full estimate|estimate|week|hours/i.test(e.innerText || ''));
      if (!f) return false; f.click(); return true;
    });
    await page.waitForTimeout(2200);
    const opts = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
      const m = [...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis);
      const s = m[m.length - 1]; if (!s) return null;
      return [...s.querySelectorAll('.q-item,[role=option],div')].filter(vis)
        .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i).slice(0, 14);
    });
    await page.screenshot({ path: `${OUT}/spread-options.png` }).catch(() => { });
    fs.writeFileSync(`${OUT}/spread-options.json`, JSON.stringify({ sel, openedSel, opts, step2_inputs: step2.inputs }, null, 1));
    REC.record(29979, [
      { step: "1 read the 'how much to schedule' selector's default value", seen: JSON.stringify(sel) },
      { step: '2 open the selector and read its options', seen: openedSel ? JSON.stringify(opts) : 'no selector field matched inside the spread modal; fields present were ' + JSON.stringify(step2.inputs) },
      { step: '3-4 presets apply on selection with no extra fields', seen: 'not driven this run - depends on the option list above' },
    ], 'see RUNNABILITY');
    await esc(page, 1);

    // ---- C29984 / C29982 : preview + start date ------------------------------
    const prev = await page.evaluate(MODAL);
    REC.record(29984, [
      { step: '1 read the preview on the spread step', seen: (prev.text || '').slice(0, 500) },
      { step: '2 is it a one-line summary that expands to a week-by-week breakdown?', seen: 'buttons/expanders present: ' + JSON.stringify(prev.buttons) + ' ; ids: ' + JSON.stringify(prev.ids) },
    ], 'see RUNNABILITY');
    REC.record(29982, [
      { step: '1 read the start date on the spread step', seen: JSON.stringify(prev.inputs) },
      { step: '2 is it the earliest working day, and can it be changed?', seen: (prev.text || '').slice(0, 400) },
    ], 'see RUNNABILITY');

    // ---- C29978 : 'Change scope' --------------------------------------------
    const back = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
      const open = [...document.querySelectorAll('.q-dialog__inner,[role=dialog]')].filter(vis);
      const s = open[open.length - 1]; if (!s) return { ok: false };
      const b = [...s.querySelectorAll('button,.q-btn,a,span,div')].filter(vis)
        .filter(e => /change scope/i.test((e.innerText || '').trim()))
        .sort((a, b2) => (a.innerText || '').length - (b2.innerText || '').length)[0];
      if (!b) return { ok: false, buttons: [...s.querySelectorAll('button,.q-btn')].filter(vis).map(e => (e.innerText || '').trim()) };
      b.click(); return { ok: true, label: (b.innerText || '').trim() };
    });
    await page.waitForTimeout(3500);
    const backTo = await page.evaluate(MODAL);
    const bBack = await board();
    const dBack = diff(t0, bBack);
    fs.writeFileSync(`${OUT}/spread-changescope.json`, JSON.stringify({ back, backTo, board: dBack }, null, 1));
    REC.record(29978, [
      { step: '1-2 reach the spread step and read its header', seen: (step2.text || '').slice(0, 300) },
      { step: "3 a 'Change scope' back-link is present and clicking it returns to the scope picker", seen: back.ok ? "clicked '" + back.label + "' -> back on the picker=" + backTo.isPicker + ' (dialog open=' + backTo.open + ')' : "NO 'Change scope' control found. Buttons on the spread step were: " + JSON.stringify(back.buttons) },
      { step: '4 without creating anything', seen: 'board ' + dBack.shifts_before + ' -> ' + dBack.shifts_after + ', added ' + dBack.added.length },
    ], 'see RUNNABILITY');
  }

  await esc(page, 3);
  await h.browser.close();
  const bF = await board();
  const dF = diff(t0, bF);
  fs.writeFileSync(`${OUT}/spread-board.json`, JSON.stringify(dF, null, 1));
  console.log('\nRUN board', dF.shifts_before, '->', dF.shifts_after, 'added', dF.added.length, 'removed', dF.removed.length);
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
