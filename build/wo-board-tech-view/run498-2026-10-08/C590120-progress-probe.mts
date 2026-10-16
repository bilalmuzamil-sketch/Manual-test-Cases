/** 16 Oct 2026 — C590120 helper probe (read only): what the work order list's "progress" is made of on staging, so the test can give
 *  its work order a progress above 0 the way the product counts it. Reads a few list rows (progress-like fields) and one work order's
 *  lines (estimate / labor fields) with progress > 0. Nothing is changed. */
import { open, done } from './session.mts'; import { api } from './data.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); await p.waitForTimeout(4000);
const r = await a.get('/api/work-orders?tab=all&pagination[rowsPerPage]=40');
const rows: any[] = r.body?.data?.work_orders ?? r.body?.data?.collection ?? [];
console.log('LISTKEYS', r.status, rows[0] ? Object.keys(rows[0]).join(',') : JSON.stringify(r.body).slice(0, 300));
const pk = rows[0] ? Object.keys(rows[0]).filter((k) => /progress|hour|time|estimat|labor|clock|complete|lines/i.test(k)) : [];
for (const x of rows.filter((x) => Number(x.progress ?? 0) > 0).slice(0, 4)) console.log('ROW', x.number, JSON.stringify(Object.fromEntries(pk.map((k) => [k, x[k]]))));
const hit = rows.find((x) => Number(x.progress ?? 0) > 0 && Number(x.progress) < 100);
if (hit) { const d = (await a.get(`/api/work-orders/lines/${hit.id}`)).body?.data; const ls: any[] = Array.isArray(d) ? d : d?.collection ?? d?.lines ?? [];
  for (const l of ls.slice(0, 4)) console.log('LINE', hit.number, l.status, JSON.stringify(Object.fromEntries(Object.entries(l).filter(([k, v]) => /hour|time|estimat|labor|clock|progress|minutes|duration/i.test(k) && (typeof v !== 'object' || v === null)))).slice(0, 600)); }
await done(browser);
