// Wider sweep: the partially-applied seed needs a customer with an unpaid invoice AND NO deposits or
// credits already sitting on the account - the last attempt was spoiled because the New Payment dialog
// automatically lists every available deposit and consumed one instead of the credit.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APIH } = await boot('sv8218', '/customers', 'admin');
await page.waitForTimeout(5000);
const out = await page.evaluate(async (h) => {
  const get = async u => { const r=await fetch(`https://${h}${u}`,{credentials:'include'}); return r.ok? await r.json():{__status:r.status}; };
  const clean=[]; let looked=0, pages=0;
  for (let p=1; p<=3 && clean.length<6; p++) {
    const cl = await get(`/api/customers?pagination[rowsPerPage]=250&pagination[page]=${p}&search=`);
    const list = cl?.data?.collection || []; if (!list.length) break; pages++;
    for (const c of list) {
      if (clean.length>=6 || looked>=260) break; looked++;
      const v = await get(`/api/customers/view/${c.id}?`);
      const acc = v?.data?.company?.customer_account_id; if (!acc) continue;
      const t = await get(`/api/customer-account/list-unpaid-transaction?accountId=${acc}&pagination[rowsPerPage]=100&openOnly=false`);
      const arr = t?.data?.response?.collection || [];
      const inv = arr.filter(r=>r.type==='invoice' && Number(r.balance)>1000);
      const junk = arr.filter(r=>(r.type==='deposit'||r.type==='credit') && r.status!=='applied' && r.status!=='voided' && r.status!=='refunded');
      if (inv.length && !junk.length) clean.push({ id:c.id, name:c.name, acc,
        invoice:{num:inv[0].invoice_number, bal:inv[0].balance}, otherRows:arr.filter(r=>r.type!=='invoice').map(r=>`${r.invoice_number}:${r.status_label}`) });
    }
  }
  return { pages, looked, clean };
}, APIH);
console.log(JSON.stringify(out,null,1).slice(0,2500));
fs.writeFileSync('build/invoice-ui-refresh/seed-2026-09-03/clean-customers.json', JSON.stringify(out,null,1));
await browser.close();
