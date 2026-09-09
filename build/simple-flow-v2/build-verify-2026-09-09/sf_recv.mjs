import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/parts','admin');
await page.waitForTimeout(6000);
// Parts area sub-nav — look for Purchase Orders / Receiving
console.log('PARTS SUBNAV:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab],a,.q-item')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<26).slice(0,25))));
// try the PO page routes
for(const path of ['/purchase-orders','/parts/purchase-orders','/parts/receiving','/parts/orders']){
  await page.goto('https://sv8683.qa.shopview.com'+path,{waitUntil:'domcontentloaded'}).catch(()=>{});
  await page.waitForTimeout(2500);
  const t=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').trim().slice(0,80));
  const notfound=/in the shop... indefinitely/i.test(t);
  console.log(`${path} -> ${notfound?'404':'OK: '+t}`);
}
await page.screenshot({path:OUT+'/parts-po-sv8683.png'}).catch(()=>{});
await browser.close();
