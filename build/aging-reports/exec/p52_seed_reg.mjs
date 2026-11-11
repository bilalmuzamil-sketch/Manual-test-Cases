// p52_seed_reg.mjs — 11 Nov 2026: data for the 72 V1-regression tests added to run 557 (C1078974–C1079045) that need documents of their own.
// Customers "ZZR <name><SFX>", vendors "ZZRV <name><SFX>". Each set notes its test. Dates: daysAgo from 11 Nov 2026 (11:00 at the location).
// History sets use dated payments (customer: xseed.pay(..., when); vendor: vseed.pay(..., when)). Output p52/out.json (+ read-back per name).
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import { mkX } from './xseed.mjs'; import { mkV } from './vseed.mjs'; import fs from 'fs';
const OUT = new URL('./p52/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/customers'); const p = s.page; const a = mk(p);
const o = { sets: {} }; const log = (t) => { console.log(t); (o.log ||= []).push(t); }; const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
const SFX = process.env.SFX || ''; const X = mkX(a, log); const V = mkV(a, p, log, SFX); const HD = S.WP.heavy, LB = S.WP.leth;
const day = (daysAgo, h = '12:00:00') => new Date(Date.UTC(2026, 10, 11 - daysAgo)).toISOString().slice(0, 10) + ' ' + h;
const C = async (n, term) => X.customer('ZZR ' + n, term); /* xseed adds process.env.SFX itself */
const SETS = {
  G1: async () => { const c = await C('Bucket Ten', 'COD'); await X.invoice(c, 10, 100, HD, 'D-100'); return [c]; },                      // C1078995: due day D = 100 days ago
  G2: async () => { const c = await C('Credit Fifteen', 'COD'); await X.credit(c, 15, 40, HD, 'C-40'); return [c]; },                    // C1078996: credit day C = 40 days ago
  G3: async () => { const c = await C('No Due Date', 'Net 30'); const d = await X.invoice(c, 64, 40, HD, 'nodue'); o.g3inv = d; return [c]; }, // C1078998 (due date left as made)
  G4: async () => { const c = await C('Net Credits', 'Net 30'); await X.invoice(c, 100, 40, HD, '10-past'); await X.credit(c, 30, 5, HD, 'cm-30'); await X.invoice(c, 50, 5, HD, 'not-due'); return [c]; }, // C1079003
  G5: async () => { const c = await C('Part Paid', 'COD'); const d = await X.invoice(c, 250, 10, HD, '250'); await X.pay(c, d, 100, HD, day(5)); return [c]; }, // C1079014
  G6: async () => { const c = await C('Credit Five', 'COD'); await X.credit(c, 5, 6, HD, 'cm-5'); return [c]; },                        // C1079015
  G8: async () => { const c = await C('Collection Mix', 'Net 30'); await X.invoice(c, 41, 35, HD, 'A-5-past'); await X.invoice(c, 42, 30, HD, 'B-due-today'); await X.invoice(c, 43, 23, HD, 'C-due-next-week'); await X.credit(c, 44, 7, HD, 'cm-last-week'); return [c]; }, // C1079018
  G9: async () => { const c = await C('Credit Last Week', 'COD'); await X.credit(c, 33, 7, HD, 'cm'); return [c]; },                    // C1079019
  G10: async () => { const c = await C('Twelve Days', 'Net 30'); await X.invoice(c, 112, 42, HD, 'due-12-ago'); await X.credit(c, 13, 3, HD, 'cm-3'); return [c]; }, // C1079021
  G11: async () => { const c = await C('Nothing Due', 'Net 30'); await X.invoice(c, 21, 3, HD, 'not-due'); return [c]; },               // C1079024: nothing past due, no credit
  H1: async () => { const c = await C('Dated D', 'COD'); await X.invoice(c, 77, 20, HD, 'inv-D'); await X.credit(c, 7, 19, HD, 'cm-D+1'); return [c]; }, // C1078984: D = 20 days ago
  H3: async () => { const c = await C('Paid Later', 'COD'); const d = await X.invoice(c, 100, 20, HD, 'inv-D'); await X.pay(c, d, 40, HD, day(15)); return [c]; }, // C1078986: payment D+5
  H4: async () => { const c = await C('Paid In Full', 'COD'); const d = await X.invoice(c, 90, 20, HD, 'inv'); await X.pay(c, d, 90, HD, day(10)); return [c]; }, // C1078987: paid day P = 10 days ago
  PA: async () => { const c = await C('Credits Today', 'COD'); await X.credit(c, 8, 0, HD, 'cm-today'); await X.credit(c, 6, 1, HD, 'cm-yesterday'); await X.invoice(c, 55, 12, HD, 'past-due-12'); return [c]; }, // C1095430, C1095442
  PB: async () => { const v = await V.vendor('ZZRV Credits Today', 'COD'); await V.credit(v, 9, 0, HD, 'vc-today'); await V.credit(v, 4, 1, HD, 'vc-yesterday'); return [v]; }, // C1095431
  VA: async () => { const v = await V.vendor('ZZRV Credit Twelve', 'COD'); await V.credit(v, 12, 70, HD, 'vc-70'); return [v]; },        // C1078997: credit day C = 70 days ago
  VB: async () => { const v = await V.vendor('ZZRV Net Mix', 'Net 30'); await V.bill(v, 300, 70, HD, '40-past'); await V.bill(v, 90, 5, HD, 'not-due'); await V.credit(v, 20, 35, HD, 'vc-35'); return [v]; }, // C1079025
  VC: async () => { const v = await V.vendor('ZZRV Due Nine', 'Net 30'); await V.bill(v, 99, 21, HD, 'due-in-9'); return [v]; },          // C1079030
  VD: async () => { const v = await V.vendor('ZZRV Credit Ten', 'COD'); await V.credit(v, 25, 10, HD, 'vc-10'); return [v]; },          // C1079031
  VE: async () => { const v = await V.vendor('ZZRV Dated D', 'COD'); await V.bill(v, 61, 20, HD, 'bill-D'); await V.bill(v, 62, 19, HD, 'bill-D+1'); return [v]; }, // C1078985
  VF: async () => { const v = await V.vendor('ZZRV Paid Later', 'COD'); const d = await V.bill(v, 200, 20, HD, 'bill-D'); await V.pay(v, d, 80, V.ymd(16)); return [v]; }, // C1078993: paid D+4
  VG: async () => { const v = await V.vendor('ZZRV Overpaid', 'COD'); const d = await V.bill(v, 100, 15, HD, 'bill-100'); try { await V.pay(v, d, 110, V.ymd(10)); } catch (e) { log('  vendor overpay refused: ' + String(e).slice(0, 200)); } return [v]; }, // C1079000
};
await p.waitForTimeout(2000); await S.loc(a); const ONLY = process.env.ONLY?.split(',');
for (const [k, fn] of Object.entries(SETS)) { if (ONLY && !ONLY.includes(k)) continue; log('== ' + k);
  try { const xs = await fn(); o.sets[k] = xs.map((x) => ({ name: x.name, id: x.cid || x.id, acct: x.acct, docs: x.docs })); }
  catch (e) { log('  ERR ' + String(e).slice(0, 400)); o.sets[k + '-err'] = String(e).slice(0, 400); } save(); }
o.disc = V.disc; save(); await s.close(); process.exit(0);
