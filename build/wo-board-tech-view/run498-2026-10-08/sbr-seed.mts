/**
 * C368237 setup (2026-10-10): Sales By Representative showed no rows at all on this branch, so its Location filter could not
 * be judged. Make ONE invoiced sale with a sales representative at Staging Heavy Duty - 9919 (playbook "Sales reps" + "The
 * invoiced-work-order chain"): the report reads the rep AT INVOICE CREATION, so the rep is set before the invoice.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open } from './session.mts';
import { api, customer, workOrder } from './data.mts';
import { EV, t } from './wob.mts';
import { HEAVY } from './staff.mts';
const { browser, page } = await open('/customers'); const a = api(page); const o: any = {};
const st = (r: any) => `${r.status} ${r.status >= 300 ? JSON.stringify(r.body).slice(0, 160) : ''}`.trim();
try {
  const c: any = await customer(a, `ZZAUTOTEST SBR Sale ${Date.now() % 100000}`, 'SBR-1'); o.customer = !!c.company_id; o.contact = !!c.contact_id; o.vehicle = !!c.vehicle_id;
  const w = await workOrder(a, c, 'approved'); o.wo = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order?.number;
  const reps = (await a.get('/api/sales-reps')).body?.data ?? []; o.reps = reps.map((r: any) => r.name).slice(0, 6); const rep = reps[0];
  o.rep = rep?.name; o.setRep = st(await a.post('/api/work-orders/change-sales-rep', { work_order_id: w, sales_rep_id: rep?.id }));
  const canned = ((await a.get('/api/work-orders/canned-lines')).body?.data?.collection ?? (await a.get('/api/work-orders/canned-lines')).body?.data ?? []) as any[];
  const cl = canned.find((x) => x.fixed_price && (!x.workplace_id || x.workplace_id === HEAVY)) ?? canned[0]; o.canned = cl?.name ?? cl?.title;
  const lr = await a.post(`/api/work-orders/${w}/lines/create-from-canned-line`, { canned_line_id: cl?.id, status: 'authorized' }); o.line = st(lr); const lid = lr.body?.data?.line_id ?? lr.body?.line_id;
  o.mileage = st(await a.post('/api/work-orders/change-mileage', { work_order_id: w, mileage: '123456' }));
  o.story = st(await a.post('/api/work-orders/lines/change-story', { line_id: lid, tech_story: 'ZZAUTOTEST done', work_order_id: w }));
  o.lineDone = st(await a.post('/api/work-orders/lines/change-status', { line_id: lid, status: 'complete' }));
  o.woDone = st(await a.post('/api/work-orders/change-status', { id: w, status: 'complete' }));
  o.invoice = st(await a.post('/api/invoices/create', { work_order_id: w }));
  o.status = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order?.status;
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
console.log(t(), 'SBR-SEED', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'sbr-seed.json'), JSON.stringify(o, null, 1));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
