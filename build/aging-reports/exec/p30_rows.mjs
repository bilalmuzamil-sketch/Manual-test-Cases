// p30_rows.mjs — 11 Nov 2026: what the screen's first load of an over-100 group carries: the collection reply for the one customer/vendor
// (rows length, rowsNumber, any paging fields) and any per-group rows endpoint. Read only.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const s = await start(new URL('./p30/', import.meta.url).pathname); const a = mk(s.page); const c = JSON.parse(fs.readFileSync(new URL('./p26/state.json', import.meta.url))).cid, v = JSON.parse(fs.readFileSync(new URL('./p27/state.json', import.meta.url))).vid;
for (const u of [`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-10&customers=${c}`, `/api/reporting/reports/ap-unpaid-invoices?asOfDate=2026-11-10&vendors=${v}`]) { const r = await a.get(u); const g = r.j?.data?.collection?.[0] || {}; console.log(u.split('?')[0].split('/').pop(), r.st, 'rows', g.rows?.length, 'rowsNumber', g.rowsNumber, 'keys', Object.keys(g).join(','), 'pagination', JSON.stringify(r.j?.data?.pagination)); }
await s.close(); process.exit(0);
