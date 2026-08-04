import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const box=await page.evaluate(()=>{const b=[...document.querySelectorAll('.schedule-block')].find(e=>/Qispring/.test(e.innerText)); const r=b.getBoundingClientRect(); return{x:r.x+r.width/2,y:r.y+r.height/2};});
// right click
await page.mouse.click(box.x,box.y,{button:'right'}); await page.waitForTimeout(1800);
F.rightClick=await page.evaluate(()=>({menu:document.querySelector('.q-menu')?.innerText.trim()||null,dialog:document.querySelector('.q-dialog')?.innerText.trim().slice(0,200)||null}));
await page.keyboard.press('Escape'); await page.waitForTimeout(700);
// double click
await page.mouse.dblclick(box.x,box.y); await page.waitForTimeout(2200);
F.dblClick=await page.evaluate(()=>({dialog:document.querySelector('.q-dialog')?.innerText.trim().slice(0,200)||null}));
await page.keyboard.press('Escape'); await page.waitForTimeout(700);
// day view
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='Day'); b.click();});
await page.waitForTimeout(3500);
await page.evaluate(()=>{const d=[...document.querySelectorAll('.mini-calendar__day')].find(e=>e.innerText.trim()==='10'&&!e.className.includes('outside')); if(d)d.click();});
await page.waitForTimeout(3800);
F.dayBlocks=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].map(e=>e.innerText.trim().replace(/\n/g,' / ').slice(0,50)));
const qi=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].findIndex(e=>/Qispring/.test(e.innerText)));
F.dayQispringIdx=qi;
if(qi>=0){ await page.evaluate(i=>document.querySelectorAll('.schedule-block')[i].click(),qi); await page.waitForTimeout(2400);
  F.dayClick=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.trim().slice(0,300)||null);
  await page.screenshot({path:E+'53-day-series.png'});
}
// month view
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='Month'); b.click();});
await page.waitForTimeout(4000);
const mi=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].findIndex(e=>/Qispring/.test(e.innerText)));
F.monthQispringIdx=mi;
if(mi>=0){ await page.evaluate(i=>document.querySelectorAll('.schedule-block')[i].click(),mi); await page.waitForTimeout(2400);
  F.monthClick=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.trim().slice(0,300)||null);
  await page.screenshot({path:E+'54-month-series.png'});
}
F.monthBlocks=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].map(e=>e.innerText.trim().replace(/\n/g,' / ').slice(0,45)).slice(0,14));
fs.writeFileSync('/tmp/sviu/f-seriesopen.json',JSON.stringify(F,null,1));
console.log(JSON.stringify(F,null,1));
await browser.close();
