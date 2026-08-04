import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/administration/staff',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(7000);
const si=await page.$('input'); await si.click(); await si.type('Ayesha',{delay:40}); await page.waitForTimeout(3000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,i,span')].find(e=>/edit_note/.test(e.innerText||'')); if(b)b.click();});
await page.waitForTimeout(4500);
await page.screenshot({path:E+'79-staff-edit.png',fullPage:true});
F.dlg=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?d.innerText.trim():null;});
console.log('DIALOG',JSON.stringify(F.dlg));
F.toggles=await page.evaluate(()=>{const d=document.querySelector('.q-dialog')||document.body; return [...d.querySelectorAll('.q-toggle,.q-checkbox')].map(t=>({t:t.innerText.trim().slice(0,70),a:t.querySelector('input')?.getAttribute('aria-checked')}));});
console.log('TOGGLES',JSON.stringify(F.toggles,null,1));
F.ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].filter(x=>/hour|schedule|custom|day|range/i.test(x)));
console.log('HOUR IDS',JSON.stringify(F.ids));
// if a custom-hours toggle exists, turn it on
const hit=await page.evaluate(()=>{const d=document.querySelector('.q-dialog')||document.body; const t=[...d.querySelectorAll('.q-toggle,.q-checkbox')].find(e=>/custom hours|working hours/i.test(e.innerText)); if(t){t.click(); return t.innerText.trim();} return null;});
console.log('HOURS TOGGLE',JSON.stringify(hit));
if(hit){ await page.waitForTimeout(2200); await page.screenshot({path:E+'80-custom-hours.png',fullPage:true});
  F.hoursEditor=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?d.innerText.trim().slice(0,1800):null;});
  console.log('HOURS EDITOR',JSON.stringify(F.hoursEditor));
  // revert
  await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const t=[...d.querySelectorAll('.q-toggle,.q-checkbox')].find(e=>/custom hours|working hours/i.test(e.innerText)); if(t)t.click();});
  await page.waitForTimeout(1200);
}
fs.writeFileSync('/tmp/sviu/f-hours.json',JSON.stringify(F,null,1));
await browser.close();
