// probe_series_delete.cjs — read the series banner (C29985 item 2), then delete
// the series created by the spread commit, and poll for the toast FAST.
//
// The toast poll starts immediately and samples every 400ms for 12s.  The
// previous run read notifications once, 9 seconds after confirming, and found
// none - which is not the same as there being none.  Polling makes the answer
// an observation either way.
const { makeHarness, APP, OUT, CK, UA } = require('./harness.cjs');
const { READ_OVERLAY } = require('./lib.cjs');
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';
const SERIES = '6ea4e87b-7556-4cd1-911c-75689219b6cf';
const LAST = `(() => { const o=Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
  .filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0); return o[o.length-1]; })()`;
const TOAST = `(() => Array.from(document.querySelectorAll('.q-notification,[role=alert],.q-toast,[class*=notification]'))
   .map(e=>({t:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,180)})).filter(x=>x.t))()`;
const clickTid = (page, tid) => page.evaluate(({ t }) => {
  const e = document.querySelector(`[data-test-id="${t}"]`); if (!e) return { ok: false, why: 'no ' + t };
  e.scrollIntoView({ block: 'center' }); e.click(); return { ok: true };
}, { t: tid });
async function pollToast(page, ms = 12000) {
  const seen = []; const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const n = await page.evaluate(TOAST).catch(() => []);
    for (const x of n) if (!seen.find(s => s.t === x.t)) seen.push({ t: x.t, at_ms: Date.now() - t0 });
    await page.waitForTimeout(400);
  }
  return seen;
}
async function count() {
  const r = await fetch(`${API}/api/schedule/board?from=2026-08-10T00:00:00Z&to=2026-08-28T00:00:00Z`,
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  const b = (await r.json()).data.board;
  return b.shifts.filter(s => s.seriesId === SERIES).length;
}

(async () => {
  const rec = { series: SERIES, remaining_before: await count() };
  const h = await makeHarness('seriesdel'); const page = h.page;
  await page.goto(APP + '/schedule?date=2026-08-17', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${OUT}/seriesdel-01-grid.png`, fullPage: false }).catch(() => {});

  // C29985 item 2 - does the series render as one connected banner?
  rec.banner = await page.evaluate(`(() => {
     const tids = Array.from(document.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id'));
     const bannerish = Array.from(new Set(tids.filter(t=>/series|banner|connected|linked/i.test(t))));
     const blocks = Array.from(document.querySelectorAll('[data-test-id=schedule_shift_block]'))
       .filter(e=>/Brabay/i.test(e.innerText||''))
       .map(e=>{ const r=e.getBoundingClientRect(); const cs=getComputedStyle(e);
         return { text:(e.innerText||'').replace(/\\s+/g,' ').slice(0,60), x:Math.round(r.x), w:Math.round(r.width),
                  radius: cs.borderTopLeftRadius+'/'+cs.borderTopRightRadius, cls: e.className.slice(0,120) }; });
     return { banner_tids: bannerish, brabay_blocks: blocks }; })()`);

  // delete: open one member, press delete, read the dialog
  rec.opened = await page.evaluate(`(() => {
     const b = Array.from(document.querySelectorAll('[data-test-id=schedule_shift_block]'))
       .filter(e=>/Brabay/i.test(e.innerText||''))
       .filter(e=>{const r=e.getBoundingClientRect(); return r.width>20&&r.y>150&&r.y<innerHeight-40;});
     if(!b.length) return {ok:false};
     b[0].scrollIntoView({block:'center'}); b[0].click(); return {ok:true, text:(b[0].innerText||'').replace(/\\s+/g,' ').slice(0,60), n:b.length}; })()`);
  await page.waitForTimeout(4500);
  await clickTid(page, 'button_shift_detail_delete'); await page.waitForTimeout(3000);
  rec.delete_dialog = await page.evaluate(READ_OVERLAY);
  await page.screenshot({ path: `${OUT}/seriesdel-02-deletedialog.png` }).catch(() => {});

  // choose the option that removes the WHOLE series
  rec.chose = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {ok:false};
     const cands = Array.from(s.querySelectorAll('button,.q-btn,[role=button],.q-item'))
       .filter(e=>/all shifts|whole series|entire series|all in series|series/i.test(e.innerText||''));
     if(cands.length){ cands[0].scrollIntoView({block:'center'}); cands[0].click(); return {ok:true, pressed:(cands[0].innerText||'').trim().slice(0,60)}; }
     return {ok:false, options: Array.from(s.querySelectorAll('button,.q-btn,.q-item')).map(e=>(e.innerText||'').trim().slice(0,50))}; })()`);
  const toastP = pollToast(page, 12000);
  await page.waitForTimeout(1500);
  // some flows need a final confirm
  rec.confirm2 = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {ok:false, why:'nothing open'};
     const b = Array.from(s.querySelectorAll('button,.q-btn')).filter(e=>/^(delete|confirm|yes|remove)/i.test((e.innerText||'').trim()) && !e.disabled);
     if(!b.length) return {ok:false, seen: Array.from(s.querySelectorAll('button,.q-btn')).map(e=>(e.innerText||'').trim()).slice(0,15)};
     b[b.length-1].click(); return {ok:true, pressed:(b[b.length-1].innerText||'').trim()}; })()`);
  rec.toast = await toastP;
  await page.screenshot({ path: `${OUT}/seriesdel-03-after.png` }).catch(() => {});
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(2500);
  await h.browser.close();
  rec.remaining_after = await count();
  fs.writeFileSync(`${OUT}/seriesdel.json`, JSON.stringify({ ...rec, api_writes: h.apiLog.filter(a => a.m !== 'GET'), api_4xx: h.apiLog.filter(a => a.s >= 400), read_at_utc: new Date().toISOString() }, null, 1));
  console.log('remaining before/after:', rec.remaining_before, '->', rec.remaining_after);
  console.log('BANNER:', JSON.stringify(rec.banner, null, 1).slice(0, 1400));
  console.log('OPENED:', JSON.stringify(rec.opened));
  console.log('\nDELETE DIALOG:');
  const seen = new Set();
  (rec.delete_dialog.nodes || []).forEach(n => { if (!seen.has(n.shown)) { seen.add(n.shown); console.log('   TXT ' + JSON.stringify(n.shown)); } });
  (rec.delete_dialog.buttons || []).forEach(b => console.log('   BTN ' + JSON.stringify(b.shown).slice(0, 60) + ' tid=' + b.tid));
  console.log('CHOSE:', JSON.stringify(rec.chose).slice(0, 400));
  console.log('CONFIRM2:', JSON.stringify(rec.confirm2).slice(0, 300));
  console.log('TOAST:', JSON.stringify(rec.toast));
  console.log('WRITES:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
