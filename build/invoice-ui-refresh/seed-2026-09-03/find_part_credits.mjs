// The customer record carries `part_sale_credit_count`. Find a customer that already HAS one: that is
// where a credit raised from a returned part will be, and C44967 line 2 / C44968 line 1 need exactly
// such a credit (a negative quantity and rate, with a restocking fee).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APIH } = await boot('sv8218', '/customers', 'admin');
await page.waitForTimeout(6000);
const out = await page.evaluate(async h => {
  const get = async u => { const r=await fetch(`https://${h}${u}`,{credentials:'include'}); return r.ok? await r.json():{__status:r.status}; };
  const hits=[]; let looked=0;
  // the part-sales list without a status filter, to see whether any sale carries returns
  const ps = await get('/api/part-sales?pagination[page]=1&pagination[rowsPerPage]=200&search=');
  const psRows = ps?.data?.collection || ps?.data || [];
  const psKeys = Array.isArray(psRows)&&psRows[0] ? Object.keys(psRows[0]) : null;
  const withRet = (Array.isArray(psRows)?psRows:[]).filter(r=>Number(r.returns_count ?? r.returns ?? 0) > 0)
      .map(r=>({num:r.number, status:r.status, cust:r.company_name||r.customer_name, returns:r.returns_count ?? r.returns}));
  for (let p=1; p<=2 && hits.length<8; p++) {
    const cl = await get(`/api/customers?pagination[rowsPerPage]=250&pagination[page]=${p}&search=`);
    for (const c of (cl?.data?.collection||[])) {
      looked++;
      const v = await get(`/api/customers/view/${c.id}?`);
      const co = v?.data?.company; if (!co) continue;
      if (Number(co.part_sale_credit_count||0) > 0)
        hits.push({name:c.name, id:c.id, acc:co.customer_account_id, credits:co.part_sale_credit_count});
      if (hits.length>=8 || looked>=200) break;
    }
  }
  return { psTotal: Array.isArray(psRows)? psRows.length : 0, psKeys, withRet, looked, hits };
}, APIH);
console.log(JSON.stringify(out,null,1).slice(0,2500));
fs.writeFileSync('build/invoice-ui-refresh/seed-2026-09-03/part-credit-hunt.json', JSON.stringify(out,null,1));
await browser.close();
