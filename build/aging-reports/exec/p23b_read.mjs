// p23b_read.mjs — 11 Nov 2026: read A/P Detail bucket rows for one vendor (VID env) as of ASOF (default 2026-11-10). Read only.
import { start } from './lib.mjs'; import { mk } from './api.mjs';
const s = await start(new URL('./p23/', import.meta.url).pathname); const a = mk(s.page); const V = process.env.VID, D = process.env.ASOF || '2026-11-10', R = process.env.REP || 'ap-aging-detail', F = process.env.F || 'vendors';
for (const b of ['days_91_plus', 'days_61_to_90', 'days_31_to_60', 'days_1_to_30', 'current']) { const r = await a.get(`/api/reporting/reports/${R}/buckets/${b}/rows?asOfDate=${D}&${F}=${V}&pagination[page]=1&pagination[rowsPerPage]=100`); const c = r.j?.data?.collection || r.j?.data?.rows || []; if (c.length || r.st !== 200) console.log(b, r.st, JSON.stringify(c.map((x) => [x.transactionType, x.documentNumber, x.date, x.dueDate, x.daysPastDue, x.openBalanceCents])).slice(0, 900)); }
await s.close(); process.exit(0);
