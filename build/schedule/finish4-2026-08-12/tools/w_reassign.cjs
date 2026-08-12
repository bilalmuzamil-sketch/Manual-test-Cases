// finish4 probe C - C43556 (reassign a SERIES member by dragging in week view)
// and the reassign half of C30065.
//
// The grid is taller than the viewport, so the block is scrolled into view FIRST
// and every coordinate is re-read after the scroll - a stale rect is how the
// earlier coordinate click landed at y=1371 in a 1080-tall window.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, ev, pops, esc } = require('./walkbase.cjs');
const fs = require('fs');
const R = mkRecorder(`${OUT}/walk_reassign.json`);

async function dragTo(page, src, tgt, sampleAt) {
  let sample = null;
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 20; i++) {
    await page.mouse.move(src.x + (tgt.x - src.x) * i / 20, src.y + (tgt.y - src.y) * i / 20);
    await page.waitForTimeout(60);
    if (sampleAt && i === 14) sample = await sampleAt();
  }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(4000);
  return sample;
}

(async () => {
  const h = await makeHarness('reassign'); const page = h.page;
  const nonget = [];
  page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url())) nonget.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
  const F = {}; const save = () => fs.writeFileSync(`${OUT}/reassign-findings.json`, JSON.stringify(F, null, 1));
  const shot = async n => { try { await page.screenshot({ path: `${OUT}/reassign-${n}.png` }); } catch (e) { } };
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(13000);
  const api = async p => page.evaluate(async p => { const r = await fetch('https://sv8685api.qa.shopview.com' + p, { credentials: 'include', headers: { accept: 'application/json' } }); return await r.json(); }, p);
  const BOARD = '/api/schedule/board?from=2026-08-01T00:00:00Z&to=2026-09-15T00:00:00Z';
  const snap = async () => { const b = (await api(BOARD)).data.board; const m = {}; b.shifts.forEach(s => m[s.id] = { staff: s.staffId, starts: s.startsAt, series: s.seriesId }); return m; };

  const before = await snap();
  // a SERIES member that the grid actually renders
  const cand = await ev(page, ({ v }) => { const vis = eval(v);
    return [...new Set([...document.querySelectorAll('[data-shift-id]')].filter(vis).map(e => e.getAttribute('data-shift-id')))]; });
  const seriesOnScreen = cand.filter(i => before[i] && before[i].series);
  F.series_on_screen = seriesOnScreen.map(i => ({ id: i, series: before[i].series, staff: before[i].staff }));
  save();
  const SRC = seriesOnScreen[0];
  if (!SRC) { console.log('NO SERIES MEMBER RENDERED'); save(); await h.browser.close(); return; }
  F.src = { id: SRC, ...before[SRC] };

  // scroll it into view, THEN re-read every coordinate
  const geom = await page.evaluate(async id => {
    const e = document.querySelector(`[data-shift-id="${id}"]`);
    e.scrollIntoViewIfNeeded ? e.scrollIntoViewIfNeeded() : e.scrollIntoView({ block: 'center' });
    await new Promise(r => setTimeout(r, 900));
    const r0 = e.getBoundingClientRect();
    // every technician lane currently on screen, with its label
    const lanes = [...document.querySelectorAll('[data-test-id*="lane"],[class*="resource-row"],[class*="schedule-row"]')]
      .map(l => { const rr = l.getBoundingClientRect(); return { t: (l.innerText || '').replace(/\s+/g, ' ').slice(0, 40), y: Math.round(rr.y + rr.height / 2), h: Math.round(rr.height), x: Math.round(rr.x + rr.width / 2) }; })
      .filter(l => l.y > 90 && l.y < window.innerHeight - 60 && l.h > 25);
    return { src: { x: Math.round(r0.x + r0.width / 2), y: Math.round(r0.y + r0.height / 2), w: Math.round(r0.width), h: Math.round(r0.height) },
             inview: r0.y > 60 && r0.y < window.innerHeight - 60, lanes: lanes.slice(0, 40), vh: window.innerHeight };
  }, SRC);
  F.geom = { src: geom.src, inview: geom.inview, vh: geom.vh, lanes: geom.lanes.length };
  F.lanes = geom.lanes; save();
  console.log('src', JSON.stringify(geom.src), 'inview', geom.inview, 'lanes visible', geom.lanes.length);

  // a different lane, at least 60px away vertically, still on screen
  const tgtLane = geom.lanes.filter(l => Math.abs(l.y - geom.src.y) > 60).sort((a, b) => Math.abs(a.y - geom.src.y) - Math.abs(b.y - geom.src.y))[0];
  F.target_lane = tgtLane; save();
  if (!tgtLane) { console.log('NO SECOND LANE ON SCREEN'); save(); await h.browser.close(); return; }

  const mid = await dragTo(page, geom.src, { x: geom.src.x, y: tgtLane.y }, async () => ({
    lifted: await ev(page, ({ v }) => { const vis = eval(v);
      const g = [...document.body.children].filter(e => /drag|ghost|clone/i.test((e.className || '').toString()));
      return g.map(e => (e.innerText || '').replace(/\s+/g, ' ').slice(0, 100)); }),
    droptarget: await ev(page, () => !!document.querySelector('.schedule-drop-target')) }));
  F.mid_drag = mid;
  F.after_drop_dialog = await pops(page); await shot('drop'); save();
  const after = await snap();
  F.moved = before[SRC] && after[SRC] ? { staff_before: before[SRC].staff, staff_after: after[SRC].staff, starts_before: before[SRC].starts, starts_after: after[SRC].starts } : null;
  save();

  R.record(43556, [
    { step: 'precondition: week view, a repeating series on the week you are looking at', seen: `week view is the default; shift ${SRC.slice(0, 8)} belongs to series ${String(before[SRC].series).slice(0, 8)} and the grid renders it. Note: the case names work order S-9379 on Jose Young; that exact series is not on this board, so a different series was used and is named here.` },
    { step: '1-2 find one block of the series and press and hold the mouse on it', seen: `block at ${JSON.stringify(geom.src)}, scrolled into view first (in view = ${geom.inview}); mid-drag sample = ${JSON.stringify(mid)}` },
    { step: "3 drag it onto the other technician's row and release", seen: `target lane "${tgtLane.t}" at y=${tgtLane.y}` },
    { step: '4 look at what appears, then at which row the block is in', seen: `dialog after release: ${JSON.stringify(F.after_drop_dialog).slice(0, 400)} ; shift record: ${JSON.stringify(F.moved)}` },
  ], 'see RUNNABILITY');

  fs.writeFileSync(`${OUT}/reassign-nonget.json`, JSON.stringify(nonget, null, 1));
  console.log('NON-GET:', JSON.stringify(nonget));
  save(); await h.browser.close();
})();
