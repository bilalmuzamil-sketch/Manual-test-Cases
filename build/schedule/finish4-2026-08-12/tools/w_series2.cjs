// finish4 probe A2 - the SERIES cases.  C30057 C43556 C30060 C30065 C38864
//
// The first attempt failed because it targeted a shift id that is NOT among the
// blocks the grid renders (the lane caps at 3 with a "+N more").  That was OUR
// harness, not a missing feature - so the target is now chosen FROM WHAT IS ON
// SCREEN and cross-referenced against the board fetch for series membership.
//
// SAFETY (drag-retry-2026-08-12/INCIDENT-accidental-delete): selection is BY ID,
// never by customer name, and Delete on a NON-series shift has no confirmation.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, ev, pops, esc, clickId, clickText } = require('./walkbase.cjs');
const fs = require('fs');

const R = mkRecorder(`${OUT}/walk_series.json`);
const board = JSON.parse(fs.readFileSync(`${OUT}/board-BEFORE.json`, 'utf8'));
const byId = {}; board.shifts.forEach(s => byId[s.id] = s);
const bySeries = {};
board.shifts.forEach(s => { if (s.seriesId) (bySeries[s.seriesId] = bySeries[s.seriesId] || []).push(s); });
Object.values(bySeries).forEach(a => a.sort((x, y) => x.startsAt < y.startsAt ? -1 : 1));

const ONSCREEN = ({ v }) => { const vis = eval(v);
  return [...document.querySelectorAll('[data-shift-id]')].filter(vis).map(e => {
    const r = e.getBoundingClientRect();
    return { id: e.getAttribute('data-shift-id'), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2),
             t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 120) }; }); };

(async () => {
  const h = await makeHarness('series2');
  const page = h.page;
  const nonget = [];
  page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url())) nonget.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(12000);
  const F = {};
  const shot = async n => { try { await page.screenshot({ path: `${OUT}/series2-${n}.png` }); } catch (e) { } };
  const save = () => fs.writeFileSync(`${OUT}/series2-findings.json`, JSON.stringify(F, null, 1));

  let vis = await ev(page, ONSCREEN);
  const uniq = [...new Map(vis.map(o => [o.id, o])).values()];
  const members = uniq.filter(o => byId[o.id] && byId[o.id].seriesId && (bySeries[byId[o.id].seriesId] || []).length >= 3);
  F.onscreen_total = uniq.length;
  F.series_members_onscreen = members.map(o => ({ id: o.id, series: byId[o.id].seriesId, n: bySeries[byId[o.id].seriesId].length,
      pos: bySeries[byId[o.id].seriesId].findIndex(s => s.id === o.id) + 1, starts: byId[o.id].startsAt, t: o.t }));
  save();
  console.log('series members on screen:', JSON.stringify(F.series_members_onscreen, null, 1));

  // prefer a genuine MIDDLE member (not first, not last)
  const middle = members.find(o => { const a = bySeries[byId[o.id].seriesId]; const i = a.findIndex(s => s.id === o.id); return i > 0 && i < a.length - 1; }) || members[0];
  if (!middle) { console.log('NO SERIES MEMBER ON SCREEN'); save(); await h.browser.close(); return; }
  const ser = byId[middle.id].seriesId, arr = bySeries[ser];
  const pos = arr.findIndex(s => s.id === middle.id) + 1;
  F.chosen = { id: middle.id, series: ser, n: arr.length, position: pos, starts: byId[middle.id].startsAt };
  save();

  // ---------------- C30057 : delete a MIDDLE shift -> all three scope options ----------------
  await page.mouse.click(middle.x, middle.y); await page.waitForTimeout(2500);
  F.detail_modal = await pops(page); await shot('detail'); save();
  const delOk = await clickId(page, 'button_shift_detail_delete');
  await page.waitForTimeout(2000);
  F.scope_dialog = await pops(page); await shot('scope');
  F.scope_options = await ev(page, ({ v }) => { const vis2 = eval(v);
    const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis2).pop(); if (!d) return null;
    return [...d.querySelectorAll('.q-item,label,.q-radio,[role="option"],button')].filter(vis2)
      .map(e => ({ tid: e.getAttribute('data-test-id'), t: (e.innerText || '').replace(/\s+/g, ' ').trim() }))
      .filter(o => o.t); });
  save();
  R.record(30057, [
    { step: 'precondition: a shift that is a MIDDLE member of a repeating series', seen: `series ${ser.slice(0, 8)} has ${arr.length} shifts; the one opened is position ${pos} of ${arr.length}, starting ${byId[middle.id].startsAt}. Chosen BY ID from the blocks the grid actually rendered, never by customer name.` },
    { step: '1 open that shift and press Delete', seen: `detail modal read: ${JSON.stringify(F.detail_modal).slice(0, 300)} ; delete control clicked = ${delOk}` },
    { step: '2 a scope dialog offers all three options', seen: JSON.stringify(F.scope_options) },
  ], 'see RUNNABILITY');
  // CANCEL - this case destroys nothing
  await clickText(page, 'Cancel'); await page.waitForTimeout(1200); await esc(page, 2);
  F.after_cancel_dialogs = await pops(page); save();

  fs.writeFileSync(`${OUT}/series2-nonget.json`, JSON.stringify(nonget, null, 1));
  console.log('NON-GET API CALLS:', JSON.stringify(nonget));
  await h.browser.close();
})();
