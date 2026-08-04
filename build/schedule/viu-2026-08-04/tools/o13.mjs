import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:r.postData()});});
page.on('response',async r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.request().method()!=='GET'){try{F.reqs.push({res:r.status(),body:(await r.text()).slice(0,600)});}catch{}}});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
const C=await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
const br=R.find(r=>/Brittany/.test(r.t)); const wed=C.find(c=>c.cls==='fc-day-wed');
await page.mouse.click(wed.x,br.y); await page.waitForTimeout(1500);
await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const i=[...m.querySelectorAll('.q-item')].find(e=>/Create Event/i.test(e.innerText)); i.click();});
await page.waitForTimeout(2200);
await page.screenshot({path:E+'32-event-modal.png'});
F.eventModal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); if(!d)return null;
 return {text:d.innerText.trim(),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean),
  inputs:[...d.querySelectorAll('input')].map(i=>({ph:i.placeholder||'',v:i.value,type:i.type})),
  toggles:[...d.querySelectorAll('.q-toggle,.q-checkbox')].map(t=>({t:t.innerText.trim(),a:t.querySelector('input')?.getAttribute('aria-checked')}))};});
console.log('EVENT MODAL',JSON.stringify(F.eventModal,null,1));
// fill name and save
await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const i=[...d.querySelectorAll('input')][0]; i.focus();});
await page.keyboard.type('ZZAUTOTEST Event',{delay:30});
await page.waitForTimeout(600);
await page.screenshot({path:E+'33-event-filled.png'});
const saveBtn=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const b=[...d.querySelectorAll('button')].find(e=>/^(Save|Create|Create event|Add)$/i.test(e.innerText.trim())); return b?b.innerText.trim():null;});
F.saveBtn=saveBtn;
if(saveBtn){ await page.evaluate(l=>{const d=document.querySelector('.q-dialog'); const b=[...d.querySelectorAll('button')].find(e=>e.innerText.trim()===l); b.click();},saveBtn);
  await page.waitForTimeout(1200);
  F.toastAfterCreate=await page.evaluate(()=>({n:document.querySelectorAll('.q-notification').length,t:document.querySelector('.q-notification')?.innerText.trim()||null}));
  await page.screenshot({path:E+'34-event-created-toast.png'});
  await page.waitForTimeout(3000);
  F.toastAt4s=await page.evaluate(()=>({n:document.querySelectorAll('.q-notification').length,t:document.querySelector('.q-notification')?.innerText.trim()||null}));
}
fs.writeFileSync('/tmp/sviu/f-event.json',JSON.stringify(F,null,1));
console.log('SAVE BTN',saveBtn);console.log('TOAST',JSON.stringify(F.toastAfterCreate),JSON.stringify(F.toastAt4s));
console.log('REQS',JSON.stringify(F.reqs,null,1).slice(0,1800));
await browser.close();
