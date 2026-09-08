import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315', '/', 'admin');
await page.waitForTimeout(8000);
console.log('build:', await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content));
await page.locator('a:has-text("Work Orders")').first().click().catch(()=>{}); await page.waitForTimeout(8000);
await page.locator('.q-tab:has-text("Estimates"),button:has-text("Estimates")').first().click().catch(()=>{}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L); const tb=document.querySelector('table'); const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c)); const li=head.findIndex(h=>/^Lines/.test(h));
  for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab); if(c.join('').trim().length<3)continue; if(parseInt(c[li])>0){tr.setAttribute('data-qa-open','1');break;}}}, lab);
await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
const target=['Add Part','+ Add Part','New Line','Part number','Sell price','More options','Add tech story for this line','Story'];
function scan(body){const o={};for(const t of target)o[t]=body.includes(t);return o;}
let body = await page.evaluate(()=>document.body.innerText);
console.log('LINES SCREEN:', JSON.stringify(scan(body)));
// open Add Part inline row
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e))); if(b)b.setAttribute('data-qa-add1','1');}, lab);
await page.locator('[data-qa-add1="1"]').click().catch(()=>{}); await page.waitForTimeout(4500);
// column/field labels in the inline row
const flds = await page.evaluate(()=>[...document.querySelectorAll('.q-field__label')].map(e=>(e.textContent||'').trim()).filter(Boolean));
console.log('INLINE FIELD LABELS:', JSON.stringify([...new Set(flds)]));
body = await page.evaluate(()=>document.body.innerText);
console.log('ROW OPEN:', JSON.stringify(scan(body)));
await page.screenshot({path:OUT+'/inline-row-v26.35.9.png', fullPage:false}).catch(()=>{});
// open More options menu on the row
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a,[role=button]')].find(e=>/More options/i.test(lab(e))||/More options/i.test(e.getAttribute('aria-label')||'')); if(b)b.setAttribute('data-qa-more','1');}, lab);
const more=page.locator('[data-qa-more="1"]');
let moreItems=[];
if(await more.count()){ await more.click().catch(()=>{}); await page.waitForTimeout(2500);
  moreItems = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu [role=menuitem], .q-list .q-item')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean));
}
console.log('MORE OPTIONS MENU:', JSON.stringify([...new Set(moreItems)]));
fs.writeFileSync(OUT+'/inline-body-v26.35.9.txt', body);
// settings sidebar: Bin Locations
await page.goto('https://sv9315.qa.shopview.com/administration',{waitUntil:'domcontentloaded'}).catch(()=>{});
await page.waitForTimeout(5000);
const sb = await page.evaluate(()=>document.body.innerText);
console.log('SETTINGS has Bin Locations:', sb.includes('Bin Locations'), '| Inventory:', sb.includes('Inventory'));
await browser.close();
