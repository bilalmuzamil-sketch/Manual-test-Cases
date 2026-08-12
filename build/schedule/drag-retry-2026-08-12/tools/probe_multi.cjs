// probe_multi.cjs — C29967 items 2,3,4: the running tally, a 'Select all'
// shortcut, and a 'Cancel' that leaves tick-box mode without closing the picker.
//
// BEFORE recording any control as ABSENT this states what makes the current
// state one where it SHOULD appear: tick-box mode is entered and proven entered
// (checkboxes present), and >=2 lines are ticked so a tally and a Select-all
// both have something to act on.  Three "absences" this week were artefacts of
// the state being stood in.
//
// NOTHING IS COMMITTED.  The Schedule button is never pressed here.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { READ_OVERLAY } = require('./lib.cjs');
const fs = require('fs');

const LAST = `(() => { const o = Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
  .filter(e => getComputedStyle(e).display!=='none' && e.getBoundingClientRect().width>0); return o[o.length-1]; })()`;

async function clickText(page, txt) {
  return page.evaluate(({ t }) => {
    const o = Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
      .filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0);
    const s = o[o.length - 1]; if (!s) return { ok: false, why: 'no overlay' };
    const b = Array.from(s.querySelectorAll('button,[role=button],.q-btn,div,span,a'))
      .filter(e => (e.innerText || '').trim() === t)
      .sort((a, b2) => a.getBoundingClientRect().width - b2.getBoundingClientRect().width)[0];
    if (!b) return { ok: false, why: 'not found: ' + t };
    b.scrollIntoView({ block: 'center' }); b.click(); return { ok: true };
  }, { t: txt });
}
// the tally is the small status line; capture every node that looks like one
const TALLY = `(() => { const o=Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
   .filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0); const s=o[o.length-1];
   if(!s) return []; const out=[]; const w=document.createTreeWalker(s,NodeFilter.SHOW_TEXT); let n;
   while((n=w.nextNode())){const t=(n.nodeValue||'').trim();
     if(/selected|·\\s*\\d|\\bshift\\b|\\blines?\\b/i.test(t)&&t.length<70) out.push(t);} return out; })()`;

(async () => {
  const h = await makeHarness('multi'); const page = h.page; const rec = { steps: [] };
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

  await clickText(page, 'Select multiple'); await page.waitForTimeout(3000);
  // PROVE tick-box mode was entered before judging any absence
  const boxes = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {n:0};
     const cb=Array.from(s.querySelectorAll('[data-test-id^=checkbox_line_picker_]'));
     return { n: cb.length, first: cb.slice(0,3).map(e=>e.getAttribute('data-test-id')) }; })()`);
  rec.tickbox_mode = boxes;
  rec.steps.push({ step: '0 ticked', tally: await page.evaluate(TALLY) });

  // tick two
  const ticked = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {ok:false};
     const cb=Array.from(s.querySelectorAll('[data-test-id^=checkbox_line_picker_]')).slice(0,2);
     cb.forEach(e=>{e.scrollIntoView({block:'center'}); e.click();});
     return { ok:true, clicked: cb.map(e=>e.getAttribute('data-test-id')) }; })()`);
  rec.ticked_two = ticked; await page.waitForTimeout(2500);
  rec.steps.push({ step: '2 ticked', tally: await page.evaluate(TALLY), overlay: await page.evaluate(READ_OVERLAY) });
  await page.screenshot({ path: `${OUT}/multi-01-two-ticked.png` }).catch(() => {});

  // look for a Select all shortcut - by text AND by test-id, and record what IS there
  rec.select_all_hunt = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {};
     const all=Array.from(s.querySelectorAll('button,[role=button],.q-btn,div,span,a,label'));
     const byText = all.filter(e=>/^(select all|all)$/i.test((e.innerText||'').trim())).map(e=>({t:(e.innerText||'').trim(), tid:e.getAttribute('data-test-id')}));
     const byTid  = Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id')).filter(t=>/all|every|toggle/i.test(t));
     const headerCb = Array.from(s.querySelectorAll('[data-test-id^=checkbox_]')).map(e=>e.getAttribute('data-test-id')).filter(t=>!/checkbox_line_picker_[0-9a-f]{8}/.test(t));
     return { byText, byTid, headerCb }; })()`);

  // look for a Cancel that leaves tick-box mode
  rec.cancel_hunt = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {};
     const all=Array.from(s.querySelectorAll('button,[role=button],.q-btn,div,span,a'));
     const byText = all.filter(e=>/^(cancel|done|back)$/i.test((e.innerText||'').trim())).map(e=>({t:(e.innerText||'').trim(), tid:e.getAttribute('data-test-id')}));
     const tids = Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id')).filter(t=>/cancel|exit|done|back|multi/i.test(t));
     return { byText, tids }; })()`);

  // does the multi-select button toggle back out?
  rec.toggle_back = await clickText(page, 'Select multiple');
  await page.waitForTimeout(2500);
  rec.after_toggle = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {open:false};
     return { open:true, boxes: s.querySelectorAll('[data-test-id^=checkbox_line_picker_]').length,
              multi_btn: !!s.querySelector('[data-test-id=button_line_picker_multi_select]'),
              multi_txt: (s.querySelector('[data-test-id=button_line_picker_multi_select]')||{innerText:null}).innerText }; })()`);
  await page.screenshot({ path: `${OUT}/multi-02-after-toggle.png` }).catch(() => {});

  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(2000);
  fs.writeFileSync(`${OUT}/multi.json`, JSON.stringify({ ...rec, api_4xx: h.apiLog.filter(a => a.s >= 400), bridge_errors: h.bridgeErrors, read_at_utc: new Date().toISOString() }, null, 1));
  await h.browser.close();
  console.log(JSON.stringify({ src: rec.src, tickbox_mode: rec.tickbox_mode, ticked: rec.ticked_two, select_all: rec.select_all_hunt, cancel: rec.cancel_hunt, toggle_back: rec.toggle_back, after_toggle: rec.after_toggle }, null, 1));
  console.log('\nTALLY BY STEP:');
  rec.steps.forEach(s => console.log('  ' + s.step + ' -> ' + JSON.stringify(s.tally)));
})();
