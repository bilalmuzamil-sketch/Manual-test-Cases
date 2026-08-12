// spread3.cjs — press the two controls the previous run only READ.
//   C29980 expected 2 : does the Finish-by control respond?  SV-9005 is open saying
//                       it may not.  Rule 61 outcome 3 applies if it now does.
//   C29981 expected 2 : does the hours stepper change the preview?
// Nothing is confirmed.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');
const REC = mkRecorder(`${OUT}/walk_spread.json`);

function READ() {
  const q = id => { const e = document.querySelector('[data-test-id=' + id + ']'); return e ? (e.innerText || '').replace(/\s+/g, ' ').trim() : null; };
  return { option: q('select_spread_option'), until: q('text_spread_until_date'),
    hours: q('text_spread_specific_hours'), summary: q('text_spread_summary'), cadence: q('text_spread_cadence') };
}
async function press(page, id, n) {
  for (let i = 0; i < n; i++) {
    await page.evaluate((id) => { const b = document.querySelector('[data-test-id=' + id + ']'); if (b) b.click(); }, id);
    await page.waitForTimeout(1400);
  }
}
async function pickOption(page, label) {
  await page.evaluate(() => { const e = document.querySelector('[data-test-id=select_spread_option]'); if (e) e.click(); });
  await page.waitForTimeout(1800);
  const ok = await page.evaluate((label) => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const m = [...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis);
    const s = m[m.length - 1]; if (!s) return false;
    const it = [...s.querySelectorAll('.q-item,[role=option]')].filter(vis).find(e => (e.innerText || '').indexOf(label) !== -1);
    if (!it) return false; it.click(); return true;
  }, label);
  await page.waitForTimeout(2600);
  return ok;
}

(async () => {
  const t0 = await board();
  const h = await makeHarness('spread3');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');
  const src = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const best = cs.map(c => { const m = (c.innerText || '').match(/([\d.]+)h Est/); return { c, h: m ? parseFloat(m[1]) : 0 }; }).sort((a, b) => b.h - a.h)[0];
    best.c.scrollIntoView({ block: 'center' }); const r = best.c.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const tgt = await page.evaluate(() => { const r = document.querySelector('[data-test-id=schedule_calendar]').getBoundingClientRect();
    return { x: Math.round(r.x + r.width * 0.4), y: Math.round(Math.min(r.y + 300, window.innerHeight - 180)) }; });
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 20; i++) { await page.mouse.move(src.x + (tgt.x - src.x) * i / 20, src.y + (tgt.y - src.y) * i / 20); await page.waitForTimeout(55); }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
  await page.evaluate(() => { const w = document.querySelector('[data-test-id=line_picker_whole_work_order]'); if (w) w.click(); });
  await page.waitForTimeout(6500);

  const out = {};
  // ---------- C29980 : Finish by ----------
  await pickOption(page, 'Until a date');
  const u0 = await page.evaluate(READ);
  await press(page, 'button_spread_until_date_next', 5);
  const u1 = await page.evaluate(READ);
  await press(page, 'button_spread_until_date_next', 5);
  const u2 = await page.evaluate(READ);
  await press(page, 'button_spread_until_date_prev', 3);
  const u3 = await page.evaluate(READ);
  out.until = { u0, u1, u2, u3 };
  await page.screenshot({ path: `${OUT}/spread3-until.png` }).catch(() => { });
  const dateMoved = u0.until !== u1.until;
  const prevMoved = u2.until !== u3.until;
  const previewMoved = u0.summary !== u1.summary || u0.cadence !== u1.cadence;
  REC.record(29980, [
    { step: "1 choose 'Until a date…'", seen: 'selector reads ' + u0.option + '; a single Finish-by control is revealed: button_spread_until_date_prev / text_spread_until_date / button_spread_until_date_next, reading "' + u0.until + '"' },
    { step: '2 press the forward arrow 5 times, then 5 more, then back 3', seen: 'date: ' + u0.until + ' -> ' + u1.until + ' -> ' + u2.until + ' -> ' + u3.until },
    { step: '2 does the date respond?', seen: 'forward moved it: ' + dateMoved + ' ; back moved it: ' + prevMoved },
    { step: '2 does the preview follow the date?', seen: 'summary ' + u0.summary + ' -> ' + u1.summary + ' -> ' + u2.summary + ' ; cadence ' + u0.cadence + ' -> ' + u1.cadence + ' -> ' + u2.cadence },
    { step: 'SV-9005 outcome (Standing Rule 61)', seen: (dateMoved && previewMoved) ? 'IT RESPONDS - so SV-9005 no longer reproduces on this build. Outcome 3: tell the QA lead.' : 'it does NOT respond - SV-9005 still reproduces. Outcome 1: mark FAILED, raise nothing new.' },
  ], 'see RUNNABILITY');

  // ---------- C29981 : hours stepper ----------
  await pickOption(page, 'Specific hours');
  const h0 = await page.evaluate(READ);
  await press(page, 'button_spread_specific_hours_increment', 7);
  const h1 = await page.evaluate(READ);
  await press(page, 'button_spread_specific_hours_decrement', 2);
  const h2 = await page.evaluate(READ);
  out.hours = { h0, h1, h2 };
  await page.screenshot({ path: `${OUT}/spread3-hours.png` }).catch(() => { });
  REC.record(29981, [
    { step: "1 choose 'Specific hours…'", seen: 'an hours stepper is revealed - "Hours  −  ' + h0.hours + '  +" (button_spread_specific_hours_decrement / text_spread_specific_hours / button_spread_specific_hours_increment)' },
    { step: '2 press + seven times, then − twice', seen: 'hours: ' + h0.hours + ' -> ' + h1.hours + ' -> ' + h2.hours },
    { step: '2 the preview updates to spread exactly the entered hours', seen: 'summary ' + h0.summary + ' -> ' + h1.summary + ' -> ' + h2.summary + ' ; cadence ' + h0.cadence + ' -> ' + h1.cadence + ' -> ' + h2.cadence },
  ], 'see RUNNABILITY');

  await esc(page, 3);
  await h.browser.close();
  fs.writeFileSync(`${OUT}/spread3.json`, JSON.stringify(out, null, 1));
  const bF = await board(); const dF = diff(t0, bF);
  console.log('\nRUN board', dF.shifts_before, '->', dF.shifts_after, 'added', dF.added.length);
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
