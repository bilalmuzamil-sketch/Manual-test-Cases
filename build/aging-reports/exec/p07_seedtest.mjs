// p07_seedtest.mjs — 11 Nov 2026: prove seedlib once — receive the p06 PO into a bill; one customer with one invoice; then read
// whether both show in A/P Unpaid / A/R Summary. Output exec/p07/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p07/', import.meta.url).pathname; const s = await start(OUT); const a = mk(s.page); const o = {};
await S.loc(a);
try { const v = await S.vendor(a, 'ZZAUTOTEST SEEDTEST V ' + (Date.now() % 1e5)); o.vendor = v; o.bill = await S.bill(a, v, { amount: 12.34 }); } catch (e) { o.billErr = String(e).slice(0, 400); }
try { o.cust = await S.customerInvoice(a, s.page, 'ZZAUTOTEST SEEDTEST C ' + (Date.now() % 1e5), { go: s.go }); } catch (e) { o.custErr = String(e).slice(0, 400); }
console.log(JSON.stringify(o).slice(0, 1500)); s.save('seedtest', o); await s.close(); process.exit(0);
