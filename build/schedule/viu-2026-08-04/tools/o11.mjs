import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:r.postData()});});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
// go to next week (Aug 9-15) where my seeded shifts live and there's room
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const rows=async()=>await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
const cols=async()=>await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({t:th.innerText.trim().replace(/\n/g,' '),cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
// ---- A. LEFT-CLICK on empty grid space -> menu
const R=await rows(); const C=await cols();
const angela=R.find(r=>/Brittany Anderson/.test(r.t)); const wed=C.find(c=>c.cls==='fc-day-wed');
await page.mouse.click(wed.x,angela.y); await page.waitForTimeout(1600);
await page.screenshot({path:E+'31-cell-menu.png'});
F.cellMenu=await page.evaluate(()=>{const m=document.querySelector('.q-menu');return m?{text:m.innerText.trim(),items:[...m.querySelectorAll('.q-item')].map(e=>e.innerText.trim())}:null;});
// ---- B. Create event from that menu
if(F.cellMenu){
  await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const i=[...m.querySelectorAll('.q-item')].find(e=>/Create event/i.test(e.innerText)); if(i)i.click();});
  await page.waitForTimeout(2000); await page.screenshot({path:E+'32-event-modal.png'});
  F.eventModal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog');return d?{text:d.innerText.trim(),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean),inputs:[...d.querySelectorAll('input')].map(i=>({ph:i.placeholder||'',v:i.value})),labels:[...d.querySelectorAll('.q-field__label')].map(l=>l.innerText.trim())}:null;});
  await page.keyboard.press('Escape'); await page.waitForTimeout(900);
  F.escClosedEvent=await page.evaluate(()=>!document.querySelector('.q-dialog'));
}
// ---- C. multi-line WO drop -> scope picker
const inp=await page.$('input[placeholder="Search work orders"]');
await inp.click(); await inp.fill(''); await inp.type('S-13053',{delay:40}); await page.waitForTimeout(2500);
const card=await page.evaluate(()=>{const c=document.querySelector('.sidebar-card'); if(!c)return null; const r=c.getBoundingClientRect(); return {t:c.innerText.trim().replace(/\n/g,' / '),x:r.x+r.width/2,y:r.y+r.height/2};});
F.multiCard=card;
const R2=await rows(); const C2=await cols();
const tgtRow=R2.find(r=>/Brittany Anderson/.test(r.t)); const thu=C2.find(c=>c.cls==='fc-day-thu');
if(card&&tgtRow&&thu){
  await page.mouse.move(card.x,card.y); await page.mouse.down();
  for(let i=1;i<=12;i++){await page.mouse.move(card.x+(thu.x-card.x)*i/12,card.y+(tgtRow.y-card.y)*i/12,{steps:2}); await page.waitForTimeout(80);}
  await page.mouse.up(); await page.waitForTimeout(2600);
  await page.screenshot({path:E+'33-scope-picker.png'});
  F.scopePicker=await page.evaluate(()=>{const m=document.querySelector('.q-menu')||document.querySelector('.q-dialog'); return m?{cls:m.className,text:m.innerText.trim(),btns:[...m.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean)}:null;});
  await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
  F.escClosedScope=await page.evaluate(()=>!document.querySelector('.q-menu')&&!document.querySelector('.q-dialog'));
}
fs.writeFileSync('/tmp/sviu/f-batch6.json',JSON.stringify(F,null,1));
console.log(JSON.stringify(F,null,1).slice(0,4500));
await browser.close();
