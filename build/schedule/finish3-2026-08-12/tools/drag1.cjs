// drag1.cjs — DRIVE A REAL DRAG.  The claim "our tooling cannot drag" has been
// wrong twice; this re-tests it properly.
//
// Order of business, deliberately:
//   1. board snapshot BEFORE (API GET)
//   2. Week view
//   3. mid-drag sample  -> C29960 (highlight + ghost)
//   4. drop a MULTI-line card    -> C29956 / C29963 / C29967 (scope picker)
//   5. drop a SINGLE-line card   -> C29955 (no picker, shift created)
//   6. board snapshot AFTER, diffed by id
//
// NOTHING DESTRUCTIVE.  `button_shift_detail_delete` is never touched: it
// destroys a non-series shift on the first click with no confirmation (two
// workers have lost a shift to it).  Creation is expected and allowed - the QA
// lead's ruling is that test data on this branch need not be restored.
const { makeHarness, APP, OUT, CK, UA } = require('./harness.cjs');
const { mkRecorder, ev, pops, esc, setView } = require('./walkbase.cjs');
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';
const REC = mkRecorder(`${OUT}/walk_drag1.json`);

async function board() {
  const out = {};
  for (const [a, b] of [['2026-06-01', '2026-07-30'], ['2026-07-30', '2026-09-27'], ['2026-09-27', '2026-11-25']]) {
    const r = await fetch(`${API}/api/schedule/board?from=${a}T00:00:00Z&to=${b}T00:00:00Z`,
      { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
    if (!r.ok) { out['err_' + a] = r.status; continue; }
    const j = await r.json();
    const d = j.data || j;
    (d.shifts || []).forEach(s => { out[s.id] = { staffId: s.staffId, startsAt: s.startsAt, endsAt: s.endsAt, wo: s.workOrder && s.workOrder.id }; });
  }
  return out;
}

const GRAB = `(() => {
  const vis = e => { const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01; };
  const open = [...document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu')].filter(vis);
  const s = open[open.length-1]; if(!s) return {open:0};
  const out=[]; const w=document.createTreeWalker(s,NodeFilter.SHOW_TEXT); let n;
  while((n=w.nextNode())){const t=(n.nodeValue||'').trim(); if(!t) continue;
    const p=n.parentElement; if(!p) continue; const cs=getComputedStyle(p);
    if(cs.display==='none') continue; out.push({raw:t, transform:cs.textTransform, tag:p.tagName});}
  return {open:open.length, nodes:out,
    ids:[...s.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')),
    checkboxes: s.querySelectorAll('input[type=checkbox],.q-checkbox').length,
    text:(s.innerText||'').replace(/\\s+/g,' ').slice(0,1200)};
})()`;

// pick a drop target INSIDE the viewport, in the calendar body, right of the
// 199px label column.  y=2095 in a 1080-tall window is what made the first
// attempt "fail" on 12 Aug.
async function target(page, frac) {
  return page.evaluate((frac) => {
    const cal = document.querySelector('[data-test-id=schedule_calendar]');
    if (!cal) return { ok: false, why: 'no calendar' };
    const r = cal.getBoundingClientRect();
    const vh = window.innerHeight;
    const x = r.x + r.width * frac;
    // a lane band well inside the visible calendar
    const y = Math.min(r.y + 260, vh - 160);
    return { ok: true, x: Math.round(x), y: Math.round(y), cal: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }, vh };
  }, frac);
}

async function card(page, wantMulti) {
  return page.evaluate((wantMulti) => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const pick = cs.find(c => {
      const m = (c.innerText || '').match(/(\d+)\s+lines?/);
      const n = m ? +m[1] : 0;
      return wantMulti ? n > 1 && n < 10 : /1 line\b/.test(c.innerText || '');
    });
    if (!pick) return { ok: false, n: cs.length };
    pick.scrollIntoView({ block: 'center' });
    const r = pick.getBoundingClientRect();
    return { ok: true, text: (pick.innerText || '').replace(/\s+/g, ' ').slice(0, 80), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  }, wantMulti);
}

(async () => {
  const before = await board();
  const h = await makeHarness('drag1');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  const wk = await setView(page, 'Week');
  await page.waitForTimeout(3000);

  // ---------- MULTI-LINE DRAG : scope picker ----------
  const src = await card(page, true);
  const tgt = await target(page, 0.45);
  let mid = null, harvest = { open: 0 };
  if (src.ok && tgt.ok) {
    await page.mouse.move(src.x, src.y);
    await page.mouse.down();
    for (let i = 1; i <= 22; i++) {
      await page.mouse.move(src.x + (tgt.x - src.x) * i / 22, src.y + (tgt.y - src.y) * i / 22);
      await page.waitForTimeout(55);
      if (i === 16) {
        // C29960 — sample the page WHILE the button is still down
        mid = await page.evaluate(() => {
          const vis = e => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
            const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01; };
          const all = [...document.querySelectorAll('*')].filter(vis);
          const cls = e => (e.className || '').toString();
          return {
            ghost: all.filter(e => /drag|ghost|preview|mirror/i.test(cls(e)))
              .slice(0, 8).map(e => ({ cls: cls(e).slice(0, 90), t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 60) })),
            highlight: all.filter(e => /highlight|drop|active|hover|target/i.test(cls(e)))
              .slice(0, 10).map(e => ({ cls: cls(e).slice(0, 90) })),
            body_dragging: /drag/i.test(document.body.className || '')
          };
        });
      }
    }
    await page.waitForTimeout(900);
    await page.mouse.up();
    await page.waitForTimeout(6500);
    harvest = await page.evaluate(GRAB);
  }
  fs.writeFileSync(`${OUT}/drag1-multi.json`, JSON.stringify({ src, tgt, mid, harvest, week_view: wk }, null, 1));
  await page.screenshot({ path: `${OUT}/drag1-multi.png` }).catch(() => { });
  console.log('MULTI src:', JSON.stringify(src).slice(0, 120));
  console.log('MULTI tgt:', JSON.stringify(tgt));
  console.log('MULTI dialog open:', harvest.open, 'ids:', JSON.stringify(harvest.ids || []).slice(0, 300));
  console.log('MULTI text:', (harvest.text || '').slice(0, 700));
  console.log('MID   :', JSON.stringify(mid).slice(0, 600));

  await esc(page, 2);
  await page.waitForTimeout(2000);
  const after = await board();
  const added = Object.keys(after).filter(k => !(k in before));
  const removed = Object.keys(before).filter(k => !(k in after));
  fs.writeFileSync(`${OUT}/drag1-board.json`, JSON.stringify({
    before_n: Object.keys(before).length, after_n: Object.keys(after).length,
    added, removed, added_detail: added.map(a => after[a])
  }, null, 1));
  console.log('BOARD', Object.keys(before).length, '->', Object.keys(after).length, 'added', added.length, 'removed', removed.length);
  console.log('ADDED:', JSON.stringify(added.map(a => after[a])).slice(0, 400));

  await h.browser.close();
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
  console.log('bridge errors:', h.bridgeErrors.length);
})();
