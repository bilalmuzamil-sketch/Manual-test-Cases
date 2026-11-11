// p26_apiinv.mjs — 11 Nov 2026: C1062570 needs a customer with more than 100 overdue invoices. Try an all-API invoice: WO + canned line →
// line complete → POST /api/work-orders/change-status {id, status:'complete'} (minimal) → POST /api/invoices/create with the body the
// screen sends (p24 capture: invoice_number, due_date, created_on, cost, customer_id, company_id, work_order_id, work_place_id, costs,
// tax). N env = how many (default 1). Customer "ZZAUTOTEST OVER100 C". Output exec/p26/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p26/', import.meta.url).pathname; const s = await start(OUT, '/work-orders'); const a = mk(s.page); const N = +(process.env.N || 1);
const st = fs.existsSync(OUT + 'state.json') ? JSON.parse(fs.readFileSync(OUT + 'state.json')) : { made: [] }; const keep = () => fs.writeFileSync(OUT + 'state.json', JSON.stringify(st, null, 1));
const ok = (t, r) => { if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
await S.loc(a);
if (!st.cid) { const c = ok('customer', await a.post('/api/customers/create', { name: 'ZZAUTOTEST OVER100 C' })); st.cid = c.data?.company_id || c.data?.id;
  st.contact = ok('contact', await a.post('/api/contacts/create', { company_id: st.cid, first_name: 'ZZ', last_name: 'Over100' })).data?.contact_id;
  const v = ok('vehicle', await a.post('/api/vehicles/create', { company_id: st.cid, customer_id: st.contact, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); st.vehicle = v.data?.vehicle_id || v.data?.id; keep(); }
const TAX = { id: '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b', name: 'GST', isEnabledLabor: true, isEnabledParts: true, isEnabledShopSupplies: true, isDefault: true, isDeletable: false, rates: [{ id: 'f98f5826-14d7-475e-8d1b-3fc10bf400bc', name: 'GST', percentage: 5, amount: 8.29 }], rateTotal: 5, amountTotal: 8.29 };
for (let i = 0; i < N; i++) { const t0 = Date.now();
  try {
    const w = ok('wo', await a.post('/api/work-orders/create', { company_id: st.cid, vehicle_id: st.vehicle, workplace_id: S.WP.heavy, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id;
    ok('contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: st.vehicle, contact_id: st.contact, update_vehicle: true }));
    ok('line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: S.CANNED, status: 'authorized' }));
    const l = (await a.get('/api/work-orders/lines/' + id)).j.data.collection[0];
    ok('story', await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST', work_order_id: id }));
    ok('line-complete', await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' }));
    const cs = await a.post('/api/work-orders/change-status', { id, status: 'complete' }); if (cs.st >= 300) { st.csErr = JSON.stringify(cs.j).slice(0, 300); keep(); throw new Error('change-status ' + cs.st + ' ' + st.csErr); }
    const view = (await a.get('/api/work-orders/view/' + id)).j.data.work_order; const num = view.display_number || view.number;
    const day = `2026-10-${String(1 + (i % 20)).padStart(2, '0')}T18:00:00.000Z`;
    const inv = await a.post('/api/invoices/create', { invoice_number: num, due_date: day, discount: 0, cost: '165.75', customer_id: st.contact, company_id: st.cid, work_order_id: id, work_place_id: S.WP.heavy, work_order_part_cost: '0.00', work_order_labour_cost: '150.00', time_estimate: '0.00', include_declined: false, created_on: day, tax: TAX });
    if (inv.st >= 300) { st.invErr = JSON.stringify(inv.j).slice(0, 300); keep(); throw new Error('invoice ' + inv.st + ' ' + st.invErr); }
    st.made.push({ id, num, day, ms: Date.now() - t0 }); keep();
  } catch (e) { st.lastErr = String(e).slice(0, 400); keep(); console.log('ERR', st.lastErr); break; }
}
const r = await a.get(`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-10&customers=${st.cid}`); console.log('made', st.made.length, 'last', JSON.stringify(st.made.slice(-1)), 'report rowsNumber', JSON.stringify(r.j?.data?.collection?.[0]?.rowsNumber), JSON.stringify(r.j?.data?.collection?.[0]?.rows?.slice(-1)).slice(0, 400));
await s.close(); process.exit(0);
