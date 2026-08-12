// spread2.cjs — the rest of the spread step, using the test ids spread.cjs found:
//   select_spread_option · button_spread_toggle_preview · text_spread_summary
//   text_spread_cadence · button_spread_confirm · button_spread_cancel
//   C29979 presets apply at once, preview updates
//   C29980 'Until a date...' -> a single finish-by field   (SV-9005 is open against it)
//   C29981 'Specific hours...' -> an hours stepper
//   C29984 preview expands to a week-by-week breakdown
//   C29982 start date defaults to the earliest working day and can be changed
//   C38863 past 8 weeks asks to confirm; a series can never exceed 120 shifts
// Nothing is confirmed: button_spread_confirm is never pressed.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');
const REC = mkRecorder(`${OUT}/walk_spread.json`);

function SNAP() {
  const vis = e => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01; };
  const q = id => { const e = document.querySelector('[data-test-id=' + id + ']'); return e && vis(e) ? (e.innerText || '').replace(/\s+/g, ' ').trim() : null; };
  const body = document.querySelector('[data-test-id=schedule_spread_body]');
  return {
    scope: q('text_spread_scope'), option: q('select_spread_option'),
    summary: q('text_spread_summary'), cadence: q('text_spread_cadence'),
    confirm: q('button_spread_confirm'), cancel: q('button_spread_cancel'),
    body: body ? (body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 700) : null,
    fields: body ? [...body.querySelectorAll('input,.q-field,[data-test-id]')].filter(vis).map(e => ({
      tid: e.getAttribute('data-test-id'), tag: e.tagName, type: e.getAttribute('type'),
      val: e.value !== undefined ? String(e.value).slice(0, 40) : null,
      t: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60)
    })) : [],
    ids: [...document.querySelectorAll('.q-dialog [data-test-id]')].filter(vis).map(e => e.getAttribute('data-test-id')),
  };
}

async function pickOption(page, label) {
  await page.evaluate(() => { const e = document.querySelector('[data-test-id=select_spread_option]'); if (e) e.click(); });
  await page.waitForTimeout(1800);
  const ok = await page.evaluate((label) => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const m = [...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis);
    const s = m[m.length - 1]; if (!s) return false;
    const it = [...s.querySelectorAll('.q-item,[role=option]')].filter(vis)
      .find(e => (e.innerText || '').replace(/\s+/g, ' ').indexOf(label) !== -1);
    if (!it) return false; it.click(); return true;
  }, label);
  await page.waitForTimeout(2600);
  return ok;
}

(async () => {
  const t0 = await board();
  const h = await makeHarness('spread2');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');

  const src = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const best = cs.map(c => { const m = (c.innerText || '').match(/([\d.]+)h Est/); return { c, h: m ? parseFloat(m[1]) : 0 }; })
      .sort((a, b) => b.h - a.h)[0];
    best.c.scrollIntoView({ block: 'center' });
    const r = best.c.getBoundingClientRect();
    return { hours: best.h, text: (best.c.innerText || '').replace(/\s+/g, ' ').slice(0, 70), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const tgt = await page.evaluate(() => {
    const cal = document.querySelector('[data-test-id=schedule_calendar]'); const r = cal.getBoundingClientRect();
    return { x: Math.round(r.x + r.width * 0.4), y: Math.round(Math.min(r.y + 300, window.innerHeight - 180)) };
  });
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 20; i++) { await page.mouse.move(src.x + (tgt.x - src.x) * i / 20, src.y + (tgt.y - src.y) * i / 20); await page.waitForTimeout(55); }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
  await page.evaluate(() => { const w = document.querySelector('[data-test-id=line_picker_whole_work_order]'); if (w) w.click(); });
  await page.waitForTimeout(6500);

  const base = await page.evaluate(SNAP);
  console.log('BASE option:', base.option, '| summary:', base.summary, '| cadence:', base.cadence, '| confirm:', base.confirm);
  const out = { src, base, steps: {} };

  // ---- C29984 : expand the preview -----------------------------------------
  const toggled = await page.evaluate(() => { const b = document.querySelector('[data-test-id=button_spread_toggle_preview]'); if (!b) return false; b.click(); return true; });
  await page.waitForTimeout(2200);
  const expanded = await page.evaluate(SNAP);
  await page.screenshot({ path: `${OUT}/spread2-expanded.png` }).catch(() => { });
  out.steps.expanded = { toggled, expanded };
  REC.record(29984, [
    { step: '1 read the preview summary', seen: base.summary + ' | cadence: ' + base.cadence },
    { step: '2 expand it', seen: 'button_spread_toggle_preview clicked=' + toggled },
    { step: '2 a week-by-week breakdown appears', seen: 'body BEFORE: ' + (base.body || '').slice(0, 220) + '  ||  body AFTER: ' + (expanded.body || '').slice(0, 500) },
  ], 'see RUNNABILITY');
  // collapse again
  await page.evaluate(() => { const b = document.querySelector('[data-test-id=button_spread_toggle_preview]'); if (b) b.click(); });
  await page.waitForTimeout(1500);

  // ---- C29979 : presets apply at once --------------------------------------
  const presets = {};
  for (const label of ['1 week', '2 weeks', 'Full estimate']) {
    const ok = await pickOption(page, label);
    const s = await page.evaluate(SNAP);
    presets[label] = { picked: ok, option: s.option, summary: s.summary, cadence: s.cadence, extraFields: s.fields.filter(f => f.tag === 'INPUT').map(f => f.tid || f.type) };
  }
  out.steps.presets = presets;
  REC.record(29979, [
    { step: "1 the selector defaults to 'Full estimate'", seen: base.option },
    { step: '2 the options include Full estimate / 1 week / 2 weeks / Until a date… / Specific hours…', seen: 'read in the previous run: ["Full estimate (76h 36m)","1 week","2 weeks","Until a date…","Specific hours…"]' },
    { step: '3 Full estimate, 1 week and 2 weeks apply on selection with no extra fields', seen: JSON.stringify(presets) },
    { step: '4 the preview summary updates to match each selection', seen: Object.entries(presets).map(([k, v]) => k + ' -> ' + v.summary).join('  |  ') },
  ], 'see RUNNABILITY');

  // ---- C29980 : Until a date… ----------------------------------------------
  const okDate = await pickOption(page, 'Until a date');
  const sDate = await page.evaluate(SNAP);
  await page.screenshot({ path: `${OUT}/spread2-untildate.png` }).catch(() => { });
  out.steps.untilDate = { okDate, sDate };
  REC.record(29980, [
    { step: "1 open the how-much selector and choose 'Until a date…'", seen: 'picked=' + okDate + ' ; selector now reads: ' + sDate.option },
    { step: '1 a single Finish by date field is revealed (and it is the only custom control)', seen: 'fields inside the spread body: ' + JSON.stringify(sDate.fields) + ' ; body: ' + (sDate.body || '').slice(0, 320) },
    { step: '2 picking a date updates the preview (SV-9005 is open against this half)', seen: 'summary: ' + sDate.summary + ' ; cadence: ' + sDate.cadence },
  ], 'see RUNNABILITY');

  // ---- C29981 : Specific hours… --------------------------------------------
  const okHrs = await pickOption(page, 'Specific hours');
  const sHrs = await page.evaluate(SNAP);
  await page.screenshot({ path: `${OUT}/spread2-hours.png` }).catch(() => { });
  // try the stepper
  const stepped = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const body = document.querySelector('[data-test-id=schedule_spread_body]'); if (!body) return null;
    const inp = [...body.querySelectorAll('input')].filter(vis)[0];
    const btns = [...body.querySelectorAll('button,.q-btn')].filter(vis).map(e => (e.innerText || '').trim());
    return { input: inp ? { type: inp.getAttribute('type'), val: inp.value, tid: inp.getAttribute('data-test-id') } : null, buttons: btns };
  });
  out.steps.specificHours = { okHrs, sHrs, stepped };
  REC.record(29981, [
    { step: "1 choose 'Specific hours…'", seen: 'picked=' + okHrs + ' ; selector now reads: ' + sHrs.option },
    { step: '1 an hours stepper control is revealed', seen: JSON.stringify(stepped) + ' ; body: ' + (sHrs.body || '').slice(0, 300) },
    { step: '2 the preview updates to spread exactly the entered hours', seen: 'summary: ' + sHrs.summary + ' ; cadence: ' + sHrs.cadence },
  ], 'see RUNNABILITY');

  // ---- C29982 : start date --------------------------------------------------
  await pickOption(page, 'Full estimate');
  const sStart = await page.evaluate(SNAP);
  out.steps.start = sStart;
  REC.record(29982, [
    { step: '1 read the start date the spread proposes', seen: 'summary: ' + sStart.summary + ' ; cadence: ' + sStart.cadence },
    { step: '2 is a start-date control offered on the spread step?', seen: 'controls inside the spread body: ' + JSON.stringify(sStart.fields.map(f => f.tid || f.tag)) + ' ; all dialog test ids: ' + JSON.stringify(sStart.ids) },
  ], 'see RUNNABILITY');

  // ---- C38863 : the 8-week / 120-shift guards ------------------------------
  // read them WITHOUT confirming: the summary states the shift count and span.
  out.steps.guards = { note: 'observed from the summary only; button_spread_confirm was never pressed' };
  REC.record(38863, [
    { step: '1 build a spread long enough to cross 8 weeks', seen: 'the largest work order on this branch is ' + src.hours + 'h, which spreads to ' + sStart.summary + ' - it does not reach 8 weeks, so the confirm prompt cannot be provoked from the interface with the data present' },
    { step: '2 a series can never exceed 120 shifts', seen: 'the server limits were established by the 12 August pass at the API: a series over 56 days returns 409 unless acknowledgeLongSeries is set, and over 120 shifts returns 422 which the acknowledgement does NOT override' },
  ], 'partial - needs a work order large enough, or the API');

  await esc(page, 3);
  await h.browser.close();
  fs.writeFileSync(`${OUT}/spread2.json`, JSON.stringify(out, null, 1));
  const bF = await board();
  const dF = diff(t0, bF);
  console.log('\nRUN board', dF.shifts_before, '->', dF.shifts_after, 'added', dF.added.length, 'removed', dF.removed.length);
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
