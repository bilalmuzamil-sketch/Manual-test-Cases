// p42_exact.mjs — 11 Nov 2026: try an exact-amount invoice by the app's own line call (found in LineDialog: POST work-orders/lines/create with
// fixed_line_total / fixed_line_labor_price / fixed_line_parts_price when the labour type is "Fixed Line Total"). Customer made tax-exempt and
// with no shop supplies by the same call the Edit Customer screen sends (captured by p38: customers/change with tax Exempt, shop_supplies_charge 0).
// One invoice of $1,000.00 dated 15 days ago at Staging Heavy Duty - 9919; reads the amount back from the A/R report. Output p42/out.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p42/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/customers'); const a = mk(s.page); const o = {};
const ok = (t, r) => { o[t] = [r.st, JSON.stringify(r.j).slice(0, 300)]; if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
const EXEMPT = { id: '0c47b1fb-38bb-4788-8719-6900c365e34c', isEnabledLabor: false, isEnabledParts: false, isEnabledShopSupplies: false };
try { await S.loc(a); const name = 'ZZAUTOTEST EXACT PROBE 2';
  const cid = ok('customer', await a.post('/api/customers/create', { name })).data.company_id; o.cid = cid;
  ok('exempt', await a.post('/api/customers/change', { name, state_or_province: null, country_code: 'CA', require_po: false, credit_term: 'COD', credit_limit: 0, shop_supplies_charge: 0, min_shop_supplies_charge: null, max_shop_supplies_charge: null, pin_notes: false, notes: null, id: cid, tax: EXEMPT }));
  const contact = ok('contact', await a.post('/api/contacts/create', { company_id: cid, first_name: 'ZZ', last_name: 'Exact' })).data.contact_id;
  const vj = ok('vehicle', await a.post('/api/vehicles/create', { company_id: cid, customer_id: contact, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); const vehicle = vj.data.vehicle_id || vj.data.id;
  const id = ok('wo', await a.post('/api/work-orders/create', { company_id: cid, vehicle_id: vehicle, workplace_id: S.WP.heavy, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })).data.work_order_id; o.wo = id;
  ok('wo-contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: vehicle, contact_id: contact, update_vehicle: true }));
  ok('line', await a.post('/api/work-orders/lines/create', { work_order_id: id, line_name: 'ZZAUTOTEST exact 1000', description: 'ZZAUTOTEST exact 1000', time_estimate: '0', tech_time: '0', status: 'authorized', is_authorized_to_repair: true, is_diagnosis: false, is_parts_required_are_authorized: false, is_warranty: false, tech_story: '', fixed_line_total: '1000.00', fixed_line_labor_price: '1000.00', fixed_line_parts_price: '0', assigned_techs: [], another: false }));
  const lines = (await a.get('/api/work-orders/lines/' + id)).j.data.collection; o.lines = lines.map((l) => [l.line_id, l.status, l.fixed_line_total, l.total_labour_cost, l.cost, l.name]);
  for (const l of lines) { ok('story', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id })); ok('lc', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' })); }
  ok('wo-complete', await a.post('/api/work-orders/change-status', { id, status: 'complete' })); const num = (await a.get('/api/work-orders/view/' + id)).j.data.work_order.display_number; o.num = num;
  const day = new Date(Date.UTC(2026, 9, 27, 18)).toISOString(); // 27 Oct 2026 18:00Z, COD -> 15 days past due on 11 Nov
  ok('invoice', await a.post('/api/invoices/create', { invoice_number: num, due_date: day, discount: 0, cost: '1000.00', customer_id: contact, company_id: cid, work_order_id: id, work_place_id: S.WP.heavy, work_order_part_cost: '0.00', work_order_labour_cost: '1000.00', time_estimate: '0.00', include_declined: false, created_on: day, tax: { id: EXEMPT.id, name: 'Exempt', rates: [], rateTotal: 0, amountTotal: 0 } }));
  const rep = await a.get(`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-11&customers=${cid}`); o.rows = (rep.j?.data?.collection?.[0]?.rows || []).map((x) => [x.documentNumber, x.date, x.dueDate, x.daysPastDue, x.amountCents, x.openBalanceCents, x.locationName]);
} catch (e) { o.err = String(e).slice(0, 400); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
