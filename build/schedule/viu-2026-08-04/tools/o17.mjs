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
F.qispring=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].map((e,i)=>({i,t:e.innerText.trim().replace(/\n/g,' / ').slice(0,70)})).filter(x=>/Qispring/.test(x.t)));
console.log('QISPRING BLOCKS',JSON.stringify(F.qispring));
const i0=F.qispring[0]?.i;
if(i0!==undefined){
  await page.evaluate(i=>document.querySelectorAll('.schedule-block')[i].click(),i0);
  await page.waitForTimeout(2400);
  await page.screenshot({path:E+'43-series-modal.png'});
  F.seriesModal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{text:d.innerText.trim(),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean)}:null;});
  console.log('SERIES MODAL',JSON.stringify(F.seriesModal,null,1));
  // delete
  await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const b=[...d.querySelectorAll('button')].find(e=>/delete_outline/.test(e.innerText)); if(b)b.click();});
  await page.waitForTimeout(2000);
  await page.screenshot({path:E+'44-delete-scope.png'});
  F.deleteScope=await page.evaluate(()=>{const ds=[...document.querySelectorAll('.q-dialog')].filter(d=>d.offsetParent!==null||true); return ds.map(d=>({text:d.innerText.trim().slice(0,700),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean),radios:[...d.querySelectorAll('.q-radio,.q-item')].map(r=>r.innerText.trim().replace(/\n/g,' | '))}));});
  console.log('DELETE SCOPE',JSON.stringify(F.deleteScope,null,1));
  // pick "The whole series" and confirm
  const picked=await page.evaluate(()=>{const ds=[...document.querySelectorAll('.q-dialog')]; const d=ds[ds.length-1];
    const el=[...d.querySelectorAll('*')].find(x=>x.children.length<=2&&/whole series/i.test(x.innerText||''));
    if(el){el.click(); return el.innerText.trim();} return null;});
  F.pickedScope=picked; console.log('PICKED',picked);
  await page.waitForTimeout(900);
  const conf=await page.evaluate(()=>{const ds=[...document.querySelectorAll('.q-dialog')]; const d=ds[ds.length-1];
    const b=[...d.querySelectorAll('button')].find(e=>/^(Delete|Delete shifts?|Confirm|Remove)/i.test(e.innerText.trim())); if(b){b.click(); return b.innerText.trim();} return null;});
  F.confirmBtn=conf; console.log('CONFIRM',conf);
  await page.waitForTimeout(1300);
  F.toastDelete=await page.evaluate(()=>({n:document.querySelectorAll('.q-notification').length,t:document.querySelector('.q-notification')?.innerText.trim()||null}));
  await page.screenshot({path:E+'45-delete-toast.png'});
  console.log('TOAST AFTER DELETE',JSON.stringify(F.toastDelete));
  await page.waitForTimeout(4200);
  F.toastAt55=await page.evaluate(()=>({n:document.querySelectorAll('.q-notification').length}));
  console.log('TOAST at ~5.5s',JSON.stringify(F.toastAt55));
  F.remaining=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].filter(e=>/Qispring/.test(e.innerText)).length);
  console.log('QISPRING REMAINING',F.remaining);
}
fs.writeFileSync('/tmp/sviu/f-delete.json',JSON.stringify(F,null,1));
console.log('REQS',JSON.stringify(F.reqs).slice(0,1200));
await browser.close();
