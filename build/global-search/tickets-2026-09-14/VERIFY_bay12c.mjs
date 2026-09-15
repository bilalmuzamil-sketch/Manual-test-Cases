// C53604's own steps say it plainly: address line 2 is empty on most records, so if the search finds
// nothing, OPEN THE RECORD and check the field is filled in before recording a result. An empty
// field proves nothing about the search. The supplier half found nothing, so this is that check.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/bay12c`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APP } = await boot('sv9160','/','admin');
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3200);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
await page.type('[data-test-id="search_modal_input"]','ZZAUTOTEST Kestrel',{delay:35});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const r=document.querySelector('[data-test-id^="search_result_row_vendors"]'); r&&r.click();});
await page.waitForTimeout(8000);
const txt=await page.evaluate(()=>(document.body.innerText||'').split('\n').map(s=>s.trim()).filter(Boolean));
R.vendorPage={url:page.url(), addressLine2Visible:txt.some(s=>/Bay 12C/i.test(s)), shows:txt.slice(10,55)};
await page.screenshot({path:`${EV}/vendor.png`,fullPage:true});
L('the supplier page is', page.url());
L('does it show Bay 12C on screen?', R.vendorPage.addressLine2Visible);
L('what it shows:', JSON.stringify(txt.slice(14,40)).slice(0,420));
// and the customer half, for the same reason
await page.goto(`${APP}/customers/b450f737-ead4-4ba6-a881-9085c5bf8c2f/work-orders`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(8000);
const ct=await page.evaluate(()=>(document.body.innerText||'').split('\n').map(s=>s.trim()).filter(Boolean));
R.customerPage={addressLine2Visible:ct.some(s=>/Dock 7B/i.test(s))};
L('the customer shows Dock 7B:', R.customerPage.addressLine2Visible);
fs.writeFileSync(`${DIR}/BAY12C.json`,JSON.stringify(R,null,1));
L('DONE'); await browser.close();
