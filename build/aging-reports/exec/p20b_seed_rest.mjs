// p20b_seed_rest.mjs — 11 Nov 2026: second half of p20 (which stopped on the old estimate: its lines were 'authorization_required'). Authorise those lines first, then complete; invoice B on S2-7195 and Bravo's invoice. Same notes as p20:
// seed the data C715280/C715281/C715282/C715283 need (Rule 107):
//  customers "ZZAUTOTEST S1R5 Alpha" (= the tests' customer B, first by name) and "ZZAUTOTEST S1R5 Bravo" (= customer A):
//   Alpha: invoice A dated 08/20/2026 (oldest) · invoice C dated 10/25/2026 on a NEW work order (5-digit number), invoiced at 15:00 UTC
//          · invoice B dated 10/25/2026 on an old 4-digit estimate (S2-7195, moved to Alpha), invoiced at 21:00 UTC (later that day).
//   Bravo: one invoice dated 10/25/2026. Customers made through the API get COD terms, so due date = invoice date (p19).
//  Invoices are made through the SCREEN (Finance tab > Invoice Date > Create Invoice; p19); the time of day is set by rewriting
//  created_on in the page's own request (the screen always sends T18:00Z). Page reloaded after, never closed with x (recipe).
//  vendors "ZZAUTOTEST S1R5 V Alpha" (vendor B) and "ZZAUTOTEST S1R5 V Bravo" (vendor A): Alpha bills "ZZAL-A" 08/20, then "10023"
//  dated 10/25 entered first, then "9917" dated 10/25 entered second; Bravo one bill "ZZBR-1" dated 10/25. Output exec/p20/.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./p20b/', import.meta.url).pathname; const s = await start(OUT, '/work-orders'); const a = mk(s.page); const o = { steps: [] };
const ok = (t, r) => { o.steps.push([t, r.st]); if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
const log = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
await S.loc(a);
async function cust(name) {
  const c = ok('customer ' + name, await a.post('/api/customers/create', { name })); const company_id = c.data?.company_id || c.data?.id;
  const ct = ok('contact', await a.post('/api/contacts/create', { company_id, first_name: 'ZZ', last_name: 'Aging' })); const contact_id = ct.data?.contact_id;
  const v = ok('vehicle', await a.post('/api/vehicles/create', { company_id, customer_id: contact_id, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); const vehicle_id = v.data?.vehicle_id || v.data?.id;
  return { name, company_id, contact_id, vehicle_id };
}
async function newWo(c) {
  const w = ok('wo', await a.post('/api/work-orders/create', { company_id: c.company_id, vehicle_id: c.vehicle_id, workplace_id: S.WP.heavy, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id;
  ok('wo-contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id: c.vehicle_id, contact_id: c.contact_id, update_vehicle: true }));
  return id;
}
async function lineDone(id) {
  if (!process.env.NOLINE) ok('line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: S.CANNED, status: 'authorized' }));
  const lines = (await a.get('/api/work-orders/lines/' + id)).j.data.collection;
  for (const l of lines) {
    if (l.status === 'authorization_required') { const r0 = await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'authorized' }); o.steps.push(['line-authorise ' + l.line_id.slice(0, 6), r0.st, JSON.stringify(r0.j).slice(0, 160)]); }
    await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'ZZAUTOTEST aging seed work done', work_order_id: id });
    const r = await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, work_order_id: id, status: 'complete' }); o.steps.push(['line-complete ' + l.line_id.slice(0, 6) + ' was ' + l.status, r.st, JSON.stringify(r.j).slice(0, 160)]);
  }
}
async function invoiceUI(id, mdy, hourZ, tag) {
  const iso = `${mdy.slice(6)}-${mdy.slice(0, 2)}-${mdy.slice(3, 5)}T${String(hourZ).padStart(2, '0')}:00:00.000Z`;
  await s.page.route('**/api/invoices/create', async (route) => { const b = JSON.parse(route.request().postData()); o[tag + '-sent'] = { invoice_number: b.invoice_number, created_on: b.created_on, due_date: b.due_date }; b.created_on = iso; route.continue({ postData: JSON.stringify(b) }); });
  await s.go('/workorders/' + id + '/lines'); await s.page.waitForTimeout(3000); const mr = s.page.locator('[data-test-id="button_mark_reviewed"]'); if (await mr.count()) { await mr.click(); await s.page.waitForTimeout(3000); }
  await s.go('/workorders/' + id + '/finance'); await s.page.waitForTimeout(3500);
  const box = s.page.getByLabel(/Invoice Date/i).first(); await box.click(); await box.fill(''); await box.type(mdy); await s.page.keyboard.press('Tab'); await s.page.waitForTimeout(800);
  await s.page.getByRole('button', { name: /Create Invoice/i }).first().click(); await s.page.waitForTimeout(4500); await s.shot(tag + '-created');
  await s.page.unroute('**/api/invoices/create'); await s.page.reload(); await s.page.waitForTimeout(3000);
}
const P = JSON.parse(fs.readFileSync(new URL('./p20/out.json', import.meta.url)));
try {
  const al = P.al, br = P.br; const est = 'babb61e8-303f-4b35-a1cd-0f33b04ea8e8';
  { const m = await a.post('/api/work-orders/change-mileage', { work_order_id: est, mileage: '123456' }); o.steps.push(['mileage', m.st]); }
  process.env.NOLINE = '1'; await lineDone(est); delete process.env.NOLINE;
  o.estView = JSON.stringify((await a.get('/api/work-orders/view/' + est)).j).slice(0, 600);
  await invoiceUI(est, '10/25/2026', 21, 'alB'); o.alB = est; log();
  const w = await newWo(br); await lineDone(w); await invoiceUI(w, '10/25/2026', 18, 'brA'); o.brA = w; log();
} catch (e) { o.custErr = String(e).slice(0, 600); }
const r = await a.get(`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-10&customers=${P.al.company_id},${P.br.company_id}`); o.rep = JSON.stringify(r.j).slice(0, 3500);
log(); console.log(JSON.stringify(o).slice(0, 5000)); await s.close(); process.exit(0);
