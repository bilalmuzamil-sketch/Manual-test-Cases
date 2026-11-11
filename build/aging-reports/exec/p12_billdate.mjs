// p12_billdate.mjs — 11 Nov 2026: is the seeded bill missing from A/P aging because of its date? Make a bill dated 2026-11-09 for the
// same seeded vendor and read A/P Summary for that vendor as of 2026-11-10. Also read the location's time zone. Output exec/p12/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p12/', import.meta.url).pathname; const s = await start(OUT); const a = mk(s.page); await S.loc(a);
const o = JSON.parse(fs.readFileSync(new URL('./p07/seedtest.json', import.meta.url)));
const b = await S.bill(a, o.vendor, { amount: 5.55, date: '2026-11-09' }); console.log('bill', JSON.stringify(b));
const r = await a.get(`/api/reporting/reports/ap-aging-summary?asOfDate=2026-11-10&vendors=${o.vendor}`); console.log('summary', JSON.stringify(r.j).slice(0, 400));
const w = await a.get('/api/staff/my-workplaces'); console.log('workplaces', JSON.stringify(w.j).slice(0, 700));
await s.close(); process.exit(0);
