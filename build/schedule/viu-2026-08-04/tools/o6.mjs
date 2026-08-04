import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot();
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET'){F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:r.postData()});}});
page.on('response',async r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.request().method()!=='GET'){try{F.reqs.push({res:r.status(),u:u.replace(/^https:\/\/[^/]+/,''),body:(await r.text()).slice(0,900)});}catch{}}});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
// find a single-line unscheduled WO card by searching
const inp=await page.$('input[placeholder="Search work orders"]');
await inp.click(); await inp.type('S-15855',{delay:40}); await page.waitForTimeout(2500);
F.card=await page.evaluate(()=>{const c=document.querySelector('.sidebar-card'); if(!c) return null; const r=c.getBoundingClientRect(); return {t:c.innerText.trim().replace(/\n/g,' / '),x:r.x+r.width/2,y:r.y+r.height/2};});
console.log('CARD',JSON.stringify(F.card));
// target: Ayesha row, Sunday column. Find row cell
F.rows=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map((tr,i)=>({i,t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
F.cols=await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({t:th.innerText.trim().replace(/\n/g,' '),cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
console.log('ROWS',JSON.stringify(F.rows.slice(0,20)));
console.log('COLS',JSON.stringify(F.cols));
const ay=F.rows.find(r=>/Ayesha/.test(r.t)); const sun=F.cols.find(c=>c.cls==='fc-day-sun');
console.log('AY',JSON.stringify(ay),'SUN',JSON.stringify(sun));
if(F.card&&ay&&sun){
  await page.mouse.move(F.card.x,F.card.y); await page.mouse.down();
  for(let i=1;i<=14;i++){await page.mouse.move(F.card.x+(sun.x-F.card.x)*i/14, F.card.y+(ay.y-F.card.y)*i/14,{steps:2}); await page.waitForTimeout(90);}
  await page.waitForTimeout(700);
  await page.screenshot({path:E+'16-dragging.png'});
  F.duringDrag=await page.evaluate(()=>({mirror:document.querySelectorAll('.fc-event-dragging,.fc-event-mirror,.schedule-drag-ghost,.fc-highlight').length,
    ghostText:document.querySelector('.fc-event-mirror,.schedule-drag-ghost')?.innerText?.trim()||null,
    highlightCells:document.querySelectorAll('.fc-highlight,.fc-day-hover,.schedule-cell--drop').length,
    bodyHas:[...document.querySelectorAll('[class*=drag],[class*=ghost],[class*=mirror],[class*=highlight]')].map(e=>e.className.toString()).slice(0,10)}));
  await page.mouse.up(); await page.waitForTimeout(3500);
  await page.screenshot({path:E+'17-after-drop.png'});
  F.afterDrop=await page.evaluate(()=>({dialog:document.querySelector('.q-dialog')?.innerText.trim().slice(0,600)||null,
    menu:document.querySelector('.q-menu')?.innerText.trim().slice(0,600)||null,
    toast:document.querySelector('.q-notification')?.innerText.trim()||null}));
}
fs.writeFileSync('/tmp/sviu/f-drag.json',JSON.stringify(F,null,1));
console.log('DURING',JSON.stringify(F.duringDrag)); console.log('AFTER',JSON.stringify(F.afterDrop));
console.log('REQS',JSON.stringify(F.reqs,null,1));
await browser.close();
