// The bundle scan points straight at it: "Restocking Fee" lives in CreateCredit and
// IssueCreditMemoDialog, and "Issue Credit" also lives in InvoiceActionBar. The Issue Credit dialog I
// used all night was opened from the CUSTOMER's Invoices tab and only offers an Amount. Opened from an
// INVOICE's own action bar it may list that invoice's parts, with a restocking fee per part - which is
// exactly what C44967 and C44968 describe.
// Route in: a paid part sale -> the "Finance" tab -> the toolbar's three-dot menu.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const SALE='2fa6c0dc-10a6-4334-8d63-fa4425239556', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', `/parts/part-sale/${SALE}/part-requests`, 'admin');
await page.waitForTimeout(12000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.locator('.q-tab:has-text("Finance"), [role="tab"]:has-text("Finance")').first().click();
await page.waitForTimeout(9000);
const kebabs = page.locator('.q-btn:has-text("more_vert")');
console.log('more_vert buttons on the Finance tab:', await kebabs.count());
for (let i=0;i<await kebabs.count();i++){
  await kebabs.nth(i).click({force:true}).catch(()=>{}); await page.waitForTimeout(2500);
  const items = await page.evaluate(L=>{ const lab=eval(L);
    return [...document.querySelectorAll('.q-menu .q-item')].map((e,k)=>{e.setAttribute('data-qa-mi',String(k));return lab(e);}).filter(Boolean); }, lab);
  console.log(`  menu ${i}:`, JSON.stringify(items));
  const ic = items.findIndex(t=>/issue credit/i.test(t));
  if (ic >= 0) {
    console.log('  -> opening "Issue Credit" from the invoice action bar');
    await page.locator(`[data-qa-mi="${ic}"]`).first().click(); await page.waitForTimeout(7000);
    const d = await page.evaluate(L=>{ const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
      const tb=x.querySelector('table');
      return { whole: lab(x).slice(0,800),
        inputs:[...x.querySelectorAll('input,textarea')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
          let p=i.parentElement,ctx=''; for(let dd=0;dd<7&&p;dd++,p=p.parentElement){const q=lab(p); if(q.length>=3&&q.length<=90){ctx=q;break;}}
          return {k,value:i.value,ctx};}),
        buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean),
        radios:[...x.querySelectorAll('.q-radio')].map(lab),
        table: tb? {h:[...tb.querySelectorAll('thead th')].map(lab), r:[...tb.querySelectorAll('tbody tr')].map(tr=>[...tr.cells].map(lab))}:null }; }, lab);
    console.log('ISSUE CREDIT (from the invoice):'); console.log(JSON.stringify(d,null,1).slice(0,2600));
    fs.writeFileSync(`${OUT}/invoice-issue-credit.json`, JSON.stringify(d,null,1));
    await page.screenshot({path:`${OUT}/invoice-issue-credit.png`, fullPage:true});
    break;
  }
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
await browser.close();
