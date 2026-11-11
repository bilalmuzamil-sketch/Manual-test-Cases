// p24e_dayb.mjs — 11 Nov 2026 (before midnight at the location): C1062566 data. Customer "ZZAUTOTEST CREDIT DAY B": work order with the
// canned line ($174.04) + deposit $200 (POST /api/deposits, as the screen sends it) → complete → invoice today (API, as p26) → the
// invoice is paid from the deposit and $25.96 stays as an unused deposit dated today (10 Nov at the location) → credit memo $50 dated
// 10 Nov (POST /api/credit-memos, as the Issue Credit screen sends it). Both dated 10 Nov = date A; the check runs on 11 Nov. Output p24/dayb.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p24/', import.meta.url).pathname; const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = {};
const ok = (t, r) => { o[t] = r.st; if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
const TAX = { id: '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b', name: 'GST', isEnabledLabor: true, isEnabledParts: true, isEnabledShopSupplies: true, isDefault: true, isDeletable: false, rates: [{ id: 'f98f5826-14d7-475e-8d1b-3fc10bf400bc', name: 'GST', percentage: 5, amount: 8.29 }], rateTotal: 5, amountTotal: 8.29 };
try {
  await S.loc(a);
  const c = ok('customer', await a.post('/api/customers/create', { name: 'ZZAUTOTEST CREDIT DAY B' })); o.cid = c.data?.company_id || c.data?.id;
  o.contact = ok('contact', await a.post('/api/contacts/create', { company_id: o.cid, first_name: 'ZZ', last_name: 'DayB' })).data?.contact_id;
  const v = ok('vehicle', await a.post('/api/vehicles/create', { company_id: o.cid, customer_id: o.contact, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); o.vehicle = v.data?.vehicle_id || v.data?.id;
  const w = ok('wo', await a.post('/api/work-orders/create', { company_id: o.cid, vehicle_id: o.vehicle, workplace_id: S.WP.heavy, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id; o.wo = id;
  ok('wo-contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: o.vehicle, contact_id: o.contact, update_vehicle: true }));
  ok('line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: S.CANNED, status: 'authorized' }));
  const view0 = (await a.get('/api/work-orders/view/' + id)).j.data.work_order; o.num = view0.display_number;
  ok('deposit', await a.post('/api/deposits', { workOrderId: id, amount: 200, paymentMethod: 'CASH', depositDate: new Date().toISOString(), memo: 'Deposit for Work Order ' + o.num }));
  const l = (await a.get('/api/work-orders/lines/' + id)).j.data.collection[0];
  ok('story', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id }));
  ok('line-complete', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' }));
  ok('wo-complete', await a.post('/api/work-orders/change-status', { id, status: 'complete' }));
  const now = new Date().toISOString();
  const inv = ok('invoice', await a.post('/api/invoices/create', { invoice_number: o.num, due_date: now, discount: 0, cost: '165.75', customer_id: o.contact, company_id: o.cid, work_order_id: id, work_place_id: S.WP.heavy, work_order_part_cost: '0.00', work_order_labour_cost: '150.00', time_estimate: '0.00', include_declined: false, created_on: now, tax: TAX }));
  o.inv = JSON.stringify(inv).slice(0, 300); o.acct = inv.data?.customer_account_id;
  ok('credit', await a.post('/api/credit-memos', { customerAccountId: o.acct, amount: 50, reason: 'ZZAUTOTEST aging credit dated 10 Nov\n— Admin ShopView', originKind: 'manual', originDate: '2026-11-10T07:00:00.000Z' }));
} catch (e) { o.err = String(e).slice(0, 400); }
for (const D of ['2026-11-10', '2026-11-11']) for (const b of ['days_1_to_30', 'current']) { const x = await a.get(`/api/reporting/reports/ar-aging-detail/buckets/${b}/rows?asOfDate=${D}&customers=${o.cid}&pagination[page]=1&pagination[rowsPerPage]=100`); o[`r-${D}-${b}`] = [x.st, (x.j?.data?.collection || []).map((q) => [q.transactionType, q.documentNumber, q.date, q.daysPastDue, q.openBalanceCents])]; }
fs.writeFileSync(OUT + 'dayb.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
