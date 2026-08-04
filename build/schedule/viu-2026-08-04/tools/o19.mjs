import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
// delete the ZZAUTOTEST event via its block -> observe modal + toast
const ev=await page.evaluate(()=>{const b=[...document.querySelectorAll('.schedule-block')].find(e=>/ZZAUTOTEST/.test(e.innerText)); if(!b)return null; const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
console.log('event block',JSON.stringify(ev));
if(ev){
  await page.mouse.move(ev.x,ev.y); await page.waitForTimeout(2000);
  F.eventTooltip=await page.evaluate(()=>{const t=[...document.querySelectorAll('[class*=tooltip]')].pop(); return t?t.innerText.trim():null;});
  console.log('EVENT TOOLTIP',JSON.stringify(F.eventTooltip));
  await page.mouse.click(ev.x,ev.y); await page.waitForTimeout(2400);
  await page.screenshot({path:E+'46-event-view.png'});
  F.eventView=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{text:d.innerText.trim(),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean)}:null;});
  console.log('EVENT VIEW',JSON.stringify(F.eventView,null,1));
  // delete it
  const del=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); if(!d)return null; const b=[...d.querySelectorAll('button')].find(e=>/delete|Delete/.test(e.innerText)); if(b){b.click(); return b.innerText.trim();} return null;});
  console.log('DEL BTN',del);
  await page.waitForTimeout(1800); await page.screenshot({path:E+'47-event-delete.png'});
  F.afterDel=await page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>({t:d.innerText.trim().slice(0,400),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean)})));
  console.log('AFTER DEL',JSON.stringify(F.afterDel,null,1));
  const c2=await page.evaluate(()=>{const ds=[...document.querySelectorAll('.q-dialog')]; const d=ds[ds.length-1]; if(!d)return null; const b=[...d.querySelectorAll('button')].find(e=>/^(Delete|Delete event|Confirm|Yes|Remove)/i.test(e.innerText.trim())); if(b){b.click(); return b.innerText.trim();} return null;});
  console.log('CONFIRM',c2);
  await page.waitForTimeout(1500);
  F.toast=await page.evaluate(()=>{
    const cands=[...document.querySelectorAll('div')].filter(d=>/Undo/.test(d.innerText||'')&&d.innerText.length<200);
    return cands.map(d=>({cls:d.className.toString().slice(0,90),t:d.innerText.trim().replace(/\n/g,' | ')})).slice(-4);});
  await page.screenshot({path:E+'48-undo-toast.png'});
  console.log('TOAST',JSON.stringify(F.toast,null,1));
  await page.waitForTimeout(6500);
  F.toastGone=await page.evaluate(()=>[...document.querySelectorAll('div')].filter(d=>/Undo/.test(d.innerText||'')&&d.innerText.length<200).length);
  console.log('toast elems after ~8s:',F.toastGone);
}
fs.writeFileSync('/tmp/sviu/f-toast.json',JSON.stringify(F,null,1));
await browser.close();
