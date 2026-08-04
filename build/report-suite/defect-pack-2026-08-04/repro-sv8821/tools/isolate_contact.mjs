// isolate_contact.mjs — hold EVERYTHING constant except the contact.
// Same customer, same vehicle, same canned line, same chain, run twice: once with a contact on the
// work order and once without. This is what proves the contact is the discriminator and the canned
// line is not (Rule 50: both directions, not just the confirming one).
//
// Usage: node isolate_contact.mjs
import fs from 'fs';
import { login, api, BASE } from '../../../viu-2026-08-03/tools/qa8582.mjs';
const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const LEDGER = '/tmp/sv8821/repro-ledger.json';
const { sessCookie } = await login('admin');
await api(sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP_HD, workplace_timezone: 'America/Edmonton' });
const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : [];
const writeL = () => fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1));

async function apiH(method, path, body) {
  const opts = { method, redirect: 'manual', headers: { Cookie: sessCookie, Accept: 'application/json',
    Origin: 'https://sv8582.qa.shopview.com', Referer: 'https://sv8582.qa.shopview.com/' } };
  if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const r = await fetch(BASE + path, opts);
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {}
  return { status: r.status, body: j ?? t.slice(0, 800), reqid: r.headers.get('x-request-id') };
}

// one company that HAS a contact and a vehicle
const customers = (await apiH('GET', '/api/customers?limit=80')).body?.data?.collection || [];
let T = null;
for (const c of customers) {
  const co = (await apiH('GET', '/api/customers/view/' + c.id)).body?.data?.company;
  if (!co?.contacts?.length) continue;
  const veh = (await apiH('GET', `/api/vehicles?company_id=${c.id}`)).body?.data?.collection || [];
  if (!veh.length) continue;
  T = { c, contact: co.contacts[0], veh: veh[0] }; break;
}
if (!T) { console.error('no suitable customer'); process.exit(3); }
const CANNED = ['ce1f2549-24a9-485c-a849-267f8918d66e', 'HD CVIP air brake trailer single/tandem'];
console.log('constant: customer', T.c.name, '| vehicle', T.veh.id, '| canned line', CANNED[1]);
console.log('constant: contact available =', T.contact.first_name, T.contact.last_name, T.contact.id, '\n');

async function drive(withContact) {
  const payload = { company_id: T.c.id, vehicle_id: T.veh.id, workplace_id: WP_HD,
    start_date: '2026-07-20', is_vehicle_here: true };
  if (withContact) payload.customer_id = T.contact.id;
  const wo = await apiH('POST', '/api/work-orders/create', payload);
  const woId = wo.body?.data?.work_order_id;
  ledger.push({ woId, cannedLine: CANNED[1], stage: 'isolate-' + (withContact ? 'with' : 'without') }); writeL();
  const ln = await apiH('POST', `/api/work-orders/${woId}/lines/create-from-canned-line`, { canned_line_id: CANNED[0], status: 'authorized' });
  const lineId = ln.body?.data?.line_id;
  await apiH('POST', '/api/work-orders/change-mileage', { work_order_id: woId, mileage: '123456' });
  await apiH('POST', '/api/work-orders/lines/change-story', { line_id: lineId, tech_story: 'ZZAUTOTEST SV-8821 isolate', work_order_id: woId });
  const lc = await apiH('POST', '/api/work-orders/lines/change-status', { line_id: lineId, status: 'complete' });
  const wc = await apiH('POST', '/api/work-orders/change-status', { id: woId, status: 'complete' });
  const v1 = (await apiH('GET', '/api/work-orders/view/' + woId)).body?.data?.work_order;
  const inv = await apiH('POST', '/api/invoices/create', { work_order_id: woId });
  // also exercise the estimate/document endpoint the original evidence cited as "the UI's button"
  const est = await apiH('POST', '/api/work-orders/invoices/estimate', { work_order_id: woId, type: 'html',
    isEstimate: 1, includeDeclined: 0, issueDate: '', dueDate: '', historyEvent: null });
  const v2 = (await apiH('GET', '/api/work-orders/view/' + woId)).body?.data?.work_order;
  const rec = { arm: withContact ? 'WITH contact' : 'WITHOUT contact', woId, woNumber: v1?.number,
    contactOnWo: v1?.customer_id || null,
    contactName: [v1?.customer_first_name, v1?.customer_last_name].filter(Boolean).join(' ') || null,
    subTotal: v1?.sub_total, total: v1?.total_cost, woStatus: v1?.status,
    lineComplete: lc.status, woComplete: wc.status,
    invoiceStatus: inv.status, invoiceReqId: inv.reqid, invoiceBody: JSON.stringify(inv.body).slice(0, 300),
    estimateStatus: est.status, estimateReqId: est.reqid, estimateBody: JSON.stringify(est.body).slice(0, 300),
    isInvoiceCreated: v2?.is_invoice_created, invoiceId: v2?.invoice_id || null, statusAfter: v2?.status };
  ledger.push(rec); writeL();
  return rec;
}

const out = [];
for (const w of [false, true]) {
  const r = await drive(w);
  out.push(r);
  console.log(`--- ${r.arm} ---`);
  console.log('  WO', r.woNumber, r.woId, '| contact on WO:', r.contactOnWo ? r.contactName + ' (' + r.contactOnWo + ')' : 'NONE');
  console.log('  money identical?  subTotal', r.subTotal, 'total', r.total, '| lineComplete', r.lineComplete, 'woComplete', r.woComplete, 'status', r.woStatus);
  console.log('  POST /api/invoices/create              ->', r.invoiceStatus, '| reqid', r.invoiceReqId);
  if (r.invoiceStatus >= 400) console.log('       body:', r.invoiceBody);
  console.log('  POST /api/work-orders/invoices/estimate ->', r.estimateStatus, '| reqid', r.estimateReqId);
  if (r.estimateStatus >= 400) console.log('       body:', r.estimateBody);
  console.log('  after: is_invoice_created =', r.isInvoiceCreated, '| invoice_id =', r.invoiceId, '| status =', r.statusAfter, '\n');
}
fs.writeFileSync('/tmp/sv8821/isolate-results.json', JSON.stringify(out, null, 1));
console.log('VERDICT: contact is the discriminator ->',
  out[0].invoiceStatus === 500 && out[1].invoiceStatus < 300 ? 'CONFIRMED' : 'NOT CONFIRMED (see above)');
