// probe_history.mjs — READ-ONLY probe: can the stored nightly rows be reached
// indirectly, through the reports' own date selection?
// Reuses the proven qa8582 helper (CLAUDE.md Standing Rule 27). Secrets stay in /tmp.
import { login, api } from '../../viu-2026-08-03/tools/qa8582.mjs';
import { writeFileSync } from 'fs';

const { sessCookie, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }
const out = { probed_at_utc: new Date().toISOString(), build: 'v3.4.1-0ed4433', calls: [] };

function summarise(path, r) {
  const b = r.body;
  const d = (b && b.data) || {};
  const s = {
    path, http: r.status,
    as_of_date: d.as_of_date ?? null,
    rows: Array.isArray(d.collection) ? d.collection.length : null,
    total_records: d.pagination ? (d.pagination.total ?? d.pagination.total_records ?? null) : null,
    totals: d.totals ?? null,
    keys: b && typeof b === 'object' ? Object.keys(b) : null,
    data_keys: d && typeof d === 'object' ? Object.keys(d) : null,
    error: (b && (b.error || b.message)) || (typeof b === 'string' ? String(b).slice(0, 160) : null),
  };
  out.calls.push(s);
  console.log(JSON.stringify(s));
  return s;
}

// ---- A. INVENTORY VALUE across a spread of end-dates (the as-of / history path)
const ivDates = ['2026-08-04','2026-08-03','2026-08-02','2026-08-01','2026-07-31','2026-07-30',
                 '2026-07-15','2026-06-30','2026-01-31','2020-01-31'];
for (const d of ivDates) {
  const p = `/api/reporting/reports/inventory-value?range=custom&start_date=${d}&end_date=${d}&page=1&per_page=1`;
  summarise('IV end=' + d, await api(sessCookie, 'GET', p));
}

// ---- B. WORK IN PROGRESS across the same spread (does it serve stored history at all?)
const wipDates = ['2026-08-04','2026-08-03','2026-08-01','2026-07-31','2026-07-15','2026-06-30','2020-01-31'];
for (const d of wipDates) {
  const p = `/api/reporting/reports/work-in-progress?from=${d}T00:00:00.000Z&to=${d}T23:59:59.999Z`;
  summarise('WIP end=' + d, await api(sessCookie, 'GET', p));
}
writeFileSync(new URL('../evidence/probe-history.json', import.meta.url), JSON.stringify(out, null, 1));
console.log('\nwrote evidence/probe-history.json');
