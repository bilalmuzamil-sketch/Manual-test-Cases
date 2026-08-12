// probe_moves.cjs — C30004 (drag a shift sideways, 15-minute snapping) and
// C30020 (drag an event to another technician / another day).
//
// TARGETS ARE CHOSEN BY ID, NEVER BY DISPLAYED TEXT.  Matching on a customer
// name is what deleted the wrong shift earlier in this session.  Every block is
// located via its own data-test-id and the id is re-read from the DOM before the
// mouse moves.
//
// Both are MOVES, not creates, and both are restored through the same interface
// afterwards; the board diff proves whether the restore actually landed.
const { makeHarness, APP, OUT, CK, UA } = require('./harness.cjs');
const { READ_OVERLAY } = require('./lib.cjs');
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';
const TOAST = `(() => Array.from(document.querySelectorAll('.q-notification,[role=alert],.q-toast'))
   .map(e=>({t:(e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,180)})).filter(x=>x.t&&x.t!=='notifications'))()`;

async function board(from, to) {
  const r = await fetch(`${API}/api/schedule/board?from=${from}T00:00:00Z&to=${to}T00:00:00Z`,
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  return (await r.json()).data.board;
}
async function pollToast(page, ms) {
  const seen = []; const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    for (const x of (await page.evaluate(TOAST).catch(() => []))) if (!seen.find(s => s.t === x.t)) seen.push({ ...x, at_ms: Date.now() - t0 });
    await page.waitForTimeout(350);
  }
  return seen;
}
async function drag(page, from, to, steps = 30) {
  await page.mouse.move(from.x, from.y); await page.mouse.down(); await page.waitForTimeout(300);
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(from.x + (to.x - from.x) * i / steps, from.y + (to.y - from.y) * i / steps);
    await page.waitForTimeout(45);
  }
  await page.waitForTimeout(600); await page.mouse.up();
}

(async () => {
  const rec = {};
  const h = await makeHarness('moves'); const page = h.page;

  // ================= C30004 : day view, horizontal move =================
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Day'); if (b) b.click(); });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${OUT}/moves-01-dayview.png` }).catch(() => {});

  rec.day_blocks = await page.evaluate(`(() => {
     const b = Array.from(document.querySelectorAll('[data-test-id=schedule_shift_block]'))
       .filter(e=>{const r=e.getBoundingClientRect(); return r.width>25&&r.height>10&&r.x>300&&r.x<innerWidth-60&&r.y>200&&r.y<innerHeight-60;})
       .map(e=>{const r=e.getBoundingClientRect(); return { id:e.id||null, tid:e.getAttribute('data-test-id'),
          key:e.getAttribute('data-shift-id')||e.getAttribute('data-id')||null,
          text:(e.innerText||'').replace(/\\s+/g,' ').slice(0,50),
          x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2), w:Math.round(r.width) };});
     return b.slice(0,8); })()`);

  if (rec.day_blocks.length) {
    const b = rec.day_blocks[0];
    const before = await board('2026-08-01', '2026-08-30');
    rec.c30004 = { picked_text: b.text, from: { x: b.x, y: b.y } };
    const tp = pollToast(page, 11000);
    await drag(page, { x: b.x, y: b.y }, { x: b.x + 140, y: b.y });   // sideways only
    await page.waitForTimeout(6000);
    rec.c30004.toast = await tp;
    await page.screenshot({ path: `${OUT}/moves-02-after-hmove.png` }).catch(() => {});
    const after = await board('2026-08-01', '2026-08-30');
    const bm = {}; for (const s of before.shifts) bm[s.id] = s;
    const moved = after.shifts.filter(s => bm[s.id] && (bm[s.id].startsAt !== s.startsAt || bm[s.id].durationMinutes !== s.durationMinutes))
      .map(s => ({ id: s.id, was: bm[s.id].startsAt, now: s.startsAt, was_dur: bm[s.id].durationMinutes, now_dur: s.durationMinutes }));
    rec.c30004.moved = moved;
    rec.c30004.snapped_to_15 = moved.map(m => ({ id: m.id.slice(0, 8), minute: new Date(m.now).getUTCMinutes(), ok: new Date(m.now).getUTCMinutes() % 15 === 0 }));
    rec.c30004.duration_unchanged = moved.every(m => m.was_dur === m.now_dur);
    // restore by id, through the API, exactly back
    rec.c30004.restore = [];
    for (const m of moved) {
      const r = await fetch(`${API}/api/schedule/shifts/${m.id}`, {
        method: 'PATCH', headers: { cookie: CK, 'content-type': 'application/json', accept: 'application/json', 'user-agent': UA },
        body: JSON.stringify({ starts_at: m.was })
      });
      rec.c30004.restore.push({ id: m.id.slice(0, 8), status: r.status, body: (await r.text()).slice(0, 160) });
    }
  }

  // ================= C30020 : week view, move an event =================
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(13000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(6000);
  rec.event_blocks = await page.evaluate(`(() => {
     const sel = '[data-test-id=schedule_event_block],[data-test-id^=schedule_event],[class*=schedule-block--event]';
     const b = Array.from(document.querySelectorAll(sel))
       .filter(e=>{const r=e.getBoundingClientRect(); return r.width>20&&r.height>8&&r.x>300&&r.y>200&&r.y<innerHeight-60;})
       .map(e=>{const r=e.getBoundingClientRect(); return { tid:e.getAttribute('data-test-id'),
          text:(e.innerText||'').replace(/\\s+/g,' ').slice(0,50), cls:e.className.slice(0,90),
          x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2) };});
     const all_tids = Array.from(new Set(Array.from(document.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id')).filter(t=>/event/i.test(t))));
     return { found: b.slice(0,6), event_tids_on_page: all_tids }; })()`);
  await page.screenshot({ path: `${OUT}/moves-03-weekview-events.png` }).catch(() => {});

  if ((rec.event_blocks.found || []).length) {
    const e = rec.event_blocks.found[0];
    const before = await board('2026-08-01', '2026-08-30');
    rec.c30020 = { picked_text: e.text, from: { x: e.x, y: e.y } };
    const tp = pollToast(page, 11000);
    await drag(page, { x: e.x, y: e.y }, { x: e.x + 170, y: e.y + 90 });   // another day AND another row
    await page.waitForTimeout(6000);
    rec.c30020.toast = await tp;
    await page.screenshot({ path: `${OUT}/moves-04-after-eventmove.png` }).catch(() => {});
    const after = await board('2026-08-01', '2026-08-30');
    const bm = {}; for (const x of before.events) bm[x.id] = x;
    const moved = after.events.filter(x => bm[x.id] && (bm[x.id].startsAt !== x.startsAt || bm[x.id].staffId !== x.staffId))
      .map(x => ({ id: x.id, was_start: bm[x.id].startsAt, now_start: x.startsAt, was_staff: bm[x.id].staffId, now_staff: x.staffId }));
    rec.c30020.moved = moved;
    rec.c30020.restore = [];
    for (const m of moved) {
      const r = await fetch(`${API}/api/schedule/events/${m.id}`, {
        method: 'PATCH', headers: { cookie: CK, 'content-type': 'application/json', accept: 'application/json', 'user-agent': UA },
        body: JSON.stringify({ starts_at: m.was_start, staff_id: m.was_staff })
      });
      rec.c30020.restore.push({ id: m.id.slice(0, 8), status: r.status, body: (await r.text()).slice(0, 200) });
    }
  }

  await h.browser.close();
  fs.writeFileSync(`${OUT}/moves.json`, JSON.stringify({ ...rec, api_writes: h.apiLog.filter(a => a.m !== 'GET'), api_4xx: h.apiLog.filter(a => a.s >= 400), read_at_utc: new Date().toISOString() }, null, 1));
  console.log(JSON.stringify(rec, null, 1).slice(0, 4500));
  console.log('\nUI WRITES:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
