// finish4 probe D - day view, events, colour, capacity, keyboard.
// C30017 C30005 C30018 C30072 C30073 C30031 C30615 C30068
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, ev, pops, esc, setView, clickText } = require('./walkbase.cjs');
const fs = require('fs');
const R = mkRecorder(`${OUT}/walk_day.json`);
const F = {}; const save = () => fs.writeFileSync(`${OUT}/day-findings.json`, JSON.stringify(F, null, 1));

(async () => {
  const h = await makeHarness('day'); const page = h.page;
  const nonget = [];
  page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url())) nonget.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
  const shot = async n => { try { await page.screenshot({ path: `${OUT}/day-${n}.png` }); } catch (e) { } };
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(13000);

  // ============ C30072 / C30073 : the colour picker inside a shift's detail modal ============
  const anyShift = await ev(page, ({ v }) => { const vis = eval(v);
    const e = [...document.querySelectorAll('[data-shift-id]')].filter(vis)[0];
    return e ? e.getAttribute('data-shift-id') : null; });
  F.colour_shift = anyShift;
  if (anyShift) {
    await page.evaluate(async id => { const e = document.querySelector(`[data-shift-id="${id}"]`);
      e.scrollIntoViewIfNeeded && e.scrollIntoViewIfNeeded(); await new Promise(r => setTimeout(r, 600)); (e.querySelector('*') || e).click(); }, anyShift);
    await page.waitForTimeout(2400);
    F.colour_modal = await pops(page);
    // the colour control - the modal text ends "... blue expand_more Notes"
    const opened = await ev(page, ({ v }) => { const vis = eval(v);
      const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop(); if (!d) return null;
      const cands = [...d.querySelectorAll('[data-test-id],button,.q-btn,.q-select')].filter(vis)
        .filter(e => /colo(u)?r/i.test(e.getAttribute('data-test-id') || '') || /^(blue|grey|gray|green|amber|red|purple)\b/i.test((e.innerText || '').trim()));
      if (!cands.length) return { found: false, ids: [...d.querySelectorAll('[data-test-id]')].filter(vis).map(e => e.getAttribute('data-test-id')).slice(0, 40) };
      const b = cands[0]; b.click();
      return { found: true, tid: b.getAttribute('data-test-id'), t: (b.innerText || '').replace(/\s+/g, ' ').slice(0, 40) }; });
    await page.waitForTimeout(1600);
    F.colour_control = opened;
    F.colour_picker = await pops(page);
    F.colour_swatches = await ev(page, ({ v }) => { const vis = eval(v);
      const m = [...document.querySelectorAll('.q-menu,.q-dialog,[role="menu"]')].filter(vis).pop(); if (!m) return null;
      return [...m.querySelectorAll('[data-test-id],input,button,.q-item,label')].filter(vis)
        .map(e => ({ tag: e.tagName, tid: e.getAttribute('data-test-id'), t: (e.innerText || e.value || '').replace(/\s+/g, ' ').slice(0, 40), editable: e.tagName === 'INPUT' || e.isContentEditable })).slice(0, 40); });
    await shot('colour'); save();
    R.record(30072, [
      { step: 'precondition: a shift detail modal is open', seen: `shift ${String(anyShift).slice(0, 8)}; modal read live` },
      { step: '1 open the colour picker in the modal', seen: JSON.stringify(F.colour_control) },
      { step: '2 the picker offers non-default colours', seen: JSON.stringify(F.colour_swatches).slice(0, 600) },
    ], 'see RUNNABILITY');
    R.record(30073, [
      { step: "precondition: a shift's colour picker is open", seen: JSON.stringify(F.colour_control) },
      { step: '1 find the editable label of one colour in the picker', seen: JSON.stringify((F.colour_swatches || []).filter(o => o.editable)) || 'none editable' },
    ], 'see RUNNABILITY');
    await esc(page, 3);
  }

  // ============ DAY VIEW : C30017, C30005 ============
  const toDay = await setView(page, 'Day');
  F.day_view_switch = toDay;
  await page.waitForTimeout(3000); await shot('dayview'); save();
  F.day_body = await ev(page, () => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 700));

  // C30017 - left-click empty timeline space -> menu with Create Event
  const cell = await ev(page, ({ v }) => { const vis = eval(v);
    const cal = document.querySelector('[data-test-id=schedule_calendar]'); if (!cal) return null;
    const r = cal.getBoundingClientRect();
    return { x: Math.round(r.x + r.width * 0.55), y: Math.round(Math.min(r.y + 260, window.innerHeight - 200)) }; });
  F.day_cell = cell;
  if (cell) {
    await page.mouse.click(cell.x, cell.y); await page.waitForTimeout(1800);
    F.day_menu = await pops(page); await shot('daymenu'); save();
    const ce = await clickText(page, 'Create Event');
    await page.waitForTimeout(2200);
    F.event_modal = await pops(page);
    F.event_fields = await ev(page, ({ v }) => { const vis = eval(v);
      const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop(); if (!d) return null;
      return [...d.querySelectorAll('[data-test-id]')].filter(vis).map(e => ({ tid: e.getAttribute('data-test-id'), tag: e.tagName, t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 34) })); });
    await shot('eventmodal'); save();
    R.record(30017, [
      { step: 'precondition: the Schedule page in DAY view', seen: `Day toggle clicked = ${toDay}; page reads: ${String(F.day_body).slice(0, 220)}` },
      { step: "1 left-click an empty spot on a technician's timeline and choose Create Event", seen: `menu: ${JSON.stringify(F.day_menu).slice(0, 260)} ; Create Event clicked = ${ce}` },
      { step: '2 while creating, watch the block and try dragging to size it', seen: `event modal opened: ${JSON.stringify(F.event_modal).slice(0, 300)}` },
    ], 'see RUNNABILITY');
    R.record(30018, [
      { step: 'precondition: the event modal is open (left-click empty grid space, then Create Event)', seen: `reached: ${JSON.stringify(F.event_modal).slice(0, 260)}` },
      { step: '1 read the fields the modal offers', seen: JSON.stringify(F.event_fields) },
    ], 'see RUNNABILITY');
    await esc(page, 3);
  }

  // C30005 - a shift's resize handles in day view
  F.day_shifts = await ev(page, ({ v }) => { const vis = eval(v);
    return [...document.querySelectorAll('[data-shift-id]')].filter(vis).slice(0, 6).map(e => {
      const r = e.getBoundingClientRect();
      const handles = [...e.querySelectorAll('*')].filter(vis).filter(k => /resize|handle|grip/i.test((k.className || '').toString() + (k.getAttribute('data-test-id') || '')))
        .map(k => ({ cls: (k.className || '').toString().slice(0, 50), tid: k.getAttribute('data-test-id') }));
      const cs = getComputedStyle(e);
      return { id: e.getAttribute('data-shift-id'), x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), cursor: cs.cursor, handles }; }); });
  save();
  R.record(30005, [
    { step: 'precondition: a shift exists on a technician\'s day-view timeline', seen: `day view shows ${(F.day_shifts || []).length} shift blocks: ${JSON.stringify(F.day_shifts).slice(0, 400)}` },
    { step: "1-2 drag the shift's RIGHT edge, then its LEFT edge", seen: `resize handles found on those blocks: ${JSON.stringify((F.day_shifts || []).map(s => s.handles))}` },
  ], 'see RUNNABILITY');

  // ============ C30031 / C30615 : capacity bars ============
  await setView(page, 'Week'); await page.waitForTimeout(2500);
  const viewOpts = await ev(page, ({ v }) => { const vis = eval(v);
    const b = [...document.querySelectorAll('button,.q-btn')].filter(vis).find(e => /view options/i.test(e.innerText || '')); if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(1500);
  F.view_options = await pops(page); await shot('viewopts'); save();
  await esc(page, 2);
  F.capacity = await ev(page, ({ v }) => { const vis = eval(v);
    return [...document.querySelectorAll('[class*="capacity"]')].filter(vis).slice(0, 10).map(e => {
      const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
      return { cls: (e.className || '').toString().slice(0, 60), t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 50),
               w: Math.round(r.width), bg: cs.backgroundColor }; }); });
  save();
  R.record(30031, [
    { step: 'precondition: Capacity Bars are ON', seen: `View options menu reads: ${JSON.stringify(F.view_options).slice(0, 300)}` },
    { step: "1 look at that day's capacity bar", seen: JSON.stringify(F.capacity).slice(0, 600) },
  ], 'see RUNNABILITY');

  fs.writeFileSync(`${OUT}/day-nonget.json`, JSON.stringify(nonget, null, 1));
  console.log('NON-GET:', JSON.stringify(nonget));
  save(); await h.browser.close();
})();
