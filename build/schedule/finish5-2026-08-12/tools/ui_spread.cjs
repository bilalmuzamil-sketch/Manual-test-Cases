// ui_spread.cjs — the UI half of C38863 (the long-series warning) and C29986
// (the 'Full estimate' option on a spread onto a SECOND technician).
//
// SAFE TO PRESS CREATE, and that was established BEFORE pressing rather than discovered by
// pressing: the API refuses a >56-day spread with HTTP 409 and creates nothing unless
// acknowledgeLongSeries is sent, so the worst case here is an error message.
// (build/schedule/finish5-2026-08-12/evidence/c38863-c38865.json)
//
// No destructive control is pressed anywhere in this probe.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const vis = `(e)=>{const r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return false;
  const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01;}`;

function SNAP() {
  const vis = e => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01; };
  const q = id => { const e = document.querySelector('[data-test-id=' + id + ']'); return e && vis(e) ? (e.innerText || '').replace(/\s+/g, ' ').trim() : null; };
  const body = document.querySelector('[data-test-id=schedule_spread_body]');
  return {
    scope: q('text_spread_scope'), option: q('select_spread_option'),
    summary: q('text_spread_summary'), cadence: q('text_spread_cadence'),
    confirm: q('button_spread_confirm'), cancel: q('button_spread_cancel'),
    body: body ? (body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 600) : null,
    dialogIds: [...document.querySelectorAll('.q-dialog [data-test-id]')].filter(vis).map(e => e.getAttribute('data-test-id')),
    dialogText: [...document.querySelectorAll('.q-dialog')].filter(vis)
      .map(d => (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 700))
  };
}

async function pickOption(page, label) {
  await page.evaluate(() => { const e = document.querySelector('[data-test-id=select_spread_option]'); if (e) e.click(); });
  await page.waitForTimeout(1800);
  const r = await page.evaluate((label) => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const m = [...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis);
    const s = m[m.length - 1]; if (!s) return { ok: false, opts: [] };
    const items = [...s.querySelectorAll('.q-item,[role=option]')].filter(vis);
    const opts = items.map(e => (e.innerText || '').replace(/\s+/g, ' ').trim());
    const it = items.find(e => (e.innerText || '').replace(/\s+/g, ' ').indexOf(label) !== -1);
    if (!it) return { ok: false, opts }; it.click(); return { ok: true, opts };
  }, label);
  await page.waitForTimeout(2600);
  return r;
}

(async () => {
  const h = await makeHarness('ui_spread');
  const page = h.page;
  const out = { case_ids: ['C38863', 'C29986'], read_at: new Date().toISOString(), build: 'v3.5-65d6500', steps: {} };

  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(15000);

  // --- reach the spread step by dragging the largest sidebar job onto the grid ---
  const src = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const best = cs.map(c => { const m = (c.innerText || '').match(/([\d.]+)h Est/); return { c, h: m ? parseFloat(m[1]) : 0 }; })
      .sort((a, b) => b.h - a.h)[0];
    if (!best) return null;
    best.c.scrollIntoView({ block: 'center' });
    const r = best.c.getBoundingClientRect();
    return { hours: best.h, text: (best.c.innerText || '').replace(/\s+/g, ' ').slice(0, 80),
             x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  out.source_card = src;
  console.log('source card:', JSON.stringify(src));

  const tgt = await page.evaluate(() => {
    const cal = document.querySelector('[data-test-id=schedule_calendar]'); const r = cal.getBoundingClientRect();
    return { x: Math.round(r.x + r.width * 0.4), y: Math.round(Math.min(r.y + 300, window.innerHeight - 180)) };
  });
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 20; i++) { await page.mouse.move(src.x + (tgt.x - src.x) * i / 20, src.y + (tgt.y - src.y) * i / 20); await page.waitForTimeout(55); }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
  await page.evaluate(() => { const w = document.querySelector('[data-test-id=line_picker_whole_work_order]'); if (w) w.click(); });
  await page.waitForTimeout(6500);

  // --- C29986 / C29979 : the how-much selector and its options ---
  const base = await page.evaluate(SNAP);
  out.steps.spread_step_reached = base;
  console.log('OPTION :', base.option);
  console.log('SUMMARY:', base.summary, '| CADENCE:', base.cadence, '| CONFIRM:', base.confirm);

  const opened = await pickOption(page, 'Until a date');
  out.steps.option_list = opened.opts;
  console.log('OPTIONS:', JSON.stringify(opened.opts));

  // --- C38863 : push the finish-by date past 8 weeks ---
  // The finish-by control advances a day per chevron_right press.  56 days is the limit,
  // so it is driven well past that.
  const advance = await page.evaluate(async () => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const body = document.querySelector('[data-test-id=schedule_spread_body]');
    if (!body) return { err: 'no spread body' };
    const btns = [...body.querySelectorAll('button,[role=button],.q-btn')].filter(vis);
    const right = btns.find(b => (b.innerText || '').indexOf('chevron_right') !== -1);
    if (!right) return { err: 'no chevron_right', sawButtons: btns.map(b => (b.innerText || '').replace(/\s+/g, ' ').slice(0, 30)) };
    for (let i = 0; i < 85; i++) { right.click(); await new Promise(r => setTimeout(r, 45)); }
    return { clicked: 85 };
  });
  out.steps.date_advance = advance;
  await page.waitForTimeout(4000);
  const pushed = await page.evaluate(SNAP);
  out.steps.after_pushing_the_date = pushed;
  console.log('AFTER PUSH -> summary:', pushed.summary, '| cadence:', pushed.cadence, '| confirm:', pushed.confirm);

  // --- press Create and read whatever the build raises ---
  const before = h.apiLog.filter(a => a.m !== 'GET').length;
  await page.evaluate(() => { const b = document.querySelector('[data-test-id=button_spread_confirm]'); if (b) b.click(); });
  await page.waitForTimeout(7000);
  const warned = await page.evaluate(SNAP);
  out.steps.after_pressing_create = warned;
  out.steps.non_get_calls_during_create = h.apiLog.filter(a => a.m !== 'GET').slice(before);
  console.log('AFTER CREATE -> dialogText:', JSON.stringify(warned.dialogText).slice(0, 900));
  console.log('non-GET during create:', JSON.stringify(out.steps.non_get_calls_during_create));

  await page.screenshot({ path: `${OUT}/ui_spread_warning.png` }).catch(() => {});
  out.api_4xx = h.apiLog.filter(a => a.s >= 400);
  out.bridge_errors = h.bridgeErrors.length;
  out.all_non_get = h.apiLog.filter(a => a.m !== 'GET');
  fs.writeFileSync(`${OUT}/ui_spread.json`, JSON.stringify(out, null, 1));
  console.log('API 4xx/5xx:', JSON.stringify(out.api_4xx));
  console.log('ALL non-GET:', JSON.stringify(out.all_non_get));
  await h.browser.close();
})();
