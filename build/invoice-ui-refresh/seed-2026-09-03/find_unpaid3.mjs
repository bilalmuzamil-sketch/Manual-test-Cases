// Shapes now READ, not guessed:
//   /api/customers                     -> data.collection[]            (customer id)
//   /api/customers/view/<id>           -> data.company.*               (the ACCOUNT id lives here)
//   /api/customer-account/list-unpaid-transaction -> data.response.collection[]
//                                          rows carry type/status_label/invoice_number/balance
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APIH } = await boot('sv8218', '/customers', 'admin');
await page.waitForTimeout(5000);
const out = await page.evaluate(async (h) => {
  const get = async u => { const r=await fetch(`https://${h}${u}`,{credentials:'include'}); return r.ok? await r.json():{__status:r.status}; };
  const cl = await get('/api/customers?pagination[rowsPerPage]=250&pagination[page]=1&search=');
  const list = cl?.data?.collection || [];
  const co0 = await get(`/api/customers/view/${list[0].id}?`);
  const companyKeys = Object.keys(co0?.data?.company||{});
  const accKey = companyKeys.find(k=>/account/i.test(k));
  const found=[]; let looked=0, noAcc=0;
  for (const c of list) {
    if (found.length>=5 || looked>=120) break; looked++;
    const v = await get(`/api/customers/view/${c.id}?`);
    const acc = accKey ? v?.data?.company?.[accKey] : null;
    if (!acc) { noAcc++; continue; }
    const t = await get(`/api/customer-account/list-unpaid-transaction?accountId=${acc}&pagination[rowsPerPage]=100&openOnly=true`);
    const arr = t?.data?.response?.collection || [];
    const inv = arr.filter(r=>r.type==='invoice' && Number(r.balance)>300);
    if (inv.length) found.push({ id:c.id, name:c.name, acc,
      invoices: inv.slice(0,3).map(i=>({num:i.invoice_number, bal:i.balance, status:i.status_label})),
      credits: arr.filter(r=>r.type==='credit').map(r=>({num:r.invoice_number, bal:r.balance, status:r.status_label})) });
  }
  return { companyKeys, accKey, listLen:list.length, looked, noAcc, found };
}, APIH);
console.log(JSON.stringify(out,null,1).slice(0,3000));
fs.writeFileSync('build/invoice-ui-refresh/seed-2026-09-03/unpaid-customers.json', JSON.stringify(out,null,1));
await browser.close();
