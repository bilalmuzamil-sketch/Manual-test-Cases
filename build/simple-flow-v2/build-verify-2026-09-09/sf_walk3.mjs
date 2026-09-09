import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/administration','admin');
await page.waitForTimeout(6000);
// click the general "Settings" sidebar item (infoSettings)
await page.evaluate(()=>{const el=[...document.querySelectorAll('a,.q-item')].find(e=>/^\s*(info)?Settings\s*$/i.test((e.textContent||'').trim()));if(el)el.click();});
await page.waitForTimeout(4000);
console.log('url after Settings:', page.url());
let body=await page.evaluate(()=>document.body.innerText);
for(const t of ['Require receiving','Require Review','Require Tech Story','Require Mileage','Engine Hours','completion','Work Order']) console.log('  has',JSON.stringify(t),':',body.includes(t));
// dump any toggle/label mentioning require/complete/receiv/review
const toggles=await page.evaluate(()=>[...document.querySelectorAll('.q-toggle,label,.q-item__label,.q-field__label,h1,h2,h3,h4')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&/requir|review|tech story|mileage|engine|receiv|complet|part/i.test(t)).slice(0,30));
console.log('TOGGLES/HEADINGS:', JSON.stringify([...new Set(toggles)]));
// section tabs within settings
console.log('SETTINGS TABS:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,15))));
await page.screenshot({path:OUT+'/wo-settings-sv8683.png',fullPage:true}).catch(()=>{});
await browser.close();
