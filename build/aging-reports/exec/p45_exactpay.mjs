// p45_exactpay.mjs — 11 Nov 2026: proves the rest of the exact-amount seed before writing the big seed: (1) an invoice dated 40 days ago and DUE 10 days ago
// (separate created_on / due_date), $300.00 exactly by a Fixed Line Total line on a tax-exempt customer; (2) a part payment of $250.00 through the
// app's own call (customer-account/create-customer-payment, payload from playbook 019) leaves $50.00 open; (3) the A/R report row reads back
// date, due date, days past due, amount 30000 and open 5000. Output p45/out.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p45/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/customers'); const a = mk(s.page); const o = {};
const ok = (t, r) => { o[t] = [r.st, JSON.stringify(r.j).slice(0, 400)]; if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
const EXEMPT = { id: '0c47b1fb-38bb-4788-8719-6900c365e34c', isEnabledLabor: false, isEnabledParts: false, isEnabledShopSupplies: false };
const dayAt = (daysAgo) => new Date(Date.UTC(2026, 10, 11 - daysAgo, 18)).toISOString();
try { await S.loc(a); const name = 'ZZAUTOTEST EXACT PAY PROBE';
  const cid = ok('customer', await a.post('/api/customers/create', { name })).data.company_id; o.cid = cid;
  ok('exempt', await a.post('/api/customers/change', { name, state_or_province: null, country_code: 'CA', require_po: false, credit_term: 'COD', credit_limit: 0, shop_supplies_charge: 0, min_shop_supplies_charge: null, max_shop_supplies_charge: null, pin_notes: false, notes: null, id: cid, tax: EXEMPT }));
  const contact = ok('contact', await a.post('/api/contacts/create', { company_id: cid, first_name: 'ZZ', last_name: 'Pay' })).data.contact_id;
  const vj = ok('vehicle', await a.post('/api/vehicles/create', { company_id: cid, customer_id: contact, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); const vehicle = vj.data.vehicle_id || vj.data.id;
  const id = ok('wo', await a.post('/api/work-orders/create', { company_id: cid, vehicle_id: vehicle, workplace_id: S.WP.heavy, start_date: '2026-10-02', is_vehicle_here: true, mileage: 1000 })).data.work_order_id;
  ok('wo-contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: vehicle, contact_id: contact, update_vehicle: true }));
  ok('line', await a.post('/api/work-orders/lines/create', { work_order_id: id, line_name: 'ZZAUTOTEST exact 300', description: 'ZZAUTOTEST exact 300', time_estimate: '0', tech_time: '0', status: 'authorized', is_authorized_to_repair: true, is_diagnosis: false, is_parts_required_are_authorized: false, is_warranty: false, tech_story: '', fixed_line_total: '300.00', fixed_line_labor_price: '300.00', fixed_line_parts_price: '0', assigned_techs: [], another: false }));
  for (const l of (await a.get('/api/work-orders/lines/' + id)).j.data.collection) { ok('story', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id })); ok('lc', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' })); }
  ok('wo-complete', await a.post('/api/work-orders/change-status', { id, status: 'complete' })); const num = (await a.get('/api/work-orders/view/' + id)).j.data.work_order.display_number; o.num = num;
  const inv = ok('invoice', await a.post('/api/invoices/create', { invoice_number: num, due_date: dayAt(10), discount: 0, cost: '300.00', customer_id: contact, company_id: cid, work_order_id: id, work_place_id: S.WP.heavy, work_order_part_cost: '0.00', work_order_labour_cost: '300.00', time_estimate: '0.00', include_declined: false, created_on: dayAt(40), tax: { id: EXEMPT.id, name: 'Exempt', rates: [], rateTotal: 0, amountTotal: 0 } }));
  const acct = inv.data.customer_account_id; o.acct = acct;
  const un = await a.get(`/api/customer-account/list-unpaid-transaction?accountId=${acct}&openOnly=true`); const rowsU = un.j?.data?.collection || un.j?.data || []; o.unpaid = JSON.stringify(rowsU).slice(0, 600);
  const row = rowsU.find((x) => x.reference_id === inv.data.invoice_id) || rowsU[0];
  ok('payment', await a.post('/api/customer-account/create-customer-payment', { account_id: acct, payment_date: '2026-11-01 12:00:00', payment_method: 'CASH', reference_number: 'ZZPAY', description: 'ZZAUTOTEST part payment', transactions: [{ ...row, transaction_payment_amount: 250 }], primary_id: row.id, new_credit: 0, new_deposit: 0, applied_credits: [], applied_deposits: [], ibs_batch_id: null, payment_amount: 250 }));
  ok('credit', await a.post('/api/credit-memos', { customerAccountId: acct, amount: 150, reason: 'ZZAUTOTEST exact credit', originKind: 'manual', originDate: '2026-11-05T07:00:00.000Z' }));
  const rep = await a.get(`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-11&customers=${cid}`); o.rows = (rep.j?.data?.collection?.[0]?.rows || []).map((x) => [x.documentNumber, x.transactionType, x.date, x.dueDate, x.daysPastDue, x.amountCents, x.openBalanceCents]);
} catch (e) { o.err = String(e).slice(0, 400); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
