import { stgStart } from './stglib.mjs';
const s = await stgStart(new URL('./s1/', import.meta.url).pathname); const d = '2026-11-12'; const o = {};
const P = (n) => `pagination[page]=${n}&pagination[rowsPerPage]=100`;
for (const [k, u] of [['ars', `/api/reporting/reports/ar-aging-summary?asOfDate=${d}&${P(1)}`], ['aps', `/api/reporting/reports/ap-aging-summary?asOfDate=${d}&${P(1)}`],
  ['ard', `/api/reporting/reports/ar-aging-detail?asOfDate=${d}`], ['ardRows', `/api/reporting/reports/ar-aging-detail/buckets/current/rows?asOfDate=${d}&${P(1)}`],
  ['apd', `/api/reporting/reports/ap-aging-detail?asOfDate=${d}`], ['arc', `/api/reporting/reports/ar-aging-collection?asOfDate=${d}&${P(1)}`], ['apu', `/api/reporting/reports/ap-unpaid-invoices?asOfDate=${d}&${P(1)}`]]) {
  const r = await s.api(u); const dd = r.j?.data || {}; const c = dd.collection || []; o[k] = { st: r.st, keys: Object.keys(dd), pag: dd.pagination, totals: dd.totals, n: c.length, row0: JSON.stringify(c[0] || {}).slice(0, 500), buckets: dd.buckets ? JSON.stringify(dd.buckets).slice(0, 400) : undefined }; }
console.log(JSON.stringify(o, null, 1)); await s.close(); process.exit(0);
