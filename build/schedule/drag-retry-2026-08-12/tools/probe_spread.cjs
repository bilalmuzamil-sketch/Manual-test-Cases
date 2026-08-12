// probe_spread.cjs — reach step 2 of the modal, the multi-day spread (§4.5),
// by choosing 'Schedule whole work order' on a scope far larger than one day.
//
// C29982 (start date default + adjustable), C29984 (preview collapsed then
// expanded), and the 'Change scope' back-link all live here.
//
// READ-ONLY BY DEFAULT.  Set COMMIT=1 in the environment to press the final
// confirm (C29985) - that is a real write and is done in its own run so the
// board can be diffed around it.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { READ_OVERLAY } = require('./lib.cjs');
const fs = require('fs');
const COMMIT = process.env.COMMIT === '1';
const TAG = COMMIT ? 'spread-commit' : 'spread';

const LAST = `(() => { const o=Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
  .filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0); return o[o.length-1]; })()`;

async function clickTid(page, tid) {
  return page.evaluate(({ t }) => {
    const e = document.querySelector(`[data-test-id="${t}"]`);
    if (!e) return { ok: false, why: 'no ' + t };
    e.scrollIntoView({ block: 'center' }); e.click(); return { ok: true };
  }, { t: tid });
}
async function clickText(page, txt) {
  return page.evaluate(({ t }) => {
    const o = Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
      .filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0);
    const s = o[o.length - 1]; if (!s) return { ok: false, why: 'no overlay' };
    const c = Array.from(s.querySelectorAll('button,[role=button],.q-btn,div,span,a'))
      .filter(e => (e.innerText || '').trim() === t)
      .sort((a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width)[0];
    if (!c) return { ok: false, why: 'not found: ' + t };
    c.scrollIntoView({ block: 'center' }); c.click(); return { ok: true };
  }, { t: txt });
}

(async () => {
  const h = await makeHarness(TAG); const page = h.page; const rec = { commit: COMMIT, steps: [] };
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(5000);
  const src = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-test-id=sidebar_work_order_card]'));
    let best = null, n = 1;
    for (const c of cards) { const m = (c.innerText || '').match(/(\d+)\s+lines/); if (m && +m[1] > n) { n = +m[1]; best = c; } }
    if (!best) return { ok: false }; best.scrollIntoView({ block: 'center' });
    const r = best.getBoundingClientRect();
    return { ok: true, lines: n, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), text: (best.innerText || '').replace(/\s+/g, ' ').slice(0, 90) };
  });
  const tgt = await page.evaluate(() => {
    const vh = innerHeight, vw = innerWidth;
    const cells = Array.from(document.querySelectorAll('.q-calendar-agenda__day, [class*=day-column], td'))
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 60 && r.height > 25 && r.x > 320 && r.x + r.width < vw && r.y > 250 && r.y + Math.min(30, r.height) < vh - 20; });
    const c = cells[Math.floor(cells.length / 2)]; if (!c) return { ok: false };
    const r = c.getBoundingClientRect(); return { ok: true, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + Math.min(30, r.height / 2)) };
  });
  rec.src = src; rec.tgt = tgt;
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 25; i++) { await page.mouse.move(src.x + (tgt.x - src.x) * i / 25, src.y + (tgt.y - src.y) * i / 25); await page.waitForTimeout(60); }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
  rec.picker_opened = await page.evaluate(`(() => { const s=${LAST}; return !!(s && s.querySelector('[data-test-id=line_picker_whole_work_order]')); })()`);

  // -> whole work order (67.7h is far past one day, so the spread step must appear)
  rec.whole = await clickTid(page, 'line_picker_whole_work_order');
  await page.waitForTimeout(6000);
  rec.steps.push({ step: 'spread step (as it opens)', overlay: await page.evaluate(READ_OVERLAY) });
  await page.screenshot({ path: `${OUT}/${TAG}-01-step2.png` }).catch(() => {});

  // Preview: find the expander and open it (C29984)
  rec.preview_hunt = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {};
    const tids = Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id'));
    const exp = tids.filter(t=>/preview|expand|breakdown|detail|toggle/i.test(t));
    const byText = Array.from(s.querySelectorAll('button,[role=button],.q-btn,div,span'))
      .filter(e=>/show|expand|preview|breakdown|details/i.test((e.innerText||'').trim()) && (e.innerText||'').trim().length<40)
      .map(e=>({t:(e.innerText||'').trim(), tid:e.getAttribute('data-test-id')}));
    return { all_tids: tids, expander_tids: exp, byText }; })()`);

  if ((rec.preview_hunt.expander_tids || []).length) {
    rec.preview_click = await clickTid(page, rec.preview_hunt.expander_tids[0]);
    await page.waitForTimeout(3000);
    rec.steps.push({ step: 'preview expanded', overlay: await page.evaluate(READ_OVERLAY) });
    await page.screenshot({ path: `${OUT}/${TAG}-02-preview.png` }).catch(() => {});
  }

  if (COMMIT) {
    rec.confirm = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {ok:false};
      const b = Array.from(s.querySelectorAll('button,.q-btn')).filter(e=>{
        const t=(e.innerText||'').trim(); const dis = e.disabled|| e.getAttribute('aria-disabled')==='true';
        return !dis && /^(schedule|confirm|create)/i.test(t); });
      if(!b.length) return {ok:false, why:'no enabled confirm', seen: Array.from(s.querySelectorAll('button,.q-btn')).map(e=>(e.innerText||'').trim()).slice(0,20)};
      const t=(b[b.length-1].innerText||'').trim(); b[b.length-1].scrollIntoView({block:'center'}); b[b.length-1].click();
      return {ok:true, pressed:t}; })()`);
    await page.waitForTimeout(9000);
    rec.after_confirm = { overlay: await page.evaluate(READ_OVERLAY), body: await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 1200)) };
    await page.screenshot({ path: `${OUT}/${TAG}-03-after-confirm.png` }).catch(() => {});
    // the toast + Undo (C29985 item 4)
    rec.toast = await page.evaluate(`(() => Array.from(document.querySelectorAll('.q-notification,[role=alert],.q-notification__message'))
      .map(e=>({ t:(e.innerText||'').trim().slice(0,160) })).filter(x=>x.t))()`);
  }

  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(2000);
  fs.writeFileSync(`${OUT}/${TAG}.json`, JSON.stringify({ ...rec, api_writes: h.apiLog.filter(a => a.m !== 'GET'), api_4xx: h.apiLog.filter(a => a.s >= 400), bridge_errors: h.bridgeErrors, read_at_utc: new Date().toISOString() }, null, 1));
  await h.browser.close();

  console.log('SRC:', JSON.stringify(src).slice(0, 130));
  console.log('picker opened:', rec.picker_opened, '| whole:', JSON.stringify(rec.whole));
  for (const s of rec.steps) {
    console.log('\n### ' + s.step + ' (overlays: ' + s.overlay.open + ')');
    const seen = new Set();
    (s.overlay.nodes || []).forEach(n => { if (!seen.has(n.shown)) { seen.add(n.shown); console.log('   TXT ' + JSON.stringify(n.shown) + (n.transform !== 'none' ? ' [' + n.transform + ']' : '')); } });
    (s.overlay.buttons || []).forEach(b => console.log('   BTN ' + JSON.stringify(b.shown).slice(0, 70) + ' tid=' + b.tid + (b.disabled ? ' DISABLED' : '')));
  }
  console.log('\nPREVIEW HUNT:', JSON.stringify(rec.preview_hunt, null, 1).slice(0, 1200));
  if (COMMIT) { console.log('\nCONFIRM:', JSON.stringify(rec.confirm)); console.log('TOAST:', JSON.stringify(rec.toast)); console.log('WRITES:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET'))); }
})();
