// board.cjs — read the schedule board.  The payload nests at data.board, NOT
// data (that mistake made a snapshot read 0 shifts and look like an empty
// board).  The endpoint refuses a range over 62 days, so it is walked in
// 58-day windows and unioned by id.
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';
const CK = fs.readFileSync('/tmp/qa-cookies/sched-admin.txt', 'utf8').trim();
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const WINDOWS = [
  ['2026-06-01', '2026-07-28'], ['2026-07-28', '2026-09-24'],
  ['2026-09-24', '2026-11-20'], ['2026-11-20', '2027-01-16'],
];

async function board() {
  const shifts = {}, events = {}, series = {}, errs = [];
  for (const [a, b] of WINDOWS) {
    const r = await fetch(`${API}/api/schedule/board?from=${a}T00:00:00Z&to=${b}T00:00:00Z`,
      { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
    if (!r.ok) { errs.push({ a, b, s: r.status }); continue; }
    const j = await r.json();
    const bd = (j.data && j.data.board) || {};
    (bd.shifts || []).forEach(s => {
      shifts[s.id] = {
        staffId: s.staffId, startsAt: s.startsAt, endsAt: s.endsAt,
        durationMinutes: s.durationMinutes, seriesId: s.seriesId, color: s.color,
        isAllDay: s.isAllDay, note: s.note, isConflict: s.isConflict,
        conflictReasons: s.conflictReasons,
        wo: s.workOrder && s.workOrder.number, woId: s.workOrder && s.workOrder.id,
        lines: (s.lines || []).map(l => l.id).sort(),
      };
    });
    (bd.events || []).forEach(e => { events[e.id] = e; });
    (bd.series || []).forEach(s => { series[s.id] = s; });
  }
  return { shifts, events, series, errs };
}

function diff(before, after) {
  const A = Object.keys(before.shifts), B = Object.keys(after.shifts);
  const added = B.filter(k => !(k in before.shifts));
  const removed = A.filter(k => !(k in after.shifts));
  const changed = B.filter(k => k in before.shifts &&
    JSON.stringify(before.shifts[k]) !== JSON.stringify(after.shifts[k]));
  return {
    shifts_before: A.length, shifts_after: B.length,
    events_before: Object.keys(before.events).length, events_after: Object.keys(after.events).length,
    series_before: Object.keys(before.series).length, series_after: Object.keys(after.series).length,
    added, removed, changed,
    added_detail: added.map(k => Object.assign({ id: k }, after.shifts[k])),
    changed_detail: changed.map(k => ({ id: k, before: before.shifts[k], after: after.shifts[k] })),
  };
}

module.exports = { board, diff, API, CK, UA };

if (require.main === module) {
  (async () => {
    const b = await board();
    console.log('shifts', Object.keys(b.shifts).length, 'events', Object.keys(b.events).length,
      'series', Object.keys(b.series).length, 'errs', JSON.stringify(b.errs));
    const reasons = {};
    Object.values(b.shifts).forEach(s => (s.conflictReasons || []).forEach(r => reasons[r] = (reasons[r] || 0) + 1));
    console.log('conflict reasons across the board:', JSON.stringify(reasons));
    if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(b, null, 1));
  })();
}
