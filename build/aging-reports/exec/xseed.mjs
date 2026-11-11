// xseed.mjs — 11 Nov 2026: exact-amount seed helpers (proven by p42/p45): tax-exempt customer with a chosen credit term, one Fixed-Line-Total line
// per invoice (amount exact), invoice dated N days ago at a chosen location (due date follows the customer's term at the moment the invoice is made:
// COD = the invoice date, 'Net 30' = 30 days later), part payment through create-customer-payment, credit memo of an exact amount.
import * as S from './seedlib.mjs';
export const EXEMPT = { id: '0c47b1fb-38bb-4788-8719-6900c365e34c', isEnabledLabor: false, isEnabledParts: false, isEnabledShopSupplies: false };
export const dayAt = (daysAgo) => new Date(Date.UTC(2026, 10, 11 - daysAgo, daysAgo === 0 ? 8 : 18)).toISOString(); /* 11 Nov p46: a document stamped LATER today (18:00 UTC) is left out of the report as of today until that time; today's ones are stamped 08:00 UTC (01:00 at the location) */ // 11:00 at the location on that calendar day
export function mkX(a, log) {
  const ok = (t, r) => { if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
  async function setTerm(c, term) { ok('term', await a.post('/api/customers/change', { name: c.name, state_or_province: null, country_code: 'CA', require_po: false, credit_term: term, credit_limit: 0, shop_supplies_charge: 0, min_shop_supplies_charge: null, max_shop_supplies_charge: null, pin_notes: false, notes: null, id: c.cid, tax: EXEMPT })); c.term = term; }
  async function customer(name, term = 'COD') { name = name + (process.env.SFX || ''); await S.loc(a); const cid = ok('customer', await a.post('/api/customers/create', { name })).data.company_id; const c = { name, cid, docs: [] }; await setTerm(c, term);
    c.contact = ok('contact', await a.post('/api/contacts/create', { company_id: cid, first_name: 'ZZ', last_name: 'Xx' })).data.contact_id;
    const vj = ok('vehicle', await a.post('/api/vehicles/create', { company_id: cid, customer_id: c.contact, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); c.vehicle = vj.data.vehicle_id || vj.data.id; log && log('customer ' + name + ' ' + term); return c; }
  async function invoice(c, amount, daysAgo, wp = S.WP.heavy, tag = '') { if (wp !== S.WP.heavy) await S.loc(a, wp);
    const id = ok('wo', await a.post('/api/work-orders/create', { company_id: c.cid, vehicle_id: c.vehicle, workplace_id: wp, start_date: dayAt(daysAgo).slice(0, 10), is_vehicle_here: true, mileage: 1000 })).data.work_order_id;
    ok('wo-contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: c.vehicle, contact_id: c.contact, update_vehicle: true }));
    const amt = Number(amount).toFixed(2);
    ok('line', await a.post('/api/work-orders/lines/create', { work_order_id: id, line_name: 'ZZAUTOTEST exact ' + amt, description: 'ZZAUTOTEST exact ' + amt, time_estimate: '0', tech_time: '0', status: 'authorized', is_authorized_to_repair: true, is_diagnosis: false, is_parts_required_are_authorized: false, is_warranty: false, tech_story: '', fixed_line_total: amt, fixed_line_labor_price: amt, fixed_line_parts_price: '0', assigned_techs: [], another: false }));
    for (const l of (await a.get('/api/work-orders/lines/' + id)).j.data.collection) { ok('story', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id })); ok('lc', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' })); }
    ok('wo-complete', await a.post('/api/work-orders/change-status', { id, status: 'complete' })); const num = (await a.get('/api/work-orders/view/' + id)).j.data.work_order.display_number;
    const inv = ok('invoice', await a.post('/api/invoices/create', { invoice_number: num, due_date: dayAt(daysAgo), discount: 0, cost: amt, customer_id: c.contact, company_id: c.cid, work_order_id: id, work_place_id: wp, work_order_part_cost: '0.00', work_order_labour_cost: amt, time_estimate: '0.00', include_declined: false, created_on: dayAt(daysAgo), tax: { id: EXEMPT.id, name: 'Exempt', rates: [], rateTotal: 0, amountTotal: 0 } }));
    if (wp !== S.WP.heavy) await S.loc(a); c.acct = inv.data.customer_account_id; const d = { tag, num, invoiceId: inv.data.invoice_id, wo: id, amount: Number(amt), daysAgo, wp, term: c.term }; c.docs.push(d); log && log('  invoice ' + num + ' ' + amt + ' dated -' + daysAgo + ' ' + c.term + ' ' + (wp === S.WP.heavy ? 'HD' : 'LB')); return d; }
  async function pay(c, d, amount, wp = S.WP.heavy, when = '2026-11-01 12:00:00' /* 11 Nov: payment day, 'YYYY-MM-DD HH:MM:SS' */) { if (wp !== S.WP.heavy) await S.loc(a, wp);
    const un = await a.get(`/api/customer-account/list-unpaid-transaction?accountId=${c.acct}&openOnly=true`); const rows = un.j?.response?.collection || un.j?.data?.response?.collection || un.j?.data?.collection || [];
    const row = rows.find((x) => x.reference_id === d.invoiceId); if (!row) throw new Error('unpaid row not found for ' + d.num);
    ok('payment', await a.post('/api/customer-account/create-customer-payment', { account_id: c.acct, payment_date: when, payment_method: 'CASH', reference_number: 'ZZPAY', description: 'ZZAUTOTEST part payment', transactions: [{ ...row, transaction_payment_amount: amount }], primary_id: row.id, new_credit: 0, new_deposit: 0, applied_credits: [], applied_deposits: [], ibs_batch_id: null, payment_amount: amount }));
    if (wp !== S.WP.heavy) await S.loc(a); d.paid = (d.paid || 0) + amount; log && log('  paid ' + amount + ' on ' + d.num); }
  async function credit(c, amount, daysAgo, wp = S.WP.heavy, tag = '') { if (wp !== S.WP.heavy) await S.loc(a, wp);
    if (!c.acct) { const r = await a.get('/api/customers/view/' + c.cid); c.acct = r.j?.data?.customer_account_id || r.j?.data?.company?.customer_account_id; }
    const day = new Date(Date.UTC(2026, 10, 11 - daysAgo, 7)).toISOString(); const r = ok('credit', await a.post('/api/credit-memos', { customerAccountId: c.acct, amount, reason: 'ZZAUTOTEST exact credit', originKind: 'manual', originDate: day }));
    if (wp !== S.WP.heavy) await S.loc(a); const d = { tag, num: r.data.creditNumber, amount: -amount, daysAgo, credit: true }; c.docs.push(d); log && log('  credit ' + d.num + ' ' + amount); return d; }
  return { customer, invoice, pay, credit, setTerm };
}
