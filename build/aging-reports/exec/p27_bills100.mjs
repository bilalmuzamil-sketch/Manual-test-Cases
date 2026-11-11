// p27_bills100.mjs — 11 Nov 2026: C1062571 needs a vendor with more than 100 unpaid bills. Vendor "ZZAUTOTEST OVER100 V" (Net 30) + 105
// bills through the API (PO create + accept), dated 1-20 Sep 2026 (all overdue on 10 Nov), numbers ZZO100-001…105. Resumable. Output p27/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p27/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/parts/vendors'); const a = mk(s.page);
const st = fs.existsSync(OUT + 'state.json') ? JSON.parse(fs.readFileSync(OUT + 'state.json')) : { made: [] }; const keep = () => fs.writeFileSync(OUT + 'state.json', JSON.stringify(st, null, 1));
await S.loc(a); if (!st.vid) { st.vid = await S.vendor(a, 'ZZAUTOTEST OVER100 V'); keep(); }
for (let i = st.made.length; i < 105; i++) { const n = 'ZZO100-' + String(i + 1).padStart(3, '0'); try { await S.bill(a, st.vid, { amount: 10 + i, date: `2026-09-${String(1 + (i % 20)).padStart(2, '0')}`, number: n }); st.made.push(n); keep(); } catch (e) { st.err = String(e).slice(0, 300); keep(); console.log('ERR', st.err); break; } }
const r = await a.get(`/api/reporting/reports/ap-unpaid-invoices?asOfDate=2026-11-10&vendors=${st.vid}`); console.log('made', st.made.length, 'rowsNumber', r.j?.data?.collection?.[0]?.rowsNumber, 'rows returned', r.j?.data?.collection?.[0]?.rows?.length);
await s.close(); process.exit(0);
