import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/administration/settings','admin');
await page.waitForTimeout(6000);
// full left-nav (settings sub-nav) verbatim
const nav=await page.evaluate(()=>[...document.querySelectorAll('.q-drawer a, .q-drawer .q-item, aside a, aside .q-item, nav .q-item')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean));
console.log('SETTINGS NAV:', JSON.stringify([...new Set(nav)]));
// scroll full page and collect every toggle label + section heading
async function dump(){return await page.evaluate(()=>{const o=[];document.querySelectorAll('.q-toggle,.q-item__label,label,h1,h2,h3,h4,.text-h6,.q-item__section').forEach(e=>{const t=(e.textContent||'').replace(/\s+/g,' ').trim();if(t&&t.length<60&&/requir|review|approv|pick|order|receiv|complet|tech story|mileage|engine|part|line|invoice/i.test(t))o.push(t);});return [...new Set(o)];});}
await page.mouse.wheel(0,3000); await page.waitForTimeout(1500);
console.log('WO-FLOW TOGGLES (settings page):', JSON.stringify(await dump()));
// try the App Settings route directly if a nav item exists
for(const path of ['/administration/app-settings','/administration/general','/administration/settings/app']){
  await page.goto('https://sv8683.qa.shopview.com'+path,{waitUntil:'domcontentloaded'}).catch(()=>{});
  await page.waitForTimeout(3500);
  const t=await dump();
  console.log(`${path} -> `, JSON.stringify(t.slice(0,15)));
}
await page.screenshot({path:OUT+'/app-settings-scrolled-sv8683.png',fullPage:true}).catch(()=>{});
await browser.close();
