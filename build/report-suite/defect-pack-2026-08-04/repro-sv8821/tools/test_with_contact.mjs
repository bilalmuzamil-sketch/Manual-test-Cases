// test_with_contact.mjs — THE DECISIVE TEST.
// The product disables the work order's Finance tab (and therefore Create Invoice) with the reason
// "Please select a contact for the asset" whenever the work order has no contact person on it.
// Every work order in the original SV-8821 evidence was API-created and had NO contact.
// This script drives the same chain but WITH a contact set, on the same canned lines, and reports
// whether POST /api/invoices/create then succeeds.
//
// Usage: node test_with_contact.mjs
import fs from 'fs';
import { login, api, BASE } from '../../../viu-2026-08-03/tools/qa8582.mjs';
const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const LEDGER = '/tmp/sv8821/repro-ledger.json';
const { sessCookie } = await login('admin');
await api(sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP_HD, workplace_timezone: 'America/Edmonton' });
const readL = () => (fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : []);
const writeL = l => fs.writeFileSync(LEDGER, JSON.stringify(l, null, 1));
const ledger = readL();

async function apiH(method, path, body) {
  const opts = { method, redirect: 'manual', headers: { Cookie: sessCookie, Accept: 'application/json',
    Origin: 'https://sv8582.qa.shopview.com', Referer: 'https://sv8582.qa.shopview.com/' } };
  if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const r = await fetch(BASE + path, opts);
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {}
  return { status: r.status, body: j ?? t.slice(0, 800), reqid: r.headers.get('x-request-id') };
}

// canned lines to try, one per pricing shape (the same ones that 500'd without a contact)
const TRY = [
  ['ce1f2549-24a9-485c-a849-267f8918d66e', 'HD CVIP air brake trailer single/tandem', 'FIXED LABOUR'],
  ['e55c893f-8253-4aa9-8901-7282c804d056', 'CVIP Driving Force', 'FIXED LINE TOTAL'],
  ['53b26ca7-92ca-4def-bfd0-7f5649a775ca', 'Champ X Service air filter', 'HOURLY LABOUR RATE'],
  ['c84bd165-2687-4c13-8e34-06d2d773045a', 'Service - Adjust brakes', 'HOURLY LABOUR RATE (HD Door Rate)'],
];

// find companies that HAVE at least one contact
const customers = (await apiH('GET', '/api/customers?limit=80')).body?.data?.collection || [];
const withContact = [];
for (const c of customers) {
  if (withContact.length >= TRY.length + 2) break;
  const v = (await apiH('GET', '/api/customers/view/' + c.id)).body?.data?.company;
  const contacts = v?.contacts || [];
  if (!contacts.length) continue;
  const veh = (await apiH('GET', `/api/vehicles?company_id=${c.id}`)).body?.data?.collection || [];
  if (!veh.length) continue;
  withContact.push({ c, contact: contacts[0], veh: veh[0] });
}
console.log('companies with a contact AND a vehicle:', withContact.length);
if (!withContact.length) { console.error('none found — cannot run'); process.exit(3); }

const results = [];
for (let i = 0; i < TRY.length; i++) {
  const [cid, cname, shape] = TRY[i];
  const t = withContact[i % withContact.length];
  const rec = { cannedLineId: cid, cannedLine: cname, pricing: shape,
    customer: t.c.name, contact: `${t.contact.first_name} ${t.contact.last_name}`,
    contactId: t.contact.id, when: new Date().toISOString() };

  // create WITH the contact on the create payload (`customer_id` is the CONTACT person id;
  // `company_id` is the business — they are two different things on this build)
  const wo = await apiH('POST', '/api/work-orders/create', { company_id: t.c.id, vehicle_id: t.veh.id,
    workplace_id: WP_HD, start_date: '2026-07-20', is_vehicle_here: true, customer_id: t.contact.id });
  rec.woCreate = wo.status;
  rec.woId = wo.body?.data?.work_order_id || wo.body?.data?.id;
  if (!rec.woId) { rec.fail = JSON.stringify(wo.body).slice(0, 200); results.push(rec); console.log('FAIL create', rec.fail); continue; }
  ledger.push({ woId: rec.woId, cannedLine: cname, stage: 'created-with-contact' }); writeL(ledger);

  // did the contact stick? if not, set it explicitly
  let v = (await apiH('GET', '/api/work-orders/view/' + rec.woId)).body?.data?.work_order;
  rec.contactAfterCreate = v?.customer_id;
  if (!v?.customer_id) {
    for (const [p, b] of [
      ['/api/work-orders/change-contact', { work_order_id: rec.woId, customer_id: t.contact.id }],
      ['/api/work-orders/change-customer', { work_order_id: rec.woId, company_id: t.c.id, customer_id: t.contact.id }],
      ['/api/work-orders/change-customer', { id: rec.woId, company_id: t.c.id, customer_id: t.contact.id }],
    ]) {
      const r = await apiH('POST', p, b);
      rec.setContactTries = (rec.setContactTries || []); rec.setContactTries.push(`${p} -> ${r.status}`);
      v = (await apiH('GET', '/api/work-orders/view/' + rec.woId)).body?.data?.work_order;
      if (v?.customer_id) { rec.setContactVia = p; break; }
    }
  }
  rec.contactOnWo = v?.customer_id || null;
  rec.contactName = [v?.customer_first_name, v?.customer_last_name].filter(Boolean).join(' ') || null;

  const ln = await apiH('POST', `/api/work-orders/${rec.woId}/lines/create-from-canned-line`, { canned_line_id: cid, status: 'authorized' });
  rec.lineCreate = ln.status; rec.lineId = ln.body?.data?.line_id;
  if (!rec.lineId) { rec.fail = 'line: ' + JSON.stringify(ln.body).slice(0, 160); results.push(rec); continue; }
  rec.mileage = (await apiH('POST', '/api/work-orders/change-mileage', { work_order_id: rec.woId, mileage: '123456' })).status;
  rec.techStory = (await apiH('POST', '/api/work-orders/lines/change-story', { line_id: rec.lineId, tech_story: 'ZZAUTOTEST SV-8821 repro', work_order_id: rec.woId })).status;
  rec.lineComplete = (await apiH('POST', '/api/work-orders/lines/change-status', { line_id: rec.lineId, status: 'complete' })).status;
  rec.woComplete = (await apiH('POST', '/api/work-orders/change-status', { id: rec.woId, status: 'complete' })).status;

  const inv = await apiH('POST', '/api/invoices/create', { work_order_id: rec.woId });
  rec.invoiceStatus = inv.status; rec.invoiceRequestId = inv.reqid;
  rec.invoiceBody = JSON.stringify(inv.body).slice(0, 500);
  const after = (await apiH('GET', '/api/work-orders/view/' + rec.woId)).body?.data?.work_order;
  rec.woStatusAfter = after?.status; rec.invoiceCreated = after?.is_invoice_created; rec.invoiceId = after?.invoice_id;

  results.push(rec); ledger.push(rec); writeL(ledger);
  console.log(`${rec.invoiceStatus < 300 ? '2xx ✓' : rec.invoiceStatus + ' ✗'} | contact=${rec.contactOnWo ? rec.contactName : 'NONE'} | ${cname.padEnd(40).slice(0, 40)} | ${shape.padEnd(34)} | lineC ${rec.lineComplete} woC ${rec.woComplete} | invoice_created=${rec.invoiceCreated} invoice_id=${rec.invoiceId || '-'} | reqid ${rec.invoiceRequestId || '-'}`);
  if (rec.invoiceStatus >= 400) console.log('      body:', rec.invoiceBody);
  if (rec.setContactTries) console.log('      set-contact tries:', rec.setContactTries.join(' | '), '| via:', rec.setContactVia || 'NONE WORKED');
}
fs.writeFileSync('/tmp/sv8821/with-contact-results.json', JSON.stringify(results, null, 1));
console.log('\nresults: /tmp/sv8821/with-contact-results.json');
