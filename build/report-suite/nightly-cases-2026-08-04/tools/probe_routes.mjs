// READ-ONLY route probe: is there ANY surface that exposes the stored nightly rows,
// or triggers/reports on the capture?  Re-verifies the earlier pass's "probes 404"
// claim by listing every route tried and its exact status (Standing Rule 50).
import { login, api } from '../../viu-2026-08-03/tools/qa8582.mjs';
import { writeFileSync } from 'fs';
const { sessCookie, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }
const out = { probed_at_utc: new Date().toISOString(), build: 'v3.4.1-0ed4433', routes: [] };

const paths = [
  // report-scoped snapshot/history reads
  '/api/reporting/reports/work-in-progress/snapshots',
  '/api/reporting/reports/work-in-progress/snapshot?date=2026-08-01',
  '/api/reporting/reports/work-in-progress/history?date=2026-08-01',
  '/api/reporting/reports/inventory-value/snapshots',
  '/api/reporting/reports/inventory-value/snapshot?date=2026-08-01',
  '/api/reporting/reports/inventory-value/history?date=2026-08-01',
  // generic snapshot namespaces
  '/api/reporting/snapshots?date=2026-08-01',
  '/api/reporting/snapshots/work-in-progress?date=2026-08-01',
  '/api/reporting/snapshots/inventory-value?date=2026-08-01',
  '/api/reporting/history?date=2026-08-01',
  '/api/snapshots?date=2026-08-01',
  '/api/inventory/snapshots?date=2026-08-01',
  '/api/inventory/value/snapshots?date=2026-08-01',
  '/api/work-orders/snapshots?date=2026-08-01',
  // capture / job / cron surfaces
  '/api/reporting/reports/inventory-value/capture',
  '/api/reporting/reports/work-in-progress/capture',
  '/api/reporting/capture',
  '/api/reporting/jobs',
  '/api/jobs',
  '/api/cron',
  '/api/admin/jobs',
  '/api/admin/cron',
  '/api/organizations/settings/reporting',
  // discovery
  '/api/reporting/reports',
  '/api/reporting',
];
for (const p of paths) {
  const r = await api(sessCookie, 'GET', p);
  const b = r.body;
  const rec = { method: 'GET', path: p, http: r.status,
    body_keys: b && typeof b === 'object' ? Object.keys(b).slice(0, 8) : null,
    msg: (b && (b.error || b.message)) ? String(b.error || b.message).slice(0, 120)
         : (typeof b === 'string' ? b.slice(0, 120) : null) };
  out.routes.push(rec);
  console.log(String(r.status).padEnd(4), p, rec.msg ? '| ' + rec.msg : '');
}
writeFileSync(new URL('../evidence/probe-routes.json', import.meta.url), JSON.stringify(out, null, 1));
const codes = {}; out.routes.forEach(r => codes[r.http] = (codes[r.http]||0)+1);
console.log('\nSTATUS TALLY', JSON.stringify(codes), '| total', out.routes.length);
