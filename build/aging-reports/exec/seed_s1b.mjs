// seed_s1b.mjs — 11 Nov 2026: vendor "zzcaps supply" next to "ZZCAPS Supply" (the product allows a capitals-only vendor pair when the
// address differs: "A vendor with this name and address already exists"), with one open bill today. Appends to seeds.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const F = new URL('./seeds.json', import.meta.url).pathname; const seeds = JSON.parse(fs.readFileSync(F));
const s = await start(new URL('./seed-s1b/', import.meta.url).pathname, '/workorders'); const a = mk(s.page); await S.loc(a);
const r = await a.post('/api/parts-catalogue/add-vendor', { name: 'zzcaps supply', tax_id: S.TAX, country: 'CA', credit_term: 'NET_30', credit_limit: 0, address_1: '1 Lower Case Road', city: 'Calgary' });
console.log('add-vendor', r.st, JSON.stringify(r.j).slice(0, 200));
if (r.st < 300) { const id = r.j.data.vendor_id; seeds.vendors['zzcaps supply'] = { id, bills: [await S.bill(a, id, { amount: 44, date: process.env.DAY || '2026-11-10' })], note: 'address 1 Lower Case Road (same name with other capitals is refused at the same address)' }; fs.writeFileSync(F, JSON.stringify(seeds, null, 1)); console.log('bill ok'); }
await s.close(); process.exit(0);
