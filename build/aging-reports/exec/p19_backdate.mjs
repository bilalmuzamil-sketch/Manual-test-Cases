// p19_backdate.mjs — 11 Nov 2026: one test customer, one work order made ready, then Create Invoice through the SCREEN with the
// Finance tab's Invoice Date box set to an earlier date (recipe seen by the build-verification session; facts only, Rule 119),
// capturing the request the page sends so later invoices can be back-dated the same way. Output exec/p19/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p19/', import.meta.url).pathname; const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = { reqs: [] };
const ok = (t, r) => { if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 200)); return r.j; };
await S.loc(a);
const name = 'ZZAUTOTEST BACKDATE PROBE ' + (Date.now() % 1e5);
const c = ok('customer', await a.post('/api/customers/create', { name })); const company_id = c.data?.company_id || c.data?.id;
const ct = ok('contact', await a.post('/api/contacts/create', { company_id, first_name: 'ZZ', last_name: 'Aging' })); const contact_id = ct.data?.contact_id;
const v = ok('vehicle', await a.post('/api/vehicles/create', { company_id, customer_id: contact_id, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); const vehicle_id = v.data?.vehicle_id || v.data?.id;
const w = ok('wo', await a.post('/api/work-orders/create', { company_id, vehicle_id, workplace_id: S.WP.heavy, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id;
ok('wo-contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id, contact_id, update_vehicle: true }));
ok('line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: S.CANNED, status: 'authorized' }));
const lines = await a.get('/api/work-orders/lines/' + id); const line_id = lines.j.data.collection[0].line_id;
ok('story', await a.post('/api/work-orders/lines/change-story', { line_id, tech_story: 'ZZAUTOTEST aging seed work done', work_order_id: id }));
ok('complete', await a.post('/api/work-orders/lines/change-status', { line_id, work_order_id: id, status: 'complete' }));
s.page.on('request', (r) => { if (r.method() !== 'GET' && r.url().includes('/api/')) o.reqs.push({ m: r.method(), u: r.url().replace(/^https:\/\/[^/]+/, ''), b: (r.postData() || '').slice(0, 600) }); });
await s.go('/workorders/' + id + '/lines'); await s.page.waitForTimeout(3000); const mr = s.page.locator('[data-test-id="button_mark_reviewed"]'); if (await mr.count()) { await mr.click(); await s.page.waitForTimeout(3000); }
await s.go('/workorders/' + id + '/finance'); await s.page.waitForTimeout(3500); await s.shot('01-finance');
const box = s.page.getByLabel(/Invoice Date/i).first(); o.boxCount = await box.count();
if (o.boxCount) { await box.click(); await box.fill(''); await box.type('09/25/2026'); await s.page.keyboard.press('Tab'); await s.page.waitForTimeout(800); }
await s.shot('02-date-set');
const btn = s.page.getByRole('button', { name: /Create Invoice/i }).first(); o.btn = await btn.count(); if (o.btn) { await btn.click(); await s.page.waitForTimeout(4000); }
await s.shot('03-after-create'); await s.page.reload(); await s.page.waitForTimeout(4000); await s.shot('04-reloaded');
o.id = id; o.company_id = company_id; o.name = name;
const r = await a.get(`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-10&customers=${company_id}`); o.report = JSON.stringify(r.j).slice(0, 1500);
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 4000)); await s.close(); process.exit(0);
