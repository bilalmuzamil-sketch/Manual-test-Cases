// starts.cjs — SHIFT START TIMES AND UNASSIGNED SHIFTS (7 cases).
//
// The estate gives us exactly the states these cases need, established from
// GET /api/schedule/board workingWindows and NOT by editing anything:
//   shop business hours          6:00 AM - 3:00 PM   (the staffId:null window)
//   MQ Test Tech Qamar           11:00 AM - 3:00 PM  <- custom, clearly different
//   Ayesha Khan AK               7:00 AM - 3:00 PM   <- custom
//   18 technicians               6:00 AM - 3:00 PM   <- identical to the shop
//
// Start times are read from the API (startsAt, UTC), NOT from the screen: this
// build shows every time six hours late (SV-8848), so the screen is the wrong
// instrument for this particular question.  Edmonton is UTC-6, so 6:00 AM local
// is 12:00Z and 11:00 AM local is 17:00Z.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, esc, setView } = require('./walkbase.cjs');
const { board, diff } = require('./board.cjs');
const fs = require('fs');
const REC = mkRecorder(`${OUT}/walk_starts.json`);
const LOCAL = -6;   // America/Edmonton in August

const hhmm = iso => { const d = new Date(iso); const h = (d.getUTCHours() + 24 + LOCAL) % 24;
  const ap = h < 12 ? 'AM' : 'PM'; const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(d.getUTCMinutes()).padStart(2, '0')} ${ap} local (${iso})`; };

const LANES = () => [...document.querySelectorAll('[data-test-id=schedule_lane_label]')]
  .map(e => { const r = e.getBoundingClientRect(); return { t: (e.innerText || '').replace(/\s+/g, ' ').trim(), y: Math.round(r.y), h: Math.round(r.height) }; });

async function dropOnLane(page, laneMatch, frac) {
  const lanes = await page.evaluate(LANES);
  const lane = lanes.find(l => laneMatch.test(l.t));
  if (!lane) return { ok: false, lanes: lanes.map(l => l.t) };
  const src = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    const p = cs.find(c => /\b1 line\b/.test(c.innerText || '')) || cs[0];
    p.scrollIntoView({ block: 'center' }); const r = p.getBoundingClientRect();
    return { text: (p.innerText || '').replace(/\s+/g, ' ').slice(0, 60), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const tgt = await page.evaluate(({ y, frac }) => {
    const r = document.querySelector('[data-test-id=schedule_calendar]').getBoundingClientRect();
    return { x: Math.round(r.x + r.width * frac), y: Math.round(Math.min(Math.max(y + 14, r.y + 130), window.innerHeight - 160)) };
  }, { y: lane.y, frac });
  await page.mouse.move(src.x, src.y); await page.mouse.down();
  for (let i = 1; i <= 20; i++) { await page.mouse.move(src.x + (tgt.x - src.x) * i / 20, src.y + (tgt.y - src.y) * i / 20); await page.waitForTimeout(55); }
  await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6500);
  return { ok: true, lane, src, tgt };
}

(async () => {
  const t0 = await board();
  const h = await makeHarness('starts');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await setView(page, 'Week');
  const out = {};

  // ---------- WHERE DOES AN UNASSIGNED SHIFT RENDER? -------------------------
  // 13 shifts on this board have no staffId.  Find one on screen and read the
  // lane band it sits in - that answers C29973 without guessing.
  const unassigned = Object.entries(t0.shifts).filter(([, s]) => !s.staffId);
  const lanes0 = await page.evaluate(LANES);
  const where = await page.evaluate((wos) => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const labels = [...document.querySelectorAll('[data-test-id=schedule_lane_label]')]
      .map(e => { const r = e.getBoundingClientRect(); return { t: (e.innerText || '').replace(/\s+/g, ' ').trim(), y: r.y, h: r.height }; })
      .sort((a, b) => a.y - b.y);
    const blocks = [...document.querySelectorAll('[data-test-id=schedule_shift_block]')].filter(vis)
      .map(e => { const r = e.getBoundingClientRect(); return { t: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70), y: r.y, x: r.x }; });
    // which label band does each block fall into?
    const band = y => { let cur = null; labels.forEach(l => { if (l.y <= y + 6) cur = l.t; }); return cur; };
    return {
      labels: labels.map(l => ({ t: l.t, y: Math.round(l.y) })),
      blocks: blocks.map(b => ({ t: b.t, y: Math.round(b.y), band: band(b.y) })).slice(0, 40),
      any_unassigned_text: [...document.querySelectorAll('*')].filter(vis)
        .filter(e => e.children.length === 0 && /unassigned/i.test(e.textContent || ''))
        .map(e => ({ t: (e.textContent || '').trim().slice(0, 40), cls: (e.className || '').toString().slice(0, 60) })),
    };
  }, unassigned.map(([, s]) => s.wo));
  out.where = { unassigned_count: unassigned.length, where, lanes0 };
  fs.writeFileSync(`${OUT}/starts-where.json`, JSON.stringify(out.where, null, 1));
  await page.screenshot({ path: `${OUT}/starts-where.png`, fullPage: true }).catch(() => { });
  console.log('unassigned shifts on the board:', unassigned.length);
  console.log('lane labels:', JSON.stringify(where.labels.map(l => l.t)));
  console.log('"unassigned" text anywhere on screen:', JSON.stringify(where.any_unassigned_text));

  // ---------- C29969 : the technician's OWN hours ----------------------------
  const d69 = await dropOnLane(page, /MQ Test Tech Qamar/, 0.45);
  const b69 = await board(); const diff69 = diff(t0, b69);
  out.c29969 = { drop: d69, added: diff69.added_detail };
  REC.record(29969, [
    { step: 'precondition: a technician with hours DIFFERENT from the shop', seen: 'MQ Test Tech Qamar works 11:00 AM - 3:00 PM; the shop works 6:00 AM - 3:00 PM. Read from GET /api/schedule/board workingWindows - nothing was edited.' },
    { step: "1 drop the line onto that technician's cell in week view", seen: d69.ok ? d69.src.text + ' -> lane "' + d69.lane.t + '" at ' + JSON.stringify(d69.tgt) : 'lane not found: ' + JSON.stringify(d69.lanes) },
    { step: "2 read the created shift's start time", seen: diff69.added.length ? diff69.added_detail.map(a => hhmm(a.startsAt)).join(' ; ') : 'no shift was created' },
    { step: "1 it starts at the technician's own start time (11:00 AM), not the shop's (6:00 AM)", seen: diff69.added.length ? 'created start = ' + hhmm(diff69.added_detail[0].startsAt) : 'n/a' },
  ], 'see RUNNABILITY');

  // ---------- C29970 : no technician hours -> business hours -----------------
  const d70 = await dropOnLane(page, /Larry Collins/, 0.55);
  const b70 = await board(); const diff70 = diff(b69, b70);
  out.c29970 = { drop: d70, added: diff70.added_detail };
  REC.record(29970, [
    { step: 'precondition: a technician with NO configured hours, and the shop HAS business hours', seen: "Larry Collins's window is 6:00 AM - 3:00 PM, byte-identical to the shop's own window, which is what a technician inheriting the shop hours looks like. HONEST LIMIT: this endpoint reports the EFFECTIVE window, so it cannot by itself tell 'no custom hours' apart from 'custom hours that happen to match the shop'." },
    { step: "1 drop the line onto that technician's cell", seen: d70.ok ? d70.src.text + ' -> lane "' + d70.lane.t + '"' : 'lane not found' },
    { step: "2 read the created shift's start time", seen: diff70.added.length ? diff70.added_detail.map(a => hhmm(a.startsAt)).join(' ; ') : 'no shift was created' },
    { step: "1 it starts at the shop's business-hours start (6:00 AM)", seen: diff70.added.length ? 'created start = ' + hhmm(diff70.added_detail[0].startsAt) : 'n/a' },
  ], 'see RUNNABILITY');

  // ---------- C29972 : DAY view, start comes from the drop position ----------
  await setView(page, 'Day');
  await page.waitForTimeout(3500);
  const dayInfo = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
    const heads = [...document.querySelectorAll('*')].filter(vis)
      .filter(e => e.children.length === 0 && /^\d{1,2} (AM|PM)$/.test((e.textContent || '').trim()))
      .map(e => { const r = e.getBoundingClientRect(); return { t: (e.textContent || '').trim(), x: Math.round(r.x), w: Math.round(r.width) }; });
    return { hourHeaders: heads.slice(0, 26), range: (document.querySelector('[data-test-id=text_schedule_range]') || {}).innerText };
  });
  // aim at the column under a specific hour header
  const aim = dayInfo.hourHeaders.find(x => x.t === '10 AM') || dayInfo.hourHeaders[10];
  let d72 = { ok: false }; let diff72 = { added: [], added_detail: [] };
  if (aim) {
    const lanes = await page.evaluate(LANES);
    const lane = lanes.find(l => /MQ Test Tech Qamar/.test(l.t)) || lanes[1];
    const src = await page.evaluate(() => {
      const cs = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
      const p = cs.find(c => /\b1 line\b/.test(c.innerText || '')) || cs[0];
      p.scrollIntoView({ block: 'center' }); const r = p.getBoundingClientRect();
      return { text: (p.innerText || '').replace(/\s+/g, ' ').slice(0, 60), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    });
    const tgt = { x: Math.round(aim.x + aim.w / 2), y: Math.min(lane.y + 14, 900) };
    await page.mouse.move(src.x, src.y); await page.mouse.down();
    for (let i = 1; i <= 20; i++) { await page.mouse.move(src.x + (tgt.x - src.x) * i / 20, src.y + (tgt.y - src.y) * i / 20); await page.waitForTimeout(55); }
    await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6500);
    d72 = { ok: true, aim, lane, src, tgt };
    const b72 = await board(); diff72 = diff(b70, b72);
  }
  out.c29972 = { dayInfo, d72, added: diff72.added_detail };
  await page.screenshot({ path: `${OUT}/starts-day.png` }).catch(() => { });
  REC.record(29972, [
    { step: '3 you are on the Schedule page in DAY view', seen: 'range reads ' + dayInfo.range + '; hour headers found: ' + JSON.stringify(dayInfo.hourHeaders.map(x => x.t).slice(0, 14)) },
    { step: '1 drop the line at a specific time position on a technician timeline (aiming at 10 AM)', seen: d72.ok ? 'aimed at the "' + d72.aim.t + '" column, lane "' + d72.lane.t + '", point ' + JSON.stringify(d72.tgt) : 'could not find an hour column to aim at' },
    { step: "2 read the created shift's start time", seen: diff72.added.length ? diff72.added_detail.map(a => hhmm(a.startsAt)).join(' ; ') : 'no shift was created' },
    { step: '1 the shift starts at the dropped position, not the technician/business default', seen: diff72.added.length ? 'created start = ' + hhmm(diff72.added_detail[0].startsAt) + '  (the technician default would be 11:00 AM, the shop default 6:00 AM)' : 'n/a' },
  ], 'see RUNNABILITY');

  await esc(page, 2);
  await h.browser.close();
  fs.writeFileSync(`${OUT}/starts.json`, JSON.stringify(out, null, 1));
  const bF = await board(); const dF = diff(t0, bF);
  console.log('\nRUN board', dF.shifts_before, '->', dF.shifts_after, 'added', dF.added.length);
  console.log('starts created:', JSON.stringify(dF.added_detail.map(a => ({ wo: a.wo, start: hhmm(a.startsAt) }))));
  console.log('NON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
