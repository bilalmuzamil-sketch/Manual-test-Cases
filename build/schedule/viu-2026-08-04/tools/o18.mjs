import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,400)});});
page.on('response',async r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.request().method()!=='GET'){try{F.reqs.push({res:r.status(),body:(await r.text()).slice(0,300)});}catch{}}});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const p=await page.evaluate(()=>{const b=[...document.querySelectorAll('.schedule-block')].find(e=>/Qispring/.test(e.innerText)); if(!b)return null; const r=b.getBoundingClientRect(); return {x:r.x+30,y:r.y+r.height/2,w:r.width,h:r.height};});
console.log('banner box',JSON.stringify(p));
if(p){
  await page.mouse.click(p.x,p.y); await page.waitForTimeout(2600);
  const open=await page.evaluate(()=>!!document.querySelector('.q-dialog'));
  console.log('dialog?',open);
  await page.screenshot({path:E+'43-series-modal.png'});
  F.seriesModal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{text:d.innerText.trim(),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean)}:null;});
  console.log('SERIES MODAL',JSON.stringify(F.seriesModal,null,1));
  if(open){
    await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const b=[...d.querySelectorAll('button')].find(e=>/delete_outline/.test(e.innerText)); b.click();});
    await page.waitForTimeout(2200);
    await page.screenshot({path:E+'44-delete-scope.png'});
    F.deleteScope=await page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>({text:d.innerText.trim().slice(0,800),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean)})));
    console.log('DELETE SCOPE',JSON.stringify(F.deleteScope,null,1));
  }
}
fs.writeFileSync('/tmp/sviu/f-delete.json',JSON.stringify(F,null,1));
await browser.close();
