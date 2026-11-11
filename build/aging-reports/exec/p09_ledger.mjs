// p09_ledger.mjs — 11 Nov 2026: is the seeded bill in the vendor's unpaid list and in A/P aging (summary for that vendor, as of today
// and tomorrow)? Screen + API. Output exec/p09/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p09/', import.meta.url).pathname; const s = await start(OUT); const a = mk(s.page); await S.loc(a);
const o = JSON.parse(fs.readFileSync(new URL('./p07/seedtest.json', import.meta.url)));
await s.go('/parts/vendor/' + o.vendor + '/unpaid-invoices'); await s.page.waitForTimeout(5000); await s.shot('vendor-unpaid');
console.log('vendor unpaid page rows', JSON.stringify(await s.rows(10)));
for (const d of ['2026-11-10', '2026-11-11']) { const r = await a.get(`/api/reporting/reports/ap-aging-summary?asOfDate=${d}&vendorIds[]=${o.vendor}`); console.log('ap summary', d, r.st, JSON.stringify(r.j).slice(0, 300)); }
const u = await a.get(`/api/reporting/reports/ap-unpaid-invoices?asOfDate=2026-11-11&vendorIds[]=${o.vendor}`); console.log('ap unpaid', u.st, JSON.stringify(u.j).slice(0, 400));
await s.close(); process.exit(0);
