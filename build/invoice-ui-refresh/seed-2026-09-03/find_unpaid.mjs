// Find a customer that still has an UNPAID invoice, using the two endpoints the screen itself uses:
//   /api/customers/list...        -> customer ids
//   /api/customers/view/<id>      -> the ACCOUNT id (customer id is not the account id; that mistake
//                                    voided an earlier hunt and returned 0 of 500)
//   /api/customer-account/list-unpaid-transaction?accountId=...
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
await page.waitForTimeout(6000);
const out = await page.evaluate(async (h) => {
  const get = async u => { const r = await fetch(`https://${h}${u}`, {credentials:'include'});
    return r.ok ? await r.json() : {__status:r.status}; };
  const unwrap = j => j?.response?.collection || j?.collection || j?.response?.data || j?.data || j?.response || j;
  const cl = await get('/api/customers/list?pagination[rowsPerPage]=250&pagination[page]=1');
  const customers = unwrap(cl);
  const list = Array.isArray(customers) ? customers : (customers?.collection || []);
  const found = []; let looked = 0;
  for (const c of list) {
    if (found.length >= 4 || looked >= 90) break; looked++;
    const v = unwrap(await get(`/api/customers/view/${c.id}?`));
    const acc = v?.customer_account_id || v?.customer_account?.id || v?.account_id;
    if (!acc) continue;
    const t = unwrap(await get(`/api/customer-account/list-unpaid-transaction?accountId=${acc}&pagination[rowsPerPage]=100&openOnly=true`));
    const rows = Array.isArray(t) ? t : (t?.collection || []);
    const inv = rows.filter(r => (r.type||'').toLowerCase()==='invoice' && Number(r.balance) > 300);
    if (inv.length) found.push({ id:c.id, name:c.name||c.company_name, acc,
      invoices: inv.slice(0,3).map(i=>({num:i.number||i.num, bal:i.balance, status:i.status?.name||i.status})),
      credits: rows.filter(r=>(r.type||'').toLowerCase()==='credit').map(r=>({num:r.number||r.num, bal:r.balance, status:r.status?.name||r.status})) });
  }
  return { total:list.length, looked, found };
}, APIH);
console.log(JSON.stringify(out,null,1).slice(0,3000));
fs.writeFileSync('build/invoice-ui-refresh/seed-2026-09-03/unpaid-customers.json', JSON.stringify(out,null,1));
await browser.close();
