// p18c_short.mjs — 11 Nov 2026: page through all work orders (pagination[...] params) and list the ones not invoiced/paid with a number
// of 4 digits or fewer. Read only. Output exec/p18/short2.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p18/', import.meta.url).pathname; const s = await start(OUT, '/work-orders'); const a = mk(s.page); const all = [];
for (let p = 1; p < 400; p++) {
  const r = await a.get(`/api/work-orders?pagination[page]=${p}&pagination[rowsPerPage]=100`); const w = r.j?.data?.work_orders || [];
  if (p === 1) console.log('p1', r.st, JSON.stringify(r.j?.data?.pagination));
  all.push(...w.map(x => ({ id: x.id, n: x.number, st: x.status, co: x.companyName, start: x.startDate }))); if (w.length < 100) break;
}
const short = all.filter(x => +x.n.split('-').pop() < 10000); const open = short.filter(x => !['invoiced', 'paid'].includes(x.st));
fs.writeFileSync(OUT + 'short2.json', JSON.stringify({ total: all.length, short, open }, null, 1));
console.log('total', all.length, 'short', short.length, 'open short', open.length); const by = {}; all.forEach(x => by[x.st] = (by[x.st] || 0) + 1); console.log(by);
console.log(open.slice(0, 25)); await s.close(); process.exit(0);
