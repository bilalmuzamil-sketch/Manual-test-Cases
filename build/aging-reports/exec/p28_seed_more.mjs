// p28_seed_more.mjs — 11 Nov 2026: extra rows for the S2 number-sort tests. (1) one more invoice for "ZZAUTOTEST S1R5 Alpha" dated
// 25 Oct (all-API, as p26) so Alpha has THREE invoices due 25 Oct: S11315-7195, S11315-17611 and the new 5-digit one (C715301);
// (2) bill "10024" dated 25 Oct for "ZZAUTOTEST S1R5 V Alpha" so it has 9917, 10023, 10024 (C715305/C715309). Output p28/out.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p28/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = {};
const P = JSON.parse(fs.readFileSync(new URL('./p20/out.json', import.meta.url))); const ok = (t, r) => { o[t] = r.st; if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
const TAX = { id: '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b', name: 'GST', isEnabledLabor: true, isEnabledParts: true, isEnabledShopSupplies: true, isDefault: true, isDeletable: false, rates: [{ id: 'f98f5826-14d7-475e-8d1b-3fc10bf400bc', name: 'GST', percentage: 5, amount: 8.29 }], rateTotal: 5, amountTotal: 8.29 };
try { await S.loc(a); const al = P.al;
  const w = ok('wo', await a.post('/api/work-orders/create', { company_id: al.company_id, vehicle_id: al.vehicle_id, workplace_id: S.WP.heavy, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id;
  ok('contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: al.vehicle_id, contact_id: al.contact_id, update_vehicle: true }));
  ok('line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: S.CANNED, status: 'authorized' }));
  const l = (await a.get('/api/work-orders/lines/' + id)).j.data.collection[0];
  ok('story', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id }));
  ok('lc', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' }));
  ok('wc', await a.post('/api/work-orders/change-status', { id, status: 'complete' })); const num = (await a.get('/api/work-orders/view/' + id)).j.data.work_order.display_number; o.num = num;
  ok('inv', await a.post('/api/invoices/create', { invoice_number: num, due_date: '2026-10-25T12:00:00.000Z', discount: 0, cost: '165.75', customer_id: al.contact_id, company_id: al.company_id, work_order_id: id, work_place_id: S.WP.heavy, work_order_part_cost: '0.00', work_order_labour_cost: '150.00', time_estimate: '0.00', include_declined: false, created_on: '2026-10-25T12:00:00.000Z', tax: TAX }));
} catch (e) { o.err1 = String(e).slice(0, 300); }
try { o.bill = await S.bill(a, P.va, { amount: 15, date: '2026-10-25', number: '10024' }); } catch (e) { o.err2 = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o)); await s.close(); process.exit(0);
