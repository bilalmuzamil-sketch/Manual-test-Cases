// p11_compare.mjs — 11 Nov 2026: compare a bill the A/P report shows (Abadi's 5956) with the seeded one (ZZB1519526): vendor unpaid
// page rows, delivery records, and A/P Summary again for the seeded vendor (a delay in the report's data would show here). Output exec/p11/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p11/', import.meta.url).pathname; const s = await start(OUT); const a = mk(s.page);
const o = JSON.parse(fs.readFileSync(new URL('./p07/seedtest.json', import.meta.url)));
await s.go('/parts/vendor/98c705a1-ba42-42c1-b291-303deb797d3b/unpaid-invoices'); await s.page.waitForTimeout(5000); console.log('abadi unpaid page', JSON.stringify(await s.rows(8)));
for (const n of ['5956', 'ZZB1519526']) { const d = await a.get('/api/inventory/deliveries?search=' + n); const r = (d.j?.data?.collection ?? [])[0]; console.log(n, JSON.stringify(r).slice(0, 900)); }
const r = await a.get(`/api/reporting/reports/ap-aging-summary?asOfDate=2026-11-10&vendors=${o.vendor}`); console.log('summary now', JSON.stringify(r.j).slice(0, 300), new Date().toISOString());
await s.close(); process.exit(0);
