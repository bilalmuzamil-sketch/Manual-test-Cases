// p58_seed_old_hd_bill.mjs — 11 Nov 2026: C715609 needs a date A on which location B (Staging Lethbridge - 4310) had no open A/P documents.
// The A/P history on sv11315 starts with Lethbridge only (findDateA found no Heavy-Duty-only date, 2022-2026). Adds one bill at Staging Heavy
// Duty - 9919, vendor ZZAUTOTEST LOC MIX V, dated 2022-01-03, left unpaid, then reads the A/P Unpaid Invoices location list for 2022-01-15.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p58/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = {};
try { await S.loc(a); o.bill = await S.bill(a, '1a427de7-b870-4ad2-9d21-066a57683d90', { amount: 17, date: '2022-01-03', number: 'ZZLMV-OLD-HD' });
  for (const d of ['2022-01-15', '2026-11-11']) { const r = await a.get('/api/reporting/reports/ap-unpaid-invoices/locations?asOfDate=' + d); o['loc' + d] = (r.j?.data?.collection || []).map((x) => x.name || x.label || JSON.stringify(x).slice(0, 80)); }
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p58', JSON.stringify(o).slice(0, 600)); await s.close(); process.exit(0);
