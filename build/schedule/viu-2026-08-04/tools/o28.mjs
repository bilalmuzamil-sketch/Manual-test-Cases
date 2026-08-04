import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
const click=async l=>page.evaluate(x=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()===x); if(b)b.click();},l);
// A) grid search on current week (has Pamill)
await click('search'); await page.waitForTimeout(1200);
const el=await page.$('input[placeholder="Search work orders..."]');
await el.click(); await el.type('Pamill',{delay:40}); await page.waitForTimeout(2500);
await page.screenshot({path:E+'61-grid-search-match.png'});
F.gridSearch=await page.evaluate(()=>{const bs=[...document.querySelectorAll('.schedule-block')];
  return {n:bs.length, items:bs.map(b=>({t:b.innerText.trim().replace(/\n/g,' / ').slice(0,40),cls:b.className,op:getComputedStyle(b).opacity}))};});
console.log('GRID SEARCH',JSON.stringify(F.gridSearch,null,1).slice(0,2000));
await el.fill(''); await page.waitForTimeout(1800);
// B) VIN toggle ON
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='space_dashboard'); b.click();});
await page.waitForTimeout(1200);
await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const c=[...m.querySelectorAll('.q-checkbox')].find(e=>/VIN Number/.test(e.innerText)); c.click();});
await page.waitForTimeout(2200);
await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
await page.screenshot({path:E+'62-vin-on.png'});
F.vinOn=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].slice(0,3).map(b=>b.innerText.trim().replace(/\n/g,' / ')));
console.log('VIN ON blocks',JSON.stringify(F.vinOn,null,1));
// C) My Shifts ON
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='space_dashboard'); b.click();});
await page.waitForTimeout(1200);
await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const c=[...m.querySelectorAll('.q-checkbox')].find(e=>/My Shifts/.test(e.innerText)); c.click();});
await page.waitForTimeout(2400);
await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
await page.screenshot({path:E+'63-my-shifts.png'});
F.myShifts=await page.evaluate(()=>({rows:[...document.querySelectorAll('.fc-datagrid-body .fc-datagrid-cell-cushion')].map(e=>e.innerText.trim().replace(/\n/g,' ')),blocks:document.querySelectorAll('.schedule-block').length,empty:document.body.innerText.match(/No .{0,60}/)?.[0]||''}));
console.log('MY SHIFTS',JSON.stringify(F.myShifts,null,1));
// revert both
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='space_dashboard'); b.click();});
await page.waitForTimeout(1100);
await page.evaluate(()=>{const m=document.querySelector('.q-menu'); [...m.querySelectorAll('.q-checkbox')].filter(e=>/My Shifts|VIN Number/.test(e.innerText)).forEach(c=>c.click());});
await page.waitForTimeout(2000); await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
F.reverted=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='space_dashboard'); b.click(); return null;});
await page.waitForTimeout(1100);
F.fdState=await page.evaluate(()=>{const m=document.querySelector('.q-menu'); return [...m.querySelectorAll('.q-checkbox')].map(c=>({t:c.innerText.trim(),a:c.querySelector('input')?.getAttribute('aria-checked')}));});
console.log('FD STATE AFTER REVERT',JSON.stringify(F.fdState));
await page.keyboard.press('Escape'); await page.waitForTimeout(800);
// D) Tech Hours ON
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='tune'); b.click();});
await page.waitForTimeout(1200);
await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const t=[...m.querySelectorAll('.q-toggle')].find(e=>/Tech Hours/.test(e.innerText)); t.click();});
await page.waitForTimeout(2200); await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
await page.screenshot({path:E+'64-tech-hours.png'});
F.techHours=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body .fc-datagrid-cell-cushion')].map(e=>e.innerText.trim().replace(/\n/g,' ')).slice(0,8));
console.log('TECH HOURS ROWS',JSON.stringify(F.techHours,null,1));
// revert
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='tune'); b.click();});
await page.waitForTimeout(1100);
await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const t=[...m.querySelectorAll('.q-toggle')].find(e=>/Tech Hours/.test(e.innerText)); t.click();});
await page.waitForTimeout(1600); await page.keyboard.press('Escape');
fs.writeFileSync('/tmp/sviu/f-batch9.json',JSON.stringify(F,null,1));
await browser.close();
