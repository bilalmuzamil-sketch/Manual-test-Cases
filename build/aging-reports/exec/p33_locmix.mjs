// p33_locmix.mjs — 11 Nov 2026: C715298 needs an A/R Collection group with documents at both locations and two transaction types.
// Customer "ZZAUTOTEST LOC MIX": invoice at Heavy Duty dated 1 Oct, credit memo (made while at Heavy Duty) dated 2 Oct, invoice at
// Lethbridge dated 3 Oct (location switched for it, then back). All-API as p26/p24e. Output p33/out.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p33/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = {};
const ok = (t, r) => { o[t] = r.st; if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
const TAX = { id: '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b', name: 'GST', isEnabledLabor: true, isEnabledParts: true, isEnabledShopSupplies: true, isDefault: true, isDeletable: false, rates: [{ id: 'f98f5826-14d7-475e-8d1b-3fc10bf400bc', name: 'GST', percentage: 5, amount: 8.29 }], rateTotal: 5, amountTotal: 8.29 };
async function inv(c, wp, day, tag) { await S.loc(a, wp);
  const w = ok(tag + 'wo', await a.post('/api/work-orders/create', { company_id: c.cid, vehicle_id: c.vehicle, workplace_id: wp, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id;
  ok(tag + 'wc', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: c.vehicle, contact_id: c.contact, update_vehicle: true }));
  ok(tag + 'line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: S.CANNED, status: 'authorized' })); const l = (await a.get('/api/work-orders/lines/' + id)).j.data.collection[0];
  ok(tag + 'story', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id })); ok(tag + 'lc', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' }));
  ok(tag + 'woc', await a.post('/api/work-orders/change-status', { id, status: 'complete' })); const num = (await a.get('/api/work-orders/view/' + id)).j.data.work_order.display_number;
  const r = ok(tag + 'inv', await a.post('/api/invoices/create', { invoice_number: num, due_date: day, discount: 0, cost: '165.75', customer_id: c.contact, company_id: c.cid, work_order_id: id, work_place_id: wp, work_order_part_cost: '0.00', work_order_labour_cost: '150.00', time_estimate: '0.00', include_declined: false, created_on: day, tax: TAX }));
  return { num, acct: r.data?.customer_account_id }; }
try { await S.loc(a); const c = {}; c.cid = ok('customer', await a.post('/api/customers/create', { name: 'ZZAUTOTEST LOC MIX' })).data?.company_id;
  c.contact = ok('contact', await a.post('/api/contacts/create', { company_id: c.cid, first_name: 'ZZ', last_name: 'LocMix' })).data?.contact_id;
  const v = ok('vehicle', await a.post('/api/vehicles/create', { company_id: c.cid, customer_id: c.contact, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); c.vehicle = v.data?.vehicle_id || v.data?.id; o.c = c;
  o.hd = await inv(c, S.WP.heavy, '2026-10-01T18:00:00.000Z', 'hd-');
  await S.loc(a); ok('credit', await a.post('/api/credit-memos', { customerAccountId: o.hd.acct, amount: 40, reason: 'ZZAUTOTEST loc mix credit\n— Admin ShopView', originKind: 'manual', originDate: '2026-10-02T07:00:00.000Z' }));
  o.lb = await inv(c, S.WP.leth, '2026-10-03T18:00:00.000Z', 'lb-');
} catch (e) { o.err = String(e).slice(0, 400); }
await S.loc(a); const r = await a.get(`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-10&customers=${o.c?.cid}`); o.rows = (r.j?.data?.collection?.[0]?.rows || []).map((x) => [x.locationName, x.transactionType, x.documentNumber, x.daysPastDue]);
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 1500)); await s.close(); process.exit(0);
