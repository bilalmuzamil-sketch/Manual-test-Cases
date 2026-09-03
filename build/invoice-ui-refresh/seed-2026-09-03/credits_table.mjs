// The credits live in the customer's "Invoices" tab as rows whose Type is "credit" and No. starts "CM"
// (route registry, proven 2026-09-02). Read that table for whichever customer id is passed.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const CUST = process.argv[2] || '4f8e5beb-78a2-44ed-9dfe-eebc1bc2e8f4';
const { browser, page, APP } = await boot('sv8218', '/customers', 'admin');
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
const open = page.locator('.q-toggle:has-text("Open only"), :text("Open only")').first();
if (await open.count()) { await open.click().catch(()=>{}); await page.waitForTimeout(4000); }
const t = await page.evaluate(()=>{ const tb=document.querySelector('table'); if(!tb) return null;
  const h=[...tb.querySelectorAll('thead th')].map(c=>(c.textContent||'').replace(/\s+/g,' ').trim());
  const r=[...tb.querySelectorAll('tbody tr')].map(tr=>[...tr.cells].map(c=>(c.textContent||'').replace(/\s+/g,' ').trim()));
  return {h,r}; });
console.log(JSON.stringify(t,null,1));
await page.screenshot({path:'build/invoice-ui-refresh/seed-2026-09-03/credits-table.png', fullPage:true});
await browser.close();
