import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,300)});});
page.on('response',async r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.request().method()!=='GET'){try{F.reqs.push({res:r.status(),body:(await r.text()).slice(0,200)});}catch{}}});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
// COLOUR PALETTE
const i=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id=schedule_shift_block]')].findIndex(e=>!/continues/.test(e.innerText)));
await page.evaluate(x=>document.querySelectorAll('[data-test-id=schedule_shift_block]')[x].click(),i);
await page.waitForTimeout(2400);
await page.evaluate(()=>document.querySelector('[data-test-id=button_shift_detail_color]').click());
await page.waitForTimeout(1500);
await page.screenshot({path:E+'72-colour-palette.png'});
F.palette=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); return m?{text:m.innerText.trim(),items:[...m.querySelectorAll('.q-item')].map(e=>e.innerText.trim())}:null;});
console.log('PALETTE',JSON.stringify(F.palette,null,1));
await page.keyboard.press('Escape'); await page.waitForTimeout(700);
// KEYBOARD: Enter on a confirmable dialog (delete scope for a single shift = plain confirm?)
F.modalOpen=await page.evaluate(()=>!!document.querySelector('[data-test-id=dialog_schedule_shift_detail]'));
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_shift_detail_delete]'); if(b)b.click();});
await page.waitForTimeout(2000);
await page.screenshot({path:E+'73-single-delete.png'});
F.singleDelete=await page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>({t:d.innerText.trim().slice(0,400),btns:[...d.querySelectorAll('button')].map(x=>x.innerText.trim()).filter(Boolean)})));
console.log('SINGLE DELETE',JSON.stringify(F.singleDelete,null,1));
// press Escape then Enter tests
await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
F.escAfterSingleDelete=await page.evaluate(()=>({n:document.querySelectorAll('.q-dialog').length,head:document.querySelector('.q-dialog')?.innerText.trim().slice(0,60)}));
console.log('ESC',JSON.stringify(F.escAfterSingleDelete));
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
// DAY VIEW drag/resize + snap
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='Day'); b.click();});
await page.waitForTimeout(4000);
F.dayIds=await page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].filter(x=>/now|slot|shad|business/i.test(x)));
const blk=await page.evaluate(()=>{const b=document.querySelector('[data-test-id=schedule_shift_block]'); if(!b)return null; const r=b.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,t:b.innerText.trim().replace(/\n/g,' / ').slice(0,40)};});
console.log('day block',JSON.stringify(blk),'dayIds',JSON.stringify(F.dayIds));
if(blk){
  // horizontal drag by ~23px (about half a slot -> should snap to 15 min)
  await page.mouse.move(blk.x+blk.w/2,blk.y+blk.h/2); await page.mouse.down();
  for(let k=1;k<=8;k++){await page.mouse.move(blk.x+blk.w/2+3*k,blk.y+blk.h/2,{steps:2}); await page.waitForTimeout(70);}
  await page.mouse.up(); await page.waitForTimeout(2600);
  await page.screenshot({path:E+'74-day-drag.png'});
  F.dayDrag=await page.evaluate(()=>({toast:document.querySelector('.undo-toast')?.innerText.trim().replace(/\n/g,' | ')||null}));
  console.log('DAY DRAG',JSON.stringify(F.dayDrag),'reqs',JSON.stringify(F.reqs.slice(-2)));
}
fs.writeFileSync('/tmp/sviu/f-batch13.json',JSON.stringify(F,null,1));
await browser.close();
