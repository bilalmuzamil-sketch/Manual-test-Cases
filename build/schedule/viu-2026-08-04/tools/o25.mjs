import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,300)});});
page.on('response',async r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.request().method()!=='GET'){try{F.reqs.push({res:r.status(),body:(await r.text()).slice(0,250)});}catch{}}});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='Day'); b.click();});
await page.waitForTimeout(3500);
await page.evaluate(()=>{const d=[...document.querySelectorAll('.mini-calendar__day')].find(e=>e.innerText.trim()==='12'&&!e.className.includes('outside')); if(d)d.click();});
await page.waitForTimeout(4200);
F.blocks=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].map((e,i)=>({i,t:e.innerText.trim().replace(/\n/g,' / ').slice(0,45)})));
console.log(JSON.stringify(F.blocks));
// find a Qispring block whose modal says "Shift 3 of 4"
for(const b of F.blocks.filter(x=>/Qispring/.test(x.t))){
  await page.evaluate(i=>document.querySelectorAll('.schedule-block')[i].click(),b.i);
  await page.waitForTimeout(2200);
  const t=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.match(/Shift \d of \d/)?.[0]||null);
  console.log('block',b.i,'->',t);
  if(t&&/Shift [23] of 4/.test(t)){
    await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const x=[...d.querySelectorAll('button')].find(e=>/delete_outline/.test(e.innerText)); x.click();});
    await page.waitForTimeout(2400);
    await page.screenshot({path:E+'56-delete-scope-3opt.png'});
    F.scope3=await page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>({t:d.innerText.trim().slice(0,900),btns:[...d.querySelectorAll('button')].map(x=>x.innerText.trim().replace(/\n/g,' ')).filter(Boolean)})));
    console.log('SCOPE3',JSON.stringify(F.scope3,null,1));
    // Escape with focus inside the dialog
    await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); d.querySelector('button')?.focus();});
    await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
    F.escInside=await page.evaluate(()=>({n:document.querySelectorAll('.q-dialog').length,head:document.querySelector('.q-dialog')?.innerText.trim().slice(0,50)}));
    console.log('ESC inside ->',JSON.stringify(F.escInside));
    // click Cancel instead
    await page.evaluate(()=>{const ds=[...document.querySelectorAll('.q-dialog')]; const d=ds[ds.length-1]; const b=[...d.querySelectorAll('button')].find(e=>/^Cancel$/.test(e.innerText.trim())); if(b)b.click();});
    await page.waitForTimeout(1200);
    F.afterCancel=await page.evaluate(()=>({n:document.querySelectorAll('.q-dialog').length,head:document.querySelector('.q-dialog')?.innerText.trim().slice(0,50)}));
    console.log('CANCEL ->',JSON.stringify(F.afterCancel));
    break;
  }
  await page.keyboard.press('Escape'); await page.waitForTimeout(900);
}
fs.writeFileSync('/tmp/sviu/f-scope3.json',JSON.stringify(F,null,1));
await browser.close();
