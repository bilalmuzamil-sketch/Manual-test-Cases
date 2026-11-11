// p24b_deposit.mjs — 11 Nov 2026: unused deposit dated 5 Nov for "ZZAUTOTEST CREDIT DAY A" (C1062566). Work order with the canned line
// ($174.04) → Finance tab → Add Deposit (Deposit Date 11/05/2026, Payment Method first offered, Amount 200.00) → Record Deposit; then
// complete + Mark Reviewed + Invoice Date 11/05/2026 → Create Invoice → reload. The leftover deposit ($25.96) should be on A/R Detail;
// which DATE it carries is what this probe finds out. Requests captured. Output exec/p24/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p24/', import.meta.url).pathname; const s = await start(OUT, '/work-orders'); const p = s.page; const a = mk(p);
const o = JSON.parse(fs.readFileSync(OUT + 'out.json')); o.dreqs = [];
p.on('request', (r) => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/recent-entities|estimate/.test(r.url())) o.dreqs.push({ u: r.url().replace(/^https:\/\/[^/]+/, ''), b: (r.postData() || '').slice(0, 900) }); });
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); const ok = (t, r) => { if (r.st >= 300) throw new Error(t + ' ' + r.st + JSON.stringify(r.j).slice(0, 200)); return r.j; };
await S.loc(a); const cid = o.cid, contact_id = o.contact;
const v = ok('vehicle', await a.post('/api/vehicles/create', { company_id: cid, customer_id: contact_id, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); const vehicle_id = v.data?.vehicle_id || v.data?.id;
const w = ok('wo', await a.post('/api/work-orders/create', { company_id: cid, vehicle_id, workplace_id: S.WP.heavy, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id; o.depWo = id;
ok('wo-contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id, contact_id, update_vehicle: true }));
ok('line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: S.CANNED, status: 'authorized' }));
await s.go('/workorders/' + id + '/finance'); await p.waitForTimeout(3500); await s.shot('dep-finance');
await p.getByRole('button', { name: /Add Deposit/i }).first().click(); await p.waitForTimeout(2000); await s.shot('dep-open'); o.depForm = (await p.locator('.q-dialog, [role=dialog]').last().innerText().catch(() => '')).slice(0, 600); save();
const dd = p.getByLabel(/Deposit Date/i).first(); await dd.click(); await dd.fill(''); await dd.type('11/05/2026'); await p.keyboard.press('Tab'); await p.waitForTimeout(400);
await p.locator('.q-dialog .q-field, [role=dialog] .q-field').filter({ hasText: /Payment Method/ }).first().click(); await p.waitForTimeout(1000); o.pmMenu = (await p.locator('.q-menu').last().innerText().catch(() => '')).slice(0, 300); await p.locator('.q-menu .q-item').filter({ hasText: /Cash/ }).first().click().catch(async () => { await p.locator('.q-menu .q-item').first().click(); }); await p.waitForTimeout(500);
const da = p.getByLabel(/Deposit Amount/i).first(); await da.click(); await da.fill(''); await da.type('200.00'); await p.keyboard.press('Tab'); await s.shot('dep-filled');
await p.getByRole('button', { name: /Record Deposit/i }).click(); await p.waitForTimeout(3000); await s.shot('dep-recorded'); save();
const lines = (await a.get('/api/work-orders/lines/' + id)).j.data.collection; for (const l of lines) { await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST aging seed', work_order_id: id }); await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' }); }
await s.go('/workorders/' + id + '/lines'); await p.waitForTimeout(3000); const mr = p.locator('[data-test-id="button_mark_reviewed"]'); if (await mr.count()) { await mr.click(); await p.waitForTimeout(3000); }
await s.go('/workorders/' + id + '/finance'); await p.waitForTimeout(3500); const box = p.getByLabel(/Invoice Date/i).first(); await box.click(); await box.fill(''); await box.type('11/05/2026'); await p.keyboard.press('Tab'); await p.waitForTimeout(800);
await p.getByRole('button', { name: /Create Invoice/i }).first().click(); await p.waitForTimeout(4500); await s.shot('inv-created'); await p.reload(); await p.waitForTimeout(3000); await s.shot('inv-reloaded');
for (const D of ['2026-11-05', '2026-11-06', '2026-11-10']) for (const b of ['days_1_to_30', 'current']) { const r = await a.get(`/api/reporting/reports/ar-aging-detail/buckets/${b}/rows?asOfDate=${D}&customers=${cid}&pagination[page]=1&pagination[rowsPerPage]=100`); o[`d-${D}-${b}`] = (r.j?.data?.collection || []).map((x) => [x.transactionType, x.documentNumber, x.date, x.daysPastDue, x.openBalanceCents]); }
save(); console.log(JSON.stringify({ dreqs: o.dreqs, ...Object.fromEntries(Object.entries(o).filter(([k]) => k.startsWith('d-') || k === 'pmMenu')) }).slice(0, 4500)); await s.close(); process.exit(0);
