// p18_wolist.mjs — 11 Nov 2026: find work orders not yet invoiced whose numbers are short (4 digits or fewer) at either location,
// to make invoices whose numbers have different digit counts (C715280/C715282). Read only. Output exec/p18/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p18/', import.meta.url).pathname; const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = {};
for (const u of ['/api/work-orders?page=1&per_page=5', '/api/work-orders/simple-list', '/api/work-orders/statuses', '/api/settings', '/api/workplaces']) {
  const r = await a.get(u); o[u] = { st: r.st, keys: r.j && Object.keys(r.j), sample: JSON.stringify(r.j).slice(0, 1500) };
}
fs.writeFileSync(OUT + 'wolist.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 5000)); await s.close(); process.exit(0);
