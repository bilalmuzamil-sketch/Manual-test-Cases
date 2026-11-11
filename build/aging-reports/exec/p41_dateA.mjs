// p41_dateA.mjs — 11 Nov 2026: read-only. For C715392/C1062579 date A = 2025-01-01: which location is in each report's Location list that day,
// and how many rows A/R Summary / A/R Collection have, with their locations. Output p41/out.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p41/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/reports/ar-aging-summary'); const a = mk(s.page); const o = {};
for (const [d, ks] of [['2025-01-01', ['ar-aging-summary', 'ar-aging-detail', 'ar-aging-collection']], ['2024-12-01', ['ap-aging-summary', 'ap-aging-detail', 'ap-unpaid-invoices']]]) for (const k of ks) { /* + C715609 (A/P, date A 2024-12-01) */
  const l = await a.get(`/api/reporting/reports/${k}/locations?asOfDate=${d}`); o[d + ' ' + k + '-locations'] = [l.st, (l.j?.data?.collection || l.j?.data || []).map?.((x) => x.name || x.locationName || JSON.stringify(x).slice(0, 80))];
  const r = await a.get(`/api/reporting/reports/${k}?asOfDate=${d}`); const c = r.j?.data?.collection || r.j?.data?.groups || []; o[d + ' ' + k] = [r.st, c.length, c.slice(0, 5).map((g) => [g.name || g.label || g.bucket, g.rowsNumber, (g.rows || []).slice(0, 3).map((x) => x.locationName)])]; }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
