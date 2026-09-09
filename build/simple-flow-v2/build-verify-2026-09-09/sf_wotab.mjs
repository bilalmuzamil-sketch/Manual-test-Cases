import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/administration/settings','admin');
await page.waitForTimeout(6000);
// click the "Work Orders" tab/section within Settings
await page.evaluate(()=>{const el=[...document.querySelectorAll('.q-tab,[role=tab],button,a,.q-item,div')].find(e=>{const t=(e.textContent||'').replace(/\s+/g,' ').trim();return t==='Work Orders' && e.closest('[class*=setting],main,.q-page,.q-tabs');});if(el)el.click();});
await page.waitForTimeout(1000);
// also try a plain tab click by role
await page.locator('[role=tab]:has-text("Work Orders"), .q-tab:has-text("Work Orders")').first().click().catch(()=>{});
await page.waitForTimeout(3000);
const it=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').trim());
console.log('has toggles:', ['Require Receiving Parts Before Completion','Require picking inventory parts','Require ordering parts','Require Approval for New Lines','Require Review'].map(t=>t+'='+it.includes(t)).join(' | '));
// dump toggle labels verbatim
const toggles=await page.evaluate(()=>[...document.querySelectorAll('.q-toggle,.q-item__label,label,.q-checkbox__label')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&/requir|review|approv|pick|order|receiv|complet|tech story|mileage|engine|invoice number/i.test(t)));
console.log('WO SETTINGS TOGGLES:', JSON.stringify([...new Set(toggles)]));
// section headings on this tab
const heads=await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].map(e=>(e.textContent||'').trim()).filter(Boolean));
console.log('SETTINGS TABS:', JSON.stringify([...new Set(heads)]));
await page.screenshot({path:OUT+'/settings-workorders-tab-sv8683.png',fullPage:true}).catch(()=>{});
await browser.close();
