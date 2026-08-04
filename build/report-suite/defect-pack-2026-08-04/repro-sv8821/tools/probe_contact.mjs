// probe_contact.mjs — the UI disables the work order's Finance tab with the reason
// "Please select a contact for the asset". Test whether SETTING a contact is what makes
// POST /api/invoices/create succeed — i.e. whether the 500 is a missing-validation crash on a
// work order the product's own screens would never let you invoice.
import fs from 'fs';
import { login, api, BASE } from '../../../viu-2026-08-03/tools/qa8582.mjs';
const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const { sessCookie } = await login('admin');
await api(sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP_HD, workplace_timezone: 'America/Edmonton' });

async function apiH(method, path, body) {
  const opts = { method, redirect: 'manual', headers: { Cookie: sessCookie, Accept: 'application/json',
    Origin: 'https://sv8582.qa.shopview.com', Referer: 'https://sv8582.qa.shopview.com/' } };
  if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const r = await fetch(BASE + path, opts);
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {}
  return { status: r.status, body: j ?? t.slice(0, 800), reqid: r.headers.get('x-request-id') };
}

const woId = process.argv[2];
const wo = (await apiH('GET', '/api/work-orders/view/' + woId)).body?.data?.work_order;
console.log('WO', wo?.number, wo?.status, '| company', wo?.company_name, wo?.company_id,
  '| customer_id(contact):', wo?.customer_id, '| customer_account_id:', wo?.customer_account_id);

// find the contacts the product offers for this company
for (const p of [
  `/api/customers/${wo.company_id}/contacts`,
  `/api/customers/contacts?company_id=${wo.company_id}`,
  `/api/customers/view/${wo.company_id}`,
  `/api/companies/${wo.company_id}/contacts`,
]) {
  const r = await apiH('GET', p);
  const n = r.body?.data?.collection?.length ?? (r.body?.data ? 'obj' : '-');
  console.log('GET', p.padEnd(58), r.status, 'items:', n);
  if (r.status === 200) fs.writeFileSync('/tmp/sv8821/contacts-' + p.replace(/[^a-z0-9]/gi, '_') + '.json', JSON.stringify(r.body, null, 1));
}
