// probe_scope.cjs — reach the scope picker by dragging a MULTI-LINE work order
// card onto a technician cell, and harvest it.
//
// Why multi-line: the 11 Aug pass established that a 1-line order opens NO scope
// picker, and the earlier "the picker never appears" reports were all dragging a
// 1-line card - the build was right and our tooling report was wrong.
//
// NOTHING IS COMMITTED HERE.  The picker's confirm button is not pressed; the run
// ends with Escape.  A board snapshot is taken before and after and compared
// shift-by-shift so "nothing was left behind" is a measurement, not a claim.
const { makeHarness, APP, OUT, CK, UA } = require('./harness.cjs');
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';

async function board() {
  const r = await fetch(`${API}/api/schedule/shifts?from=2026-07-01&to=2026-09-30`,
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  if (!r.ok) return { status: r.status, note: 'shift list endpoint not reachable at this path' };
  const j = await r.json();
  const arr = (j.data && (j.data.collection || j.data)) || [];
  const list = Array.isArray(arr) ? arr : [];
  return { status: r.status, count: list.length, ids: list.map(s => s.id).sort() };
}

const GRAB = `(() => {
  const open = Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
    .filter(e => { const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
                   return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0; });
  const s = open[open.length-1]; if(!s) return {open:0};
  const out=[]; const w=document.createTreeWalker(s,NodeFilter.SHOW_TEXT); let n;
  while((n=w.nextNode())){const t=(n.nodeValue||'').trim(); if(!t) continue;
    const p=n.parentElement; if(!p) continue; const cs=getComputedStyle(p);
    if(cs.display==='none') continue; out.push({raw:t,transform:cs.textTransform});}
  return {open:open.length, nodes:out,
          ids:Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id'))};
})()`;

(async () => {
  const before = await board();
  const h = await makeHarness('scope');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(13000);
  // Week view gives wider cells to aim at
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn'))
      .find(e => (e.textContent || '').trim() === 'Week');
    if (b) b.click();
  });
  await page.waitForTimeout(5000);

  const src = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-test-id=sidebar_work_order_card]'));
    const multi = cards.find(c => { const m = (c.innerText || '').match(/(\d+) lines/); return m && +m[1] > 1; });
    if (!multi) return { ok: false, cards: cards.length };
    multi.scrollIntoView({ block: 'center' });
    const r = multi.getBoundingClientRect();
    return { ok: true, text: (multi.innerText || '').replace(/\s+/g, ' ').slice(0, 90), x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  const tgt = await page.evaluate(() => {
    // the target MUST be inside the viewport: a drop computed at y=2095 in a
    // 1080-tall window lands on nothing and the picker never opens (12 Aug).
    const vh = window.innerHeight, vw = window.innerWidth;
    const cells = Array.from(document.querySelectorAll('.q-calendar-agenda__day, [class*=day-column], td'))
      .filter(e => { const r = e.getBoundingClientRect();
        return r.width > 60 && r.height > 25 && r.x > 320 && r.x + r.width < vw
               && r.y > 250 && r.y + Math.min(30, r.height) < vh - 20; });
    const c = cells[Math.floor(cells.length / 2)];
    if (!c) return { ok: false, cells: cells.length, vh, vw };
    const r = c.getBoundingClientRect();
    return { ok: true, x: r.x + r.width / 2, y: r.y + Math.min(30, r.height / 2), cells: cells.length, vh };
  });

  let harvest = { open: 0 };
  if (src.ok && tgt.ok) {
    await page.mouse.move(src.x, src.y); await page.mouse.down();
    for (let i = 1; i <= 25; i++) {
      await page.mouse.move(src.x + (tgt.x - src.x) * i / 25, src.y + (tgt.y - src.y) * i / 25);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
    harvest = await page.evaluate(GRAB);
  }
  await page.screenshot({ path: `${OUT}/scope.png` }).catch(() => { });
  // leave nothing open
  await page.keyboard.press('Escape').catch(() => { });
  await page.waitForTimeout(2500);
  await h.browser.close();
  const after = await board();

  const same = before.ids && after.ids &&
    before.ids.length === after.ids.length && before.ids.every((x, i) => x === after.ids[i]);
  fs.writeFileSync(`${OUT}/scope.json`, JSON.stringify({ src, tgt, harvest, board_before: before, board_after: after, board_identical: same, read_at_utc: new Date().toISOString() }, null, 1));
  console.log('SRC :', JSON.stringify(src).slice(0, 160));
  console.log('TGT :', JSON.stringify(tgt));
  console.log('OPEN:', harvest.open, 'nodes:', (harvest.nodes || []).length);
  (harvest.nodes || []).forEach(n => console.log('   ' + JSON.stringify(n.raw) + (n.transform !== 'none' ? ' [' + n.transform + ']' : '')));
  console.log('ids :', JSON.stringify(harvest.ids || []).slice(0, 400));
  console.log('BOARD before/after:', JSON.stringify(before).slice(0, 120), '|', JSON.stringify(after).slice(0, 120), '| identical:', same);
})();
