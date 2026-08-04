import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
const TOAST=()=>page.evaluate(()=>{const t=document.querySelector('.undo-toast');return t?t.innerText.trim().replace(/\n/g,' | '):null;});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
// A) series delete scope
const p=await page.evaluate(()=>{const b=[...document.querySelectorAll('.schedule-block')].find(e=>/Qispring/.test(e.innerText)); if(!b)return null; const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+8};});
console.log('series block',JSON.stringify(p));
if(p){
  await page.mouse.click(p.x,p.y); await page.waitForTimeout(2600);
  F.seriesModal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{text:d.innerText.trim().slice(0,700),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean)}:null;});
  console.log('SERIES MODAL',JSON.stringify(F.seriesModal,null,1));
  if(F.seriesModal){
    await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const b=[...d.querySelectorAll('button')].find(e=>/delete_outline/.test(e.innerText)); b.click();});
    await page.waitForTimeout(2200); await page.screenshot({path:E+'49-delete-scope.png'});
    F.scopeDlg=await page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>({t:d.innerText.trim().slice(0,700),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean),radios:[...d.querySelectorAll('.q-radio')].map(r=>r.innerText.trim())})));
    console.log('SCOPE DLG',JSON.stringify(F.scopeDlg,null,1));
    // Escape should close the delete-scope dialog first
    await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
    F.afterEsc=await page.evaluate(()=>({dialogs:document.querySelectorAll('.q-dialog').length,txt:document.querySelector('.q-dialog')?.innerText.trim().slice(0,120)||null}));
    console.log('AFTER ESC',JSON.stringify(F.afterEsc));
    await page.keyboard.press('Escape'); await page.waitForTimeout(900);
    F.afterEsc2=await page.evaluate(()=>document.querySelectorAll('.q-dialog').length);
    console.log('AFTER ESC2 dialogs',F.afterEsc2);
  }
}
// B) event tooltip on a non-avatar part
const ev=await page.evaluate(()=>{const b=[...document.querySelectorAll('.schedule-block')].find(e=>/James Off/.test(e.innerText)); if(!b)return null; const r=b.getBoundingClientRect(); return {x:r.x+60,y:r.y+6,w:r.width};});
console.log('James Off block',JSON.stringify(ev));
if(ev){ await page.mouse.move(ev.x,ev.y); await page.waitForTimeout(2200);
  F.eventTooltip=await page.evaluate(()=>{const ts=[...document.querySelectorAll('.q-tooltip')]; return ts.map(t=>t.innerText.trim().replace(/\n/g,' | '));});
  await page.screenshot({path:E+'50-event-tooltip.png'});
  console.log('EVENT TOOLTIP',JSON.stringify(F.eventTooltip));
}
fs.writeFileSync('/tmp/sviu/f-batch7.json',JSON.stringify(F,null,1));
await browser.close();
