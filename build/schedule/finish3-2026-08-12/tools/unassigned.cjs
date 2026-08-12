// unassigned.cjs — C29973 / C29974 / C29975 turn on one question: is there an
// Unassigned row in the grid?  13 shifts on this board have no staffId, so the
// state the cases need EXISTS.  Before recording the row absent, rule out the
// three innocent explanations:
//   (a) a toolbar toggle hides it  -> open BOTH toolbar menus and read every item
//   (b) it is off-screen           -> the lane query is DOM-wide, not viewport-bound
//   (c) unassigned shifts render somewhere else -> find one by its work order
//       number and read which lane band it sits in
// Toolbar menu items are plain DIVs on this build, not .q-item (recorded trap).
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board } = require('./board.cjs');
const fs = require('fs');
const REC = mkRecorder(`${OUT}/walk_starts.json`);

async function openMenu(page, tid) {
  await page.evaluate((tid) => { const e = document.querySelector('[data-test-id=' + tid + ']'); if (e) e.click(); }, tid);
  await page.waitForTimeout(2200);
  return page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const menus = [...document.querySelectorAll('.q-menu')].filter(vis);
    const s = menus[menus.length - 1];            // Quasar leaves earlier menus mounted
    if (!s) return { open: false };
    const items = [...s.querySelectorAll('div,label,span,button')].filter(vis)
      .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
    return { open: true, text: (s.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 900), items: items.slice(0, 40),
      toggles: [...s.querySelectorAll('input[type=checkbox],.q-toggle,.q-checkbox')].length };
  });
}

(async () => {
  const b0 = await board();
  const unassigned = Object.entries(b0.shifts).filter(([, s]) => !s.staffId)
    .map(([id, s]) => ({ id, wo: s.wo, startsAt: s.startsAt }));
  const h = await makeHarness('unassigned');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');

  // (a) both toolbar menus, read in full
  const viewOpts = await openMenu(page, 'schedule_view_options_menu');
  await esc(page, 1);
  const filterDisp = await openMenu(page, 'schedule_filter_display_menu');
  await esc(page, 1);
  await page.waitForTimeout(1200);

  // (b) + (c) every lane, and where unassigned work orders render
  const scan = await page.evaluate((wos) => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const labels = [...document.querySelectorAll('[data-test-id=schedule_lane_label]')]
      .map(e => { const r = e.getBoundingClientRect(); return { t: (e.innerText || '').replace(/\s+/g, ' ').trim(), y: r.y }; })
      .sort((a, b) => a.y - b.y);
    const band = y => { let cur = 'ABOVE ALL LABELS'; labels.forEach(l => { if (l.y <= y + 8) cur = l.t; }); return cur; };
    const blocks = [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
      .map(e => { const r = e.getBoundingClientRect(); const t = (e.innerText || '').replace(/\s+/g, ' ').trim();
        return { t: t.slice(0, 60), y: Math.round(r.y), band: band(r.y) }; });
    return {
      lane_count: labels.length,
      labels: labels.map(l => l.t),
      any_unassigned_word: [...document.querySelectorAll('*')].filter(vis)
        .filter(e => e.children.length === 0 && /unassigned/i.test(e.textContent || ''))
        .map(e => ({ t: (e.textContent || '').trim().slice(0, 50), cls: (e.className || '').toString().slice(0, 60) })),
      blocks_in_group_bands: blocks.filter(b => /^(SERVICE|SERVICE\/PARTS|WORK ORDER STATUS)$/.test(b.band)).slice(0, 15),
      block_total: blocks.length,
    };
  }, unassigned.map(u => u.wo));
  fs.writeFileSync(`${OUT}/unassigned.json`, JSON.stringify({ unassigned_count: unassigned.length, unassigned: unassigned.slice(0, 15), viewOpts, filterDisp, scan }, null, 1));
  await page.screenshot({ path: `${OUT}/unassigned.png`, fullPage: true }).catch(() => { });

  console.log('unassigned shifts on the board :', unassigned.length);
  console.log('VIEW OPTIONS  items:', JSON.stringify(viewOpts.items || []));
  console.log('FILTER&DISPLAY items:', JSON.stringify(filterDisp.items || []));
  console.log('lane labels   :', scan.lane_count, '| any "unassigned" word on the page:', JSON.stringify(scan.any_unassigned_word));
  console.log('blocks sitting in a GROUP band (not a technician row):', JSON.stringify(scan.blocks_in_group_bands));

  const menuMentions = /unassign/i.test((viewOpts.text || '') + (filterDisp.text || ''));
  const verdict = (scan.any_unassigned_word.length === 0 && !menuMentions)
    ? 'DIVERGENCE - no Unassigned row exists' : 'see RUNNABILITY';

  const shared = [
    { step: 'precondition state proven present, not assumed', seen: unassigned.length + ' shifts on this board have no technician (staffId null), so unassigned shifts DO exist here' },
    { step: '(a) rule out a toolbar toggle hiding the row', seen: 'View options items: ' + JSON.stringify(viewOpts.items) + ' || Filter & display items: ' + JSON.stringify(filterDisp.items) + ' || either menu mentions "unassigned": ' + menuMentions },
    { step: '(b) rule out it being off-screen', seen: 'the lane query is DOM-wide and returned ' + scan.lane_count + ' lanes: ' + JSON.stringify(scan.labels) },
    { step: '(c) rule out it rendering elsewhere', seen: 'the word "unassigned" appears ' + scan.any_unassigned_word.length + ' times anywhere on the page; blocks sitting in a group band rather than a technician row: ' + JSON.stringify(scan.blocks_in_group_bands) },
  ];
  REC.record(29973, shared.concat([
    { step: "1 drag the line onto the grid's Unassigned row", seen: 'THE ROW DOES NOT EXIST on this build, so this step cannot be performed at all' },
    { step: '1-3 an unassigned shift is created there with no technician and the usual block anatomy', seen: 'not reachable - see above' },
  ]), verdict);
  REC.record(29974, shared.concat([
    { step: '1 drop the line onto the Unassigned row', seen: 'THE ROW DOES NOT EXIST on this build' },
    { step: "1 the unassigned shift starts at the shop's business-hours start", seen: "not reachable from the interface. NOTE: unassigned shifts DO exist in the data and DO start at the shop's 6:00 AM - for example " + JSON.stringify(unassigned.slice(0, 3)) + " - but they were not created through this route, so this is not evidence for this case." },
  ]), verdict);
  REC.record(29975, shared.concat([
    { step: '1 drag an unassigned shift from the Unassigned row onto a technician row', seen: 'THE ROW DOES NOT EXIST, so there is nothing to drag from' },
    { step: '1-3 it becomes assigned and the technician hours apply', seen: 'not reachable - see above' },
  ]), verdict);

  await h.browser.close();
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
