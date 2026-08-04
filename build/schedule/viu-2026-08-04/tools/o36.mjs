import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/administration/staff',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(7000);
// search Ayesha and open
const ph=await page.evaluate(()=>[...document.querySelectorAll('input')].map(i=>i.placeholder).filter(Boolean));
console.log('inputs',JSON.stringify(ph));
const si=await page.$('input');
if(si){await si.click(); await si.type('Ayesha',{delay:40});}
await page.waitForTimeout(3000);
await page.screenshot({path:E+'77-staff-list.png'});
F.rows=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(t=>t.innerText.trim().replace(/\n/g,' | ')).slice(0,6));
console.log('ROWS',JSON.stringify(F.rows,null,1));
await page.evaluate(()=>{const t=document.querySelector('tbody tr'); if(t)t.click();});
await page.waitForTimeout(4000);
await page.screenshot({path:E+'78-staff-edit.png',fullPage:true});
F.editText=await page.evaluate(()=>{const d=document.querySelector('.q-dialog')||document.body; return d.innerText.trim().slice(0,2500);});
console.log('EDIT',F.editText);
F.toggles=await page.evaluate(()=>{const d=document.querySelector('.q-dialog')||document.body; return [...d.querySelectorAll('.q-toggle,.q-checkbox')].map(t=>({t:t.innerText.trim().slice(0,60),a:t.querySelector('input')?.getAttribute('aria-checked')}));});
console.log('TOGGLES',JSON.stringify(F.toggles,null,1));
fs.writeFileSync('/tmp/sviu/f-staffedit.json',JSON.stringify(F,null,1));
await browser.close();
