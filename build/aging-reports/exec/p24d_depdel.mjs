// p24d_depdel.mjs — 11 Nov 2026: work order for "ZZAUTOTEST CREDIT DAY A" + deposit $41 dated 11/05 (POST /api/deposits, the body the
// screen sends) → delete the work order → is the deposit on A/R Detail, and with which date? Every refusal recorded. Output p24/depdel.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p24/', import.meta.url).pathname; const s = await start(OUT, '/customers'); const a = mk(s.page); const o = JSON.parse(fs.readFileSync(OUT + 'out.json')); const r = {};
await S.loc(a); const vehicle = JSON.parse(o.dreqs.find((x) => /vehicles\/create/.test(x.u)).b);
const vs = await a.get('/api/vehicles?company_id=' + o.cid); const vehicle_id = (vs.j?.data?.collection || vs.j?.data || [])[0]?.id; r.vehicle_id = vehicle_id;
const w = await a.post('/api/work-orders/create', { company_id: o.cid, vehicle_id, workplace_id: S.WP.heavy, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 }); const id = w.j?.data?.work_order_id; r.wo = [w.st, id];
await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id, contact_id: o.contact, update_vehicle: true });
const d = await a.post('/api/deposits', { workOrderId: id, amount: 41, paymentMethod: 'CASH', depositDate: '2026-11-05T07:00:00.000Z', memo: 'ZZAUTOTEST deposit dated 5 Nov' }); r.dep = [d.st, JSON.stringify(d.j).slice(0, 300)];
const del = await a.post('/api/work-orders/delete', { work_order_id: id }); r.del = [del.st, JSON.stringify(del.j).slice(0, 300)];
for (const D of ['2026-11-05', '2026-11-10']) for (const b of ['days_1_to_30', 'current']) { const x = await a.get(`/api/reporting/reports/ar-aging-detail/buckets/${b}/rows?asOfDate=${D}&customers=${o.cid}&pagination[page]=1&pagination[rowsPerPage]=100`); r[`${D}-${b}`] = (x.j?.data?.collection || []).map((q) => [q.transactionType, q.documentNumber, q.date, q.daysPastDue, q.openBalanceCents]); }
fs.writeFileSync(OUT + 'depdel.json', JSON.stringify(r, null, 1)); console.log(JSON.stringify(r).slice(0, 3000)); await s.close(); process.exit(0);
