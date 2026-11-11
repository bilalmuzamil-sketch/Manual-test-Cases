// p68_seed_batch.mjs — 11 Nov 2026: data for the next batch (ZZAUTOTEST family, names "ZZX …"/"ZZY …", suffix " P68").
// E1 customer with an invoice only at Lethbridge (empty-state tests C715499-C715501); E2 vendor with a bill only at Lethbridge (C715502-C715504);
// D1 Net 30 customer with invoices dated today, yesterday, 2 days ago (C1062572); M1 customer with invoice A at LB 40 days ago, B at HD 20 days ago,
// C at HD 30 days ago, COD (C1062578); P1 customer with invoice A $500 at HD partly paid $200 by a payment taken at LB, a credit memo at LB and
// an unused deposit left at LB (C715389); T1 customer with invoice + credit memo + unused deposit all dated today (C1062574/C1062576 — a deposit
// carries the moment its invoice is made, L0622, so "10 days ago" cannot be built; today puts all three in one bucket, "Current").
// Deposit: work order with a line, POST /api/deposits for more than the line, complete, invoice (API) -> auto-paid, leftover = unused deposit.
// Reads every customer back from A/R Detail. Output p68/out.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import { mkX, EXEMPT, dayAt } from './xseed.mjs'; import fs from 'fs';
process.env.SFX ||= ' P68';
const OUT = new URL('./p68/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/customers'); const a = mk(s.page);
const o = { sets: {}, log: [] }; const log = (t) => { o.log.push(t); console.log(t); }; const X = mkX(a, log); const HD = S.WP.heavy, LB = S.WP.leth; const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
const ok = (t, r) => { if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
async function depositLeft(c, lineAmt, depAmt, wp = HD) { if (wp !== HD) await S.loc(a, wp);
  try { const id = ok('wo', await a.post('/api/work-orders/create', { company_id: c.cid, vehicle_id: c.vehicle, workplace_id: wp, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })).data.work_order_id;
    ok('wo-contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: c.vehicle, contact_id: c.contact, update_vehicle: true })); const amt = Number(lineAmt).toFixed(2);
    ok('line', await a.post('/api/work-orders/lines/create', { work_order_id: id, line_name: 'ZZAUTOTEST exact ' + amt, description: 'ZZAUTOTEST exact ' + amt, time_estimate: '0', tech_time: '0', status: 'authorized', is_authorized_to_repair: true, is_diagnosis: false, is_parts_required_are_authorized: false, is_warranty: false, tech_story: '', fixed_line_total: amt, fixed_line_labor_price: amt, fixed_line_parts_price: '0', assigned_techs: [], another: false }));
    const num = (await a.get('/api/work-orders/view/' + id)).j.data.work_order.display_number;
    ok('deposit', await a.post('/api/deposits', { workOrderId: id, amount: Number(lineAmt) + depAmt, paymentMethod: 'CASH', depositDate: new Date().toISOString(), memo: 'Deposit for Work Order ' + num }));
    for (const l of (await a.get('/api/work-orders/lines/' + id)).j.data.collection) { ok('story', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id })); ok('lc', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' })); }
    ok('wo-complete', await a.post('/api/work-orders/change-status', { id, status: 'complete' })); const now = new Date().toISOString();
    const inv = ok('invoice', await a.post('/api/invoices/create', { invoice_number: num, due_date: now, discount: 0, cost: amt, customer_id: c.contact, company_id: c.cid, work_order_id: id, work_place_id: wp, work_order_part_cost: '0.00', work_order_labour_cost: amt, time_estimate: '0.00', include_declined: false, created_on: now, tax: { id: EXEMPT.id, name: 'Exempt', rates: [], rateTotal: 0, amountTotal: 0 } }));
    c.acct ||= inv.data.customer_account_id; const d = { tag: 'deposit-left', num, auto: inv.data.auto_paid, depLeft: depAmt, wp: wp === HD ? 'HD' : 'LB' }; c.docs.push(d); log('  deposit left ' + depAmt + ' via ' + num + ' auto_paid=' + inv.data.auto_paid); return d; } finally { if (wp !== HD) await S.loc(a); } }
const SETS = {
  E1: async () => { const c = await X.customer('ZZX Only LB', 'COD'); await X.invoice(c, 50, 5, LB, 'LB-only'); return [c]; },
  E2: async () => { const id = await S.vendor(a, 'ZZY Only LB' + process.env.SFX, 'COD'); await S.loc(a, LB); const b = await S.bill(a, id, { amount: 60, date: new Date(Date.UTC(2026, 10, 6)).toISOString().slice(0, 10), number: 'ZZYLB' + (Date.now() % 1e7) }); await S.loc(a); log('vendor ZZY Only LB bill at LB ' + JSON.stringify(b).slice(0, 120)); return [{ name: 'ZZY Only LB' + process.env.SFX, vid: id, docs: [b] }]; },
  D1: async () => { const c = await X.customer('ZZX Date Fmt', 'Net 30'); await X.invoice(c, 101, 0, HD, 'A-today'); await X.invoice(c, 102, 1, HD, 'B-yesterday'); await X.invoice(c, 103, 2, HD, 'C-2-days-ago'); return [c]; },
  M1: async () => { const c = await X.customer('ZZX Loc Sort', 'COD'); await X.invoice(c, 140, 40, LB, 'A-LB-40'); await X.invoice(c, 120, 20, HD, 'B-HD-20'); await X.invoice(c, 130, 30, HD, 'C-HD-30'); return [c]; },
  P1: async () => { const c = await X.customer('ZZX Own Loc', 'COD'); const dA = await X.invoice(c, 500, 5, HD, 'A-500-HD'); await X.pay(c, dA, 200, LB, '2026-11-08 12:00:00'); await X.credit(c, 40, 3, LB, 'credit-LB'); await depositLeft(c, 60, 25, LB); return [c]; },
  T1: async () => { const c = await X.customer('ZZX Types', 'COD'); await X.invoice(c, 90, 0, HD, 'A-invoice-today'); await X.credit(c, 30, 0, HD, 'credit-today'); await depositLeft(c, 50, 20, HD); return [c]; },
};
const ONLY = process.env.ONLY?.split(',');
for (const [k, fn] of Object.entries(SETS)) { if (ONLY && !ONLY.includes(k)) continue; log('== ' + k); try { const cs = await fn(); o.sets[k] = cs.map((c) => ({ name: c.name, cid: c.cid, vid: c.vid, docs: c.docs }));
    for (const c of cs) { if (!c.cid) continue; const rows = []; for (const b of ['current', 'days_1_to_30', 'days_31_to_60', 'days_61_to_90', 'days_91_plus']) { const r = await a.get(`/api/reporting/reports/ar-aging-detail/buckets/${b}/rows?asOfDate=2026-11-11&customers=${c.cid}&pagination[page]=1&pagination[rowsPerPage]=100`); for (const x of (r.j?.data?.collection || [])) rows.push([b, x.transactionType, x.documentNumber, x.date?.slice(0, 16), x.dueDate?.slice(0, 10), x.locationName, x.openBalanceCents]); } o.sets[k].find((x) => x.cid === c.cid).report = rows; log('  report ' + JSON.stringify(rows)); }
  } catch (e) { o.sets[k + '-err'] = String(e).slice(0, 400); log('ERR ' + k + ' ' + String(e).slice(0, 300)); } save(); }
save(); await s.close(); process.exit(0);
