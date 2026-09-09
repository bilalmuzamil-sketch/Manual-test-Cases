import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/administration','admin');
await page.waitForTimeout(6000);
// settings sidebar
const sidebar=await page.evaluate(()=>[...document.querySelectorAll('a,.q-item,[role=listitem]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<40).slice(0,50));
console.log('SETTINGS SIDEBAR:', JSON.stringify([...new Set(sidebar)]));
// find a WO/App settings entry mentioning completion/require
const body=await page.evaluate(()=>document.body.innerText);
for(const t of ['Require receiving','Require Review','Require Tech Story','Mileage','Engine Hours','Work Order','App Settings','Completion']) console.log('  admin body has',JSON.stringify(t),':',body.includes(t));
// try clicking a "Work Orders" or "App"/"Settings" that holds completion rules
const clicked=await page.evaluate(()=>{const el=[...document.querySelectorAll('a,.q-item')].find(e=>/App Settings|Work Order Settings|Work Orders/i.test(e.textContent||''));if(el){el.click();return (el.textContent||'').trim();}return null;});
console.log('clicked settings entry:', JSON.stringify(clicked));
await page.waitForTimeout(4000);
const toggles=await page.evaluate(()=>[...document.querySelectorAll('.q-toggle,[role=switch],label,.q-item__label')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&/requir|review|tech story|mileage|engine|receiv|complet/i.test(t)).slice(0,25));
console.log('COMPLETION TOGGLES:', JSON.stringify([...new Set(toggles)]));
await page.screenshot({path:OUT+'/settings-sv8683.png',fullPage:true}).catch(()=>{});
await browser.close();
