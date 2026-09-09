import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/administration/settings','admin');
await page.waitForTimeout(6000);
// look for an "App Settings" tab/link/section on the settings page
const appLink=await page.evaluate(()=>{const el=[...document.querySelectorAll('a,.q-item,.q-tab,button,h1,h2,h3,label')].find(e=>/App Settings/i.test(e.textContent||''));return el?el.tagName+':'+(el.textContent||'').trim().slice(0,30):null;});
console.log('App Settings element:', JSON.stringify(appLink));
// dump the settings page toggles verbatim
let toggles=await page.evaluate(()=>[...document.querySelectorAll('.q-toggle,.q-item__label,label,.q-field__label')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,40));
console.log('SETTINGS PAGE LABELS:', JSON.stringify([...new Set(toggles)]));
// try to click App Settings if present
if(appLink){await page.evaluate(()=>{const el=[...document.querySelectorAll('a,.q-item,.q-tab,button')].find(e=>/App Settings/i.test(e.textContent||''));if(el)el.click();});await page.waitForTimeout(3500);}
const body=await page.evaluate(()=>document.body.innerText);
for(const t of ['Require Receiving Parts Before Completion','Require picking inventory parts','Require ordering parts','Require Approval for New Lines','Require Review','Require Tech Story']) console.log('  build shows',JSON.stringify(t),':',body.includes(t));
await page.screenshot({path:OUT+'/app-settings-sv8683.png',fullPage:true}).catch(()=>{});
await browser.close();
