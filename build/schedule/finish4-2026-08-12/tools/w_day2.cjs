// finish4 probe E - the follow-ups probe D could not settle.
// C30005 (resize handles - HOVER first), C30073 (rename a colour label),
// C30031/C30615 (capacity), C30068 (Enter in dialogs).
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, ev, pops, esc, setView } = require('./walkbase.cjs');
const fs = require('fs');
const R = mkRecorder(`${OUT}/walk_day.json`);
const F = {}; const save = () => fs.writeFileSync(`${OUT}/day2-findings.json`, JSON.stringify(F, null, 1));

(async () => {
  const h = await makeHarness('day2'); const page = h.page;
  const nonget = [];
  page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url())) nonget.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
  const shot = async n => { try { await page.screenshot({ path: `${OUT}/day2-${n}.png` }); } catch (e) { } };
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(13000);

  // ============ C30005 : resize handles.  HOVER FIRST - an absence read without
  // hovering is our harness, not the build (the case is about dragging an EDGE). ============
  await setView(page, 'Day'); await page.waitForTimeout(3000);
  const blk = await ev(page, ({ v }) => { const vis = eval(v);
    const e = [...document.querySelectorAll('[data-shift-id]')].filter(vis)[0]; if (!e) return null;
    const r = e.getBoundingClientRect();
    return { id: e.getAttribute('data-shift-id'), x: Math.round(r.x), y: Math.round(r.y + r.height / 2), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.x + r.width) }; });
  F.block = blk;
  if (blk) {
    const read = async (label, mx, my) => {
      await page.mouse.move(mx, my); await page.waitForTimeout(900);
      return { label, at: { x: mx, y: my },
        cursor_at_point: await ev(page, ({ x, y }) => { const e = document.elementFromPoint(x, y); return e ? { tag: e.tagName, cls: (e.className || '').toString().slice(0, 70), tid: e.getAttribute('data-test-id'), cursor: getComputedStyle(e).cursor } : null; }, { x: mx, y: my }),
        handles: await ev(page, ({ id, v }) => { const vis = eval(v);
          const b = document.querySelector(`[data-shift-id="${id}"]`); if (!b) return null;
          return [...b.querySelectorAll('*')].map(k => ({ cls: (k.className || '').toString().slice(0, 60), tid: k.getAttribute('data-test-id'), cursor: getComputedStyle(k).cursor, vis: vis(k), op: getComputedStyle(k).opacity }))
            .filter(o => /resize|handle|grip/i.test(o.cls + (o.tid || '')) || /resize|col-resize|ew-resize/.test(o.cursor)); }, { id: blk.id }) };
    };
    F.hover_centre = await read('centre', blk.x + Math.round(blk.w / 2), blk.y);
    F.hover_right_edge = await read('right edge', blk.right - 2, blk.y);
    F.hover_left_edge = await read('left edge', blk.x + 2, blk.y);
    await shot('hover'); save();
  }
  R.record(30005, [
    { step: "precondition: a shift on a technician's day-view timeline", seen: `day view; block ${JSON.stringify(blk)}` },
    { step: '1 drag the shift\'s RIGHT edge further right', seen: `hovered the right edge first, because a handle that only appears on hover would read as absent otherwise: ${JSON.stringify(F.hover_right_edge)}` },
    { step: '2 drag the shift\'s LEFT edge', seen: JSON.stringify(F.hover_left_edge) },
    { step: '  control: the block centre', seen: JSON.stringify(F.hover_centre) },
  ], 'see RUNNABILITY');
  await setView(page, 'Week'); await page.waitForTimeout(2500);

  // ============ C30073 : rename a colour label ============
  const sid = await ev(page, ({ v }) => { const vis = eval(v);
    const e = [...document.querySelectorAll('[data-shift-id]')].filter(vis)[0]; return e ? e.getAttribute('data-shift-id') : null; });
  await page.evaluate(async id => { const e = document.querySelector(`[data-shift-id="${id}"]`);
    e.scrollIntoViewIfNeeded && e.scrollIntoViewIfNeeded(); await new Promise(r => setTimeout(r, 600)); (e.querySelector('*') || e).click(); }, sid);
  await page.waitForTimeout(2400);
  await ev(page, () => { const b = document.querySelector('[data-test-id="button_shift_detail_color"]'); if (b) b.click(); });
  await page.waitForTimeout(1500);
  F.picker_controls = await ev(page, ({ v }) => { const vis = eval(v);
    const m = [...document.querySelectorAll('.q-menu,.q-dialog,[role="menu"]')].filter(vis).pop(); if (!m) return null;
    return [...m.querySelectorAll('[data-test-id]')].filter(vis).map(e => ({ tid: e.getAttribute('data-test-id'), t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 30) })); });
  save();
  const renameOpened = await ev(page, ({ v }) => { const vis = eval(v);
    const b = [...document.querySelectorAll('[data-test-id^="button_color_label_rename_"]')].filter(vis)[0];
    if (!b) return null; const tid = b.getAttribute('data-test-id'); b.click(); return tid; });
  await page.waitForTimeout(1500);
  F.rename_control = renameOpened;
  F.after_rename_click = await ev(page, ({ v }) => { const vis = eval(v);
    const m = [...document.querySelectorAll('.q-menu,.q-dialog,[role="menu"]')].filter(vis).pop(); if (!m) return null;
    return { inputs: [...m.querySelectorAll('input,textarea,[contenteditable]')].filter(vis).map(e => ({ tid: e.getAttribute('data-test-id'), type: e.type, value: e.value })),
             text: (m.innerText || '').replace(/\s+/g, ' ').slice(0, 240) }; });
  await shot('rename'); save();
  R.record(30073, [
    { step: "precondition: a shift's colour picker is open", seen: `opened from button_shift_detail_color; controls: ${JSON.stringify(F.picker_controls).slice(0, 400)}` },
    { step: '1 find the editable label of one colour in the picker', seen: `a per-colour rename control exists: ${renameOpened}` },
    { step: '2 rename it', seen: `after clicking it: ${JSON.stringify(F.after_rename_click).slice(0, 400)}` },
    { step: '  NOTE', seen: 'the rename was NOT saved - this pass verifies the route is runnable, it does not change a shop-wide label' },
  ], 'see RUNNABILITY');
  await esc(page, 4);

  // ============ C30031 / C30615 : capacity ============
  F.capacity_all = await ev(page, ({ v }) => { const vis = eval(v);
    return [...document.querySelectorAll('[class*="capacity"]')].filter(vis).map(e => {
      const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
      return { cls: (e.className || '').toString(), t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 40), w: Math.round(r.width), bg: cs.backgroundColor, title: e.getAttribute('title') || e.getAttribute('aria-label') }; }); });
  F.capacity_modifiers = [...new Set((F.capacity_all || []).map(c => c.cls))];
  await shot('cap'); save();
  R.record(30031, [
    { step: 'precondition: Capacity Bars are ON, and one day is booked BEYOND the team\'s available hours', seen: `capacity elements render on the board: ${JSON.stringify(F.capacity_modifiers).slice(0, 500)}` },
    { step: "1 look at that day's capacity bar", seen: JSON.stringify((F.capacity_all || []).slice(0, 8)).slice(0, 700) },
  ], 'see RUNNABILITY');

  // ============ C30068 : Enter confirms the active dialog ============
  await page.evaluate(async id => { const e = document.querySelector(`[data-shift-id="${id}"]`);
    e.scrollIntoViewIfNeeded && e.scrollIntoViewIfNeeded(); await new Promise(r => setTimeout(r, 600)); (e.querySelector('*') || e).click(); }, sid);
  await page.waitForTimeout(2200);
  F.note_editor = await ev(page, ({ v }) => { const vis = eval(v);
    const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop(); if (!d) return null;
    const add = [...d.querySelectorAll('button,.q-btn,[data-test-id]')].filter(vis).find(e => /add note/i.test(e.innerText || '') || /note/i.test(e.getAttribute('data-test-id') || ''));
    if (add) add.click();
    return { control: add ? { tid: add.getAttribute('data-test-id'), t: (add.innerText || '').trim() } : null }; });
  await page.waitForTimeout(1500);
  F.note_fields = await ev(page, ({ v }) => { const vis = eval(v);
    const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop(); if (!d) return null;
    return [...d.querySelectorAll('textarea,input,[contenteditable]')].filter(vis).map(e => ({ tag: e.tagName, tid: e.getAttribute('data-test-id') })); });
  await shot('note'); save();
  R.record(30068, [
    { step: 'precondition: shifts/series and events exist to exercise the dialogs', seen: 'they do - series delete-scope, reassign confirm and the event modal were all reached live this pass' },
    { step: '5 open a shift\'s detail modal, click into the note editor', seen: `note control: ${JSON.stringify(F.note_editor)}; editable fields then present: ${JSON.stringify(F.note_fields)}` },
    { step: '1-4 the four dialogs Enter must confirm', seen: 'all four reached this pass: the SPREAD step (finish3), the REASSIGN confirm ("Move this shift to Lisa Stewart on Wed, Aug 12?"), the EVENT modal, and the series DELETE-SCOPE prompt' },
  ], 'see RUNNABILITY');
  await esc(page, 4);

  fs.writeFileSync(`${OUT}/day2-nonget.json`, JSON.stringify(nonget, null, 1));
  console.log('NON-GET:', JSON.stringify(nonget));
  save(); await h.browser.close();
})();
