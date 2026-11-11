// p36_exact.mjs — 11 Nov 2026: Totals tests (C715456-C715461) need exact amounts. Try an all-API invoice whose body says cost 1000.00 and
// no tax: does the report show $1,000.00? (If not, the amount comes from the lines and another route is needed.) Customer
// "ZZAUTOTEST EXACT PROBE". Output p36/out.json.
if (!process.env.RUN_P36) { console.log("skipped: run with RUN_P36=1 when nothing else is signed in"); process.exit(0); }
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p36/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = {};
const ok = (t, r) => { o[t] = r.st; if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
try { await S.loc(a); const cid = ok('customer', await a.post('/api/customers/create', { name: 'ZZAUTOTEST EXACT PROBE' })).data?.company_id; o.cid = cid;
  const contact = ok('contact', await a.post('/api/contacts/create', { company_id: cid, first_name: 'ZZ', last_name: 'Exact' })).data?.contact_id;
  const v = ok('vehicle', await a.post('/api/vehicles/create', { company_id: cid, customer_id: contact, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); const vehicle = v.data?.vehicle_id || v.data?.id;
  const w = ok('wo', await a.post('/api/work-orders/create', { company_id: cid, vehicle_id: vehicle, workplace_id: S.WP.heavy, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id;
  ok('wc', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: vehicle, contact_id: contact, update_vehicle: true })); ok('line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: S.CANNED, status: 'authorized' }));
  const l = (await a.get('/api/work-orders/lines/' + id)).j.data.collection[0]; ok('st', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id })); ok('lc', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' }));
  ok('woc', await a.post('/api/work-orders/change-status', { id, status: 'complete' })); const num = (await a.get('/api/work-orders/view/' + id)).j.data.work_order.display_number; const day = '2026-10-26T18:00:00.000Z';
  const r = await a.post('/api/invoices/create', { invoice_number: num, due_date: day, discount: 0, cost: '1000.00', customer_id: contact, company_id: cid, work_order_id: id, work_place_id: S.WP.heavy, work_order_part_cost: '0.00', work_order_labour_cost: '1000.00', time_estimate: '0.00', include_declined: false, created_on: day, tax: { id: '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b', name: 'GST', rates: [], rateTotal: 0, amountTotal: 0 } });
  o.inv = [r.st, JSON.stringify(r.j).slice(0, 300)];
  const rep = await a.get(`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-10&customers=${cid}`); o.rows = (rep.j?.data?.collection?.[0]?.rows || []).map((x) => [x.documentNumber, x.amountCents, x.openBalanceCents, x.daysPastDue]);
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 1200)); await s.close(); process.exit(0);
