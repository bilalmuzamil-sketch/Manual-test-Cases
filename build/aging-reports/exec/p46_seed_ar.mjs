// p46_seed_ar.mjs — 11 Nov 2026: A/R exact-amount seed for 21 waiting tests (see seed-specs-1111.txt). Names "ZZX …" (ZZAUTOTEST family).
// Due date = invoice date for COD, +30 days for Net 30 (term at the moment the invoice is made; p45 proved a later switch does not move earlier
// invoices). Reads every customer back from A/R Collection/Summary and stores names, numbers and the report's own figures in p46/out.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import { mkX } from './xseed.mjs'; import fs from 'fs';
const OUT = new URL('./p46/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/customers'); const a = mk(s.page);
const lines = []; const log = (t) => { lines.push(t); console.log(t); }; const X = mkX(a, log); const o = { sets: {} }; const HD = S.WP.heavy, LB = S.WP.leth;
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
const SETS = {
  R1: async () => { const out = []; for (const [n, v] of [['A', [100, 200, 300, 250, 350]], ['B', [300, 100, 200, 350, 150]], ['C', [200, 300, 100, 150, 250]]]) { const c = await X.customer('ZZX Sort Cust ' + n, 'Net 30');
      await X.invoice(c, v[0], 0, HD, 'current'); await X.invoice(c, v[1], 45, HD, '1-30'); await X.invoice(c, v[2], 75, HD, '31-60'); await X.invoice(c, v[3], 105, HD, '61-90'); await X.invoice(c, v[4], 150, HD, '91+'); out.push(c); } return out; },
  R2: async () => { const A = await X.customer('ZZX Doc Cust A', 'Net 30'); const dA = await X.invoice(A, 300, 40, HD, 'A'); await X.pay(A, dA, 250);
    const B = await X.customer('ZZX Doc Cust B', 'COD'); await X.invoice(B, 100, 20, HD, 'B');
    const C = await X.customer('ZZX Doc Cust C', 'Net 30'); const dC = await X.invoice(C, 200, 35, HD, 'C'); await X.pay(C, dC, 50); return [A, B, C]; },
  R3: async () => { const G = await X.customer('ZZX Doc Group', 'Net 30'); const dA = await X.invoice(G, 300, 40, HD, 'A'); await X.pay(G, dA, 250); const dC = await X.invoice(G, 200, 35, HD, 'C'); await X.pay(G, dC, 50);
    await X.setTerm(G, 'COD'); await X.invoice(G, 100, 20, HD, 'B'); return [G]; },
  R4: async () => { const c = await X.customer('ZZX CSV Sum A', 'COD'); await X.invoice(c, 1250.50, 15, HD, '1-30'); await X.invoice(c, 99, 100, HD, '91+'); return [c]; },
  R5: async () => { const c = await X.customer('ZZX CSV Det A', 'COD'); await X.invoice(c, 1250.50, 45, HD, 'A'); await X.invoice(c, 75, 15, HD, 'B'); return [c]; },
  R6: async () => { const A = await X.customer('ZZX Tot Cust A', 'COD'); await X.invoice(A, 1000, 15, HD, 'A-1000'); await X.invoice(A, 400, 45, LB, 'A-400-LB'); await X.credit(A, 150, 5, HD, 'A-credit');
    const B = await X.customer('ZZX Tot Cust B', 'COD'); await X.invoice(B, 700, 45, HD, 'B-700'); await X.invoice(B, 250, 100, LB, 'B-250-LB');
    const C = await X.customer('ZZX Tot Cust C', 'COD'); await X.invoice(C, 900, 5, HD, 'C-900'); return [A, B, C]; },
  R8: async () => { const A = await X.customer('ZZX Bkt Cust A', 'COD'); await X.invoice(A, 400, 45, HD, 'A-400'); await X.invoice(A, 300, 15, LB, 'A-300-LB'); await X.setTerm(A, 'Net 30'); await X.invoice(A, 1000, 0, HD, 'A-1000-notdue');
    const B = await X.customer('ZZX Bkt Cust B', 'COD'); const d = await X.invoice(B, 700, 45, HD, 'B-700'); await X.pay(B, d, 200); await X.invoice(B, 250, 100, HD, 'B-250'); return [A, B]; },
  R9: async () => { const c = await X.customer('ZZX Bounds', 'COD'); for (const [amt, dd] of [[1, 1], [30, 30], [31, 31], [60, 60], [61, 61], [90, 90], [91, 91]]) await X.invoice(c, amt, dd, HD, String(dd)); await X.setTerm(c, 'Net 30'); await X.invoice(c, 10, 0, HD, 'notdue'); return [c]; },
  R10: async () => { const out = []; for (const [n, amt] of [['A', 100], ['B', 200], ['C', 300], ['D', 400], ['E', 500]]) { const c = await X.customer('ZZX Quick ' + n, 'COD'); await X.invoice(c, amt, 5, HD, n); out.push(c); } return out; },
  R11: async () => { const c = await X.customer('ZZX Pay Later', 'COD'); await X.invoice(c, 500, 5, HD, 'A'); return [c]; },
  R12: async () => { const A = await X.customer('ZZX Diff Cust A', 'COD'); await X.invoice(A, 400, 45, HD, 'A-400'); await X.invoice(A, 300, 15, HD, 'A-300'); await X.credit(A, 150, 5, HD, 'A-credit'); await X.setTerm(A, 'Net 30'); await X.invoice(A, 1000, 0, HD, 'A-1000-notdue');
    const B = await X.customer('ZZX Diff Cust B', 'COD'); await X.invoice(B, 500, 45, HD, 'B-500'); await X.invoice(B, 250, 100, HD, 'B-250'); return [A, B]; },
  R13: async () => { const c = await X.customer('ZZX Credit Only', 'COD'); const d = await X.invoice(c, 50, 10, HD, 'paid'); await X.pay(c, d, 50); await X.credit(c, 150, 3, HD, 'credit'); return [c]; },
  R14: async () => { const c = await X.customer('ZZX Credit Today', 'COD'); await X.invoice(c, 500, 20, HD, 'A'); await X.credit(c, 120, 0, HD, 'credit-today'); return [c]; },
};
const ONLY = process.env.ONLY?.split(',');
for (const [k, fn] of Object.entries(SETS)) { if (ONLY && !ONLY.includes(k)) continue; log('== ' + k); try { const cs = await fn(); o.sets[k] = cs.map((c) => ({ name: c.name, cid: c.cid, acct: c.acct, docs: c.docs }));
    for (const c of cs) { const r = await a.get(`/api/reporting/reports/ar-aging-detail?asOfDate=2026-11-11&customers=${c.cid}`); const g = (r.j?.data?.groups || []).map((x) => [x.bucket, x.rowsNumber, x.openBalanceCents]); o.sets[k].find((x) => x.cid === c.cid).groups = g; log('  read back ' + c.name + ' ' + JSON.stringify(g)); } }
  catch (e) { o.sets[k] = { err: String(e).slice(0, 300) }; log('  ERR ' + String(e).slice(0, 200)); } save(); }
o.log = lines; save(); await s.close(); process.exit(0);
