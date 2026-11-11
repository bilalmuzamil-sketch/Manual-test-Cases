// p32_seed_s3.mjs — 11 Nov 2026: data for S3 export tests. (1) customer "=2+3 ZZAUTOTEST FORMULA" with one invoice today (C715576);
// (2) a third bill "ZZNEG-C" dated 1 Sep 2026 for vendor "ZZAUTOTEST NEG PASTDUE V" (COD) so it has three bills in two buckets (C715575);
// (3) read who had documents at Heavy Duty 9919 that were 31-60 AND 91+ days past due on 15 Oct 2026, customers and vendors (C715335-40).
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p32/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = {};
const ok = (t, r) => { o[t] = r.st; if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
const TAX = { id: '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b', name: 'GST', isEnabledLabor: true, isEnabledParts: true, isEnabledShopSupplies: true, isDefault: true, isDeletable: false, rates: [{ id: 'f98f5826-14d7-475e-8d1b-3fc10bf400bc', name: 'GST', percentage: 5, amount: 8.29 }], rateTotal: 5, amountTotal: 8.29 };
await S.loc(a);
try { const c = ok('customer', await a.post('/api/customers/create', { name: '=2+3 ZZAUTOTEST FORMULA' })); o.cid = c.data?.company_id || c.data?.id;
  o.contact = ok('contact', await a.post('/api/contacts/create', { company_id: o.cid, first_name: 'ZZ', last_name: 'Formula' })).data?.contact_id;
  const v = ok('vehicle', await a.post('/api/vehicles/create', { company_id: o.cid, customer_id: o.contact, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); const vehicle_id = v.data?.vehicle_id || v.data?.id;
  const w = ok('wo', await a.post('/api/work-orders/create', { company_id: o.cid, vehicle_id, workplace_id: S.WP.heavy, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id;
  ok('wc', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id, contact_id: o.contact, update_vehicle: true }));
  ok('line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: S.CANNED, status: 'authorized' })); const l = (await a.get('/api/work-orders/lines/' + id)).j.data.collection[0];
  ok('story', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id })); ok('lc', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' }));
  ok('woc', await a.post('/api/work-orders/change-status', { id, status: 'complete' })); const num = (await a.get('/api/work-orders/view/' + id)).j.data.work_order.display_number; const now = new Date().toISOString();
  ok('inv', await a.post('/api/invoices/create', { invoice_number: num, due_date: now, discount: 0, cost: '165.75', customer_id: o.contact, company_id: o.cid, work_order_id: id, work_place_id: S.WP.heavy, work_order_part_cost: '0.00', work_order_labour_cost: '150.00', time_estimate: '0.00', include_declined: false, created_on: now, tax: TAX })); o.num = num;
} catch (e) { o.err1 = String(e).slice(0, 300); }
try { o.billC = await S.bill(a, 'b39392de-ad74-448d-b0b0-a65334245987', { amount: 33, date: '2026-09-01', number: 'ZZNEG-C' }); } catch (e) { o.err2 = String(e).slice(0, 300); }
for (const [k, rep, who] of [['ar', 'ar-aging-detail', 'customerName'], ['ap', 'ap-aging-detail', 'vendorName']]) { const by = {};
  for (const b of ['days_31_to_60', 'days_91_plus']) { for (let pg = 1; pg < 20; pg++) { const r = await a.get(`/api/reporting/reports/${rep}/buckets/${b}/rows?asOfDate=2026-10-15&pagination[page]=${pg}&pagination[rowsPerPage]=100`); const c = r.j?.data?.collection || []; for (const x of c) if (x.workplaceId === S.WP.heavy) (by[x[who]] ||= new Set()).add(b); if (c.length < 100) break; } }
  o[k + 'Both'] = Object.entries(by).filter(([n, s]) => s.size === 2).map(([n]) => n).slice(0, 12); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
