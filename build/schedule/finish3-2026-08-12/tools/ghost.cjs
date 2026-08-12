// ghost.cjs — settle C29960 expected 2 properly.
// The previous look only inspected document.body.children.  This one hunts the
// WHOLE tree for an element that (a) carries the dragged line's text and (b) is
// NOT the sidebar row it came from, and tracks whether it moves with the cursor.
// It also screenshots mid-drag so the answer is visible, not just measured.
// The drag is ABORTED over the sidebar, so nothing is created.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');

function HUNT(needle) {
  const vis = e => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
    const st = getComputedStyle(e); return st.display !== 'none' && st.visibility !== 'hidden'; };
  const out = [];
  document.querySelectorAll('*').forEach(e => {
    if (!vis(e)) return;
    const t = (e.innerText || '').replace(/\s+/g, ' ').trim();
    if (!t || t.length > 200) return;
    if (t.indexOf(needle) === -1) return;
    if (e.closest('[data-test-id=schedule_sidebar]')) return;   // not the row it came from
    const r = e.getBoundingClientRect(); const st = getComputedStyle(e);
    out.push({ cls: (e.className || '').toString().slice(0, 90), tid: e.getAttribute('data-test-id'),
      t: t.slice(0, 90), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
      pos: st.position, z: st.zIndex, opacity: st.opacity });
  });
  return out;
}

(async () => {
  const t0 = await board();
  const h = await makeHarness('ghost');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');

  // open the drill-down
  await page.evaluate(() => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const p = cs.find(c => { const m = (c.innerText || '').match(/(\d+)\s+lines?/); return m && +m[1] >= 2 && +m[1] <= 8; });
    if (p) (p.querySelector('[class*=chevron],i') || p).click();
  });
  await page.waitForTimeout(4500);

  const row = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const rows = [...document.querySelectorAll('[data-test-id=sidebar_line_row]')].filter(vis);
    const pick = rows[0]; if (!pick) return { ok: false };
    pick.scrollIntoView({ block: 'center' });
    const r = pick.getBoundingClientRect();
    const handle = [...pick.querySelectorAll('*')].find(e => e.children.length === 0 && /drag_indicator/.test(e.textContent || ''));
    const hr = handle ? handle.getBoundingClientRect() : r;
    const name = ((pick.innerText || '').replace('drag_indicator', '').trim().split('Est.')[0] || '').trim();
    return { ok: true, name, x: Math.round(hr.x + hr.width / 2), y: Math.round(hr.y + hr.height / 2) };
  });
  console.log('ROW:', JSON.stringify(row));

  const tgt = await page.evaluate(() => {
    const cal = document.querySelector('[data-test-id=schedule_calendar]');
    const r = cal.getBoundingClientRect();
    return { x: Math.round(r.x + r.width * 0.45), y: Math.round(Math.min(r.y + 500, window.innerHeight - 180)) };
  });

  const shots = [];
  await page.mouse.move(row.x, row.y); await page.mouse.down();
  for (let i = 1; i <= 24; i++) {
    const cx = row.x + (tgt.x - row.x) * i / 24, cy = row.y + (tgt.y - row.y) * i / 24;
    await page.mouse.move(cx, cy); await page.waitForTimeout(60);
    if (i === 12 || i === 22) {
      const hits = await page.evaluate(HUNT, row.name);
      shots.push({ i, cursor: { x: Math.round(cx), y: Math.round(cy) }, hits });
      await page.screenshot({ path: `${OUT}/ghost-${i}.png` }).catch(() => { });
    }
  }
  // ABORT over the sidebar - create nothing
  await page.mouse.move(140, 250); await page.waitForTimeout(400);
  await page.mouse.up(); await page.waitForTimeout(4000);
  await esc(page, 2);
  await h.browser.close();

  const b1 = await board();
  const d = diff(t0, b1);
  fs.writeFileSync(`${OUT}/ghost.json`, JSON.stringify({ row, tgt, shots, board: d }, null, 1));

  console.log('\nLine name hunted:', JSON.stringify(row.name));
  shots.forEach(s => {
    console.log(`-- i=${s.i} cursor=${JSON.stringify(s.cursor)}  matches outside the sidebar: ${s.hits.length}`);
    s.hits.slice(0, 6).forEach(x => console.log('   ', JSON.stringify(x)));
  });
  // does any match TRACK the cursor?
  if (shots.length === 2) {
    const [a, b] = shots;
    const track = a.hits.map(x => {
      const m = b.hits.find(y => y.cls === x.cls && y.t === x.t);
      return m ? { cls: x.cls.slice(0, 60), t: x.t.slice(0, 50), from: { x: x.x, y: x.y }, to: { x: m.x, y: m.y }, moved: Math.abs(m.x - x.x) + Math.abs(m.y - x.y) } : null;
    }).filter(Boolean);
    console.log('TRACKING:', JSON.stringify(track));
  }
  console.log('BOARD', d.shifts_before, '->', d.shifts_after, 'added', d.added.length);
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
