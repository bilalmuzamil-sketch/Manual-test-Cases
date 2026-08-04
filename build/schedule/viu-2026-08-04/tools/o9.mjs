import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot();
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(8000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4000);
// open the NORMAL Tuesday shift (no conflict)
const b=await page.evaluate(()=>{const bs=[...document.querySelectorAll('.schedule-block')].filter(e=>/10123073/.test(e.innerText)&&!/conflict/.test(e.className)); const x=bs[0]; if(!x)return null; const r=x.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
console.log('block',JSON.stringify(b));
if(b){
  await page.mouse.move(b.x,b.y); await page.waitForTimeout(1800);
  F.tooltip=await page.evaluate(()=>document.querySelector('.q-tooltip')?.innerText.trim());
  await page.mouse.click(b.x,b.y); await page.waitForTimeout(2200);
  await page.screenshot({path:E+'27-modal-normal.png',fullPage:true});
  F.modalHtml=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerHTML.replace(/\s+/g,' ').slice(0,9000));
  F.visibleTime=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return [...d.querySelectorAll('.q-field')].map(f=>({label:f.querySelector('.q-field__label')?.innerText.trim()||'',val:f.querySelector('input')?.value||'',native:f.querySelector('.q-field__native')?.innerText.trim()||''}));});
  // click the clock icon
  await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const i=[...d.querySelectorAll('i,button')].find(e=>/access_time|schedule|clock/.test(e.innerText.trim())); if(i)i.click();});
  await page.waitForTimeout(1400);
  await page.screenshot({path:E+'28-time-picker.png'});
  F.timePicker=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu,.q-popup-proxy')].pop(); return m?{text:m.innerText.trim().slice(0,900),minutes:[...m.querySelectorAll('.q-time__clock-position')].map(e=>e.innerText.trim()).slice(0,70)}:null;});
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  // est hours area
  F.scopeArea=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const els=[...d.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText&&/h\b|—|Authorized/.test(e.innerText.trim())&&e.innerText.trim().length<40);
    return els.map(e=>({t:e.innerText.trim(),cls:e.className.toString().slice(0,70),tag:e.tagName}));});
}
fs.writeFileSync('/tmp/sviu/f-modal.json',JSON.stringify(F,null,1));
console.log('TOOLTIP',F.tooltip);
console.log('VISIBLE TIME',JSON.stringify(F.visibleTime));
console.log('TIME PICKER',JSON.stringify(F.timePicker));
console.log('SCOPE AREA',JSON.stringify(F.scopeArea));
await browser.close();
