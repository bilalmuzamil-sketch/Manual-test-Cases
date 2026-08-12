// ui_final.cjs — closes the last two UI gaps.
//
//  C38863 step 3 — "confirm/acknowledge it and continue".  The warning was read by
//                  ui_spread.cjs; this presses "Create N shifts anyway" so the step is
//                  driven as written rather than only proved at API level.
//  C30615        — the capacity bar and the TOOLBAR CONFLICT PILL, on the day that now
//                  carries both a shift and a 2-hour event (Brittany Rodriguez, 7 Sep).
//
// No destructive control is pressed.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

function SNAP() {
  const vis = e => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01; };
  const q = id => { const e = document.querySelector('[data-test-id=' + id + ']'); return e && vis(e) ? (e.innerText || '').replace(/\s+/g, ' ').trim() : null; };
  return { option: q('select_spread_option'), summary: q('text_spread_summary'),
    confirm: q('button_spread_confirm'),
    dialogText: [...document.querySelectorAll('.q-dialog')].filter(vis)
      .map(d => (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 600)) };
}

(async () => {
  const h = await makeHarness('ui_final');
  const page = h.page;
  const out = { case_ids: ['C38863', 'C30615'], read_at: new Date().toISOString(), build: 'v3.5-65d6500' };

  // ================= C38863 step 3 : press the acknowledgement =================
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(15000);
  const src = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const best = cs.map(c => { const m = (c.innerText || '').match(/([\d.]+)h Est/); return { c, h: m ? parseFloat(m[1]) : 0 }; })
      .sort((a, b) => b.h - a.h)[0];
    best.c.scrollIntoView({ block: 'center' });
    const r = best.c.getBoundingClientRect();
    return { text: (best.c.innerText || '').replace(/\s+/g, ' ').slice(0, 70), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
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

  await page.evaluate(() => { const e = document.querySelector('[data-test-id=select_spread_option]'); if (e) e.click(); });
  await page.waitForTimeout(1800);
  await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const m = [...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis); const s = m[m.length - 1];
    const it = [...s.querySelectorAll('.q-item,[role=option]')].filter(vis).find(e => (e.innerText || '').indexOf('Until a date') !== -1);
    if (it) it.click();
  });
  await page.waitForTimeout(2600);
  await page.evaluate(async () => {
    const body = document.querySelector('[data-test-id=schedule_spread_body]');
    const right = [...body.querySelectorAll('button,.q-btn')].find(b => (b.innerText || '').indexOf('chevron_right') !== -1);
    for (let i = 0; i < 85; i++) { right.click(); await new Promise(r => setTimeout(r, 45)); }
  });
  await page.waitForTimeout(4000);

  const n0 = h.apiLog.filter(a => a.m !== 'GET').length;
  await page.evaluate(() => { const b = document.querySelector('[data-test-id=button_spread_confirm]'); if (b) b.click(); });
  await page.waitForTimeout(6000);
  const warn = await page.evaluate(SNAP);
  out.warning_dialog = warn.dialogText;
  console.log('WARNING:', JSON.stringify(warn.dialogText).slice(0, 500));

  // press the "…anyway" acknowledgement
  const pressed = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const bs = [...document.querySelectorAll('.q-dialog button,.q-dialog .q-btn')].filter(vis);
    const b = bs.find(x => /anyway/i.test(x.innerText || ''));
    if (!b) return { ok: false, saw: bs.map(x => (x.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40)) };
    b.click(); return { ok: true, label: (b.innerText || '').replace(/\s+/g, ' ').trim() };
  });
  out.acknowledgement_button = pressed;
  console.log('PRESSED:', JSON.stringify(pressed));
  await page.waitForTimeout(9000);
  const after = await page.evaluate(SNAP);
  out.after_acknowledging = { dialogText: after.dialogText,
    body: await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 400)) };
  out.non_get_during_c38863 = h.apiLog.filter(a => a.m !== 'GET').slice(n0);
  console.log('AFTER ACK non-GET:', JSON.stringify(out.non_get_during_c38863));
  await page.screenshot({ path: `${OUT}/ui_final_ack.png` }).catch(() => {});

  // ================= C30615 : capacity bar + toolbar conflict pill =============
  await page.goto(APP + '/schedule?date=2026-09-07&view=week', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  const cap = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
      const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01; };
    const bars = [...document.querySelectorAll('.capacity-bar,[class*=capacity]')].filter(vis).slice(0, 12)
      .map(e => ({ cls: e.className, title: e.getAttribute('title'), text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90) }));
    const pill = [...document.querySelectorAll('[data-test-id]')].filter(vis)
      .filter(e => /conflict/i.test(e.getAttribute('data-test-id') || ''))
      .map(e => ({ tid: e.getAttribute('data-test-id'), text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80) }));
    const anyConflictText = [...document.querySelectorAll('*')].filter(vis)
      .filter(e => e.children.length === 0 && /conflict/i.test(e.innerText || ''))
      .slice(0, 6).map(e => (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80));
    const evBlocks = [...document.querySelectorAll('[data-test-id=schedule_event_block],[class*=event]')].filter(vis).slice(0, 6)
      .map(e => ({ tid: e.getAttribute('data-test-id'), text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70) }));
    return { capacity_bars: bars, conflict_pill_test_ids: pill, conflict_words_on_screen: anyConflictText, event_blocks: evBlocks };
  });
  out.c30615_ui = cap;
  console.log('CAPACITY BARS:', JSON.stringify(cap.capacity_bars).slice(0, 700));
  console.log('CONFLICT PILL:', JSON.stringify(cap.conflict_pill_test_ids));
  console.log('CONFLICT WORDS:', JSON.stringify(cap.conflict_words_on_screen));
  await page.screenshot({ path: `${OUT}/ui_final_capacity.png` }).catch(() => {});

  out.bridge_errors = h.bridgeErrors.length;
  out.all_non_get = h.apiLog.filter(a => a.m !== 'GET');
  fs.writeFileSync(`${OUT}/ui_final.json`, JSON.stringify(out, null, 1));
  console.log('ALL non-GET:', JSON.stringify(out.all_non_get));
  await h.browser.close();
})();
