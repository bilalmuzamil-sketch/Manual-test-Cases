// READ-ONLY. (a) What does the WIP report's date range actually do?
// (b) Where does the Inventory Value stored history actually begin?
import { login, api } from '../../viu-2026-08-03/tools/qa8582.mjs';
import { writeFileSync } from 'fs';
const { sessCookie, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }
const out = { probed_at_utc: new Date().toISOString(), wip: [], iv_bisect: [] };

const wip = async (label, qs) => {
  const r = await api(sessCookie, 'GET', `/api/reporting/reports/work-in-progress?${qs}`);
  const d = (r.body && r.body.data) || {};
  const rows = Array.isArray(d.collection) ? d.collection.length : null;
  const rec = { label, qs, http: r.status, rows, data_keys: Object.keys(d),
                sample: rows ? { wo: d.collection[0].work_order_number ?? d.collection[0].number ?? null,
                                 created: d.collection[0].created_at ?? d.collection[0].date ?? null,
                                 tab: d.collection[0].tab ?? null } : null };
  out.wip.push(rec); console.log('WIP', JSON.stringify(rec)); return rows;
};

// Does a WIDE range return rows?  (if yes, from/to is a created-date filter, not a snapshot selector)
await wip('wide 2020->today', 'from=2020-01-01T00:00:00.000Z&to=2026-08-04T23:59:59.999Z');
await wip('wide 2026-07-01->today', 'from=2026-07-01T00:00:00.000Z&to=2026-08-04T23:59:59.999Z');
await wip('past window 07-01->07-31', 'from=2026-07-01T00:00:00.000Z&to=2026-07-31T23:59:59.999Z');
await wip('no params at all', '');
// Does it accept any snapshot/as-of style parameter?
for (const p of ['as_of=2026-08-01','as_of_date=2026-08-01','snapshot_date=2026-08-01',
                 'date=2026-08-01','range=custom&start_date=2026-08-01&end_date=2026-08-01']) {
  await wip('param ' + p, p);
}

// IV: bisect the first date that returns rows
const ivRows = async (d) => {
  const r = await api(sessCookie, 'GET',
    `/api/reporting/reports/inventory-value?range=custom&start_date=${d}&end_date=${d}&page=1&per_page=1`);
  const dd = (r.body && r.body.data) || {};
  const rec = { end: d, as_of: dd.as_of_date ?? null,
                rows: Array.isArray(dd.collection) ? dd.collection.length : null,
                total_cost: dd.totals ? dd.totals.total_cost : null };
  out.iv_bisect.push(rec); console.log('IV ', JSON.stringify(rec));
  return rec.rows;
};
for (const d of ['2026-07-16','2026-07-20','2026-07-25','2026-07-28','2026-07-29','2026-07-30','2026-08-02','2026-08-03']) {
  await ivRows(d);
}
writeFileSync(new URL('../evidence/probe-wip-bisect.json', import.meta.url), JSON.stringify(out, null, 1));
console.log('\nwrote evidence/probe-wip-bisect.json');
