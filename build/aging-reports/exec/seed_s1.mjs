// seed_s1.mjs — 11 Nov 2026 (Rule 107): records for folder S1 "Reports open in QuickBooks name order" (C715273-C715279, C715573) and the
// handoff's name list: customers with one open invoice today, vendors with one open bill today (location calendar day 2026-11-10).
// Skips a name already in the seeds file. Appends to exec/seeds.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const F = new URL('./seeds.json', import.meta.url).pathname; const seeds = fs.existsSync(F) ? JSON.parse(fs.readFileSync(F)) : { customers: {}, vendors: {} };
const OUT = new URL('./seed-s1/', import.meta.url).pathname; const s = await start(OUT, '/workorders'); const a = mk(s.page); await S.loc(a);
const CUST = ['10 Trucking', '2 Trucking', 'A-1 Towing', 'a1 towing', 'Eagle', "Émile's", 'Emma', 'Fargo', 'Øster', 'Ozone', "Emile's Towing", "Émile's Towing",
  'ZZCAPS Haulage', 'zzcaps haulage', 'ZZPUNCT Diesel #1', 'ZZPUNCT Diesel -1', 'ZZPUNCT Diesel 1', 'ZZPUNCT Diesel @1', '#1 Diesel', '-1 Diesel', '@Home Towing'];
const VEND = ['10 Trucking', '2 Trucking', 'A-1 Towing', 'a1 towing', 'Ackley', 'æble', 'Afton', 'Strand', 'Straße', 'Strasser', 'ZZCAPS Supply', 'zzcaps supply', '#1 Diesel', '-1 Diesel', '@Home Towing', "Émile's", 'Øster', 'Ozone'];
const DAY = process.env.DAY || '2026-11-10';
for (const n of (process.env.ONLY_V ? [] : CUST)) { if (seeds.customers[n]) continue; try { seeds.customers[n] = await S.customerInvoice(a, s.page, n, { go: s.go }); console.log('customer', n, JSON.stringify(seeds.customers[n].wos.map((w) => w.invoice))); } catch (e) { console.log('customer FAIL', n, String(e).slice(0, 200)); } fs.writeFileSync(F, JSON.stringify(seeds, null, 1)); }
for (const n of VEND) { if (seeds.vendors[n]) continue; try { const id = await S.vendor(a, n); seeds.vendors[n] = { id, bills: [await S.bill(a, id, { amount: 25 + Object.keys(seeds.vendors).length, date: DAY })] }; console.log('vendor', n, id); } catch (e) { console.log('vendor FAIL', n, String(e).slice(0, 200)); } fs.writeFileSync(F, JSON.stringify(seeds, null, 1)); }
await s.close(); process.exit(0);
