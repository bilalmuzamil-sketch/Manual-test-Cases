import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,260)});});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&!e.closest('.mini-calendar')); b.click();});
await page.waitForTimeout(4500);
// open the non-conflict Vuchester shift (Tue) modal, inspect start-time field
const idx=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id=schedule_shift_block]')].findIndex(e=>/10123073/.test(e.innerText)&&!/--conflict/.test(e.className)));
await page.evaluate(i=>document.querySelectorAll('[data-test-id=schedule_shift_block]')[i].click(),idx);
await page.waitForTimeout(2400);
F.startField=await page.evaluate(()=>{const el=document.querySelector('[data-test-id=input_shift_detail_start_time]');
  return el?{tag:el.tagName,type:el.getAttribute('type'),value:el.value,step:el.getAttribute('step'),html:el.outerHTML.slice(0,320)}:null;});
console.log('START FIELD',JSON.stringify(F.startField,null,1));
// click the field itself
await page.evaluate(()=>{document.querySelector('[data-test-id=input_shift_detail_start_time]').click();});
await page.waitForTimeout(1500);
await page.screenshot({path:E+'75-time-field-click.png'});
F.afterFieldClick=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); return m?{text:m.innerText.trim().slice(0,400)}:null;});
console.log('AFTER FIELD CLICK',JSON.stringify(F.afterFieldClick));
// find and click a clock icon inside the field
F.iconsInModal=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id=dialog_schedule_shift_detail] i')].map(e=>e.innerText.trim()));
console.log('ICONS',JSON.stringify(F.iconsInModal));
await page.evaluate(()=>{const d=document.querySelector('[data-test-id=dialog_schedule_shift_detail]'); const i=[...d.querySelectorAll('i')].find(e=>/access_time|schedule|watch/.test(e.innerText.trim())); if(i)i.click();});
await page.waitForTimeout(1600);
await page.screenshot({path:E+'76-time-picker-open.png'});
F.picker=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu,.q-popup-proxy')].pop(); if(!m)return null;
  return {text:m.innerText.trim().slice(0,500), clockPositions:[...m.querySelectorAll('.q-time__clock-position')].map(e=>e.innerText.trim()).slice(0,70)};});
console.log('PICKER',JSON.stringify(F.picker,null,1).slice(0,1500));
fs.writeFileSync('/tmp/sviu/f-timepicker.json',JSON.stringify(F,null,1));
await browser.close();
