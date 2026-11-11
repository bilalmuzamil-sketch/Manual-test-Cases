// p10_vfilter.mjs — 11 Nov 2026: open A/P Summary and A/P Unpaid filtered to the seeded vendor through the address (vendorIds=<id>),
// record the API calls the screen makes and what it shows; also look the vendor up in the report's vendor list. Output exec/p10/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p10/', import.meta.url).pathname; const s = await start(OUT); const a = mk(s.page);
const o = JSON.parse(fs.readFileSync(new URL('./p07/seedtest.json', import.meta.url)));
const vl = await a.get('/api/reporting/reports/ap-aging/vendors'); const all = vl.j?.data?.collection ?? vl.j?.data ?? []; console.log('vendor list', vl.st, Array.isArray(all) ? all.length : typeof all, JSON.stringify(Array.isArray(all) ? all.filter((v) => /SEEDTEST|POCAP/.test(JSON.stringify(v))) : all).slice(0, 300));
for (const p of ['/reports/ap-aging-summary', '/reports/ap-unpaid-invoices', '/reports/ap-aging-detail']) { const n0 = s.net.length; await s.go(p + '?vendorIds=' + o.vendor); await s.page.waitForTimeout(3000);
  console.log(p, '| chips', JSON.stringify(await s.chips()), '| rows', JSON.stringify(await s.rows(6)).slice(0, 400), '| calls', s.net.slice(n0).filter((c) => /reports\/ap/.test(c.u)).map((c) => c.st + ' ' + c.u.replace(/^.*reports\//, '')).join(' ; ').slice(0, 500)); await s.shot(p.split('/').pop()); }
await s.close(); process.exit(0);
