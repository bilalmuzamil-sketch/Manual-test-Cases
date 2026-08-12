// probe_untildate.cjs — C29980 item 2: does picking a finish-by date change the
// preview?  SV-9005 says both custom controls are dead, but ticket status is
// never evidence about the build (Standing Rule 61), so this observes it.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const LAST = `(() => { const o=Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
  .filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0); return o[o.length-1]; })()`;
const STATE = `(() => { const s=${LAST}; if(!s) return null;
  const g=t=>{const e=s.querySelector('[data-test-id='+t+']'); return e?(e.innerText||'').replace(/\\s+/g,' ').trim():null;};
  return { until_date: g('text_spread_until_date'), summary: g('text_spread_summary'),
           cadence: g('text_spread_cadence'),
           confirm: (()=>{const e=s.querySelector('[data-test-id=button_spread_confirm]'); return e?(e.innerText||'').trim():null;})() }; })()`;
(async () => {
  const h = await makeHarness('untildate'); const page = h.page; const rec = { steps: [] };
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(20000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(9000);
  const src = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-test-id=sidebar_work_order_card]'));
    let best = null, n = 1;
    for (const c of cards) { const m = (c.innerText || '').match(/(\d+)\s+lines/); if (m && +m[1] > n) { n = +m[1]; best = c; } }
    if (!best) return { ok: false }; best.scrollIntoView({ block: 'center' });
    const r = best.getBoundingClientRect(); return { ok: true, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const tgt = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll('.q-calendar-agenda__day,[class*=day-column],td'))
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 60 && r.height > 25 && r.x > 320 && r.x + r.width < innerWidth && r.y > 250 && r.y + 30 < innerHeight - 20; });
    const c = cells[Math.floor(cells.length / 2)];
    if (!c) return { ok: false, cells: cells.length };
    const r = c.getBoundingClientRect();
    return { ok: true, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + Math.min(30, r.height / 2)) };
  });
  if (!src.ok || !tgt.ok) { console.log('NO TARGET', JSON.stringify(src), JSON.stringify(tgt)); await h.browser.close(); return; }
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 25; i++) { await page.mouse.move(src.x + (tgt.x - src.x) * i / 25, src.y + (tgt.y - src.y) * i / 25); await page.waitForTimeout(60); }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
  await page.evaluate(() => { const e = document.querySelector('[data-test-id=line_picker_whole_work_order]'); if (e) e.click(); });
  await page.waitForTimeout(6000);
  await page.evaluate(() => { const e = document.querySelector('[data-test-id=select_spread_option]'); if (e) e.click(); });
  await page.waitForTimeout(2200);
  await page.evaluate(() => { const e = document.querySelector('[data-test-id=option_spread_option_until_date]'); if (e) e.click(); });
  await page.waitForTimeout(3500);
  rec.steps.push({ step: 'until-a-date chosen', state: await page.evaluate(STATE) });
  await page.screenshot({ path: `${OUT}/untildate-01.png` }).catch(() => {});

  // press the NEXT arrow three times and read after each
  for (let i = 1; i <= 3; i++) {
    rec.steps.push({ step: `next arrow x${i} - click`, clicked: await page.evaluate(`(() => {
       const e=document.querySelector('[data-test-id=button_spread_until_date_next]');
       if(!e) return {ok:false,why:'no next arrow'};
       const dis = e.disabled || e.getAttribute('aria-disabled')==='true' || /disabled/.test(e.className);
       e.scrollIntoView({block:'center'}); e.click(); return {ok:true, was_disabled:dis}; })()`) });
    await page.waitForTimeout(2600);
    rec.steps.push({ step: `after next x${i}`, state: await page.evaluate(STATE) });
  }
  await page.screenshot({ path: `${OUT}/untildate-02-after-arrows.png` }).catch(() => {});
  // and clicking the date text itself
  rec.click_date = await page.evaluate(`(() => { const e=document.querySelector('[data-test-id=text_spread_until_date]');
     if(!e) return {ok:false}; e.click(); return {ok:true}; })()`);
  await page.waitForTimeout(2600);
  rec.steps.push({ step: 'after clicking the date itself', state: await page.evaluate(STATE) });
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(1200);
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(2000);
  await h.browser.close();
  fs.writeFileSync(`${OUT}/untildate.json`, JSON.stringify({ ...rec, api_writes: h.apiLog.filter(a => a.m !== 'GET'), read_at_utc: new Date().toISOString() }, null, 1));
  rec.steps.forEach(s => console.log(s.step, '->', JSON.stringify(s.state || s.clicked)));
  console.log('click_date:', JSON.stringify(rec.click_date));
  console.log('WRITES:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
