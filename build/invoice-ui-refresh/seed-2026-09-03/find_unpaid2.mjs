// Route corrected from the screen's own call: /api/customers?pagination[...]  (top key "data").
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
await page.waitForTimeout(6000);
const out = await page.evaluate(async (h) => {
  const get = async u => { const r=await fetch(`https://${h}${u}`,{credentials:'include'}); return r.ok? await r.json():{__status:r.status}; };
  const first = await get('/api/customers?pagination[rowsPerPage]=5&pagination[page]=1&search=');
  const shape = { topKeys:Object.keys(first||{}), dataType:Array.isArray(first?.data)?'array':typeof first?.data,
                  dataKeys: Array.isArray(first?.data)? Object.keys(first.data[0]||{}) : Object.keys(first?.data||{}) };
  const page1 = await get('/api/customers?pagination[rowsPerPage]=200&pagination[page]=1&search=');
  const list = Array.isArray(page1?.data) ? page1.data : (page1?.data?.collection || page1?.data?.data || []);
  const found=[]; let looked=0;
  for (const c of list) {
    if (found.length>=4 || looked>=80) break; looked++;
    const v = await get(`/api/customers/view/${c.id}?`);
    const d = v?.data || v?.response || v;
    const acc = d?.customer_account_id || d?.customer_account?.id || d?.account_id;
    if (!acc) continue;
    const t = await get(`/api/customer-account/list-unpaid-transaction?accountId=${acc}&pagination[rowsPerPage]=100&openOnly=true`);
    const rows = t?.data?.collection || t?.data || t?.response?.collection || t?.collection || [];
    const arr = Array.isArray(rows)? rows : [];
    const inv = arr.filter(r=>String(r.type||'').toLowerCase()==='invoice' && Number(r.balance)>300);
    if (inv.length) found.push({ id:c.id, name:c.name||c.company_name||c.display_name, acc,
      invoices: inv.slice(0,3).map(i=>({num:i.number, bal:i.balance, status:i.status})),
      credits: arr.filter(r=>String(r.type||'').toLowerCase()==='credit').map(r=>({num:r.number, bal:r.balance, status:r.status})) });
  }
  return { shape, listLen:list.length, looked, found };
}, APIH);
console.log(JSON.stringify(out,null,1).slice(0,3500));
fs.writeFileSync('build/invoice-ui-refresh/seed-2026-09-03/unpaid-customers.json', JSON.stringify(out,null,1));
await browser.close();
