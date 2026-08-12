// probe_moves2.cjs — two things the first move probe left unproven:
//   (a) C30020 item 1: dropping an event on ANOTHER TECHNICIAN's row reassigns it.
//       The first attempt moved +90px down and the staff id did not change, which
//       is not evidence the build cannot do it - the drop may simply have stayed
//       inside the same row.  This run reads the actual technician row rectangles
//       and drops into the CENTRE of a DIFFERENT one.
//   (b) the toast with Undo.  Polling can miss a short-lived toast, so a
//       MutationObserver is installed BEFORE the drag and records every node
//       added anywhere in the document, with its class and text.  That turns
//       "no toast seen" into "no toast rendered".
const { makeHarness, APP, OUT, CK, UA } = require('./harness.cjs');
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';

const OBSERVE = `(() => {
  window.__added = [];
  window.__obs = new MutationObserver(ms => {
    for (const m of ms) for (const n of m.addedNodes) {
      if (n.nodeType !== 1) continue;
      const cls = (n.className && n.className.toString ? n.className.toString() : '') || '';
      const txt = (n.innerText || n.textContent || '').replace(/\\s+/g,' ').trim().slice(0,140);
      if (!txt && !/notif|toast|snack|alert/i.test(cls)) continue;
      window.__added.push({ tag:n.tagName, cls: cls.slice(0,100), txt, t: Date.now() });
    }
  });
  window.__obs.observe(document.body, { childList:true, subtree:true });
  return true; })()`;
const HARVEST = `(() => { try{window.__obs.disconnect();}catch(e){}
  const a = window.__added || [];
  return { total: a.length,
           toastish: a.filter(x=>/notif|toast|snack|alert/i.test(x.cls) || /undo/i.test(x.txt)),
           any_undo: a.filter(x=>/undo/i.test(x.txt)).length }; })()`;

async function board() {
  const r = await fetch(`${API}/api/schedule/board?from=2026-08-01T00:00:00Z&to=2026-08-30T00:00:00Z`,
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  return (await r.json()).data.board;
}
async function drag(page, from, to, steps = 34) {
  await page.mouse.move(from.x, from.y); await page.mouse.down(); await page.waitForTimeout(350);
  for (let i = 1; i <= steps; i++) { await page.mouse.move(from.x + (to.x - from.x) * i / steps, from.y + (to.y - from.y) * i / steps); await page.waitForTimeout(45); }
  await page.waitForTimeout(700); await page.mouse.up();
}

(async () => {
  const rec = {};
  const h = await makeHarness('moves2'); const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(6000);

  // the technician rows, by their rendered rectangles
  rec.rows = await page.evaluate(`(() => {
     const cands = Array.from(document.querySelectorAll('[data-test-id*=technician],[data-test-id*=resource],[data-test-id*=row],[class*=technician-row],[class*=resource-row]'))
       .map(e=>{const r=e.getBoundingClientRect(); return { tid:e.getAttribute('data-test-id'),
          name:(e.innerText||'').replace(/\\s+/g,' ').slice(0,40), y:Math.round(r.y), h:Math.round(r.height), x:Math.round(r.x) };})
       .filter(r=>r.h>25);
     return cands.slice(0,20); })()`);

  rec.event = await page.evaluate(`(() => {
     const b = Array.from(document.querySelectorAll('[data-test-id=schedule_event_block]'))
       .filter(e=>{const r=e.getBoundingClientRect(); return r.width>20&&r.height>10&&r.x>300&&r.y>250&&r.y<innerHeight-260;});
     if(!b.length) return {ok:false};
     const e=b[0]; const r=e.getBoundingClientRect();
     return { ok:true, text:(e.innerText||'').replace(/\\s+/g,' ').slice(0,50),
              x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2), h:Math.round(r.height) }; })()`);

  if (rec.event.ok) {
    const before = await board();
    await page.evaluate(OBSERVE);
    // drop far enough down to be unambiguously in another technician's lane
    await drag(page, { x: rec.event.x, y: rec.event.y }, { x: rec.event.x + 120, y: rec.event.y + 230 });
    await page.waitForTimeout(7000);
    rec.mutations = await page.evaluate(HARVEST);
    await page.screenshot({ path: `${OUT}/moves2-01-after.png` }).catch(() => {});
    const after = await board();
    const bm = {}; for (const x of before.events) bm[x.id] = x;
    rec.moved = after.events.filter(x => bm[x.id] && (bm[x.id].startsAt !== x.startsAt || bm[x.id].staffId !== x.staffId))
      .map(x => ({ id: x.id, was_start: bm[x.id].startsAt, now_start: x.startsAt,
                   was_staff: bm[x.id].staffId, now_staff: x.staffId,
                   staff_changed: bm[x.id].staffId !== x.staffId, day_changed: bm[x.id].startsAt.slice(0,10) !== x.startsAt.slice(0,10) }));
    rec.restore = [];
    for (const m of rec.moved) {
      const r = await fetch(`${API}/api/schedule/events/${m.id}`, {
        method: 'PATCH', headers: { cookie: CK, 'content-type': 'application/json', accept: 'application/json', 'user-agent': UA },
        body: JSON.stringify({ starts_at: m.was_start, staff_id: m.was_staff })
      });
      rec.restore.push({ id: m.id.slice(0, 8), status: r.status });
    }
  }
  await h.browser.close();
  fs.writeFileSync(`${OUT}/moves2.json`, JSON.stringify({ ...rec, api_writes: h.apiLog.filter(a => a.m !== 'GET'), read_at_utc: new Date().toISOString() }, null, 1));
  console.log('ROWS:', JSON.stringify(rec.rows, null, 0).slice(0, 700));
  console.log('EVENT:', JSON.stringify(rec.event));
  console.log('MOVED:', JSON.stringify(rec.moved, null, 1));
  console.log('MUTATIONS:', JSON.stringify(rec.mutations, null, 1).slice(0, 1500));
  console.log('RESTORE:', JSON.stringify(rec.restore));
})();
