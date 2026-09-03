// The "Process Return" page is VENDOR-facing (Vendor, Credit memo number, Post Credit) - so the credit
// it posts is one the SHOP receives from its supplier. The question C44967/C44968 need answered is
// whether the CUSTOMER who bought the part gets a Credit Invoice. Check two places:
//   (a) the Credits tab on Parts > Returns
//   (b) the customer's own Invoices tab (Bloomingdale Diesel Repair owns part sale P8218-162)
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/parts/returns', 'admin');
await page.waitForTimeout(10000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const tab = page.locator('.q-tab:has-text("Credits"), [role="tab"]:has-text("Credits")').first();
if (await tab.count()) { await tab.click(); await page.waitForTimeout(7000);
  const t = await page.evaluate(L=>{ const lab=eval(L); const tb=document.querySelector('table'); if(!tb) return null;
    return { h:[...tb.querySelectorAll('thead th')].map(lab),
      r:[...tb.querySelectorAll('tbody tr')].slice(0,6).map(tr=>[...tr.cells].map(lab)) }; }, lab);
  console.log('CREDITS TAB:', JSON.stringify(t).slice(0,1200)); }
// (b) the customer
const cust = await page.evaluate(async h => {
  const get = async u => { const r=await fetch(`https://${h}${u}`,{credentials:'include'}); return r.ok? await r.json():{__s:r.status}; };
  const cl = await get('/api/customers?pagination[rowsPerPage]=250&pagination[page]=1&search=Bloomingdale');
  const c = (cl?.data?.collection||[])[0]; if (!c) return {err:'no customer'};
  const v = await get(`/api/customers/view/${c.id}?`); const co=v?.data?.company;
  const t = await get(`/api/customer-account/list-unpaid-transaction?accountId=${co.customer_account_id}&pagination[rowsPerPage]=100&openOnly=false`);
  return { name:c.name, id:c.id, acc:co.customer_account_id, partSaleCredits:co.part_sale_credit_count,
    rows:(t?.data?.response?.collection||[]).map(x=>`${x.invoice_number}|${x.type}|amt ${x.amount}|${x.status_label}`) };
}, APIH);
console.log('CUSTOMER:', JSON.stringify(cust,null,1).slice(0,1400));
await browser.close();
