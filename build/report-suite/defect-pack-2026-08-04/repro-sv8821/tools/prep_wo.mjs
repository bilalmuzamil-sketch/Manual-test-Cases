// prep_wo.mjs — build a Complete, NOT-yet-invoiced work order (with or without a contact) so the
// product's own Create Invoice button can be driven in the browser.
// Usage: node prep_wo.mjs with|without
import fs from 'fs';
import { login, api, BASE } from '../../../viu-2026-08-03/tools/qa8582.mjs';
const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const LEDGER = '/tmp/sv8821/repro-ledger.json';
const withContact = (process.argv[2] || 'with') === 'with';
const { sessCookie } = await login('admin');
await api(sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP_HD, workplace_timezone: 'America/Edmonton' });
const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : [];
async function apiH(m, p, b) {
  const o = { method: m, redirect: 'manual', headers: { Cookie: sessCookie, Accept: 'application/json',
    Origin: 'https://sv8582.qa.shopview.com', Referer: 'https://sv8582.qa.shopview.com/' } };
  if (b !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(b); }
  const r = await fetch(BASE + p, o); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {}
  return { status: r.status, body: j ?? t.slice(0, 400) };
}
const customers = (await apiH('GET', '/api/customers?limit=80')).body?.data?.collection || [];
let T = null;
for (const c of customers.slice(withContact ? 2 : 5)) {
  const co = (await apiH('GET', '/api/customers/view/' + c.id)).body?.data?.company;
  if (!co?.contacts?.length) continue;
  const veh = (await apiH('GET', `/api/vehicles?company_id=${c.id}`)).body?.data?.collection || [];
  if (!veh.length) continue;
  T = { c, contact: co.contacts[0], veh: veh[0] }; break;
}
const payload = { company_id: T.c.id, vehicle_id: T.veh.id, workplace_id: WP_HD, start_date: '2026-07-20', is_vehicle_here: true };
if (withContact) payload.customer_id = T.contact.id;
const woId = (await apiH('POST', '/api/work-orders/create', payload)).body?.data?.work_order_id;
ledger.push({ woId, stage: 'prep-' + (withContact ? 'with' : 'without') + '-contact' });
fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1));
const lineId = (await apiH('POST', `/api/work-orders/${woId}/lines/create-from-canned-line`,
  { canned_line_id: 'ce1f2549-24a9-485c-a849-267f8918d66e', status: 'authorized' })).body?.data?.line_id;
await apiH('POST', '/api/work-orders/change-mileage', { work_order_id: woId, mileage: '123456' });
await apiH('POST', '/api/work-orders/lines/change-story', { line_id: lineId, tech_story: 'ZZAUTOTEST SV-8821 UI check', work_order_id: woId });
await apiH('POST', '/api/work-orders/lines/change-status', { line_id: lineId, status: 'complete' });
await apiH('POST', '/api/work-orders/change-status', { id: woId, status: 'complete' });
const v = (await apiH('GET', '/api/work-orders/view/' + woId)).body?.data?.work_order;
console.log(JSON.stringify({ woId, number: v?.number, status: v?.status, customer: T.c.name,
  contact: v?.customer_id ? [v.customer_first_name, v.customer_last_name].join(' ') : null,
  is_invoice_created: v?.is_invoice_created, total: v?.total_cost }));
