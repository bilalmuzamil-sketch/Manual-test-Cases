// probe_spread_opts.cjs — the 'How much to schedule' selector's options, and a
// dedicated hunt for the START DATE control (C29982).
//
// Spec §4.5 lists Start date as its OWN bullet, separate from the selector, so
// before recording it absent this opens the selector and tries every option -
// including the two the spec says reveal an extra control ('Until a date...',
// 'Specific hours...') - because a field that only appears under a custom
// option would otherwise read as missing.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { READ_OVERLAY } = require('./lib.cjs');
const fs = require('fs');
const LAST = `(() => { const o=Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
  .filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0); return o[o.length-1]; })()`;
// look across the WHOLE document, not just the last overlay: a date popup may
// mount as its own layer
const DATEHUNT = `(() => {
  const inputs = Array.from(document.querySelectorAll('input')).map(e=>({
    tid:e.getAttribute('data-test-id'), type:e.type, name:e.name,
    ph:e.placeholder, val:(e.value||'').slice(0,40),
    aria:e.getAttribute('aria-label'), vis:e.getBoundingClientRect().width>0 }));
  const tids = Array.from(document.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id'))
    .filter(t=>/date|start|calendar|day|picker/i.test(t));
  const dateish = Array.from(document.querySelectorAll('div,span,label,button'))
    .filter(e=>e.children.length===0 && /start date|starts on|start:/i.test(e.innerText||''))
    .map(e=>({t:(e.innerText||'').trim().slice(0,60), tid:e.getAttribute('data-test-id')}));
  return { inputs: inputs.filter(i=>i.vis), date_tids: tids, dateish };
})()`;

(async () => {
  const h = await makeHarness('spreadopts'); const page = h.page; const rec = {};
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(5000);
  const src = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-test-id=sidebar_work_order_card]'));
    let best = null, n = 1;
    for (const c of cards) { const m = (c.innerText || '').match(/(\d+)\s+lines/); if (m && +m[1] > n) { n = +m[1]; best = c; } }
    if (!best) return { ok: false }; best.scrollIntoView({ block: 'center' });
    const r = best.getBoundingClientRect(); return { ok: true, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const tgt = await page.evaluate(() => {
    const vh = innerHeight, vw = innerWidth;
    const cells = Array.from(document.querySelectorAll('.q-calendar-agenda__day,[class*=day-column],td'))
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 60 && r.height > 25 && r.x > 320 && r.x + r.width < vw && r.y > 250 && r.y + Math.min(30, r.height) < vh - 20; });
    const c = cells[Math.floor(cells.length / 2)]; if (!c) return { ok: false };
    const r = c.getBoundingClientRect(); return { ok: true, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + Math.min(30, r.height / 2)) };
  });
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 25; i++) { await page.mouse.move(src.x + (tgt.x - src.x) * i / 25, src.y + (tgt.y - src.y) * i / 25); await page.waitForTimeout(60); }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
  await page.evaluate(() => { const e = document.querySelector('[data-test-id=line_picker_whole_work_order]'); if (e) e.click(); });
  await page.waitForTimeout(6000);

  rec.date_at_default = await page.evaluate(DATEHUNT);

  // open the selector
  await page.evaluate(() => { const e = document.querySelector('[data-test-id=select_spread_option]'); if (e) { e.scrollIntoView({ block: 'center' }); e.click(); } });
  await page.waitForTimeout(2500);
  rec.options = await page.evaluate(`(() => { const m=Array.from(document.querySelectorAll('.q-menu'))
     .filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0); const s=m[m.length-1];
     if(!s) return {found:false};
     return { found:true, items: Array.from(s.querySelectorAll('.q-item,[role=option],li')).map(e=>{
       const cs=getComputedStyle(e); const raw=(e.innerText||'').trim();
       return { raw, transform:cs.textTransform, tid:e.getAttribute('data-test-id') }; }) }; })()`);
  await page.screenshot({ path: `${OUT}/spreadopts-01-options.png` }).catch(() => {});

  // try each option that the spec says reveals a control
  rec.per_option = [];
  const wanted = (rec.options.items || []).map(i => i.raw);
  for (const label of wanted) {
    const picked = await page.evaluate(({ l }) => {
      const m = Array.from(document.querySelectorAll('.q-menu')).filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0);
      const s = m[m.length - 1]; if (!s) return { ok: false, why: 'menu closed' };
      const it = Array.from(s.querySelectorAll('.q-item,[role=option],li')).find(e => (e.innerText || '').trim() === l);
      if (!it) return { ok: false, why: 'no item' }; it.click(); return { ok: true };
    }, { l: label });
    await page.waitForTimeout(3000);
    const after = { option: label, picked, dates: await page.evaluate(DATEHUNT), overlay: await page.evaluate(READ_OVERLAY) };
    rec.per_option.push(after);
    await page.screenshot({ path: `${OUT}/spreadopts-opt-${label.replace(/[^a-z0-9]+/gi, '_').slice(0, 30)}.png` }).catch(() => {});
    // reopen for the next one
    await page.evaluate(() => { const e = document.querySelector('[data-test-id=select_spread_option]'); if (e) e.click(); });
    await page.waitForTimeout(2000);
  }
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(1200);
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(2000);
  fs.writeFileSync(`${OUT}/spreadopts.json`, JSON.stringify({ ...rec, api_writes: h.apiLog.filter(a => a.m !== 'GET'), bridge_errors: h.bridgeErrors, read_at_utc: new Date().toISOString() }, null, 1));
  await h.browser.close();
  console.log('DATE HUNT at default:', JSON.stringify(rec.date_at_default, null, 1));
  console.log('\nOPTIONS:', JSON.stringify(rec.options, null, 1));
  for (const p of rec.per_option) {
    console.log('\n--- after picking ' + JSON.stringify(p.option) + ' (picked=' + JSON.stringify(p.picked) + ')');
    console.log('   date tids:', JSON.stringify(p.dates.date_tids), ' inputs:', JSON.stringify(p.dates.inputs).slice(0, 400));
    const seen = new Set(); const t = [];
    (p.overlay.nodes || []).forEach(n => { if (!seen.has(n.shown)) { seen.add(n.shown); t.push(n.shown); } });
    console.log('   overlay text:', JSON.stringify(t).slice(0, 700));
  }
  console.log('\nWRITES:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
