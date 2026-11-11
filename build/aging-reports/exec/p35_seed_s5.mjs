// p35_seed_s5.mjs — 11 Nov 2026: C715407 / C715408 data. Customer "ZZAUTOTEST LOC MIX": add an invoice at Lethbridge dated 21 Oct (invoice A,
// 1-30 days past due) and one at Heavy Duty dated 20 Oct. Vendor "ZZAUTOTEST LOC MIX V" (Net 30): bills dated 1 Oct and 2 Oct at Heavy Duty and
// bill A dated 3 Oct received while at Lethbridge (all 1-30 days past due on 10 Nov). Output p35/out.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p35/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = {};
const ok = (t, r) => { o[t] = r.st; if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
const TAX = { id: '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b', name: 'GST', isEnabledLabor: true, isEnabledParts: true, isEnabledShopSupplies: true, isDefault: true, isDeletable: false, rates: [{ id: 'f98f5826-14d7-475e-8d1b-3fc10bf400bc', name: 'GST', percentage: 5, amount: 8.29 }], rateTotal: 5, amountTotal: 8.29 };
const c = JSON.parse(fs.readFileSync(new URL('./p33/out.json', import.meta.url))).c;
async function inv(wp, day, tag) { await S.loc(a, wp);
  const w = ok(tag + 'wo', await a.post('/api/work-orders/create', { company_id: c.cid, vehicle_id: c.vehicle, workplace_id: wp, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id;
  ok(tag + 'wc', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: c.vehicle, contact_id: c.contact, update_vehicle: true })); ok(tag + 'line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: S.CANNED, status: 'authorized' }));
  const l = (await a.get('/api/work-orders/lines/' + id)).j.data.collection[0]; ok(tag + 'st', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id })); ok(tag + 'lc', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' }));
  ok(tag + 'woc', await a.post('/api/work-orders/change-status', { id, status: 'complete' })); const num = (await a.get('/api/work-orders/view/' + id)).j.data.work_order.display_number;
  ok(tag + 'inv', await a.post('/api/invoices/create', { invoice_number: num, due_date: day, discount: 0, cost: '165.75', customer_id: c.contact, company_id: c.cid, work_order_id: id, work_place_id: wp, work_order_part_cost: '0.00', work_order_labour_cost: '150.00', time_estimate: '0.00', include_declined: false, created_on: day, tax: TAX })); return num; }
try { o.invA = await inv(S.WP.leth, '2026-10-21T18:00:00.000Z', 'lb-'); o.invHD = await inv(S.WP.heavy, '2026-10-20T18:00:00.000Z', 'hd-'); } catch (e) { o.err1 = String(e).slice(0, 300); }
try { await S.loc(a); o.vid = await S.vendor(a, 'ZZAUTOTEST LOC MIX V'); o.b1 = await S.bill(a, o.vid, { amount: 31, date: '2026-10-01', number: 'ZZLMV-1' }); o.b2 = await S.bill(a, o.vid, { amount: 32, date: '2026-10-02', number: 'ZZLMV-2' });
  await S.loc(a, S.WP.leth); o.bA = await S.bill(a, o.vid, { amount: 33, date: '2026-10-03', number: 'ZZLMV-A' }); } catch (e) { o.err2 = String(e).slice(0, 300); }
await S.loc(a); const r = await a.get(`/api/reporting/reports/ap-unpaid-invoices?asOfDate=2026-11-10&vendors=${o.vid}`); o.vrows = (r.j?.data?.collection?.[0]?.rows || []).map((x) => [x.locationName, x.documentNumber, x.daysPastDue]);
const r2 = await a.get(`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-10&customers=${c.cid}`); o.crows = (r2.j?.data?.collection?.[0]?.rows || []).map((x) => [x.locationName, x.documentNumber, x.daysPastDue]);
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 1500)); await s.close(); process.exit(0);
