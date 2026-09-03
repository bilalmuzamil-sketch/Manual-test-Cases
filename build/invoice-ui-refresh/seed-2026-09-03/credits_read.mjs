// Read the customer's credits the way the SCREEN does: walk to the Credits tab and capture the GET
// the SPA itself fires, instead of guessing a query shape (the previous two guesses returned []).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='4f8e5beb-78a2-44ed-9dfe-eebc1bc2e8f4', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const gets=[]; page.on('response',async r=>{const u=r.url();
  if(u.includes(APIH)&&r.request().method()==='GET'&&/credit|payment|invoice/i.test(u)) {
    let body=null; try{ body=(await r.text()).slice(0,1500);}catch{}
    gets.push({url:u.replace(`https://${APIH}`,''), status:r.status(), body}); }});
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
const tabs = await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role="tab"],a')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<30));
console.log('tabs/links on the customer screen:', JSON.stringify([...new Set(tabs)]).slice(0,900));
for (const name of ['Credits','Credit memos','Payments','Statement']) {
  const t = page.locator(`.q-tab:has-text("${name}"), [role="tab"]:has-text("${name}")`).first();
  if (await t.count()) { console.log('clicking tab', name); await t.click(); await page.waitForTimeout(6000);
    const rows = await page.evaluate(()=>{ const tb=document.querySelector('table'); if(!tb) return null;
      const h=[...tb.querySelectorAll('thead th')].map(c=>(c.textContent||'').replace(/\s+/g,' ').trim());
      const r=[...tb.querySelectorAll('tbody tr')].slice(0,12).map(tr=>[...tr.cells].map(c=>(c.textContent||'').replace(/\s+/g,' ').trim()));
      return {h,r}; });
    console.log(name, 'TABLE:', JSON.stringify(rows).slice(0,2000));
    await page.screenshot({path:`${OUT}/tab-${name.replace(/\s+/g,'-')}.png`});
  }
}
console.log('--- GETs the SPA fired ---');
for (const g of gets) console.log(g.status, g.url);
fs.writeFileSync(`${OUT}/credits-gets.json`, JSON.stringify(gets,null,1));
await browser.close();
