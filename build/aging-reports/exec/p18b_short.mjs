// p18b_short.mjs — 11 Nov 2026: list work orders whose number has 4 digits or fewer and read their status (open ones can be moved to a
// test customer and invoiced today, giving an invoice number with fewer digits). Read only. Output exec/p18/short.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p18/', import.meta.url).pathname; const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = {};
const sl = await a.get('/api/work-orders/simple-list?per_page=100000&rowsPerPage=100000'); const col = sl.j.data.collection; o.n = col.length;
o.minmax = [Math.min(...col.map(c => c.rawNumber)), Math.max(...col.map(c => c.rawNumber))];
const short = col.filter(c => c.rawNumber < 10000); o.shortN = short.length; o.short = [];
for (const c of short.slice(0, 80)) { const v = await a.get('/api/work-orders/view/' + c.id); const w = v.j?.data || {}; o.short.push({ n: c.number, st: w.status || w.work_order?.status, co: c.companyName, wp: c.workplaceId.slice(0, 4), created: c.createdOn }); }
fs.writeFileSync(OUT + 'short.json', JSON.stringify(o, null, 1)); console.log(o.n, o.minmax, o.shortN); const by = {}; o.short.forEach(x => by[x.st] = (by[x.st] || 0) + 1); console.log(by);
console.log(o.short.filter(x => !['invoiced', 'paid'].includes(x.st)).slice(0, 20)); await s.close(); process.exit(0);
